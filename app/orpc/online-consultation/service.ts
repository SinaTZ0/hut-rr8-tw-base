import type { Database } from "../../db/client";
import type { Measure } from "../../lib/request-timing.server";
import { createTrackingCode, isUniqueConstraint } from "../../lib/submission.server";
import { initialConsultationStatus } from "./constants";
import type { SubmitConsultationInput } from "./contract";
import { insertConsultation } from "./repository";
import { consultationFieldsSchema } from "./validation";

/*===== Submission Types =====*/

type InvalidSubmission = { kind: "invalid"; fields: Record<string, string> };
type InvalidChallenge = { kind: "invalid_altcha"; message: string };

export type ConsultationSubmissionResult =
  InvalidSubmission | InvalidChallenge | { kind: "success"; trackingCode: string };

/*===== Stored Domain Values =====*/

const submissionSchema = consultationFieldsSchema.transform((values) => ({
  ...values,
  mobile: values.mobile || null,
  email: values.email || null,
}));

/*===== Form Validation =====*/

/** Collects every invalid field, retaining its first actionable validation message. */
function normalizeSubmission(input: Omit<SubmitConsultationInput, "altcha">) {
  const parsed = submissionSchema.safeParse({
    ...input,
    mobile: input.mobile ?? "",
    email: input.email ?? "",
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

/*===== Submission =====*/

/** Validates and saves a submission using a nonce verified by the shared challenge guard. */
export async function submitConsultation({
  db,
  input,
  altchaNonce,
  measure,
}: {
  db: Database;
  input: Omit<SubmitConsultationInput, "altcha">;
  altchaNonce: string;
  measure: Measure;
}): Promise<ConsultationSubmissionResult> {
  return measure({
    layer: "service",
    name: "submitConsultation",
    run: async () => {
      const normalized = normalizeSubmission(input);
      if (normalized.kind === "invalid") return normalized;

      /*------ Insert and Rare Tracking-Code Collision ------*/

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const record = await insertConsultation({
            db,
            measure,
            values: {
              ...normalized.values,
              altchaNonce,
              status: initialConsultationStatus,
              trackingCode: createTrackingCode(),
            },
          });
          return { kind: "success", trackingCode: record.trackingCode };
        } catch (error) {
          if (isUniqueConstraint({ error, constraint: "online_consultation_altcha_nonce_unique" })) {
            return { kind: "invalid_altcha", message: "اعتبارسنجی امنیتی قبلاً استفاده شده است." };
          }
          if (!isUniqueConstraint({ error, constraint: "online_consultation_tracking_code_unique" }) || attempt === 2) {
            throw error;
          }
        }
      }

      throw new Error("A tracking code could not be allocated.");
    },
  });
}
