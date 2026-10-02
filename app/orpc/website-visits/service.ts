import type { Database } from "../../db/client";
import type { Measure } from "../../lib/request-timing.server";
import { isPublicVisitPathname, VISIT_TIME_ZONE } from "./constants";
import type { RecordVisitInput } from "./contract";
import { persistVisit, readVisitStatistics, refreshVisitPresence } from "./repository";

/*===== Server Clock and Calendar =====*/

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: VISIT_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Uses calendar-day arithmetic so yesterday remains correct at month/year and historical DST boundaries. */
export function visitDays(now: Date) {
  const parts = dayFormatter.formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((entry) => entry.type === type)!.value;
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  const yesterday = new Date(`${today}T00:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return { today, yesterday: yesterday.toISOString().slice(0, 10) };
}

type VisitDependencies = { db: Database; measure: Measure; now: Date };

/*===== Statistics Service =====*/

export function getVisitStatistics({ db, measure, now }: VisitDependencies) {
  return measure({
    layer: "service",
    name: "getVisitStatistics",
    run: () => readVisitStatistics({ db, measure, now, ...visitDays(now) }),
  });
}

export async function recordWebsiteVisit({
  db,
  measure,
  now,
  input,
  visitorId,
}: VisitDependencies & { input: RecordVisitInput; visitorId?: string }) {
  return measure({
    layer: "service",
    name: "recordWebsiteVisit",
    run: async () => {
      if (!isPublicVisitPathname(input.pathname)) return { kind: "invalid" as const };
      await persistVisit({ db, measure, now, eventId: input.eventId, visitorId, day: visitDays(now).today });
      return { kind: "success" as const, statistics: await getVisitStatistics({ db, measure, now }) };
    },
  });
}

export async function heartbeatWebsiteVisit({
  db,
  measure,
  now,
  visitorId,
}: VisitDependencies & { visitorId?: string }) {
  return measure({
    layer: "service",
    name: "heartbeatWebsiteVisit",
    run: async () => {
      // A missing cookie never creates presence: browsers refusing cookies cannot inflate online counts.
      if (visitorId) await refreshVisitPresence({ db, measure, now, visitorId });
      return getVisitStatistics({ db, measure, now });
    },
  });
}
