import { expect, test as base } from "playwright/test";

/*===== Isolated Browser Runtime =====*/

/** Fails on browser errors or an unmocked RPC call before it can reach the application server. */
export const test = base.extend({
  page: async ({ page }, runTest) => {
    const browserErrors: string[] = [];
    const unexpectedRequests: string[] = [];
    page.on("pageerror", (error) => browserErrors.push(error.message));
    // Playwright tries the most recently registered route first, so feature mocks override this guard.
    await page.route("**/rpc/**", async (route) => {
      unexpectedRequests.push(route.request().url());
      await route.abort("failed");
    });
    await runTest(page);
    expect(browserErrors, "Uncaught browser errors").toEqual([]);
    expect(unexpectedRequests, "RPC requests need explicit test responses").toEqual([]);
  },
});
