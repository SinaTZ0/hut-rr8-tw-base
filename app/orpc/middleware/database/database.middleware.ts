import { os } from "@orpc/server";

import { db } from "../../../db/client.server";
import { DatabaseUnavailableError } from "../../../db/errors.server";
import { databaseErrors } from "./database.errors";

/*===== Database Context =====*/

export const injectDatabaseMiddleware = os.errors(databaseErrors).middleware(async ({ errors, next, path }) => {
  try {
    return await next({ context: { db } });
  } catch (error) {
    if (!(error instanceof DatabaseUnavailableError)) throw error;

    // The client receives a stable explanation; the server retains the diagnostic code and cause.
    console.error("Database unavailable", { path: path.join("."), code: error.code });
    throw errors.DATABASE_UNAVAILABLE({ cause: error });
  }
});
