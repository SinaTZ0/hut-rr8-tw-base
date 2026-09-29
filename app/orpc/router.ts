import { submitComplaintProcedure } from "./complaints-and-feedback/complaints-and-feedback.procedure";
import { os } from "./implementer.server";

/*===== API Router =====*/

export const router = os.router({
  complaintsAndFeedback: {
    submit: submitComplaintProcedure,
  },
});
