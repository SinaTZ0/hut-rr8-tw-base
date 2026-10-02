import { randomUUID } from "node:crypto";
import { os as baseOs } from "@orpc/server";
import { isbot } from "isbot";

import { commonErrors } from "../errors";
import { os, type RpcHttpContext } from "../implementer.server";
import { injectDatabaseMiddleware } from "../middleware/database/database.middleware";
import { readVisitorId, serializeVisitorId } from "./cookie.server";
import { visitRequestOrigin } from "./http.server";
import { getVisitStatistics, heartbeatWebsiteVisit, recordWebsiteVisit } from "./service";

/*===== HTTP Tracking Policy =====*/

function isCrossOriginVisitRequest(context: RpcHttpContext) {
  const origin = context.reqHeaders?.get("Origin");
  return (
    context.reqHeaders?.get("Sec-Fetch-Site") === "cross-site" ||
    Boolean(origin && origin !== visitRequestOrigin(context))
  );
}

function permitsVisitTracking(headers?: Headers) {
  return (
    process.env.NODE_ENV !== "development" &&
    !isbot(headers?.get("User-Agent")) &&
    headers?.get("DNT") !== "1" &&
    headers?.get("Sec-GPC") !== "1"
  );
}

const visitRequestMiddleware = baseOs
  .$context<RpcHttpContext>()
  .errors(commonErrors)
  .middleware(async ({ context, errors, next, path }) => {
    context.resHeaders?.set("Cache-Control", "no-store");
    const headers = context.reqHeaders;
    if (path.at(-1) !== "summary" && isCrossOriginVisitRequest(context)) {
      throw errors.FORBIDDEN({ data: { errors: { origin: "Tracking requests must be same-origin." }, fields: {} } });
    }
    return next({ context: { trackVisits: permitsVisitTracking(headers) } });
  });

/*===== Read-only Summary =====*/

export const visitSummaryProcedure = os.websiteVisits.summary
  .use(visitRequestMiddleware)
  .use(injectDatabaseMiddleware)
  .handler(({ context }) =>
    context.measure({
      layer: "procedure",
      name: "websiteVisits.summary",
      run: () => getVisitStatistics({ db: context.db, measure: context.measure, now: new Date() }),
    }),
  );

/*===== Page Views =====*/

export const recordVisitProcedure = os.websiteVisits.record
  .use(visitRequestMiddleware)
  .use(injectDatabaseMiddleware)
  .handler(({ context, input, errors }) =>
    context.measure({
      layer: "procedure",
      name: "websiteVisits.record",
      run: async () => {
        const dependencies = { db: context.db, measure: context.measure, now: new Date() };
        if (!context.trackVisits) return getVisitStatistics(dependencies);
        const visitorId = await readVisitorId(context.reqHeaders);
        const result = await recordWebsiteVisit({ ...dependencies, input, visitorId });
        if (result.kind === "invalid")
          throw errors.INVALID_INPUT({
            data: { errors: {}, fields: { pathname: "The page is not a public website route." } },
          });
        // Only a returned cookie establishes presence; first-time visitors are confirmed by the following heartbeat.
        context.resHeaders?.append(
          "Set-Cookie",
          await serializeVisitorId({ visitorId: visitorId ?? randomUUID(), requestUrl: visitRequestOrigin(context) }),
        );
        return result.statistics;
      },
    }),
  );

/*===== Presence =====*/

export const visitHeartbeatProcedure = os.websiteVisits.heartbeat
  .use(visitRequestMiddleware)
  .use(injectDatabaseMiddleware)
  .handler(({ context }) =>
    context.measure({
      layer: "procedure",
      name: "websiteVisits.heartbeat",
      run: async () => {
        const dependencies = { db: context.db, measure: context.measure, now: new Date() };
        if (!context.trackVisits) return getVisitStatistics(dependencies);
        const visitorId = await readVisitorId(context.reqHeaders);
        const statistics = await heartbeatWebsiteVisit({ ...dependencies, visitorId });
        // Recreate expired cookies, but establish presence only after the browser returns the replacement.
        context.resHeaders?.append(
          "Set-Cookie",
          await serializeVisitorId({ visitorId: visitorId ?? randomUUID(), requestUrl: visitRequestOrigin(context) }),
        );
        return statistics;
      },
    }),
  );
