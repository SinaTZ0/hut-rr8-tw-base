import { expect } from "playwright/test";

import { test } from "../../../tests/e2e/fixtures";
import {
  fulfillRpc,
  selectOption,
  testTrackingCode,
  verifyChallenge,
  waitForForm,
} from "../../../tests/e2e/form-helpers";

/*===== Complaints Browser Smoke =====*/

test("opens from home and submits a complaint with a visible tracking code", async ({ page }) => {
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
  await expect(page.getByRole("heading", { name: "پیام شما با موفقیت ثبت شد", exact: true })).toBeVisible();
  await expect(page.getByText(testTrackingCode, { exact: true })).toBeVisible();
});
