import { expect, type Page } from "playwright/test";

import { test } from "../../../tests/e2e/fixtures";
import { fulfillRpc, testTrackingCode, verifyChallenge, waitForForm } from "../../../tests/e2e/form-helpers";

/*===== Consultation Form Helpers =====*/

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

/*===== Consultation Browser Smoke =====*/

test("opens from home and submits a consultation with a visible tracking code", async ({ page }) => {
  await page.route("**/rpc/onlineConsultation/submit", async (route) => {
    await fulfillRpc({ route, body: { status: "pending", trackingCode: testTrackingCode } });
  });
  await page.goto("/");
  await page.getByRole("link", { name: /همراه شما در مسیر دانشگاه/ }).click();
  await expect(page).toHaveURL(/\/online-consultation$/);
  await fillConsultation(page);
  await verifyChallenge(page);
  await page.getByRole("button", { name: submitLabel, exact: true }).click();

  await expect(page.getByRole("heading", { name: "پرسش شما با موفقیت ثبت شد", exact: true })).toBeVisible();
  await expect(page.getByText(testTrackingCode, { exact: true })).toBeVisible();
});

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
