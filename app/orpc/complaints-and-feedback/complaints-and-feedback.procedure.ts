import { env } from "../../../config/env";
import { initialComplaintStatus } from "./complaints-and-feedback.constants";
import { submitComplaint } from "./complaints-and-feedback.service";
import { os } from "../implementer";

/*===== Submit Complaint =====*/

export const submitComplaintProcedure = os.complaintsAndFeedback.submit.handler(async ({ context, errors, input }) => {
  const result = await submitComplaint({
    db: context.db,
    hmacSecret: env.altchaHmacSecret,
    input,
  });

  if (result.kind === "invalid") {
    throw errors.INVALID_INPUT({
      data: { field: result.field },
      message: result.message,
    });
  }

  return { status: initialComplaintStatus, trackingCode: result.trackingCode };
});
