import { oc } from "@orpc/contract";
import { z } from "zod";

import { commonErrors, errorDataSchema } from "../errors";
import { altchaErrors } from "../middleware/altcha/altcha.errors";
import { databaseErrors } from "../middleware/database/database.errors";

/*===== Submission Schemas =====*/

const submitComplaintInputSchema = z.strictObject({
  firstName: z.string(),
  lastName: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  studentId: z.string().optional(),
  department: z.string(),
  feedbackType: z.string(),
  message: z.string(),
  altcha: z.string().min(1).max(8192),
});

const submitComplaintOutputSchema = z.object({
  status: z.literal("pending"),
  trackingCode: z.string(),
});

/*===== Public Contract =====*/

export const complaintsAndFeedbackContract = {
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
    .input(submitComplaintInputSchema)
    .output(submitComplaintOutputSchema),
};

export type SubmitComplaintInput = z.infer<typeof submitComplaintInputSchema>;
