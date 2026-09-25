import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterContractClient } from "@orpc/contract";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import { contract } from "./contract";

/*===== Browser RPC Client =====*/

const rpcLink = new RPCLink({ url: "/rpc" });

export const rpcClient: RouterContractClient<typeof contract> = createORPCClient(rpcLink);

/*===== React Query Options =====*/

export const orpc = createTanstackQueryUtils(rpcClient);
