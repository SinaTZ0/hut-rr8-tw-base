import { expect } from "playwright/test";

import { test } from "../../../tests/e2e/fixtures";
import {
  expectResponsivePage,
  fulfillRpc,
  selectOption,
  testTrackingCode,
  verifyChallenge,
  waitForForm,
} from "../../../tests/e2e/form-helpers";

/*===== Shared Submission Components Regression =====*/

test("submits complaints through the shared security and confirmation components", async ({ page }) => {
  await page.route("**/rpc/complaintsAndFeedback/submit", async (route) => {
    await fulfillRpc({ route, body: { status: "pending", trackingCode: testTrackingCode } });
  });
  await page.goto("/");
  await page.getByRole("link", { name: /صدای شما برای ما مهم است/ }).click();
  await expect(page).toHaveURL(/\/complaints-and-feedback$/);
  await waitForForm(page);
  await page.locator("#firstName").fill("علی");
  await selectOption({ page, id: "feedbackType", label: "شکایات" });
  await selectOption({ page, id: "department", label: "ریاست دانشگاه" });
  await page.locator("#message").fill("متن آزمایشی برای بررسی ثبت درخواست دانشگاه.");
  await verifyChallenge(page);
  await page.getByRole("button", { name: "ثبت و ارسال پیام", exact: true }).click();
  await expect(page.getByRole("heading", { name: "پیام شما با موفقیت ثبت شد", exact: true })).toBeFocused();
  await expect(page.getByText(testTrackingCode, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "ثبت پیام جدید", exact: true }).click();
  await expect(page.locator("#firstName")).toHaveValue("");
  await expect(page.locator("#firstName")).toBeFocused();
});

/*===== Responsive Accessibility =====*/

for (const theme of ["light", "dark"] as const) {
  for (const width of [375, 768, 1280, 1440]) {
    test(`complaints are accessible in ${theme} at ${width}px`, async ({ page }) => {
      await expectResponsivePage({ page, path: "/complaints-and-feedback", width, theme });
    });
  }
}
