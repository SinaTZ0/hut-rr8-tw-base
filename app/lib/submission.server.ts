import { randomInt } from "node:crypto";

/*===== Tracking Codes and Database Errors =====*/

const trackingCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Allocates a cryptographically random 80-bit suffix; persistence enforces uniqueness. */
export function createTrackingCode() {
  let suffix = "";
  for (let index = 0; index < 16; index += 1) {
    suffix += trackingCodeAlphabet[randomInt(trackingCodeAlphabet.length)];
  }
  return `HUT-${suffix}`;
}

/** Walks wrapped PostgreSQL errors without looping on a cyclic cause chain. */
export function isUniqueConstraint({ error, constraint }: { error: unknown; constraint: string }): boolean {
  const visited = new Set<object>();
  let current = error;
  while (typeof current === "object" && current !== null && !visited.has(current)) {
    visited.add(current);
    const databaseError = current as { code?: string; constraint?: string; cause?: unknown };
    if (databaseError.code === "23505" && databaseError.constraint === constraint) return true;
    current = databaseError.cause;
  }
  return false;
}
