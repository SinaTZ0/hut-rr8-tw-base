import { RPCSerializer } from "@orpc/client";
import type { AltchaWidgetElement } from "altcha";
import { expect, type Page, type Route } from "playwright/test";

/*===== RPC Responses =====*/

const serializer = new RPCSerializer();
export const testTrackingCode = "HUT-ABCDEFGH23456789";

export async function fulfillRpc({ route, body, status = 201 }: { route: Route; body: unknown; status?: number }) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(serializer.serialize(body)),
  });
}

/*===== Form Interaction =====*/

/** The widget mounts from a client effect, so its checkbox also confirms the form is hydrated. */
export async function waitForForm(page: Page) {
  await expect(page.locator("altcha-widget").getByRole("checkbox")).toBeVisible();
}

export async function selectOption({ page, id, label }: { page: Page; id: string; label: string }) {
  await waitForForm(page);
  await page.locator(`#${id}`).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("option", { name: label, exact: true }).click();
}

/** Solves the real public challenge through keyboard activation and waits for its form-state event. */
export async function verifyChallenge(page: Page) {
  await page.locator("altcha-widget").getByRole("checkbox").focus();
  await page.keyboard.press("Space");
  await expect
    .poll(() => page.locator("altcha-widget").evaluate((widget: AltchaWidgetElement) => widget.getState()))
    .toBe("verified");
}
