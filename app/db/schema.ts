import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/*===== Complaints and Feedback =====*/

export const complaintsAndFeedbackTable = pgTable("complaints_and_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  trackingCode: varchar("tracking_code", { length: 21 })
    .notNull()
    .unique("complaints_and_feedback_tracking_code_unique"),
  // A solved challenge can create at most one submission, even across server instances.
  altchaNonce: varchar("altcha_nonce", { length: 32 }).notNull().unique("complaints_and_feedback_altcha_nonce_unique"),
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

/*===== Online Consultation =====*/

export const onlineConsultationTable = pgTable("online_consultation", {
  id: uuid("id").defaultRandom().primaryKey(),
  trackingCode: varchar("tracking_code", { length: 21 }).notNull().unique("online_consultation_tracking_code_unique"),
  // Consumption stays atomic with the insert, including concurrent submissions.
  altchaNonce: varchar("altcha_nonce", { length: 32 }).notNull().unique("online_consultation_altcha_nonce_unique"),
  status: varchar("status", { length: 16 }).notNull().default("pending"),
  gender: varchar("gender", { length: 16 }).notNull(),
  age: integer("age").notNull(),
  maritalStatus: varchar("marital_status", { length: 16 }).notNull(),
  email: varchar("email", { length: 320 }),
  mobile: varchar("mobile", { length: 20 }),
  faculty: varchar("faculty", { length: 32 }).notNull(),
  major: varchar("major", { length: 32 }).notNull(),
  question: text("question").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
