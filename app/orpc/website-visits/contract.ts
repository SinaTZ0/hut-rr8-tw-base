import { oc } from "@orpc/contract";
import { z } from "zod";

import { commonErrors, errorDataSchema } from "../errors";
import { databaseErrors } from "../middleware/database/database.errors";

/*===== Statistics DTO =====*/

const countSchema = z.string().regex(/^\d+$/);
const statisticsSchema = z.object({
  today: countSchema,
  yesterday: countSchema,
  total: countSchema,
  online: z.number().int().nonnegative(),
  updatedAt: z.iso.datetime(),
});

const recordInputSchema = z.strictObject({
  eventId: z.uuid(),
  pathname: z.string().min(1).max(2048),
});

/*===== Public Contract =====*/

const visitContract = oc.errors({
  ...commonErrors,
  ...databaseErrors,
  INVALID_INPUT: { data: errorDataSchema, message: "The page is not a public website route." },
});

export const websiteVisitsContract = {
  summary: visitContract.output(statisticsSchema),
  record: visitContract.input(recordInputSchema).output(statisticsSchema),
  heartbeat: visitContract.output(statisticsSchema),
};

export type VisitStatistics = z.infer<typeof statisticsSchema>;
export type RecordVisitInput = z.infer<typeof recordInputSchema>;
