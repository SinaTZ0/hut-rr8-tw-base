import { submitComplaintProcedure } from "./complaints-and-feedback/procedure";
import { api } from "./implementer.server";

import { submitConsultationProcedure } from "./online-consultation/procedure";

/*===== API Router =====*/

// Procedures already carry shared middleware; the undecorated builder avoids running it twice.
export const router = api.router({
  onlineConsultation: { submit: submitConsultationProcedure },
  complaintsAndFeedback: {
    submit: submitComplaintProcedure,
  },
});
