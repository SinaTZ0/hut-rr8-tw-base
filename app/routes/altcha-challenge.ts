import type { Route } from "./+types/altcha-challenge";

import { env } from "../../config/env";
import { createAltchaChallenge } from "../lib/altcha.server";

/*===== Widget Challenge Route =====*/

export async function loader(_args: Route.LoaderArgs) {
  const challenge = await createAltchaChallenge(env.altchaHmacSecret);

  return Response.json(challenge, {
    headers: { "Cache-Control": "no-store" },
  });
}
