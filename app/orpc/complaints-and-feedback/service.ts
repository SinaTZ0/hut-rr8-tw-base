import { randomInt } from "node:crypto";

import type { Database } from "../../db/client";
import type { Measure } from "../../lib/request-timing.server";
import { initialComplaintStatus } from "./constants";
import type { SubmitComplaintInput } from "./contract";
import { insertComplaint } from "./repository";
import { complaintFieldsSchema } from "./validation";

/*===== Submission Types =====*/

type InvalidSubmission = { kind: "invalid"; fields: Record<string, string> };
type InvalidChallenge = { kind: "invalid_altcha"; message: string };

export type ComplaintSubmissionResult =
  InvalidSubmission | InvalidChallenge | { kind: "success"; trackingCode: string };

/*===== Stored Domain Values =====*/

const submissionSchema = complaintFieldsSchema.transform((values) => ({
  ...values,
  lastName: values.lastName || null,
  mobile: values.mobile || null,
  email: values.email || null,
  studentId: values.studentId || null,
}));

/*===== Form Validation =====*/

/** Collects every invalid field, retaining its first actionable validation message. */
function normalizeSubmission(input: Omit<SubmitComplaintInput, "altcha">) {
  const parsed = submissionSchema.safeParse({
    ...input,
    lastName: input.lastName ?? "",
    mobile: input.mobile ?? "",
    email: input.email ?? "",
    studentId: input.studentId ?? "",
  });
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0]);
      if (!Object.hasOwn(fields, field)) fields[field] = issue.message;
    }
    return {
      kind: "invalid" as const,
      fields,
    };
  }

  return {
    kind: "valid" as const,
    values: parsed.data,
  };
}

/*===== Tracking Codes and Database Errors =====*/

const trackingCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function createTrackingCode() {
  let suffix = "";
  for (let index = 0; index < 16; index += 1) {
    suffix += trackingCodeAlphabet[randomInt(trackingCodeAlphabet.length)];
  }
  return `HUT-${suffix}`;
}

/** Walks wrapped PostgreSQL errors without looping on a cyclic cause chain. */
function isUniqueConstraint(error: unknown, constraint: string): boolean {
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

/*===== Submission =====*/

/** Validates and saves a submission using a nonce verified by the shared challenge guard. */
export async function submitComplaint({
  db,
  input,
  altchaNonce,
  measure,
}: {
  db: Database;
  input: Omit<SubmitComplaintInput, "altcha">;
  altchaNonce: string;
  measure: Measure;
}): Promise<ComplaintSubmissionResult> {
  return measure({
    layer: "service",
    name: "submitComplaint",
    run: async () => {
      const normalized = normalizeSubmission(input);
      if (normalized.kind === "invalid") return normalized;

      /*------ Insert and Rare Tracking-Code Collision ------*/

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const record = await insertComplaint({
            db,
            measure,
            values: {
              ...normalized.values,
              altchaNonce,
              status: initialComplaintStatus,
              trackingCode: createTrackingCode(),
            },
          });
          return { kind: "success", trackingCode: record.trackingCode };
        } catch (error) {
          if (isUniqueConstraint(error, "complaints_and_feedback_altcha_nonce_unique")) {
            return { kind: "invalid_altcha", message: "اعتبارسنجی امنیتی قبلاً استفاده شده است." };
          }
          if (!isUniqueConstraint(error, "complaints_and_feedback_tracking_code_unique") || attempt === 2) {
            throw error;
          }
        }
      }

      throw new Error("A tracking code could not be allocated.");
    },
  });
}
