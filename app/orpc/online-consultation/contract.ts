import { oc } from "@orpc/contract";
import { z } from "zod";

import { commonErrors, errorDataSchema } from "../errors";
import { altchaErrors } from "../middleware/altcha/altcha.errors";
import { databaseErrors } from "../middleware/database/database.errors";

/*===== Submission Schemas =====*/

const submitConsultationInputSchema = z.strictObject({
  gender: z.string(),
  age: z.string(),
  maritalStatus: z.string(),
  email: z.string().optional(),
  mobile: z.string().optional(),
  faculty: z.string(),
  major: z.string(),
  question: z.string(),
  altcha: z.string().min(1).max(8192),
});

const submitConsultationOutputSchema = z.object({
  status: z.literal("pending"),
  trackingCode: z.string(),
});

/*===== Public Contract =====*/

export const onlineConsultationContract = {
  submit: oc
    .errors({
      ...commonErrors,
      ...databaseErrors,
      ...altchaErrors,
      INVALID_INPUT: {
        data: errorDataSchema,
        message: "The request contains invalid values.",
      },
    })
    .input(submitConsultationInputSchema)
    .output(submitConsultationOutputSchema),
};

export type SubmitConsultationInput = z.infer<typeof submitConsultationInputSchema>;
