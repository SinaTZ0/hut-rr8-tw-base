import { os } from "../implementer.server";
import { verifyAltchaMiddleware } from "../middleware/altcha/altcha.middleware";
import { injectDatabaseMiddleware } from "../middleware/database/database.middleware";
import { initialComplaintStatus } from "./constants";
import { submitComplaint } from "./service";

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
      throw errors.INVALID_INPUT({ data: { errors: {}, fields: result.fields } });
    }

    if (result.kind === "invalid_altcha") {
      throw errors.INVALID_ALTCHA({
        message: result.message,
        data: { errors: {}, fields: { altcha: result.message } },
      });
    }

    return { status: initialComplaintStatus, trackingCode: result.trackingCode };
  });
