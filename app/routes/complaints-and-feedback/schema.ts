import { z } from "zod";

import { complaintFieldsSchema } from "~/orpc/complaints-and-feedback/validation";

/*===== Form Validation =====*/

export const complaintsAndFeedbackFormSchema = complaintFieldsSchema.extend({
  altcha: z.string().min(1, "لطفاً تأیید امنیتی را انجام دهید.").max(8192),
});

export type ComplaintsAndFeedbackFormValues = z.input<typeof complaintsAndFeedbackFormSchema>;

export const emptyComplaintsAndFeedbackForm: ComplaintsAndFeedbackFormValues = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  studentId: "",
  department: "",
  feedbackType: "",
  message: "",
  altcha: "",
};
