import { env } from "../../config/env";

import { createDatabase } from "./client";

/*===== Application Database =====*/

const connection = createDatabase(env.databaseUrl);

export const db = connection.db;
export const dbPool = connection.pool;
