import { submitComplaintProcedure } from "./complaints-and-feedback/procedure";
import { api } from "./implementer.server";

import { submitConsultationProcedure } from "./online-consultation/procedure";
import { recordVisitProcedure, visitHeartbeatProcedure, visitSummaryProcedure } from "./website-visits/procedure";

/*===== API Router =====*/

// Procedures already carry shared middleware; the undecorated builder avoids running it twice.
export const router = api.router({
  websiteVisits: { summary: visitSummaryProcedure, record: recordVisitProcedure, heartbeat: visitHeartbeatProcedure },
  onlineConsultation: { submit: submitConsultationProcedure },
  complaintsAndFeedback: {
    submit: submitComplaintProcedure,
  },
});
