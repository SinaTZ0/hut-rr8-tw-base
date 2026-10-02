import { complaintsAndFeedbackContract } from "./complaints-and-feedback/contract";

import { onlineConsultationContract } from "./online-consultation/contract";

/*===== API Contract =====*/

export const contract = {
  complaintsAndFeedback: complaintsAndFeedbackContract,
  onlineConsultation: onlineConsultationContract,
};
