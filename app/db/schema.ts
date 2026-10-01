import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/*===== Complaints and Feedback =====*/

export const complaintsAndFeedbackTable = pgTable("complaints_and_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  trackingCode: varchar("tracking_code", { length: 21 })
    .notNull()
    .unique("complaints_and_feedback_tracking_code_unique"),
  // A solved challenge can create at most one submission, even across server instances.
  altchaNonce: varchar("altcha_nonce", { length: 32 }).notNull().unique("complaints_and_feedback_altcha_nonce_unique"),
  // Unused retry metadata remains mapped so db:push preserves existing stored columns.
  idempotencyKey: uuid("idempotency_key").unique("complaints_and_feedback_idempotency_key_unique"),
  submissionHash: varchar("submission_hash", { length: 64 }),
  status: varchar("status", { length: 16 }).notNull().default("pending"),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }),
  mobile: varchar("mobile", { length: 20 }),
  email: varchar("email", { length: 320 }),
  studentId: varchar("student_id", { length: 30 }),
  department: varchar("department", { length: 160 }).notNull(),
  feedbackType: varchar("feedback_type", { length: 32 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
