import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import type { Database } from "../../db/client";
import { withDatabaseAvailability } from "../../db/errors.server";
import { onlineConsultationTable } from "../../db/schema";
import type { Measure } from "../../lib/request-timing.server";

/*===== Persistence Types =====*/

export type ConsultationRecord = InferSelectModel<typeof onlineConsultationTable>;
export type NewConsultationRecord = InferInsertModel<typeof onlineConsultationTable>;

/*===== Submission Insert =====*/

export async function insertConsultation({
  db,
  values,
  measure,
}: {
  db: Database;
  values: NewConsultationRecord;
  measure: Measure;
}): Promise<ConsultationRecord> {
  return measure({
    layer: "repository",
    name: "insertConsultation",
    run: async () => {
      const [record] = await withDatabaseAvailability(() =>
        db.insert(onlineConsultationTable).values(values).returning(),
      );

      if (!record) {
        throw new Error("The consultation could not be created.");
      }

      return record;
    },
  });
}
