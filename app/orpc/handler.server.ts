import { RPCHandler } from "@orpc/server/fetch";

import { rpcErrorStatusMap } from "./errors";
import { router } from "./router";

/*===== RPC Handler =====*/

export const rpcHandler = new RPCHandler(router, {
  errorStatusMap: rpcErrorStatusMap,
  outputStatus: (_output, _procedure, path) =>
    ["complaintsAndFeedback.submit", "onlineConsultation.submit"].includes(path.join(".")) ? 201 : undefined,
});

export async function handleRpcRequest({ request }: { request: Request }) {
  const result = await rpcHandler.handle(request, {
    prefix: "/rpc",
  });

  return result.response ?? new Response("Not found", { status: 404 });
}
