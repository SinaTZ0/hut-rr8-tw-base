import type { Database } from "../db/client";

/*===== oRPC Context =====*/

export type ORPCContext = {
  db: Database;
};
