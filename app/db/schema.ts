import { sql } from "drizzle-orm";
import { bigint, date, index, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/*===== Website Visits =====*/

export const websiteVisitDaysTable = pgTable("website_visit_days", {
  day: date("day").primaryKey(),
  // A SQL default avoids drizzle-kit's JSON serialization of bigint literals during db:push.
  pageViews: bigint("page_views", { mode: "bigint" })
    .notNull()
    .default(sql`0`),
});

// Receipts are short-lived; aggregates survive receipt cleanup and server restarts.
export const websiteVisitEventsTable = pgTable(
  "website_visit_events",
  {
    id: uuid("id").primaryKey(),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("website_visit_events_received_at_idx").on(table.receivedAt)],
);

export const websiteVisitPresenceTable = pgTable(
  "website_visit_presence",
  {
    id: uuid("id").primaryKey(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("website_visit_presence_last_seen_at_idx").on(table.lastSeenAt)],
);

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
