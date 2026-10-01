import { randomUUID } from "node:crypto";
import { ORPCError, os } from "@orpc/server";
import pino from "pino";

import { createRequestTiming, type Measure } from "../../../lib/request-timing.server";
import { rpcErrorStatusMap } from "../../errors";
import { serializeRpcError } from "./error-serializer.server";

/*===== Request Logging =====*/

/** Uses the same error policy for stdout and alternate destinations, including test sinks. */
export function createRpcLogger(destination?: pino.DestinationStream) {
  return pino({ serializers: { err: serializeRpcError } }, destination);
}

export const logger = createRpcLogger();

export type RequestLogContext = {
  requestId: string;
  measure: Measure;
};

/** Wraps validation and execution; emits one completion log with request-local timings. */
export const loggingMiddleware = os.middleware(async ({ next, path }) => {
  const startedAt = performance.now();
  const requestId = randomUUID();
  const { timings, measure } = createRequestTiming();
  const bindings = { requestId, path: path.join(".") };

  try {
    const result = await next({ context: { requestId, measure } satisfies RequestLogContext });
    logger.info(
      { ...bindings, outcome: "success", durationMs: performance.now() - startedAt, timings },
      "RPC completed",
    );
    return result;
  } catch (error) {
    const code = error instanceof ORPCError ? error.code : "INTERNAL_SERVER_ERROR";
    const status = Object.hasOwn(rpcErrorStatusMap, code)
      ? rpcErrorStatusMap[code as keyof typeof rpcErrorStatusMap]
      : 500;
    const details = { ...bindings, outcome: "error", code, durationMs: performance.now() - startedAt, timings };

    if (status >= 500) {
      // Error normalization keeps the original exception as its cause.
      logger.error({ ...details, err: error instanceof ORPCError ? (error.cause ?? error) : error }, "RPC completed");
    } else {
      logger.warn(details, "RPC completed");
    }
    throw error;
  }
});
