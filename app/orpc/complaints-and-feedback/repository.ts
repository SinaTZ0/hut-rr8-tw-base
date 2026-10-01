import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import type { Database } from "../../db/client";
import { withDatabaseAvailability } from "../../db/errors.server";
import { complaintsAndFeedbackTable } from "../../db/schema";
import type { Measure } from "../../lib/request-timing.server";

/*===== Persistence Types =====*/

export type ComplaintRecord = InferSelectModel<typeof complaintsAndFeedbackTable>;
export type NewComplaintRecord = InferInsertModel<typeof complaintsAndFeedbackTable>;

/*===== Submission Insert =====*/

export async function insertComplaint({
  db,
  values,
  measure,
}: {
  db: Database;
  values: NewComplaintRecord;
  measure: Measure;
}): Promise<ComplaintRecord> {
  return measure({
    layer: "repository",
    name: "insertComplaint",
    run: async () => {
      const [record] = await withDatabaseAvailability(() =>
        db.insert(complaintsAndFeedbackTable).values(values).returning(),
      );

      if (!record) {
        throw new Error("The complaint could not be created.");
      }

      return record;
    },
  });
}
