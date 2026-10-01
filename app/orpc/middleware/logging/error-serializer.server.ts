/*===== Private Error Diagnostics =====*/

type ErrorDetails = {
  message?: unknown;
  stack?: unknown;
  cause?: unknown;
  params?: unknown;
  [key: string]: unknown;
};

function isErrorObject(value: unknown): value is ErrorDetails {
  return typeof value === "object" && value !== null;
}

/** Filters dependency and Node internal frames, preserving the complete multiline error header. */
function getApplicationStack(error: ErrorDetails) {
  const stack = error.stack;
  if (typeof stack !== "string") return;
  const header =
    typeof error.name === "string" && typeof error.message === "string" ? `${error.name}: ${error.message}` : undefined;
  // SQL and params can contain newlines that resemble frames; only filter after the error header.
  const headerLines = header && stack.startsWith(header) ? header.split("\n").length : 1;
  const lines = stack
    .split("\n")
    .filter((line, index) => index < headerLines || !/^\s+at\s.*(?:[/\\]node_modules[/\\]|\bnode:)/.test(line));
  return {
    stack: lines.join("\n"),
    hasApplicationFrames: lines.slice(headerLines).some((line) => /^\s+at\s/.test(line)),
  };
}

/** Uses the deepest useful stack, since driver-only stacks can lose every frame during filtering. */
function getLogStack(causes: ErrorDetails[]) {
  let selected: ReturnType<typeof getApplicationStack>;
  for (const cause of causes) {
    const stack = getApplicationStack(cause);
    if (stack && (!selected || stack.hasApplicationFrames)) selected = stack;
  }
  return selected?.stack;
}

/**
 * Retains original messages, SQL, parameters, and driver diagnostics for debugging.
 * One top-level stack shows the deepest cause with application frames, falling back to the first
 * available stack. Dependency and Node internal frames are omitted; error headers are retained.
 * Causes are bounded and cycle-safe; arbitrary error properties and raw thrown values are omitted,
 * and the original exception is not mutated. Database details are intentionally not redacted.
 * Returns minimal diagnostics if inspecting an exception throws, preserving the original RPC failure.
 */
export function serializeRpcError(error: unknown) {
  try {
    const causes: ErrorDetails[] = [];
    const visited = new Set<object>();
    let current = error;
    while (isErrorObject(current) && !visited.has(current) && causes.length < 32) {
      visited.add(current);
      causes.push(current);
      current = current.cause;
    }

    const causeChainTruncated = isErrorObject(current) && !visited.has(current);
    const serialized = causes.map((cause) => {
      return {
        type: cause instanceof Error ? cause.constructor.name : "Error",
        message: typeof cause.message === "string" ? cause.message : "Non-Error exception",
        ...Object.fromEntries(
          // Preserve structured diagnostics even when they belong to a nested PostgreSQL cause.
          [
            "code",
            "constraint",
            "schema",
            "table",
            "column",
            "query",
            "detail",
            "hint",
            "position",
            "internalPosition",
            "internalQuery",
            "where",
            "dataType",
            "severity",
            "routine",
            "file",
            "line",
          ].flatMap((key) => (typeof cause[key] === "string" ? [[key, cause[key]]] : [])),
        ),
        ...(Array.isArray(cause.params) ? { params: cause.params } : {}),
      };
    });

    const [root, ...nested] = serialized;
    return root
      ? {
          ...root,
          stack: getLogStack(causes),
          ...(nested.length > 0 ? { causes: nested } : {}),
          ...(causeChainTruncated ? { causeChainTruncated: true } : {}),
        }
      : { type: "UnknownError", message: "Non-Error exception" };
  } catch {
    // Do not inspect the exception again: a getter or proxy may be what failed.
    return { type: "UnknownError", message: "Error diagnostics could not be serialized.", serializationFailed: true };
  }
}
