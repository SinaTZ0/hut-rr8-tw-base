import { RPCSerializer } from "@orpc/client";
import { COMMON_ERROR_STATUS_MAP } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Database } from "../../db/client";
import { os } from "../implementer";
import { performanceMiddleware } from "./performance.middleware";
import { unexpectedErrorMiddleware } from "./unexpected-error.middleware";

/*===== Test Router =====*/

const submitProcedure = os.complaintsAndFeedback.submit.handler(async ({ errors, input }) => {
  if (input.firstName === "expected") {
    throw errors.INVALID_INPUT({ data: { field: "firstName" }, message: "Expected validation failure." });
  }
  if (input.firstName === "unexpected") {
    throw new Error("Private database connection details");
  }

  return { status: "pending" as const, trackingCode: "HUT-TEST" };
});

const testRouter = os
  .use(unexpectedErrorMiddleware)
  .use(performanceMiddleware)
  .router({
    complaintsAndFeedback: { submit: submitProcedure },
  });

const handler = new RPCHandler(testRouter, {
  errorStatusMap: { ...COMMON_ERROR_STATUS_MAP, BAD_REQUEST: 422, INVALID_INPUT: 422 },
});
const serializer = new RPCSerializer();

/*===== RPC Request Helper =====*/

async function requestSubmission(firstName: unknown) {
  const input = {
    firstName,
    department: "ریاست دانشگاه",
    feedbackType: "suggestion",
    message: "A valid message for the test.",
    altcha: "test-payload",
  };
  const request = new Request("http://localhost/rpc/complaintsAndFeedback/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(serializer.serialize(input)),
  });
  const { response } = await handler.handle(request, {
    context: { db: {} as Database },
    prefix: "/rpc",
  });
  if (!response) throw new Error("The test procedure was not matched.");

  return { response, body: serializer.deserialize(await response.json()) };
}

afterEach(() => {
  vi.restoreAllMocks();
});

/*===== Shared Middleware Behavior =====*/

describe("oRPC middleware", () => {
  it("times calls, preserves expected errors, and hides unexpected failures", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const success = await requestSubmission("normal");
    expect(success.response.status).toBe(200);
    expect(success.body).toMatchObject({ trackingCode: "HUT-TEST" });

    const expected = await requestSubmission("expected");
    expect(expected.response.status).toBe(422);
    expect(expected.body).toMatchObject({
      code: "INVALID_INPUT",
      data: { field: "firstName" },
      message: "Expected validation failure.",
    });

    // Router middleware also wraps contract validation.
    const malformed = await requestSubmission(42);
    expect(malformed.response.status).toBe(422);
    expect(malformed.body).toMatchObject({ code: "BAD_REQUEST" });

    const unexpected = await requestSubmission("unexpected");
    expect(unexpected.response.status).toBe(500);
    expect(unexpected.body).toMatchObject({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
    expect(JSON.stringify(unexpected.body)).not.toContain("Private database connection details");

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(
      "[oRPC] Unexpected error in complaintsAndFeedback.submit",
      expect.objectContaining({ message: "Private database connection details" }),
    );
    expect(info.mock.calls.map(([message]) => message)).toEqual([
      expect.stringMatching(/^\[oRPC\] complaintsAndFeedback\.submit ok \d+\.\dms$/),
      expect.stringMatching(/^\[oRPC\] complaintsAndFeedback\.submit error \d+\.\dms$/),
      expect.stringMatching(/^\[oRPC\] complaintsAndFeedback\.submit error \d+\.\dms$/),
      expect.stringMatching(/^\[oRPC\] complaintsAndFeedback\.submit error \d+\.\dms$/),
    ]);
  });
});
