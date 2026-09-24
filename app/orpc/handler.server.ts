import { COMMON_ERROR_STATUS_MAP } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

import type { ORPCContext } from "./context";
import { router } from "./router";

/*===== RPC Handler =====*/

export const rpcHandler = new RPCHandler(router, {
  errorStatusMap: {
    ...COMMON_ERROR_STATUS_MAP,
    BAD_REQUEST: 422,
    INVALID_INPUT: 422,
  },
  outputStatus: (_output, _procedure, path) => (path.join(".") === "complaintsAndFeedback.submit" ? 201 : undefined),
});

export async function handleRpcRequest({ request, context }: { request: Request; context: ORPCContext }) {
  const result = await rpcHandler.handle(request, {
    context,
    prefix: "/rpc",
  });

  return result.response ?? new Response("Not found", { status: 404 });
}
