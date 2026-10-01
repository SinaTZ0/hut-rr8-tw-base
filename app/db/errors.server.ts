/*===== Database Failure Classification =====*/

const networkErrorCodes = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ENOTFOUND",
  "EPIPE",
]);
const postgresAvailabilityCodes = new Set(["53300", "57P01", "57P02", "57P03", "57014"]);
const driverTimeoutMessages = new Set([
  "timeout exceeded when trying to connect",
  "Connection terminated due to connection timeout",
  "Query read timeout",
]);

/** Only inspect driver errors at a database boundary; network errors elsewhere are unrelated. */
function findAvailabilityCode(error: unknown): string | undefined {
  const visited = new Set<object>();
  let current = error;

  while (typeof current === "object" && current !== null && !visited.has(current)) {
    visited.add(current);
    const { code, cause, message } = current as { code?: unknown; cause?: unknown; message?: unknown };
    if (
      typeof code === "string" &&
      (code.startsWith("08") || postgresAvailabilityCodes.has(code) || networkErrorCodes.has(code))
    ) {
      return code;
    }
    // pg's pool acquisition and query timers do not attach an error code.
    if (typeof message === "string" && driverTimeoutMessages.has(message)) return "ETIMEDOUT";
    current = cause;
  }
}

/** Transport-free failure that keeps the driver cause private to the server. */
export class DatabaseUnavailableError extends Error {
  readonly code: string;

  constructor({ code, cause }: { code: string; cause: unknown }) {
    super("Database unavailable", { cause });
    this.name = "DatabaseUnavailableError";
    this.code = code;
  }
}

/*===== Database Operation Boundary =====*/

/** Wraps availability failures only; constraint and programming errors retain their original identity. */
export async function withDatabaseAvailability<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const code = findAvailabilityCode(error);
    if (!code) throw error;
    throw new DatabaseUnavailableError({ code, cause: error });
  }
}
