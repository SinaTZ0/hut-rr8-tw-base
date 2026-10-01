import { RPCSerializer } from "@orpc/client";
import { oc } from "@orpc/contract";
import { call, implement, ORPCError } from "@orpc/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { databaseErrors } from "./database.errors";
import { injectDatabaseMiddleware } from "./database.middleware";
import { errorDataSchema } from "../../errors";
import { logger } from "../logging/logging.middleware";

/*===== Isolated RPC Dependencies =====*/

const state = vi.hoisted(() => ({ failure: undefined as unknown, fromDatabase: true, database: {} }));

vi.mock("../../../db/client.server", () => ({ db: state.database }));
vi.mock("../../complaints-and-feedback/service", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../complaints-and-feedback/service")>();
  const { withDatabaseAvailability } = await import("../../../db/errors.server");
  return {
    ...original,
    submitComplaint: () => {
      const fail = async () => {
        throw state.failure;
      };
      return state.fromDatabase ? withDatabaseAvailability(fail) : fail();
    },
  };
});
vi.mock("../altcha/altcha.middleware", async () => {
  const { os } = await import("@orpc/server");
  return {
    verifyAltchaMiddleware: os.middleware(async ({ next }) => next({ context: { altchaNonce: "test-nonce" } })),
  };
});

import { handleRpcRequest } from "../../handler.server";

const serializer = new RPCSerializer();

async function requestSubmission() {
  const input = {
    firstName: "علی",
    department: "ریاست دانشگاه",
    feedbackType: "suggestion",
    message: "پیشنهاد من برای بهبود خدمات دانشگاه است.",
    altcha: "test-payload",
  };
  const request = new Request("http://localhost/rpc/complaintsAndFeedback/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(serializer.serialize(input)),
  });
  const response = await handleRpcRequest({ request });

  return { status: response.status, body: serializer.deserialize(await response.json()) };
}

afterEach(() => {
  vi.restoreAllMocks();
  state.failure = undefined;
  state.fromDatabase = true;
});

/*===== Database Availability Responses =====*/

describe("database middleware", () => {
  it("injects the database into an independent procedure", async () => {
    const procedure = implement(oc.errors(databaseErrors).output(z.literal("ok")))
      .use(injectDatabaseMiddleware)
      .handler(({ context }) => {
        expect(context.db).toBe(state.database);
        return "ok";
      });
    expect(await call(procedure, undefined)).toBe("ok");
  });

  it.each([
    ["PostgreSQL connection failure", "08006"],
    ["PostgreSQL connection limit", "53300"],
    ["PostgreSQL shutdown", "57P03"],
    ["network timeout", "ETIMEDOUT"],
    ["PostgreSQL statement timeout", "57014"],
  ])("returns a typed 503 for %s", async (_description, code) => {
    state.failure = new Error("Query failed", { cause: Object.assign(new Error("private driver detail"), { code }) });
    const log = vi.spyOn(logger, "error").mockImplementation(() => {});

    const result = await requestSubmission();

    expect(result.status).toBe(503);
    expect(result.body).toMatchObject({
      defined: true,
      code: "DATABASE_UNAVAILABLE",
      message: databaseErrors.DATABASE_UNAVAILABLE.message,
    });
    expect(JSON.stringify(result.body)).not.toContain("private driver detail");
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "complaintsAndFeedback.submit",
        code: "DATABASE_UNAVAILABLE",
        requestId: expect.any(String),
        err: expect.any(ORPCError),
      }),
      "RPC completed",
    );
    const data = errorDataSchema.parse((result.body as { data: unknown }).data);
    expect(data.fields).toEqual({});
    expect(data.errors).toMatchObject({
      "Database failure code": code,
      "Error code": "DATABASE_UNAVAILABLE",
      Procedure: "complaintsAndFeedback.submit",
      "Error ID": expect.any(String),
    });
    expect(log).toHaveBeenCalledWith(expect.objectContaining({ requestId: data.errors["Error ID"] }), "RPC completed");
  });

  it("passes unrelated errors and constraint failures through", async () => {
    const log = vi.spyOn(logger, "error").mockImplementation(() => {});

    for (const failure of [new Error("unrelated"), Object.assign(new Error("unique"), { code: "23505" })]) {
      state.failure = failure;
      const result = await requestSubmission();
      expect(result.status).toBe(500);
      expect(result.body).toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    }

    expect(log).toHaveBeenCalledTimes(2);
  });

  it("preserves an existing oRPC error even when its cause has a network code", async () => {
    state.fromDatabase = false;
    state.failure = new ORPCError("INVALID_ALTCHA", {
      message: "The challenge is invalid.",
      data: { errors: {}, fields: { altcha: "The challenge is invalid." } },
      cause: Object.assign(new Error("connection refused"), { code: "ECONNREFUSED" }),
    });

    const result = await requestSubmission();

    expect(result.status).toBe(422);
    expect(result.body).toMatchObject({
      code: "INVALID_ALTCHA",
      message: "The challenge is invalid.",
      data: { errors: {}, fields: { altcha: "The challenge is invalid." } },
    });
  });

  it("does not classify network failures outside a database operation", async () => {
    state.fromDatabase = false;
    state.failure = Object.assign(new Error("external service failed"), { code: "ECONNREFUSED" });
    const log = vi.spyOn(logger, "error").mockImplementation(() => {});
    const result = await requestSubmission();
    expect(result.status).toBe(500);
    expect(result.body).toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    expect(log).toHaveBeenCalledTimes(1);
  });

  it.each([
    "timeout exceeded when trying to connect",
    "Connection terminated due to connection timeout",
    "Query read timeout",
  ])("returns a typed 503 for the pg timer: %s", async (message) => {
    state.failure = new Error("Query failed", { cause: new Error(message) });
    vi.spyOn(logger, "error").mockImplementation(() => {});
    const result = await requestSubmission();
    expect(result.status).toBe(503);
    expect(result.body).toMatchObject({ code: "DATABASE_UNAVAILABLE" });
  });

  it("does not loop on a cyclic cause chain", async () => {
    vi.spyOn(logger, "error").mockImplementation(() => {});
    const failure = new Error("cyclic") as Error & { cause: unknown };
    failure.cause = failure;
    state.failure = failure;

    const result = await requestSubmission();

    expect(result.status).toBe(500);
    expect(result.body).toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
  });

  it("leaves malformed HTTP payloads to the RPC handler", async () => {
    const response = await handleRpcRequest({
      request: new Request("http://localhost/rpc/complaintsAndFeedback/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{invalid JSON",
      }),
    });
    expect(response.status).toBe(422);
    const body = serializer.deserialize(await response.json()) as { code: string; defined: boolean; data: unknown };
    expect(body).toMatchObject({ code: "BAD_REQUEST", defined: false });
    expect(body.data).toBeUndefined();
  });
});
