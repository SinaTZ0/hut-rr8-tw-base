import { COMMON_ERROR_STATUS_MAP } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

import { router } from "./router";

/*===== RPC Handler =====*/

export const rpcHandler = new RPCHandler(router, {
  errorStatusMap: {
    ...COMMON_ERROR_STATUS_MAP,
    BAD_REQUEST: 422,
    INVALID_INPUT: 422,
    INVALID_ALTCHA: 422,
  },
  outputStatus: (_output, _procedure, path) => (path.join(".") === "complaintsAndFeedback.submit" ? 201 : undefined),
});

export async function handleRpcRequest({ request }: { request: Request }) {
  const result = await rpcHandler.handle(request, {
    prefix: "/rpc",
  });

  return result.response ?? new Response("Not found", { status: 404 });
}
