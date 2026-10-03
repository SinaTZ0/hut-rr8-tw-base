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
import { handleRpcRequest } from "../handler.server";
import type { VisitStatistics } from "./contract";
import { serializeVisitorId } from "./cookie.server";
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

/*===== RPC and Cookie Helpers =====*/

async function requestVisits({
  procedure = "summary",
  input,
  headers = {},
}: {
  procedure?: "summary" | "record" | "heartbeat";
  input?: unknown;
  headers?: Record<string, string>;
} = {}) {
  const response = await handleRpcRequest({
    request: new Request(`http://localhost/rpc/websiteVisits/${procedure}`, {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": browserAgent, ...headers },
      body: JSON.stringify(serializer.serialize(input)),
    }),
  });
  const body = response.headers.get("content-type")?.includes("json")
    ? serializer.deserialize(await response.json())
    : undefined;
  return { response, body: body as VisitStatistics };
}

async function record({
  headers = {},
  eventId = randomUUID(),
}: { headers?: Record<string, string>; eventId?: string } = {}) {
  createdIds.add(eventId);
  createdDays.add(visitDays(new Date()).today);
  return requestVisits({ procedure: "record", input: { eventId, pathname: "/" }, headers });
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

/*===== Visit Counting and Privacy Safety Net =====*/

describe("website visit statistics", () => {
  it("deduplicates concurrent deliveries and later retries across different route paths", async () => {
    const id = randomUUID();
    const before = await requestVisits();
    const results = await Promise.all([record({ eventId: id }), record({ eventId: id })]);
    expect(results.map(({ response }) => response.status)).toEqual([200, 200]);
    await requestVisits({ procedure: "record", input: { eventId: id, pathname: "/online-consultation" } });
    const after = await requestVisits();
    expect(after.body.today).toBe("1");
    expect(BigInt(after.body.total)).toBe(BigInt(before.body.total) + 1n);
    expect(await db.select().from(events).where(eq(events.id, id))).toHaveLength(1);
  });

  it.each(["DNT", "Sec-GPC"])("does not track or set cookies when %s is enabled", async (header) => {
    const cookie = await cookieFor();
    const headers = { [header]: "1", Cookie: cookie };
    const before = await requestVisits();
    const result = await record({ headers });
    const heartbeat = await requestVisits({ procedure: "heartbeat", headers });

    expect(result.response.status).toBe(200);
    expect(heartbeat.response.status).toBe(200);
    expect(result.body.total).toBe(before.body.total);
    expect(heartbeat.body.online).toBe(before.body.online);
    expect(result.response.headers.get("Set-Cookie")).toBeNull();
    expect(heartbeat.response.headers.get("Set-Cookie")).toBeNull();
    expect(
      await db
        .select()
        .from(events)
        .where(inArray(events.id, [...createdIds])),
    ).toHaveLength(0);
    expect(
      await db
        .select()
        .from(presence)
        .where(inArray(presence.id, [...createdIds])),
    ).toHaveLength(0);
  });
});
