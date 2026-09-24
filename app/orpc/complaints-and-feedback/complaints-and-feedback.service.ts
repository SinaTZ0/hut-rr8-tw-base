import { randomInt } from "node:crypto";
import { z } from "zod";

import type { Database } from "../../db/client";
import { departmentValues, feedbackTypeValues, initialComplaintStatus } from "./complaints-and-feedback.constants";
import type { SubmitComplaintInput } from "./complaints-and-feedback.contract";
import { insertComplaint } from "./complaints-and-feedback.repository";
import { verifyComplaintChallenge } from "./complaints-and-feedback.captcha.server";

/*===== Submission Types =====*/

type InvalidSubmission = { kind: "invalid"; field: string; message: string };

export type ComplaintSubmissionResult = InvalidSubmission | { kind: "success"; trackingCode: string };

/*===== Shared Normalization =====*/

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - "۰".charCodeAt(0)))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - "٠".charCodeAt(0)));
}

const optionalTextSchema = z
  .string()
  .optional()
  .transform((value) => value?.trim() || null);

function normalizeMobile(value: string | null) {
  if (value === null) return null;

  const digits = normalizeDigits(value).replace(/[\s-]/g, "");
  return digits.startsWith("+98") ? `0${digits.slice(3)}` : digits;
}

/*===== Form Schema =====*/

// The contract checks request shape. This schema turns valid form input into stored domain values.
const submissionSchema = z.object({
  firstName: z.string().trim().min(1, "وارد کردن نام الزامی است.").max(100, "نام نمی‌تواند بیشتر از ۱۰۰ نویسه باشد."),
  lastName: optionalTextSchema.pipe(z.string().max(100, "نام خانوادگی نمی‌تواند بیشتر از ۱۰۰ نویسه باشد.").nullable()),
  mobile: optionalTextSchema.transform(normalizeMobile).pipe(
    z
      .string()
      .regex(/^09\d{9}$/, "شماره همراه معتبر نیست.")
      .nullable(),
  ),
  email: optionalTextSchema
    .transform((value) => value?.toLowerCase() ?? null)
    .pipe(
      z
        .string()
        .max(320, "ایمیل نمی‌تواند بیشتر از ۳۲۰ نویسه باشد.")
        .pipe(z.email({ error: "نشانی ایمیل معتبر نیست." }))
        .nullable(),
    ),
  studentId: optionalTextSchema
    .transform((value) => (value === null ? null : normalizeDigits(value)))
    .pipe(
      z
        .string()
        .regex(/^\d{3,30}$/, "شماره دانشجویی معتبر نیست.")
        .nullable(),
    ),
  department: z
    .string()
    .trim()
    .pipe(z.enum(departmentValues, { error: "واحد مورد نظر را انتخاب کنید." })),
  feedbackType: z
    .string()
    .trim()
    .pipe(z.enum(feedbackTypeValues, { error: "نوع پیام را انتخاب کنید." })),
  message: z
    .string()
    .trim()
    .min(10, "شرح پیام باید حداقل ۱۰ نویسه باشد.")
    .max(5000, "شرح پیام نمی‌تواند بیشتر از ۵۰۰۰ نویسه باشد."),
});

/*===== Form Validation =====*/

/** Maps the first Zod issue to the service's field-specific, transport-free outcome. */
function normalizeSubmission(input: SubmitComplaintInput) {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      kind: "invalid" as const,
      field: String(issue.path[0] ?? "form"),
      message: issue.message,
    };
  }

  return { kind: "valid" as const, values: parsed.data };
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

/** Drizzle may wrap the PostgreSQL error in a cause; inspect both layers. */
function isUniqueConstraint(error: unknown, constraint: string): boolean {
  if (typeof error !== "object" || error === null) return false;

  const databaseError = error as { code?: string; constraint?: string; cause?: unknown };
  return (
    (databaseError.code === "23505" && databaseError.constraint === constraint) ||
    isUniqueConstraint(databaseError.cause, constraint)
  );
}

/*===== Submission =====*/

/** Saves one valid submission; a unique nonce makes accepted ALTCHA solutions single-use. */
export async function submitComplaint({
  db,
  input,
  hmacSecret,
}: {
  db: Database;
  input: SubmitComplaintInput;
  hmacSecret: string;
}): Promise<ComplaintSubmissionResult> {
  const normalized = normalizeSubmission(input);
  if (normalized.kind === "invalid") return normalized;

  const altchaNonce = await verifyComplaintChallenge({ payload: input.altcha, hmacSecret });
  if (!altchaNonce) {
    return { kind: "invalid", field: "altcha", message: "اعتبارسنجی امنیتی نامعتبر یا منقضی شده است." };
  }

  /*------ Insert and Rare Tracking-Code Collision ------*/

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const record = await insertComplaint({
        db,
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
        return { kind: "invalid", field: "altcha", message: "اعتبارسنجی امنیتی قبلاً استفاده شده است." };
      }
      if (!isUniqueConstraint(error, "complaints_and_feedback_tracking_code_unique") || attempt === 2) {
        throw error;
      }
    }
  }

  throw new Error("A tracking code could not be allocated.");
}
