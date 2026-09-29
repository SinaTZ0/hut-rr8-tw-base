import { os } from "../implementer.server";
import { verifyAltchaMiddleware } from "../middleware/altcha.middleware";
import { injectDatabaseMiddleware } from "../middleware/database.middleware";
import { initialComplaintStatus } from "./complaints-and-feedback.constants";
import { submitComplaint } from "./complaints-and-feedback.service";

/*===== Submit Complaint =====*/

export const submitComplaintProcedure = os.complaintsAndFeedback.submit
  .use(injectDatabaseMiddleware)
  .use(verifyAltchaMiddleware)
  .handler(async ({ context, errors, input }) => {
    const { altcha: _altcha, ...formInput } = input;
    const result = await submitComplaint({
      db: context.db,
      altchaNonce: context.altchaNonce,
      input: formInput,
    });

    if (result.kind === "invalid") {
      throw errors.INVALID_INPUT({
        data: { field: result.field },
        message: result.message,
      });
    }

    if (result.kind === "invalid_altcha") {
      throw errors.INVALID_ALTCHA({ message: result.message });
    }

    return { status: initialComplaintStatus, trackingCode: result.trackingCode };
  });
