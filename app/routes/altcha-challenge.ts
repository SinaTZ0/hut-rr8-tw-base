import type { Route } from "./+types/altcha-challenge";

import { env } from "../../config/env";
import { createComplaintChallenge } from "../orpc/complaints-and-feedback/complaints-and-feedback.captcha.server";

/*===== Widget Challenge Route =====*/

export async function loader(_args: Route.LoaderArgs) {
  const challenge = await createComplaintChallenge(env.altchaHmacSecret);

  return Response.json(challenge, {
    headers: { "Cache-Control": "no-store" },
  });
}
