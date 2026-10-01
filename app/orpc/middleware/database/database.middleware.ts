import { os } from "@orpc/server";

import { db } from "../../../db/client.server";
import { DatabaseUnavailableError } from "../../../db/errors.server";
import { databaseErrors } from "./database.errors";

/*===== Database Context =====*/

export const injectDatabaseMiddleware = os.errors(databaseErrors).middleware(async ({ errors, next }) => {
  try {
    return await next({ context: { db } });
  } catch (error) {
    if (!(error instanceof DatabaseUnavailableError)) throw error;

    throw errors.DATABASE_UNAVAILABLE({
      data: {
        errors: {
          "Database failure code": error.code,
          "Database availability":
            "PostgreSQL is unavailable or timed out. Check database service health, connection limits, network access, and timeout settings.",
        },
        fields: {},
      },
      cause: error,
    });
  }
});
