import { os } from "../implementer.server";
import { verifyAltchaMiddleware } from "../middleware/altcha/altcha.middleware";
import { injectDatabaseMiddleware } from "../middleware/database/database.middleware";
import { initialConsultationStatus } from "./constants";
import { submitConsultation } from "./service";

/*===== Submit Consultation =====*/

export const submitConsultationProcedure = os.onlineConsultation.submit
  .use(injectDatabaseMiddleware)
  .use(verifyAltchaMiddleware)
  .handler(({ context, errors, input }) =>
    context.measure({
      layer: "procedure",
      name: "onlineConsultation.submit",
      run: async () => {
        const { altcha: _altcha, ...formInput } = input;
        const result = await submitConsultation({
          db: context.db,
          altchaNonce: context.altchaNonce,
          input: formInput,
          measure: context.measure,
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

        return { status: initialConsultationStatus, trackingCode: result.trackingCode };
      },
    }),
  );
