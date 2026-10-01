import { afterEach, describe, expect, it, vi } from "vitest";

import { createRequestTiming } from "./request-timing.server";

afterEach(() => vi.restoreAllMocks());

/*===== Inclusive Operation Timings =====*/

describe("request timing", () => {
  it("includes awaited child operations in the parent duration", async () => {
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    const { timings, measure } = createRequestTiming();

    const result = await measure({
      layer: "procedure",
      name: "submit",
      run: async () => {
        await measure({
          layer: "service",
          name: "save",
          run: async () => {
            await measure({
              layer: "repository",
              name: "insert",
              run: () => {
                now = 4;
              },
            });
            now = 7;
          },
        });
        now = 10;
        return "ok";
      },
    });

    expect(result).toBe("ok");
    expect(timings).toEqual([
      { layer: "repository", name: "insert", durationMs: 4 },
      { layer: "service", name: "save", durationMs: 7 },
      { layer: "procedure", name: "submit", durationMs: 10 },
    ]);
  });

  it.each([false, true])("records failures without replacing the exception (async: %s)", async (asyncFailure) => {
    const { timings, measure } = createRequestTiming();
    const failure = new Error("failed operation");
    const run = () => {
      throw failure;
    };

    await expect(
      measure({ layer: "repository", name: "insert", run: asyncFailure ? async () => run() : run }),
    ).rejects.toBe(failure);
    expect(timings).toEqual([{ layer: "repository", name: "insert", durationMs: expect.any(Number) }]);
    expect(timings[0].durationMs).toBeGreaterThanOrEqual(0);
  });
});
