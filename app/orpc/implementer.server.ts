import { implement } from "@orpc/server";
import type { RequestHeadersHandlerPluginContext, ResponseHeadersHandlerPluginContext } from "@orpc/server/plugins";

import { contract } from "./contract";
import { standardizeErrorsMiddleware } from "./middleware/errors/errors.middleware";
import { loggingMiddleware } from "./middleware/logging/logging.middleware";

/*===== Contract Implementer =====*/

export type RpcHttpContext = RequestHeadersHandlerPluginContext &
  ResponseHeadersHandlerPluginContext & { requestUrl?: string };

export const api = implement(contract).$context<RpcHttpContext>();

// Apply shared middleware before selecting a procedure so it also wraps validation.
export const os = api.use(loggingMiddleware).use(standardizeErrorsMiddleware);
