import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

/*===== Database Factory =====*/

export function createDatabase(databaseUrl: string) {
  const pool = new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5_000,
    statement_timeout: 10_000,
    // Let PostgreSQL cancel the statement before the driver gives up waiting.
    query_timeout: 15_000,
  });

  // Idle connection errors are emitted by the pool rather than a query promise.
  pool.on("error", (error) => {
    console.error("Idle database connection failed", { code: (error as Error & { code?: string }).code });
  });

  return {
    db: drizzle(pool, { schema }),
    pool,
  };
}

export type Database = ReturnType<typeof createDatabase>["db"];
