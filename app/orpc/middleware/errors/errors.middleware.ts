import { randomUUID } from "node:crypto";
import { ORPCError, os, ValidationError } from "@orpc/server";

import { commonErrors, errorDataSchema, rpcErrorStatusMap, type ErrorData } from "../../errors";
import { databaseErrors } from "../database/database.errors";

/*===== Input Validation Data =====*/

function addInputValidation({ data, issues }: { data: ErrorData; issues: ValidationError["issues"] }) {
  const fields = new Map(Object.entries(data.fields));
  const diagnostics = new Map(Object.entries(data.errors));
  for (const issue of issues) {
    const segment = issue.path?.[0];
    const field = segment === undefined ? undefined : String(typeof segment === "object" ? segment.key : segment);
    if (field && !fields.has(field)) fields.set(field, "مقدار این فیلد معتبر نیست.");
    const title = field ? `Input validation (${field})` : "Input validation";
    if (!diagnostics.has(title)) diagnostics.set(title, issue.message);
  }
  data.fields = Object.fromEntries(fields);
  data.errors = Object.fromEntries(diagnostics);
}

function getPublicErrorData(error: ORPCError<string, unknown> | undefined) {
  const parsed = errorDataSchema.safeParse(error?.data);
  const data: ErrorData = parsed.success ? parsed.data : { errors: {}, fields: {} };
  if (error?.code === "BAD_REQUEST" && error.cause instanceof ValidationError) {
    addInputValidation({ data, issues: error.cause.issues });
  }
  return data;
}

/*===== Private Log Correlation =====*/

function addServerDiagnostics({
  error,
  data,
  code,
  path,
}: {
  error: unknown;
  data: ErrorData;
  code: string;
  path: readonly string[];
}) {
  const errorId = randomUUID();
  if (Object.keys(data.errors).length === 0) {
    data.errors["Server failure"] =
      error instanceof ORPCError && error.cause instanceof ValidationError
        ? "The procedure output does not match its contract. Check the handler output and response schema."
        : "An unexpected server exception occurred. Locate the error ID in server logs and inspect its cause.";
  }
  data.errors["Error ID"] = errorId;
  console.error("RPC server error", { path: path.join("."), code, errorId, cause: error });
}

/*===== Outermost Error Middleware =====*/

/**
 * Standardizes errors from validation, feature middleware, and procedure handlers.
 * Register once on the router, before input validation and every feature middleware.
 * Server failures receive an ID correlated with the original exception in server logs.
 * HTTP decoding errors occur before this middleware and remain owned by the RPC handler.
 */
export const standardizeErrorsMiddleware = os.errors(commonErrors).middleware(async ({ next, path }) => {
  try {
    return await next();
  } catch (error) {
    const rpcError = error instanceof ORPCError ? error : new ORPCError("INTERNAL_SERVER_ERROR");
    const code = rpcError.code;
    const data = getPublicErrorData(rpcError);
    const status = Object.hasOwn(rpcErrorStatusMap, code)
      ? rpcErrorStatusMap[code as keyof typeof rpcErrorStatusMap]
      : 500;
    let message = rpcError.message;

    if (status >= 500) {
      addServerDiagnostics({ error, data, code, path });
      // Explicit ORPCError messages can also contain internal details.
      message =
        code === "DATABASE_UNAVAILABLE"
          ? databaseErrors.DATABASE_UNAVAILABLE.message
          : "An unexpected server error occurred.";
    } else if (Object.keys(data.errors).length === 0 && Object.keys(data.fields).length === 0) {
      data.errors["RPC failure"] =
        "The request was rejected. Check the RPC error code, request contract, and server configuration.";
    }

    // Field-only errors stay inline; technical context accompanies general errors.
    if (Object.keys(data.errors).length > 0) {
      data.errors["Error code"] = code;
      data.errors["Procedure"] = path.join(".");
    }

    throw new ORPCError(code, { message, data, cause: error });
  }
});
