import { complaintsAndFeedbackContract } from "./complaints-and-feedback/contract";

import { onlineConsultationContract } from "./online-consultation/contract";
import { websiteVisitsContract } from "./website-visits/contract";

/*===== API Contract =====*/

export const contract = {
  complaintsAndFeedback: complaintsAndFeedbackContract,
  onlineConsultation: onlineConsultationContract,
  websiteVisits: websiteVisitsContract,
};
