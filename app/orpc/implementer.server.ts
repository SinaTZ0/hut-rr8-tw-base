import { implement } from "@orpc/server";

import { contract } from "./contract";

/*===== Contract Implementer =====*/

export const os = implement(contract);
