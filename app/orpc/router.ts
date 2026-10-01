import { submitComplaintProcedure } from "./complaints-and-feedback/procedure";
import { api } from "./implementer.server";

/*===== API Router =====*/

// Procedures already carry shared middleware; the undecorated builder avoids running it twice.
export const router = api.router({
  complaintsAndFeedback: {
    submit: submitComplaintProcedure,
  },
});
