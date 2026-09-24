import { implement } from "@orpc/server";

import type { ORPCContext } from "./context";
import { contract } from "./contract";

/*===== Contract Implementer =====*/

export const os = implement(contract).$context<ORPCContext>();
