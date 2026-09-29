import { env } from "../../../config/env";
import { verifyComplaintChallenge } from "../complaints-and-feedback/complaints-and-feedback.captcha.server";
import type { SubmitComplaintInput } from "../complaints-and-feedback/complaints-and-feedback.contract";
import { os } from "../implementer.server";

/*===== ALTCHA Guard =====*/

export const verifyAltchaMiddleware = os.middleware(async ({ errors, next }, input: SubmitComplaintInput) => {
  const altchaNonce = await verifyComplaintChallenge({ payload: input.altcha, hmacSecret: env.altchaHmacSecret });
  if (!altchaNonce) {
    throw errors.INVALID_ALTCHA({ message: "اعتبارسنجی امنیتی نامعتبر یا منقضی شده است." });
  }

  return next({ context: { altchaNonce } });
});
