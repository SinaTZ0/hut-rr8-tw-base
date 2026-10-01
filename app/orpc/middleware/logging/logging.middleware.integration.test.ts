import { oc } from "@orpc/contract";
import { call, implement, ORPCError, os } from "@orpc/server";
import { DrizzleQueryError } from "drizzle-orm/errors";
import { DatabaseError } from "pg";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { DatabaseUnavailableError } from "../../../db/errors.server";
import type { OperationTiming } from "../../../lib/request-timing.server";
import { commonErrors } from "../../errors";
import { standardizeErrorsMiddleware } from "../errors/errors.middleware";
import { createRpcLogger, logger, loggingMiddleware } from "./logging.middleware";

/*===== Independent Contract Fixture =====*/

const api = implement({ check: oc.errors(commonErrors).input(z.string()).output(z.string()) });
const monitored = api.use(loggingMiddleware).use(standardizeErrorsMiddleware);

function captureErrorLogs() {
  const records: string[] = [];
  const sink = createRpcLogger({ write: (chunk) => records.push(chunk) });
  vi.mocked(logger.error).mockImplementation(sink.error.bind(sink));
  return records;
}

beforeEach(() => {
  vi.spyOn(logger, "info").mockImplementation(() => {});
  vi.spyOn(logger, "warn").mockImplementation(() => {});
  vi.spyOn(logger, "error").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

/*===== Completion Logs =====*/

describe("RPC logging middleware", () => {
  it("logs success once, keeps output unchanged, and omits input and output", async () => {
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    const router = api.router({
      check: monitored.check.handler(({ context, input }) =>
        context.measure({
          layer: "procedure",
          name: "check",
          run: () => {
            now = 12;
            return input;
          },
        }),
      ),
    });

    expect(await call(router.check, "private value", { path: ["check"] })).toBe("private value");
    expect(logger.info).toHaveBeenCalledExactlyOnceWith(
      {
        requestId: expect.any(String),
        path: "check",
        outcome: "success",
        durationMs: 12,
        timings: [{ layer: "procedure", name: "check", durationMs: 12 }],
      },
      "RPC completed",
    );
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("logs input-validation rejection before entering the handler", async () => {
    const handler = vi.fn(() => "ok");
    const procedure = monitored.check.handler(handler);

    await expect(call(procedure, 123 as never)).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(handler).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        code: "BAD_REQUEST",
        outcome: "error",
        durationMs: expect.any(Number),
        timings: [],
      }),
      "RPC completed",
    );
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("logs a feature guard rejection without adding unexecuted layer timings", async () => {
    const guard = os.errors(commonErrors).middleware(async ({ errors }) => {
      throw errors.FORBIDDEN({ data: { errors: {}, fields: {} } });
    });
    const handler = vi.fn(() => "ok");
    const procedure = monitored.check.use(guard).handler(handler);

    await expect(call(procedure, "ok")).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(handler).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ code: "FORBIDDEN", timings: [] }),
      "RPC completed",
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("keeps timings and IDs isolated when concurrent requests overlap", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const procedure = monitored.check.handler(({ context, input }) =>
      context.measure({
        layer: "procedure",
        name: "check",
        run: async () => {
          if (input === "first") await gate;
          return input;
        },
      }),
    );

    const first = call(procedure, "first");
    expect(await call(procedure, "second")).toBe("second");
    release();
    expect(await first).toBe("first");

    const entries = vi.mocked(logger.info).mock.calls.map(
      ([entry]) =>
        entry as {
          requestId: string;
          timings: OperationTiming[];
        },
    );
    expect(entries).toHaveLength(2);
    expect(entries[0].requestId).not.toBe(entries[1].requestId);
    expect(entries[0].timings).not.toBe(entries[1].timings);
    for (const entry of entries) expect(entry.timings).toHaveLength(1);
  });

  it("serializes original exceptions and cyclic causes without exposing them to the client", async () => {
    const records = captureErrorLogs();
    const failure = new Error("private driver detail") as Error & { cause: unknown };
    failure.cause = failure;
    const procedure = monitored.check.handler(() => {
      throw failure;
    });

    const normalized = await call(procedure, "ok").catch((error) => error);
    const entry = JSON.parse(records[0]);
    expect(records).toHaveLength(1);
    expect(entry).toMatchObject({
      level: 50,
      code: "INTERNAL_SERVER_ERROR",
      requestId: normalized.data.errors["Error ID"],
      err: { type: "Error", message: expect.stringContaining(failure.message), stack: expect.any(String) },
    });
    expect(JSON.stringify(normalized)).not.toContain(failure.message);
  });

  it("filters dependency and Node internal frames while retaining multiline messages and application frames", async () => {
    const records = captureErrorLogs();
    const message = "Query failed\nparams: node_modules/value\n    at /app/node_modules/submitted-value";
    const cause = new Error("Driver failed");
    const failure = new Error(message, { cause });
    const applicationFrames = [
      "    at insertComplaint (/app/orpc/repository.ts:10:5)",
      "    at helper (C:\\app\\orpc\\helper.ts:20:3)",
      "    at local (/app/node_modules_extra/local.ts:1:1)",
    ];
    const dependencyFrames = [
      "    at query (/app/node_modules/pg/lib/client.js:1:1)",
      "    at next (file:///app/node_modules/@orpc/server/dist/index.mjs:2:2)",
      "    at execute (C:\\app\\node_modules\\drizzle-orm\\session.js:3:3)",
      "    at processTicksAndRejections (node:internal/process/task_queues:105:5)",
      "    at Socket.emit (node:events:509:28)",
    ];
    failure.stack = [`Error: ${message}`, ...dependencyFrames, ...applicationFrames].join("\n");
    cause.stack = [`Error: ${cause.message}`, ...dependencyFrames].join("\n");
    const originalStack = failure.stack;
    const originalCauseStack = cause.stack;
    const procedure = monitored.check.handler(() => {
      throw failure;
    });

    await expect(call(procedure, "ok")).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    expect(records).toHaveLength(1);
    const entry = JSON.parse(records[0]);
    expect(entry.err.message).toBe(message);
    expect(entry.err.stack).toBe([`Error: ${message}`, ...applicationFrames].join("\n"));
    expect(entry.err.causes[0]).not.toHaveProperty("stack");
    expect(failure.stack).toBe(originalStack);
    expect(cause.stack).toBe(originalCauseStack);
  });

  it("logs only the deepest stack with application frames while retaining every cause's diagnostics", async () => {
    const records = captureErrorLogs();
    const driver = Object.assign(new Error("Driver failed"), { code: "08006" });
    driver.stack =
      "Error: Driver failed\n    at query (/app/node_modules/pg/client.js:1:1)\n    at Socket.emit (node:events:1:1)";
    const query = new DrizzleQueryError("insert into complaints values ($1)", ["submitted value"], driver);
    query.stack = `${query.name}: ${query.message}\n    at insertComplaint (/app/orpc/repository.ts:28:5)\n    at submitComplaint (/app/orpc/service.ts:107:3)`;
    const failure = new Error("Database unavailable", { cause: query });
    failure.stack = "Error: Database unavailable\n    at middleware (/app/orpc/database.middleware.ts:15:3)";
    const procedure = monitored.check.handler(() => {
      throw failure;
    });

    await expect(call(procedure, "ok")).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    expect(records).toHaveLength(1);
    const entry = JSON.parse(records[0]);
    expect(entry.err.stack).toBe(query.stack);
    expect(entry.err.message).toBe(failure.message);
    expect(entry.err.causes).toMatchObject([
      { message: query.message, query: query.query, params: ["submitted value"] },
      { message: driver.message, code: "08006" },
    ]);
    for (const cause of entry.err.causes) expect(cause).not.toHaveProperty("stack");
  });

  /*------ Database Debugging and Cause Diagnostics ------*/

  it.each(["cause", "message", "stack", "code", "params", "constructor"])(
    "keeps the original RPC failure when the %s getter throws during serialization",
    async (property) => {
      const records = captureErrorLogs();
      const failure = new Error("original failure");
      const getter = vi.fn(() => {
        throw new Error("getter failure");
      });
      Object.defineProperty(failure, property, { get: getter });
      const procedure = monitored.check.handler(() => {
        throw failure;
      });

      const normalized = await call(procedure, "ok").catch((error) => error);

      expect(normalized.code).toBe("INTERNAL_SERVER_ERROR");
      expect(normalized.defined).toBe(true);
      expect(normalized.cause).toBe(failure);
      expect(getter).toHaveBeenCalled();
      expect(records).toHaveLength(1);
      expect(JSON.parse(records[0])).toMatchObject({
        level: 50,
        code: "INTERNAL_SERVER_ERROR",
        requestId: normalized.data.errors["Error ID"],
        err: {
          type: "UnknownError",
          message: "Error diagnostics could not be serialized.",
          serializationFailed: true,
        },
      });
    },
  );

  it.each(["query", "driver", "availability"])(
    "retains %s failures and structured driver diagnostics in logs while keeping client errors normalized",
    async (kind) => {
      const records = captureErrorLogs();
      const privateValue = "private-complaint\n    at private-submitted-value";
      const query = "insert into complaints_and_feedback values ($1)";
      const driver = Object.assign(new DatabaseError(`driver rejected ${privateValue}`, 0, "error"), {
        code: kind === "availability" ? "08006" : "23505",
        constraint: "complaints_and_feedback_tracking_code_unique",
        schema: "public",
        table: "complaints_and_feedback",
        column: "tracking_code",
        detail: `Failing row contains (${privateValue})`,
        internalQuery: query,
      });
      const queryError = new DrizzleQueryError(query, [privateValue], driver);
      const failure =
        kind === "driver"
          ? driver
          : kind === "availability"
            ? new ORPCError("DATABASE_UNAVAILABLE", {
                message: `Connection failed: ${privateValue}`,
                cause: new DatabaseUnavailableError({ code: "08006", cause: queryError }),
              })
            : queryError;
      const originalStack = queryError.stack;
      const procedure = monitored.check.handler(() => {
        throw failure;
      });

      const normalized = await call(procedure, "ok").catch((error) => error);
      expect(records).toHaveLength(1);
      const entry = JSON.parse(records[0]);
      const chain = [entry.err, ...(entry.err.causes ?? [])];
      expect(chain).toContainEqual(
        expect.objectContaining({
          type: "DatabaseError",
          code: driver.code,
          constraint: driver.constraint,
          schema: driver.schema,
          table: driver.table,
          column: driver.column,
          message: driver.message,
          detail: driver.detail,
          internalQuery: query,
        }),
      );
      expect(entry.err.message).toBe(failure.message);
      if (kind !== "driver") {
        expect(chain).toContainEqual(
          expect.objectContaining({
            type: "DrizzleQueryError",
            message: queryError.message,
            query,
            params: [privateValue],
          }),
        );
      }
      expect(entry.err.stack).toContain("\n    at ");
      expect(entry.err.stack).not.toMatch(/^\s+at\s.*(?:[/\\]node_modules[/\\]|\bnode:)/m);
      for (const cause of entry.err.causes ?? []) expect(cause).not.toHaveProperty("stack");
      for (const value of ["private-complaint", "private-submitted-value", query]) {
        expect(records[0]).toContain(value);
        expect(JSON.stringify(normalized)).not.toContain(value);
      }
      expect(entry.requestId).toBe(normalized.data.errors["Error ID"]);
      expect(queryError.message).toContain(privateValue);
      expect(queryError.stack).toBe(originalStack);
      expect(queryError.params).toEqual([privateValue]);
    },
  );

  it("retains database details while handling cyclic causes", async () => {
    const records = captureErrorLogs();
    const driver = Object.assign(new DatabaseError("private submitted value", 0, "error"), { code: "23505" });
    const queryError = new DrizzleQueryError("private SQL", ["private params"], driver);
    Object.assign(driver, { cause: queryError });
    const procedure = monitored.check.handler(() => {
      throw queryError;
    });

    await expect(call(procedure, "ok")).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    expect(records).toHaveLength(1);
    const entry = JSON.parse(records[0]);
    expect(entry.err.causes).toHaveLength(1);
    expect(entry.err.causes[0].code).toBe("23505");
    expect(entry.err).toMatchObject({ query: "private SQL", params: ["private params"] });
    expect(entry.err.causes[0].message).toBe(driver.message);
  });

  it("omits response payloads and arbitrary properties from non-database errors", async () => {
    const records = captureErrorLogs();
    const failure = Object.assign(new Error("Application failed"), {
      input: "private-input",
      data: "private-data",
    });
    const procedure = monitored.check.handler(() => {
      throw failure;
    });
    await expect(call(procedure, "ok")).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    const invalidOutput = monitored.check.handler(() => ({ private: "private-output" }) as never);
    await expect(call(invalidOutput, "ok")).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });

    expect(records).toHaveLength(2);
    expect(JSON.parse(records[0]).err.message).toBe(failure.message);
    expect(records.join("\n")).not.toContain("private-input");
    expect(records.join("\n")).not.toContain("private-data");
    expect(records.join("\n")).not.toContain("private-output");
  });

  it("retains messages while bounding unusually deep cause chains", async () => {
    const records = captureErrorLogs();
    let failure: Error = new DrizzleQueryError("private SQL", ["private params"]);
    for (let depth = 0; depth < 40; depth += 1) {
      failure = new Error(`Wrapped ${failure.message}`, { cause: failure });
    }
    const procedure = monitored.check.handler(() => {
      throw failure;
    });

    await expect(call(procedure, "ok")).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    expect(records).toHaveLength(1);
    const entry = JSON.parse(records[0]);
    expect(entry.err.causeChainTruncated).toBe(true);
    expect(entry.err.causes).toHaveLength(31);
    expect(entry.err.message).toBe(failure.message);
    expect(entry.err.stack).toEqual(expect.any(String));
    expect(entry.err.stack).not.toMatch(/^\s+at\s.*(?:[/\\]node_modules[/\\]|\bnode:)/m);
    for (const cause of entry.err.causes) expect(cause).not.toHaveProperty("stack");
  });
});
