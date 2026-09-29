import { db } from "../../db/client.server";
import { os } from "../implementer.server";

/*===== Database Context =====*/

export const injectDatabaseMiddleware = os.middleware(async ({ next }) => next({ context: { db } }));
