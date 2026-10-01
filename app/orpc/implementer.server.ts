import { implement } from "@orpc/server";

import { contract } from "./contract";
import { standardizeErrorsMiddleware } from "./middleware/errors/errors.middleware";
import { loggingMiddleware } from "./middleware/logging/logging.middleware";

/*===== Contract Implementer =====*/

export const api = implement(contract);

// Apply shared middleware before selecting a procedure so it also wraps validation.
export const os = api.use(loggingMiddleware).use(standardizeErrorsMiddleware);
