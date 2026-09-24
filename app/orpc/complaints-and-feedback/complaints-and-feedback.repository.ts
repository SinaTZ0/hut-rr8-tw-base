import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import type { Database } from "../../db/client";
import { complaintsAndFeedbackTable } from "../../db/schema";

/*===== Persistence Types =====*/

export type ComplaintRecord = InferSelectModel<typeof complaintsAndFeedbackTable>;
export type NewComplaintRecord = InferInsertModel<typeof complaintsAndFeedbackTable>;

/*===== Submission Insert =====*/

export async function insertComplaint({
  db,
  values,
}: {
  db: Database;
  values: NewComplaintRecord;
}): Promise<ComplaintRecord> {
  const [record] = await db.insert(complaintsAndFeedbackTable).values(values).returning();

  if (!record) {
    throw new Error("The complaint could not be created.");
  }

  return record;
}
