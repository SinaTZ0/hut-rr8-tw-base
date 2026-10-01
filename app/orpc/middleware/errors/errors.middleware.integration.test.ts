import { oc } from "@orpc/contract";
import { call, implement, ORPCError, os } from "@orpc/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { commonErrors, errorDataSchema } from "../../errors";
import { standardizeErrorsMiddleware } from "./errors.middleware";

/*===== Independent Contract Fixture =====*/

const contract = {
  check: oc
    .errors({ ...commonErrors, INVALID_INPUT: { data: errorDataSchema } })
    .input(z.object({ name: z.string(), email: z.string() }))
    .output(z.string()),
};
const api = implement(contract);

function withErrorMiddleware(procedure: ReturnType<typeof api.check.handler>) {
  return api.use(standardizeErrorsMiddleware).router({ check: procedure }).check;
}

async function callFailure(failure: unknown) {
  const procedure = withErrorMiddleware(
    api.check.handler(() => {
      throw failure;
    }),
  );
  return call(procedure, { name: "علی", email: "example@hut.ac.ir" }, { path: ["check"] }).catch((error) => error);
}

afterEach(() => vi.restoreAllMocks());

/*===== Shared Error Envelope =====*/

describe("standard RPC error data", () => {
  it("requires two maps with string values", () => {
    expect(errorDataSchema.safeParse({ errors: {}, fields: {} }).success).toBe(true);
    expect(errorDataSchema.safeParse({ field: "name" }).success).toBe(false);
    expect(errorDataSchema.safeParse({ errors: { Failure: 42 }, fields: {} }).success).toBe(false);
  });

  it("preserves field-only errors without general diagnostics or logging", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const data = { errors: {}, fields: { name: "نام الزامی است.", email: "ایمیل معتبر نیست." } };
    const result = await callFailure(new ORPCError("INVALID_INPUT", { data }));
    expect(result.data).toEqual(data);
    expect(log).not.toHaveBeenCalled();
  });

  it("keeps technical diagnostics and field errors together", async () => {
    const result = await callFailure(
      new ORPCError("BAD_REQUEST", {
        data: {
          errors: { "Request version": "Check the client contract version." },
          fields: { name: "نام الزامی است." },
        },
      }),
    );
    expect(result.data).toMatchObject({
      errors: {
        "Request version": "Check the client contract version.",
        "Error code": "BAD_REQUEST",
        Procedure: "check",
      },
      fields: { name: "نام الزامی است." },
    });
  });

  it("normalizes built-in validation before reaching the handler", async () => {
    const handler = vi.fn(() => "ok");
    const procedure = withErrorMiddleware(api.check.handler(handler));
    const error = await call(procedure, { name: 42, email: false } as never).catch((error) => error);
    expect(error).toMatchObject({ code: "BAD_REQUEST", defined: true });
    expect(errorDataSchema.parse(error.data)).toMatchObject({
      fields: { name: expect.any(String), email: expect.any(String) },
      errors: { "Input validation (name)": expect.any(String), "Input validation (email)": expect.any(String) },
    });
    expect(handler).not.toHaveBeenCalled();
  });

  it("correlates unexpected failures with one private log", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const failure = new Error("private SQL, credentials, and submitted values");
    const normalized = await callFailure(failure);
    expect(normalized).toMatchObject({ code: "INTERNAL_SERVER_ERROR", defined: true });
    expect(normalized.data.errors["Error ID"]).toEqual(expect.any(String));
    expect(JSON.stringify(normalized)).not.toContain(failure.message);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith("RPC server error", {
      code: "INTERNAL_SERVER_ERROR",
      path: "check",
      errorId: normalized.data.errors["Error ID"],
      cause: failure,
    });
  });

  it("normalizes output-validation failures without exposing output values", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const procedure = withErrorMiddleware(api.check.handler(() => ({ private: "secret" }) as never));
    const error = await call(procedure, { name: "علی", email: "example@hut.ac.ir" }).catch((error) => error);
    expect(error).toMatchObject({ code: "INTERNAL_SERVER_ERROR", defined: true });
    expect(error.data.errors["Server failure"]).toContain("output does not match its contract");
    expect(JSON.stringify(error)).not.toContain("secret");
  });

  it("keeps explicit internal-error messages in server logs", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const failure = new ORPCError("INTERNAL_SERVER_ERROR", { message: "private database connection string" });
    const normalized = await callFailure(failure);
    expect(JSON.stringify(normalized)).not.toContain(failure.message);
    expect(log.mock.calls[0][1].cause).toBe(failure);
  });

  it("catches feature middleware failures before the handler", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const failure = new Error("private middleware failure");
    const handler = vi.fn(() => "ok");
    const featureMiddleware = os.middleware(async () => {
      throw failure;
    });
    const procedure = withErrorMiddleware(api.check.use(featureMiddleware).handler(handler));
    const error = await call(procedure, { name: "علی", email: "example@hut.ac.ir" }).catch((error) => error);
    expect(error).toMatchObject({ code: "INTERNAL_SERVER_ERROR", defined: true });
    expect(errorDataSchema.safeParse(error.data).success).toBe(true);
    expect(handler).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledTimes(1);
  });
});
