import { os } from "@orpc/server";

import { env } from "../../../../config/env";
import { verifyAltchaChallenge } from "../../../lib/altcha.server";
import { altchaErrors } from "./altcha.errors";

/*===== Shared ALTCHA Guard =====*/

// Each feature owns consumption of this verified nonce alongside its database write.
export const verifyAltchaMiddleware = os
  .errors(altchaErrors)
  .middleware(async ({ errors, next }, input: { altcha: string }) => {
    const altchaNonce = await verifyAltchaChallenge({ payload: input.altcha, hmacSecret: env.altchaHmacSecret });
    if (!altchaNonce) {
      throw errors.INVALID_ALTCHA({
        data: { errors: {}, fields: { altcha: altchaErrors.INVALID_ALTCHA.message } },
      });
    }
    return next({ context: { altchaNonce } });
  });
