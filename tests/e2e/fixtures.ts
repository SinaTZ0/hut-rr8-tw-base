import { expect, test as base } from "playwright/test";
import { RPCSerializer } from "@orpc/client";

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
    // Only the three known statistics procedures are mocked; the unexpected-RPC guard remains intact.
    const serializer = new RPCSerializer();
    for (const procedure of ["summary", "record", "heartbeat"]) {
      await page.route(`**/rpc/websiteVisits/${procedure}`, (route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify(
            serializer.serialize({
              today: "1234",
              yesterday: "987",
              total: "45678",
              online: 12,
              updatedAt: "2026-10-02T10:00:00.000Z",
            }),
          ),
        }),
      );
    }
    await runTest(page);
    expect(browserErrors, "Uncaught browser errors").toEqual([]);
    expect(unexpectedRequests, "RPC requests need explicit test responses").toEqual([]);
  },
});
