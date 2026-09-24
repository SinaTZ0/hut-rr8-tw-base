import type { Route } from "./+types/rpc";

import { db } from "~/db/client.server";
import { handleRpcRequest } from "~/orpc/handler.server";

/*===== RPC Resource Route =====*/

function handleRequest(request: Request) {
  return handleRpcRequest({ context: { db }, request });
}

export function loader({ request }: Route.LoaderArgs) {
  return handleRequest(request);
}

export function action({ request }: Route.ActionArgs) {
  return handleRequest(request);
}
