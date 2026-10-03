import { RPCSerializer } from "@orpc/client";
import { createChallenge, sha, solveChallenge, type Challenge } from "altcha/lib";
import { eq } from "drizzle-orm";
import { afterAll, afterEach, describe, expect, it } from "vitest";

import { env } from "../../../config/env";
import { db, dbPool } from "../../db/client.server";
import { complaintsAndFeedbackTable } from "../../db/schema";
import { loader as challengeLoader } from "../../routes/altcha-challenge";
import { handleRpcRequest } from "../handler.server";

/*===== Test Database =====*/

if (process.env.NODE_ENV !== "test") {
  throw new Error("Integration tests require NODE_ENV=test so requests use TEST_DATABASE_URL.");
}

const serializer = new RPCSerializer();
const createdIds: string[] = [];

/*===== Request Helpers =====*/

async function requestSubmission(input: unknown) {
  const request = new Request("http://localhost/rpc/complaintsAndFeedback/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(serializer.serialize(input)),
  });
  const response = await handleRpcRequest({ request });
  const body = serializer.deserialize(await response.json());

  // Register successful writes before assertions so failures still clean up their rows.
  let record;
  if (response.status === 201) {
    [record] = await db
      .select()
      .from(complaintsAndFeedbackTable)
      .where(eq(complaintsAndFeedbackTable.trackingCode, (body as { trackingCode: string }).trackingCode));
    if (record) createdIds.push(record.id);
  }
  return { response, body, record };
}

async function getSolvedPayload(challenge: Challenge) {
  const solution = await solveChallenge({ challenge, deriveKey: sha.deriveKey, timeout: 30_000 });
  if (!solution) throw new Error("The test challenge could not be solved.");

  return Buffer.from(JSON.stringify({ challenge, solution })).toString("base64");
}

async function createEasyPayload() {
  // Fast signed challenges keep failure tests focused on API behavior.
  const challenge = await createChallenge({
    algorithm: "SHA-256",
    cost: 1,
    deriveKey: sha.deriveKey,
    expiresAt: new Date(Date.now() + 20 * 60 * 1000),
    hmacSignatureSecret: env.altchaHmacSecret,
    keyPrefix: "0",
  });
  return getSolvedPayload(challenge);
}

const validSubmission = {
  firstName: "  علی  ",
  lastName: " رضایی ",
  mobile: "۰۹۱۲-۱۲۳-۴۵۶۷",
  email: " USER@Example.COM ",
  studentId: "۱۲۳۴۵۶",
  department: "ریاست دانشگاه",
  feedbackType: "suggestion",
  message: "  پیشنهاد من برای بهبود خدمات دانشگاه است.  ",
};

/*===== Cleanup =====*/

afterEach(async () => {
  for (const id of createdIds.splice(0)) {
    await db.delete(complaintsAndFeedbackTable).where(eq(complaintsAndFeedbackTable.id, id));
  }
});

afterAll(async () => {
  await dbPool.end();
});

/*===== Complaints Safety Net =====*/

describe("complaints and feedback API", () => {
  it("saves a normalized pending complaint using the public widget challenge", async () => {
    const challengeResponse = await challengeLoader({} as Parameters<typeof challengeLoader>[0]);
    const challenge = (await challengeResponse.json()) as Challenge;
    expect(challengeResponse.headers.get("Cache-Control")).toBe("no-store");
    const result = await requestSubmission({ ...validSubmission, altcha: await getSolvedPayload(challenge) });

    expect(result.response.status).toBe(201);
    expect(result.body).toMatchObject({
      status: "pending",
      trackingCode: expect.stringMatching(/^HUT-[A-HJ-NP-Z2-9]{16}$/),
    });
    expect(result.record).toMatchObject({
      firstName: "علی",
      lastName: "رضایی",
      mobile: "09121234567",
      email: "user@example.com",
      studentId: "123456",
      department: "ریاست دانشگاه",
      feedbackType: "suggestion",
      message: validSubmission.message.trim(),
      status: "pending",
      altchaNonce: challenge.parameters.nonce,
    });
  });

  it("rejects a blank message without saving or consuming the proof", async () => {
    const altcha = await createEasyPayload();
    const nonce = JSON.parse(Buffer.from(altcha, "base64").toString("utf8")).challenge.parameters.nonce;
    const rejected = await requestSubmission({ ...validSubmission, message: " ", altcha });

    expect(rejected.response.status).toBe(422);
    expect(rejected.body).toMatchObject({ code: "INVALID_INPUT", data: { fields: { message: expect.any(String) } } });
    expect(
      await db.select().from(complaintsAndFeedbackTable).where(eq(complaintsAndFeedbackTable.altchaNonce, nonce)),
    ).toHaveLength(0);
    expect((await requestSubmission({ ...validSubmission, altcha })).response.status).toBe(201);
  });

  it("rejects proof reuse without creating a second complaint", async () => {
    const submission = { ...validSubmission, altcha: await createEasyPayload() };
    const accepted = await requestSubmission(submission);
    expect(accepted.response.status).toBe(201);

    const replay = await requestSubmission(submission);
    expect(replay.response.status).toBe(422);
    expect(replay.body).toMatchObject({ code: "INVALID_ALTCHA" });
    expect(
      await db
        .select()
        .from(complaintsAndFeedbackTable)
        .where(eq(complaintsAndFeedbackTable.altchaNonce, accepted.record!.altchaNonce)),
    ).toHaveLength(1);
  });
});
