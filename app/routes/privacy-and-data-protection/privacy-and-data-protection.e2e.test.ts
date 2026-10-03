import { expect } from "playwright/test";

import { test } from "../../../tests/e2e/fixtures";
import { expectClientNavigation, observeNavigation, readNavigationProbe } from "../../../tests/e2e/navigation-helpers";

/*===== Privacy Navigation =====*/

const privacyPath = "/privacy-and-data-protection";
const privacyLabel = "حریم خصوصی و صیانت از داده‌ها";
const homeLabel = "صفحه اصلی دانشگاه صنعتی همدان";

for (const width of [375, 1440]) {
  test(`privacy menu and return-home navigation transition without reloading at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await observeNavigation({ page });
    await page.goto("/");
    const { documentId } = await readNavigationProbe(page);
    expect((await readNavigationProbe(page)).calls).toBe(0);

    if (width === 375) {
      await page.getByRole("button", { name: "باز کردن منو", exact: true }).click();
      await page
        .getByRole("navigation", { name: "منوی اصلی موبایل", exact: true })
        .getByRole("button", { name: "دانشگاه", exact: true })
        .click();
    } else {
      await page
        .getByRole("navigation", { name: "منوی اصلی", exact: true })
        .getByRole("button", { name: "دانشگاه", exact: true })
        .click();
    }

    const privacyLink = page.getByRole("link", { name: privacyLabel, exact: true });
    await privacyLink.focus();
    await page.keyboard.press("Enter");
    await expectClientNavigation({ page, documentId, calls: 1, pathname: privacyPath });
    await expect(page.locator("#privacy-title")).toBeVisible();
    expect((await readNavigationProbe(page)).styles[0]).toMatchObject({
      rootDuration: "0.2s",
      headerAnimation: "none",
      footerAnimation: "none",
    });

    await page.getByRole("link", { name: homeLabel, exact: true }).first().click();
    await expectClientNavigation({ page, documentId, calls: 2, pathname: "/" });
    await page.goBack();
    await expectClientNavigation({ page, documentId, calls: 3, pathname: privacyPath });
    await page.goForward();
    await expectClientNavigation({ page, documentId, calls: 4, pathname: "/" });
  });
}

test("search uses the default transition for privacy navigation", async ({ page }) => {
  await observeNavigation({ page });
  await page.goto("/");
  const { documentId } = await readNavigationProbe(page);
  await page.getByRole("button", { name: "جستجو در دانشگاه", exact: true }).click();
  await page.getByLabel("عبارت جستجو", { exact: true }).fill("حریم");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expectClientNavigation({ page, documentId, calls: 1, pathname: privacyPath });
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

/*===== Scrolling and Motion Preferences =====*/

test("same-page anchors scroll without a fade and navigation from a scrolled page restores the top", async ({
  page,
}) => {
  await observeNavigation({ page });
  await page.goto(privacyPath);
  const { documentId } = await readNavigationProbe(page);
  const backToTop = page.getByRole("link", { name: "بازگشت به ابتدای بیانیه", exact: true });
  await backToTop.scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await backToTop.click();
  await expect(page).toHaveURL(`${privacyPath}#privacy-title`);
  expect((await readNavigationProbe(page)).calls).toBe(0);

  await page.getByRole("link", { name: homeLabel, exact: true }).last().click();
  await expectClientNavigation({ page, documentId, calls: 1, pathname: "/" });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

for (const theme of ["light", "dark"] as const) {
  test(`reduced motion suppresses the page fade in ${theme} mode`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await observeNavigation({ page });
    await page.goto(privacyPath);
    const { documentId } = await readNavigationProbe(page);
    await page.getByRole("link", { name: homeLabel, exact: true }).first().click();
    await expectClientNavigation({ page, documentId, calls: 1, pathname: "/" });
    expect((await readNavigationProbe(page)).styles[0].rootAnimation).toBe("none");
  });
}

test("the home logo stays unanimated when already on home", async ({ page }) => {
  await observeNavigation({ page });
  await page.goto("/");
  const { documentId } = await readNavigationProbe(page);
  await page.getByRole("link", { name: homeLabel, exact: true }).first().click();
  await page.waitForLoadState("networkidle");
  await expectClientNavigation({ page, documentId, calls: 0, pathname: "/" });
});

test("unsupported browsers still navigate without reloading", async ({ page }) => {
  await observeNavigation({ page, disableViewTransitions: true });
  await page.goto(privacyPath);
  const { documentId } = await readNavigationProbe(page);
  await page.getByRole("link", { name: homeLabel, exact: true }).first().click();
  await expect(page).toHaveURL("/");
  await expectClientNavigation({ page, documentId, calls: 0, pathname: "/" });
});

/*===== Native External Navigation =====*/

test("external university destinations remain document navigations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await observeNavigation({ page });
  await page.route("https://hut.ac.ir/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>University destination</p>" }),
  );
  await page.goto("/");
  const { documentId } = await readNavigationProbe(page);
  await page
    .getByRole("navigation", { name: "منوی اصلی", exact: true })
    .getByRole("button", { name: "دانشگاه", exact: true })
    .click();
  const link = page.locator('[data-slot="navigation-menu-link"]').filter({ hasText: "معرفی دانشگاه" });
  const href = await link.getAttribute("href");
  await link.click();
  await expect(page).toHaveURL(new URL(href!).href);
  const probe = await readNavigationProbe(page);
  expect(probe.documentId).not.toBe(documentId);
  expect(probe.calls).toBe(0);
});
