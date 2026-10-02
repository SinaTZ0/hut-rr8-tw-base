import { RPCSerializer } from "@orpc/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { OperationTiming } from "../../lib/request-timing.server";
import { logger } from "../middleware/logging/logging.middleware";

/*===== Isolated Persistence and Challenge =====*/

const state = vi.hoisted(() => ({ attempts: 0, failures: [] as unknown[] }));

vi.mock("../../db/client.server", () => ({
  db: {
    insert: () => ({
      values: (values: Record<string, unknown>) => ({
        returning: async () => {
          state.attempts += 1;
          const failure = state.failures.shift();
          if (failure !== undefined) throw failure;
          return [values];
        },
      }),
    }),
  },
}));
vi.mock("../middleware/altcha/altcha.middleware", async () => {
  const { os } = await import("@orpc/server");
  return {
    verifyAltchaMiddleware: os.middleware(async ({ next }) => next({ context: { altchaNonce: "test-nonce" } })),
  };
});

import { handleRpcRequest } from "../handler.server";

const serializer = new RPCSerializer();

async function submit(question = "برای انتخاب مسیر تحصیلی خود به راهنمایی نیاز دارم.") {
  return handleRpcRequest({
    request: new Request("http://localhost/rpc/onlineConsultation/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        serializer.serialize({
          gender: "unknown",
          age: "21",
          maritalStatus: "unknown",
          faculty: "unknown",
          major: "unknown",
          question,
          altcha: "test-payload",
        }),
      ),
    }),
  });
}

beforeEach(() => {
  state.attempts = 0;
  state.failures = [];
  vi.spyOn(logger, "info").mockImplementation(() => {});
  vi.spyOn(logger, "warn").mockImplementation(() => {});
  vi.spyOn(logger, "error").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

function loggedTimings(method: "info" | "warn" | "error") {
  expect(logger[method]).toHaveBeenCalledOnce();
  return (vi.mocked(logger[method]).mock.calls[0][0] as { timings: OperationTiming[] }).timings;
}

/*===== Actual Feature Layer Timings =====*/

describe("consultation submission timings", () => {
  it("times all three layers and preserves the successful HTTP response", async () => {
    const response = await submit();
    expect(response.status).toBe(201);
    expect(serializer.deserialize(await response.json())).toMatchObject({
      status: "pending",
      trackingCode: expect.any(String),
    });
    const timings = loggedTimings("info");
    expect(timings.map(({ layer, name }) => ({ layer, name }))).toEqual([
      { layer: "repository", name: "insertConsultation" },
      { layer: "service", name: "submitConsultation" },
      { layer: "procedure", name: "onlineConsultation.submit" },
    ]);
    expect(timings[0].durationMs).toBeGreaterThanOrEqual(0);
    expect(timings[1].durationMs).toBeGreaterThanOrEqual(timings[0].durationMs);
    expect(timings[2].durationMs).toBeGreaterThanOrEqual(timings[1].durationMs);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("records each repository attempt during tracking-code collision retries", async () => {
    state.failures = [
      Object.assign(new Error("collision"), {
        code: "23505",
        constraint: "online_consultation_tracking_code_unique",
      }),
    ];
    expect((await submit()).status).toBe(201);
    expect(state.attempts).toBe(2);
    expect(loggedTimings("info").map(({ layer }) => layer)).toEqual([
      "repository",
      "repository",
      "service",
      "procedure",
    ]);
  });

  it("records failed repository, service, and procedure operations", async () => {
    state.failures = [new Error("private failure")];
    const response = await submit();
    expect(response.status).toBe(500);
    expect(loggedTimings("error").map(({ layer }) => layer)).toEqual(["repository", "service", "procedure"]);
    expect(await response.text()).not.toContain("private failure");
  });

  it("omits repository timing when domain validation rejects the submission", async () => {
    expect((await submit("short")).status).toBe(422);
    expect(state.attempts).toBe(0);
    expect(loggedTimings("warn").map(({ layer }) => layer)).toEqual(["service", "procedure"]);
  });

  it("stops after three tracking-code collisions", async () => {
    state.failures = Array.from(
      { length: 3 },
      () =>
        new Error("wrapped", {
          cause: Object.assign(new Error("collision"), {
            code: "23505",
            constraint: "online_consultation_tracking_code_unique",
          }),
        }),
    );
    expect((await submit()).status).toBe(500);
    expect(state.attempts).toBe(3);
  });

  it("does not retry an already consumed nonce", async () => {
    state.failures = [
      new Error("wrapped", {
        cause: Object.assign(new Error("nonce replay"), {
          code: "23505",
          constraint: "online_consultation_altcha_nonce_unique",
        }),
      }),
    ];
    const response = await submit();
    expect(response.status).toBe(422);
    expect(serializer.deserialize(await response.json())).toMatchObject({ code: "INVALID_ALTCHA" });
    expect(state.attempts).toBe(1);
  });

  it("returns a recoverable database availability error", async () => {
    state.failures = [
      new Error("wrapped", {
        cause: Object.assign(new Error("private connection detail"), { code: "ECONNREFUSED" }),
      }),
    ];
    const response = await submit();
    expect(response.status).toBe(503);
    const body = serializer.deserialize(await response.json());
    expect(body).toMatchObject({ code: "DATABASE_UNAVAILABLE" });
    expect(JSON.stringify(body)).not.toContain("private connection detail");
    expect(state.attempts).toBe(1);
  });
});
