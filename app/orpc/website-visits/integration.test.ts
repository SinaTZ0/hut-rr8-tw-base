import { randomUUID } from "node:crypto";
import { RPCSerializer } from "@orpc/client";
import { eq, inArray } from "drizzle-orm";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { db, dbPool } from "../../db/client.server";
import {
  websiteVisitDaysTable as days,
  websiteVisitEventsTable as events,
  websiteVisitPresenceTable as presence,
} from "../../db/schema";
import { createRequestTiming } from "../../lib/request-timing.server";
import { handleRpcRequest } from "../handler.server";
import { VISIT_ACTIVE_MS, VISIT_RETENTION_MS } from "./constants";
import type { VisitStatistics } from "./contract";
import { readVisitorId, serializeVisitorId } from "./cookie.server";
import { persistVisit } from "./repository";
import { visitDays } from "./service";

/*===== Isolated Test Data =====*/

if (process.env.NODE_ENV !== "test")
  throw new Error("Website visit integration tests require the isolated test database.");

const serializer = new RPCSerializer();
const browserAgent =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const createdDays = new Set<string>();
const createdIds = new Set<string>();
const initialTime = new Date("2090-01-02T12:00:00Z");
const excludedHeaders: Record<string, string>[] = [
  { DNT: "1" },
  { "Sec-GPC": "1" },
  { "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" },
];

async function requestVisits({
  procedure = "summary",
  input,
  headers = {},
  method = "POST",
}: {
  procedure?: "summary" | "record" | "heartbeat";
  input?: unknown;
  headers?: Record<string, string>;
  method?: string;
} = {}) {
  const response = await handleRpcRequest({
    request: new Request(`http://localhost/rpc/websiteVisits/${procedure}`, {
      method,
      headers: { "content-type": "application/json", "user-agent": browserAgent, ...headers },
      ...(method === "GET" ? {} : { body: JSON.stringify(serializer.serialize(input)) }),
    }),
  });
  const body = response.headers.get("content-type")?.includes("json")
    ? serializer.deserialize(await response.json())
    : undefined;
  return { response, body: body as VisitStatistics, error: body as { code: string } };
}

async function record(headers: Record<string, string> = {}, eventId = randomUUID()) {
  createdIds.add(eventId);
  createdDays.add(visitDays(new Date()).today);
  return requestVisits({ procedure: "record", input: { eventId, pathname: "/" }, headers });
}

async function seedDay({ day, pageViews }: { day: string; pageViews: bigint }) {
  createdDays.add(day);
  await db.insert(days).values({ day, pageViews });
}

async function cookieFor(visitorId = randomUUID()) {
  createdIds.add(visitorId);
  return (await serializeVisitorId({ visitorId, requestUrl: "http://localhost" })).split(";")[0];
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(initialTime);
});

afterEach(async () => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  if (createdIds.size) {
    await db.delete(events).where(inArray(events.id, [...createdIds]));
    await db.delete(presence).where(inArray(presence.id, [...createdIds]));
  }
  if (createdDays.size) await db.delete(days).where(inArray(days.day, [...createdDays]));
  createdIds.clear();
  createdDays.clear();
});
afterAll(() => dbPool.end());

/*===== Public API and Atomic Counters =====*/

describe("website visit statistics", () => {
  it("reads without tracking and records one page view without registering unconfirmed presence", async () => {
    const before = await requestVisits();
    expect(before.response.status).toBe(200);
    expect(before.response.headers.get("Set-Cookie")).toBeNull();
    expect(before.response.headers.get("Cache-Control")).toBe("no-store");
    const result = await record();
    expect(result.response.status).toBe(200);
    expect(BigInt(result.body.total)).toBe(BigInt(before.body.total) + 1n);
    expect(result.body.today).toBe("1");
    expect(result.body.online).toBe(before.body.online);
    expect(result.response.headers.get("Set-Cookie")).toMatch(/hut-visit=.*HttpOnly.*SameSite=Lax/i);
  });

  it("deduplicates concurrent deliveries and later retries across different route paths", async () => {
    const id = randomUUID();
    const before = await requestVisits();
    const results = await Promise.all([record({}, id), record({}, id)]);
    expect(results.map(({ response }) => response.status)).toEqual([200, 200]);
    await requestVisits({ procedure: "record", input: { eventId: id, pathname: "/online-consultation" } });
    const after = await requestVisits();
    expect(after.body.today).toBe("1");
    expect(BigInt(after.body.total)).toBe(BigInt(before.body.total) + 1n);
    expect(await db.select().from(events).where(eq(events.id, id))).toHaveLength(1);
  });

  it("rolls receipts, counters, and presence back together when a transaction fails", async () => {
    const id = randomUUID();
    createdIds.add(id);
    createdDays.add("2090-01-02");
    await expect(
      db.transaction(async (tx) => {
        // The repository's transaction becomes a real savepoint inside the failing outer transaction.
        await persistVisit({
          db: tx as unknown as typeof db,
          eventId: id,
          visitorId: id,
          day: "2090-01-02",
          now: new Date(),
          measure: createRequestTiming().measure,
        });
        throw new Error("Failure before commit");
      }),
    ).rejects.toThrow("Failure before commit");
    expect(await db.select().from(events).where(eq(events.id, id))).toHaveLength(0);
    expect(await db.select().from(presence).where(eq(presence.id, id))).toHaveLength(0);
    expect(await db.select().from(days).where(eq(days.day, "2090-01-02"))).toHaveLength(0);
  });

  it("returns exact bigint counts without rounding", async () => {
    await seedDay({ day: "2090-01-02", pageViews: 9007199254740999n });
    const result = await record();
    expect(result.body.today).toBe("9007199254741000");
  });

  it.each([
    ["2090-01-31T20:29:59.999Z", "2090-01-31", "2090-01-30"],
    ["2090-01-31T20:30:00.000Z", "2090-02-01", "2090-01-31"],
    ["2089-12-31T20:30:00.000Z", "2090-01-01", "2089-12-31"],
    ["2088-02-29T20:30:00.000Z", "2088-03-01", "2088-02-29"],
  ])("buckets Tehran calendar days at %s", async (time, today, yesterday) => {
    vi.setSystemTime(new Date(time));
    expect(visitDays(new Date())).toEqual({ today, yesterday });
    await seedDay({ day: yesterday, pageViews: 7n });
    const result = await record();
    expect(result.body).toMatchObject({ today: "1", yesterday: "7", updatedAt: new Date(time).toISOString() });
  });

  /*------ Presence and Retention ------*/

  it("confirms a browser cookie, shares presence across tabs, and expires after five minutes", async () => {
    const first = await record();
    const cookie = first.response.headers.get("Set-Cookie")!.split(";")[0];
    // Register the server-generated ID for cleanup without coupling tests to cookie encoding.
    const visitorId = (await readVisitorId(new Headers({ Cookie: cookie })))!;
    createdIds.add(visitorId);
    const heartbeat = await requestVisits({ procedure: "heartbeat", headers: { Cookie: cookie } });
    expect(heartbeat.body.online).toBe(first.body.online + 1);
    expect(heartbeat.body.total).toBe(first.body.total);
    const secondTab = await record({ Cookie: cookie });
    expect(secondTab.body.online).toBe(heartbeat.body.online);
    vi.setSystemTime(new Date(initialTime.getTime() + VISIT_ACTIVE_MS));
    expect((await requestVisits()).body.online).toBe(first.body.online);
    expect((await requestVisits({ procedure: "heartbeat", headers: { Cookie: cookie } })).body.online).toBe(
      first.body.online + 1,
    );
  });

  it.each([undefined, "hut-visit=malformed"])(
    "does not create presence without a returned valid cookie (%s)",
    async (cookie) => {
      const before = await requestVisits();
      // A browser rejecting replacement cookies keeps sending the same missing or invalid value.
      for (let attempt = 0; attempt < 2; attempt++) {
        const result = await requestVisits({ procedure: "heartbeat", headers: cookie ? { Cookie: cookie } : {} });
        expect(result.body.online).toBe(before.body.online);
        expect(result.body.total).toBe(before.body.total);
        expect(result.response.headers.get("Set-Cookie")).toMatch(/hut-visit=.*HttpOnly.*SameSite=Lax/i);
      }
    },
  );

  it("replaces an expired cookie and restores presence on the next heartbeat without adding visits", async () => {
    const first = await record();
    const cookie = first.response.headers.get("Set-Cookie")!.split(";")[0];
    const originalId = (await readVisitorId(new Headers({ Cookie: cookie })))!;
    createdIds.add(originalId);
    await requestVisits({ procedure: "heartbeat", headers: { Cookie: cookie } });

    // After more than 30 minutes offline, the browser omits the expired cookie when returning.
    vi.setSystemTime(new Date(initialTime.getTime() + 31 * 60_000));
    const before = await requestVisits();
    const replacement = await requestVisits({ procedure: "heartbeat" });
    expect(replacement.body.online).toBe(before.body.online);
    expect(replacement.body.total).toBe(first.body.total);
    const replacementCookie = replacement.response.headers.get("Set-Cookie")!.split(";")[0];
    const replacementId = (await readVisitorId(new Headers({ Cookie: replacementCookie })))!;
    expect(replacementId).toBeDefined();
    expect(replacementId).not.toBe(originalId);
    createdIds.add(replacementId);
    expect(await db.select().from(presence).where(eq(presence.id, replacementId))).toHaveLength(0);

    const confirmed = await requestVisits({ procedure: "heartbeat", headers: { Cookie: replacementCookie } });
    expect(confirmed.body.online).toBe(before.body.online + 1);
    expect(confirmed.body.total).toBe(first.body.total);
    const renewedCookie = confirmed.response.headers.get("Set-Cookie")!.split(";")[0];
    expect(await readVisitorId(new Headers({ Cookie: renewedCookie }))).toBe(replacementId);
  });

  it("uses secure cookies over HTTPS and renews the 30-minute lifetime", async () => {
    const cookie = await serializeVisitorId({ visitorId: randomUUID(), requestUrl: "https://hut.ac.ir" });
    expect(cookie).toMatch(/Secure/);
    expect(cookie).toMatch(/Max-Age=1800/);
  });

  it("prunes old receipts and presence while keeping historical aggregates", async () => {
    const id = randomUUID();
    createdIds.add(id);
    const old = new Date(initialTime.getTime() - VISIT_RETENTION_MS - 1);
    await db.insert(events).values({ id, receivedAt: old });
    await db.insert(presence).values({ id, lastSeenAt: old });
    await seedDay({ day: "2089-12-01", pageViews: 13n });
    await record();
    expect(await db.select().from(events).where(eq(events.id, id))).toHaveLength(0);
    expect(await db.select().from(presence).where(eq(presence.id, id))).toHaveLength(0);
    expect(await db.select().from(days).where(eq(days.day, "2089-12-01"))).toMatchObject([{ pageViews: 13n }]);
  });

  /*------ Privacy, Validation, and Availability ------*/

  it.each(excludedHeaders)("suppresses writes and cookies for %j", async (headers) => {
    const cookie = await cookieFor();
    const before = await requestVisits();
    const result = await record({ ...headers, Cookie: cookie });
    expect(result.body.total).toBe(before.body.total);
    expect(result.response.headers.get("Set-Cookie")).toBeNull();
    for (const includeCookie of [true, false]) {
      const heartbeat = await requestVisits({
        procedure: "heartbeat",
        headers: includeCookie ? { ...headers, Cookie: cookie } : headers,
      });
      expect(heartbeat.body.online).toBe(before.body.online);
      expect(heartbeat.response.headers.get("Set-Cookie")).toBeNull();
    }
  });

  it("rejects invalid payloads and paths without writing", async () => {
    for (const input of [
      { eventId: "invalid", pathname: "/" },
      { eventId: randomUUID(), pathname: "/", extra: true },
      ...["/rpc/websiteVisits/summary", "/altcha/challenge", "/missing", "/?secret=value"].map((pathname) => ({
        eventId: randomUUID(),
        pathname,
      })),
    ]) {
      expect((await requestVisits({ procedure: "record", input })).response.status).toBe(422);
    }
    expect(await db.select().from(days).where(eq(days.day, "2090-01-02"))).toHaveLength(0);
  });

  it("rejects cross-origin writes and safe-method requests", async () => {
    expect((await record({ Origin: "https://another.example" })).response.status).toBe(403);
    expect(
      (await requestVisits({ procedure: "heartbeat", headers: { "Sec-Fetch-Site": "cross-site" } })).response.status,
    ).toBe(403);
    expect((await requestVisits({ procedure: "heartbeat", method: "GET" })).response.status).toBe(404);
  });

  it("supports HTTPS origins behind TLS termination without accepting a different host", async () => {
    const headers = { Origin: "https://localhost", "Sec-Fetch-Site": "same-origin" };
    const result = await record(headers);
    expect(result.response.status).toBe(200);
    expect(result.response.headers.get("Set-Cookie")).toMatch(/Secure/);
    expect((await record({ ...headers, Origin: "https://another.example" })).response.status).toBe(403);
    expect((await record({ ...headers, "Sec-Fetch-Site": "cross-site" })).response.status).toBe(403);
    expect((await record({ Origin: "malformed", "Sec-Fetch-Site": "same-origin" })).response.status).toBe(403);
  });

  it("reports a database outage without exposing driver details", async () => {
    vi.spyOn(db, "select").mockImplementationOnce(() => {
      throw Object.assign(new Error("private connection failure"), { code: "ECONNREFUSED" });
    });
    const result = await requestVisits();
    expect(result.response.status).toBe(503);
    expect(result.error.code).toBe("DATABASE_UNAVAILABLE");
    expect(JSON.stringify(result.error)).not.toContain("private connection failure");
  });
});
