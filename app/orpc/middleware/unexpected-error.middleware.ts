import { ORPCError } from "@orpc/server";

import { os } from "../implementer";

/*===== Unexpected Error Boundary =====*/

export const unexpectedErrorMiddleware = os.middleware(async ({ next, path }) => {
  try {
    // Await the downstream call so rejected promises are caught here too.
    return await next();
  } catch (error) {
    // Declared and standard oRPC errors already have a safe public response.
    if (error instanceof ORPCError) throw error;

    console.error(`[oRPC] Unexpected error in ${path.join(".")}`, error);
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Internal server error",
      cause: error,
    });
  }
});
