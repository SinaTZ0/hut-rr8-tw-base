import { lt, sql } from "drizzle-orm";

import type { Database } from "../../db/client";
import { withDatabaseAvailability } from "../../db/errors.server";
import {
  websiteVisitDaysTable as days,
  websiteVisitEventsTable as events,
  websiteVisitPresenceTable as presence,
} from "../../db/schema";
import type { Measure } from "../../lib/request-timing.server";
import { VISIT_ACTIVE_MS, VISIT_RETENTION_MS } from "./constants";

/*===== Aggregated Reads =====*/

export function readVisitStatistics({
  db,
  now,
  today,
  yesterday,
  measure,
}: {
  db: Database;
  now: Date;
  today: string;
  yesterday: string;
  measure: Measure;
}) {
  return measure({
    layer: "repository",
    name: "readVisitStatistics",
    run: () =>
      withDatabaseAvailability(async () => {
        const [counts] = await db
          .select({
            today: sql<string>`coalesce(sum(case when ${days.day} = ${today} then ${days.pageViews} else 0 end), 0)::text`,
            yesterday: sql<string>`coalesce(sum(case when ${days.day} = ${yesterday} then ${days.pageViews} else 0 end), 0)::text`,
            total: sql<string>`coalesce(sum(${days.pageViews}), 0)::text`,
            online: sql<number>`(select count(*)::int from ${presence} where ${presence.lastSeenAt} > ${new Date(now.getTime() - VISIT_ACTIVE_MS)})`,
          })
          .from(days);
        if (!counts) throw new Error("Website statistics could not be read.");
        return { ...counts, updatedAt: now.toISOString() };
      }),
  });
}

/*===== Atomic Page-view Recording =====*/

/** The receipt and counter commit together, preventing double counts after retries or concurrent delivery. */
export function persistVisit({
  db,
  eventId,
  visitorId,
  day,
  now,
  measure,
}: {
  db: Database;
  eventId: string;
  visitorId?: string;
  day: string;
  now: Date;
  measure: Measure;
}) {
  return measure({
    layer: "repository",
    name: "persistVisit",
    run: () =>
      withDatabaseAvailability(() =>
        db.transaction(async (tx) => {
          const [receipt] = await tx
            .insert(events)
            .values({ id: eventId, receivedAt: now })
            .onConflictDoNothing()
            .returning({ id: events.id });
          if (receipt) {
            await tx
              .insert(days)
              .values({ day, pageViews: 1n })
              .onConflictDoUpdate({ target: days.day, set: { pageViews: sql`${days.pageViews} + 1` } });
          }
          if (visitorId) {
            await tx
              .insert(presence)
              .values({ id: visitorId, lastSeenAt: now })
              .onConflictDoUpdate({
                target: presence.id,
                set: { lastSeenAt: sql`greatest(${presence.lastSeenAt}, ${now})` },
              });
          }
          const cutoff = new Date(now.getTime() - VISIT_RETENTION_MS);
          await tx.delete(events).where(lt(events.receivedAt, cutoff));
          await tx.delete(presence).where(lt(presence.lastSeenAt, cutoff));
        }),
      ),
  });
}

/*===== Presence Refresh =====*/

export function refreshVisitPresence({
  db,
  visitorId,
  now,
  measure,
}: {
  db: Database;
  visitorId: string;
  now: Date;
  measure: Measure;
}) {
  return measure({
    layer: "repository",
    name: "refreshVisitPresence",
    run: () =>
      withDatabaseAvailability(() =>
        db.transaction(async (tx) => {
          await tx
            .insert(presence)
            .values({ id: visitorId, lastSeenAt: now })
            .onConflictDoUpdate({
              target: presence.id,
              set: { lastSeenAt: sql`greatest(${presence.lastSeenAt}, ${now})` },
            });
          const cutoff = new Date(now.getTime() - VISIT_RETENTION_MS);
          await tx.delete(events).where(lt(events.receivedAt, cutoff));
          await tx.delete(presence).where(lt(presence.lastSeenAt, cutoff));
        }),
      ),
  });
}
