import { RPCSerializer } from "@orpc/client";
import { expect, type Page } from "playwright/test";

import { test } from "../../../tests/e2e/fixtures";
import {
  expectAccessible,
  expectResponsivePage,
  fulfillRpc,
  selectOption,
  testTrackingCode,
  verifyChallenge,
  waitForForm,
} from "../../../tests/e2e/form-helpers";

/*===== Consultation Form Helpers =====*/

const serializer = new RPCSerializer();
const question = "برای انتخاب مسیر تحصیلی خود به راهنمایی نیاز دارم.";
const submitLabel = "ثبت و ارسال پرسش";

async function fillConsultation(page: Page) {
  await waitForForm(page);
  await page.locator("#age").fill("21");
  await expect(page.locator("#age")).toHaveValue("۲۱");
  await page.locator("#email").fill("USER@Example.COM");
  await page.locator("#mobile").fill("٠٩١٢١٢٣٤٥٦٧");
  await page.locator("#question").fill(question);
}

async function expectDefaultSelections(page: Page) {
  await waitForForm(page);
  for (const field of ["gender", "maritalStatus", "faculty", "major"]) {
    await expect(page.locator(`#${field} [data-slot=select-value]`)).toHaveText("نامعین");
  }
}

/*===== Navigation and Client Validation =====*/

test("opens from the homepage and rejects invalid fields before making a request", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /همراه شما در مسیر دانشگاه/ }).click();
  await expect(page).toHaveURL(/\/online-consultation$/);
  await expect(page).toHaveTitle(/مشاوره آنلاین/);
  await expectDefaultSelections(page);

  const submit = page.getByRole("button", { name: submitLabel, exact: true });
  await submit.click();
  await expect(page.locator("#age")).toBeFocused();
  await expect(page.locator("#age-error")).toHaveText("سن باید عددی صحیح بین ۱ تا ۱۲۰ باشد.");
  await expect(page.locator("#question-error")).toBeVisible();

  await page.locator("#question").fill(question);
  for (const age of ["0", "۱۲۱"]) {
    await page.locator("#age").fill(age);
    await submit.click();
    await expect(page.locator("#age")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#age")).toBeFocused();
  }
  await page.locator("#age").fill("۲۱");
  await page.locator("#email").fill("invalid-email");
  await submit.click();
  await expect(page.locator("#email-error")).toHaveText("نشانی ایمیل معتبر نیست.");
  await expect(page.locator("#email")).toBeFocused();
  // The fixture fails this test if validation allows any unmocked RPC request.
});

/*===== Age Editing =====*/

test("displays age digits in Persian and preserves the cursor while editing", async ({ page }) => {
  await page.goto("/online-consultation");
  await waitForForm(page);
  const age = page.getByRole("textbox", { name: "سن", exact: true });

  for (const digits of ["0123456789", "٠١٢٣٤٥٦٧٨٩", "۰۱۲۳۴۵۶۷۸۹"]) {
    await age.clear();
    await age.pressSequentially(digits);
    await expect(age).toHaveValue("۰۱۲۳۴۵۶۷۸۹");
  }
  await age.fill("2١");
  await expect(age).toHaveValue("۲۱");
  // The form value stays the same, but the replacement still needs normalization.
  await age.fill("21");
  await expect(age).toHaveValue("۲۱");

  await age.fill("12");
  await age.press("Home");
  await age.pressSequentially("0");
  await expect(age).toHaveValue("۰۱۲");
  expect(await age.evaluate((input: HTMLInputElement) => input.selectionStart)).toBe(1);
  await age.press("Delete");
  await expect(age).toHaveValue("۰۲");
  await age.evaluate((input: HTMLInputElement) => input.setSelectionRange(0, 1));
  await age.pressSequentially("1");
  await expect(age).toHaveValue("۱۲");
  expect(await age.evaluate((input: HTMLInputElement) => input.selectionStart)).toBe(1);
  await age.press("Backspace");
  await expect(age).toHaveValue("۲");
  await age.clear();
  await expect(age).toHaveValue("");
  await page.locator("#email").focus();
  await expect(page.locator("#age-error")).toHaveText("سن باید عددی صحیح بین ۱ تا ۱۲۰ باشد.");
});

test("rejects nondigit age edits and converts valid pasted digits to Persian", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/online-consultation");
  await waitForForm(page);
  const age = page.locator("#age");
  await age.fill("21");

  for (const invalid of ["21abc", "سن", "21.5", "۲۱٫۵", "-21", "+21", "2e1", "21 5"]) {
    await age.fill(invalid);
    await expect(age).toHaveValue("۲۱");
    await page.evaluate((text) => navigator.clipboard.writeText(text), invalid);
    await age.press("ControlOrMeta+A");
    await age.press("ControlOrMeta+V");
    await expect(age).toHaveValue("۲۱");
  }
  await age.press("End");
  await age.pressSequentially("a.-+e ");
  await expect(age).toHaveValue("۲۱");

  for (const digits of ["021", "٠٢١", "۰۲۱"]) {
    await page.evaluate((text) => navigator.clipboard.writeText(text), digits);
    await age.press("ControlOrMeta+A");
    await age.press("ControlOrMeta+V");
    await expect(age).toHaveValue("۰۲۱");
  }
});

/*===== Submission and Confirmation =====*/

test("normalizes input, solves ALTCHA, copies the code, and resets a new submission", async ({ page }) => {
  let submittedInput: unknown;
  await page.route("**/rpc/onlineConsultation/submit", async (route) => {
    submittedInput = serializer.deserialize(route.request().postDataJSON());
    await fulfillRpc({ route, body: { status: "pending", trackingCode: testTrackingCode } });
  });
  await page.goto("/online-consultation");
  await fillConsultation(page);
  await selectOption({ page, id: "gender", label: "زن" });
  await selectOption({ page, id: "maritalStatus", label: "مجرد" });
  await selectOption({ page, id: "faculty", label: "علوم پایه" });
  // Academic options remain independent; this combination is intentionally valid.
  await selectOption({ page, id: "major", label: "کامپیوتر" });
  await verifyChallenge(page);
  await page.getByRole("button", { name: submitLabel, exact: true }).click();

  const confirmation = page.getByRole("heading", { name: "پرسش شما با موفقیت ثبت شد", exact: true });
  await expect(confirmation).toBeFocused();
  expect(submittedInput).toMatchObject({
    gender: "female",
    age: "21",
    maritalStatus: "single",
    email: "user@example.com",
    mobile: "09121234567",
    faculty: "basic-sciences",
    major: "computer",
    question,
    altcha: expect.any(String),
  });
  await expectAccessible(page);

  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          document.documentElement.dataset.copiedTrackingCode = value;
        },
      },
    }),
  );
  const copy = page.getByRole("button", { name: "کپی کد پیگیری", exact: true });
  await copy.click();
  await expect(page.getByText("کد پیگیری کپی شد.", { exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-copied-tracking-code", testTrackingCode);
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error("Clipboard permission denied");
    };
  });
  await copy.click();
  await expect(page.getByText("کپی خودکار انجام نشد؛ لطفاً کد را دستی کپی کنید.", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "ثبت پرسش جدید", exact: true }).click();
  await expectDefaultSelections(page);
  for (const field of ["age", "email", "mobile", "question"]) await expect(page.locator(`#${field}`)).toHaveValue("");
  await expect(page.locator("#gender")).toBeFocused();
  await fillConsultation(page);
  await page.getByRole("button", { name: submitLabel, exact: true }).click();
  await expect(page.locator("#altcha-error")).toHaveText("لطفاً تأیید امنیتی را انجام دهید.");
});

/*===== Failure and Retry Behavior =====*/

test("preserves values after a network failure and allows a successful retry", async ({ page }) => {
  let networkFailure = true;
  let requests = 0;
  await page.route("**/rpc/onlineConsultation/submit", async (route) => {
    requests += 1;
    if (networkFailure) {
      await route.abort("failed");
      return;
    }
    await fulfillRpc({ route, body: { status: "pending", trackingCode: testTrackingCode } });
  });
  await page.goto("/online-consultation");
  await fillConsultation(page);
  await verifyChallenge(page);
  await page.getByRole("button", { name: submitLabel, exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "ارسال پرسش انجام نشد. لطفاً اتصال خود را بررسی کنید و دوباره تلاش کنید.",
  );
  await expect(page.locator("#age")).toHaveValue("۲۱");
  await expect(page.locator("#question")).toHaveValue(question);
  networkFailure = false;
  await page.getByRole("button", { name: submitLabel, exact: true }).click();
  await expect(page.getByRole("heading", { name: "پرسش شما با موفقیت ثبت شد", exact: true })).toBeVisible();
  expect(requests).toBe(2);
});

test("focuses server field errors and resets a rejected security proof", async ({ page }) => {
  let securityFailure = false;
  let requests = 0;
  await page.route("**/rpc/onlineConsultation/submit", async (route) => {
    requests += 1;
    await fulfillRpc({
      route,
      status: 422,
      body: {
        defined: true,
        code: securityFailure ? "INVALID_ALTCHA" : "INVALID_INPUT",
        message: "Invalid submission",
        data: {
          errors: {},
          fields: securityFailure
            ? { altcha: "تأیید امنیتی از سرور" }
            : { question: "پرسش از سرور", age: "سن از سرور" },
        },
      },
    });
  });
  await page.goto("/online-consultation");
  await fillConsultation(page);
  await verifyChallenge(page);
  const submit = page.getByRole("button", { name: submitLabel, exact: true });
  await submit.click();
  await expect(page.locator("#age-error")).toHaveText("سن از سرور");
  await expect(page.locator("#question-error")).toHaveText("پرسش از سرور");
  await expect(page.locator("#age")).toBeFocused();
  securityFailure = true;
  await submit.click();
  await expect(page.locator("#altcha-error")).toHaveText("تأیید امنیتی از سرور");
  await submit.click();
  await expect(page.locator("#altcha-error")).toHaveText("لطفاً تأیید امنیتی را انجام دهید.");
  expect(requests).toBe(2);
});

test("prevents duplicate submissions while a request is pending and shows database diagnostics", async ({ page }) => {
  let requests = 0;
  let releaseResponse = () => {};
  const responseGate = new Promise<void>((resolve) => {
    releaseResponse = resolve;
  });
  await page.route("**/rpc/onlineConsultation/submit", async (route) => {
    requests += 1;
    await responseGate;
    await fulfillRpc({
      route,
      status: 503,
      body: {
        defined: true,
        code: "DATABASE_UNAVAILABLE",
        message: "Database unavailable",
        data: {
          fields: {},
          errors: { "Error ID": "browser-consultation-check", "Database failure code": "ECONNREFUSED" },
        },
      },
    });
  });
  await page.goto("/online-consultation");
  await fillConsultation(page);
  await verifyChallenge(page);
  try {
    await page.locator("form").evaluate((form) => {
      // Queue both events before React can commit the button's disabled state.
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    await expect(page.getByRole("button", { name: "در حال ارسال…", exact: true })).toBeDisabled();
    await expect.poll(() => requests).toBe(1);
  } finally {
    releaseResponse();
  }
  await expect(page.getByRole("alert")).toBeVisible();
  const details = page.getByRole("button", { name: "جزئیات فنی خطا", exact: true });
  await details.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("browser-consultation-check", { exact: true })).toBeVisible();
  expect(requests).toBe(1);
});

/*===== Responsive Accessibility =====*/

for (const theme of ["light", "dark"] as const) {
  for (const width of [375, 768, 1280, 1440]) {
    test(`consultation is accessible in ${theme} at ${width}px`, async ({ page }) => {
      await expectResponsivePage({ page, path: "/online-consultation", width, theme });
    });
  }
}

test("keeps return navigation and form transitions usable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/online-consultation");
  await expect(page.locator("form").locator("xpath=../..")).toHaveCSS("animation-name", "none");
  await page.getByRole("link", { name: "صفحه اصلی دانشگاه صنعتی همدان", exact: true }).first().click();
  await expect(page).toHaveURL(/\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/online-consultation$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/$/);
});
