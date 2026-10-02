import AxeBuilder from "@axe-core/playwright";
import { RPCSerializer } from "@orpc/client";
import { expect, type Page, type Route } from "playwright/test";

import { test } from "../../../tests/e2e/fixtures";

/*===== Statistics Browser Helpers =====*/

const serializer = new RPCSerializer();
const statistics = {
  today: "1234",
  yesterday: "987",
  total: "45678",
  online: 12,
  updatedAt: "2026-10-02T10:00:00.000Z",
};
const statisticsRegion = (page: Page) => page.getByRole("region", { name: "آمار بازدید وب‌سایت" });

function fulfillStatistics(route: Route) {
  return route.fulfill({ contentType: "application/json", body: JSON.stringify(serializer.serialize(statistics)) });
}

async function expectStatistics(page: Page) {
  await expect(statisticsRegion(page).locator("dd")).toHaveText(["۱٬۲۳۴", "۹۸۷", "۴۵٬۶۷۸", "۱۲"]);
}

/*===== Server-rendered Placeholders =====*/

test.describe("statistics without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("renders SSR placeholders without browser statistics requests", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/rpc/websiteVisits/")) requests.push(request.url());
    });

    // A new document for each public route must render without database-backed statistics.
    for (const pathname of ["/", "/online-consultation", "/complaints-and-feedback"]) {
      const response = await page.goto(pathname);
      expect(response?.status()).toBe(200);
      await expect(statisticsRegion(page)).toHaveAttribute("aria-busy", "true");
      await expect(statisticsRegion(page).locator("dd")).toHaveText(["—", "—", "—", "—"]);
    }

    expect(requests).toEqual([]);
  });
});

/*===== Navigation and Retry Semantics =====*/

test("records one visit per document load and ignores client navigation", async ({ page }) => {
  const records: { eventId: string; pathname: string }[] = [];
  await page.route("**/rpc/websiteVisits/record", async (route) => {
    records.push(serializer.deserialize(route.request().postDataJSON()) as (typeof records)[number]);
    await fulfillStatistics(route);
  });
  await page.goto("/");
  await expect.poll(() => records.length).toBe(1);
  await expectStatistics(page);

  // Notify React Router of a same-path history change, including query and fragment changes.
  await page.evaluate(() => {
    history.pushState(null, "", "/?view=test#homepage-main");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page).toHaveURL(/view=test#homepage-main$/);
  await expectStatistics(page);
  expect(records).toHaveLength(1);

  await page.getByRole("link", { name: /همراه شما در مسیر دانشگاه/ }).click();
  await expect(page).toHaveURL(/\/online-consultation$/);
  await expectStatistics(page);
  expect(records).toHaveLength(1);
  await page.goBack();
  await expect(page).toHaveURL(/view=test#homepage-main$/);
  await expectStatistics(page);
  expect(records).toHaveLength(1);
  await page.reload();
  await expect.poll(() => records.length).toBe(2);
  expect(records.map((record) => record.pathname)).toEqual(["/", "/"]);
  expect(new Set(records.map((record) => record.eventId)).size).toBe(2);
});

test("counts direct entry and a hard refresh on a secondary public page", async ({ page }) => {
  const records: { eventId: string; pathname: string }[] = [];
  await page.route("**/rpc/websiteVisits/record", async (route) => {
    records.push(serializer.deserialize(route.request().postDataJSON()) as (typeof records)[number]);
    await fulfillStatistics(route);
  });
  await page.goto("/online-consultation");
  await expect.poll(() => records.length).toBe(1);
  await expectStatistics(page);
  await page.reload();
  await expect.poll(() => records.length).toBe(2);
  expect(records.map((record) => record.pathname)).toEqual(["/online-consultation", "/online-consultation"]);
  expect(new Set(records.map((record) => record.eventId)).size).toBe(2);
});

test("reuses the same event UUID after a network failure", async ({ page }) => {
  const ids: string[] = [];
  await page.route("**/rpc/websiteVisits/record", async (route) => {
    ids.push((serializer.deserialize(route.request().postDataJSON()) as { eventId: string }).eventId);
    if (ids.length === 1) await route.abort("failed");
    else await fulfillStatistics(route);
  });
  await page.goto("/");
  await expect.poll(() => ids.length).toBe(2);
  expect(new Set(ids).size).toBe(1);
  await expectStatistics(page);
});

/*===== Privacy and Presence Lifecycle =====*/

for (const preference of ["doNotTrack", "globalPrivacyControl"] as const) {
  test(`reads statistics without tracking for ${preference}`, async ({ page }) => {
    await page.addInitScript(
      (name) => Object.defineProperty(navigator, name, { get: () => (name === "doNotTrack" ? "1" : true) }),
      preference,
    );
    const writes: string[] = [];
    page.on("request", (request) => {
      if (/\/websiteVisits\/(record|heartbeat)$/.test(request.url())) writes.push(request.url());
    });
    await page.goto("/");
    await expectStatistics(page);
    await page.getByRole("link", { name: /همراه شما در مسیر دانشگاه/ }).click();
    await expectStatistics(page);
    expect(writes).toEqual([]);
  });
}

test("refreshes every minute and pauses while hidden or offline", async ({ page }) => {
  await page.clock.install();
  let heartbeats = 0;
  await page.route("**/rpc/websiteVisits/heartbeat", async (route) => {
    heartbeats++;
    await fulfillStatistics(route);
  });
  await page.goto("/");
  await expect.poll(() => heartbeats).toBe(1);
  await page.clock.fastForward(60_000);
  await expect.poll(() => heartbeats).toBe(2);
  await page.evaluate(() =>
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }),
  );
  await page.clock.fastForward(60_000);
  expect(heartbeats).toBe(2);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(() => heartbeats).toBe(3);
  await page.evaluate(() => Object.defineProperty(navigator, "onLine", { configurable: true, get: () => false }));
  await page.clock.fastForward(60_000);
  expect(heartbeats).toBe(3);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "onLine", { configurable: true, get: () => true });
    window.dispatchEvent(new Event("online"));
  });
  await expect.poll(() => heartbeats).toBe(4);
});

/*===== Loading, Failures, and Formatting =====*/

test("does not confirm presence after a pending page view becomes hidden", async ({ page }) => {
  let release!: () => void;
  let recorded = false;
  let heartbeats = 0;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/rpc/websiteVisits/record", async (route) => {
    recorded = true;
    await gate;
    await fulfillStatistics(route);
  });
  await page.route("**/rpc/websiteVisits/heartbeat", async (route) => {
    heartbeats++;
    await fulfillStatistics(route);
  });
  await page.goto("/");
  await expect.poll(() => recorded).toBe(true);
  await page.evaluate(() =>
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }),
  );
  const response = page.waitForResponse("**/rpc/websiteVisits/record");
  release();
  await response;
  await expectStatistics(page);
  expect(heartbeats).toBe(0);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(() => heartbeats).toBe(1);
});

test("shows loading placeholders before statistics arrive", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/rpc/websiteVisits/*", async (route) => {
    await gate;
    await fulfillStatistics(route);
  });
  await page.goto("/");
  await expect(statisticsRegion(page)).toHaveAttribute("aria-busy", "true");
  await expect(statisticsRegion(page).locator("dd")).toHaveText(["—", "—", "—", "—"]);
  release();
  await expectStatistics(page);
  await expect(statisticsRegion(page)).toHaveAttribute("aria-busy", "false");
});

test("recovers from failures and retains the last successful statistics during subsequent outages", async ({
  page,
}) => {
  const matcher = "**/rpc/websiteVisits/*";
  await page.route(matcher, (route) => route.abort("failed"));
  await page.goto("/");
  await expect(statisticsRegion(page)).toContainText("آمار بازدید موقتاً در دسترس نیست.");
  await expect(statisticsRegion(page).locator("dd")).toHaveText(["—", "—", "—", "—"]);
  await page.unroute(matcher);
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await expectStatistics(page);
  await page.route(matcher, (route) => route.abort("failed"));
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await expect(statisticsRegion(page)).toContainText("آخرین آمار دریافت‌شده نمایش داده می‌شود.");
  await expectStatistics(page);
});

test("formats bigint totals without rounding", async ({ page }) => {
  await page.route("**/rpc/websiteVisits/*", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(serializer.serialize({ ...statistics, total: "9007199254740999" })),
    }),
  );
  await page.goto("/");
  await expect(statisticsRegion(page).locator("dd").nth(2)).toHaveText("۹٬۰۰۷٬۱۹۹٬۲۵۴٬۷۴۰٬۹۹۹");
});

/*===== Responsive Footer Accessibility =====*/

for (const width of [375, 768, 1280, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`footer statistics at ${width}px in ${theme} mode`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await expectStatistics(page);
      const region = statisticsRegion(page);
      await region.scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .include("footer")
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      if (width === 375 || width === 1280)
        await page.locator("footer").screenshot({ path: `.tmp-codex/visit-statistics-${width}-${theme}.png` });
    });
  }
}
