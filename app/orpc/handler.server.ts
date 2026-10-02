import { RPCHandler } from "@orpc/server/fetch";
import { RequestHeadersHandlerPlugin, ResponseHeadersHandlerPlugin } from "@orpc/server/plugins";

import { rpcErrorStatusMap } from "./errors";
import { router } from "./router";

/*===== RPC Handler =====*/

export const rpcHandler = new RPCHandler(router, {
  plugins: [new RequestHeadersHandlerPlugin(), new ResponseHeadersHandlerPlugin()],
  allowMethods: (method, _procedure, path) =>
    path[0] === "websiteVisits" ? method === "POST" : ["POST", "PUT", "PATCH", "DELETE"].includes(method),
  errorStatusMap: rpcErrorStatusMap,
  outputStatus: (_output, _procedure, path) =>
    ["complaintsAndFeedback.submit", "onlineConsultation.submit"].includes(path.join(".")) ? 201 : undefined,
});

export async function handleRpcRequest({ request }: { request: Request }) {
  const result = await rpcHandler.handle(request, {
    prefix: "/rpc",
    context: { requestUrl: request.url },
  });

  return result.response ?? new Response("Not found", { status: 404 });
}
