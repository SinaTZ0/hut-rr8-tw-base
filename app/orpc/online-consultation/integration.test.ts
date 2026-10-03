import { RPCSerializer } from "@orpc/client";
import { createChallenge, sha, solveChallenge, type Challenge } from "altcha/lib";
import { eq } from "drizzle-orm";
import { afterAll, afterEach, describe, expect, it } from "vitest";

import { env } from "../../../config/env";
import { db, dbPool } from "../../db/client.server";
import { onlineConsultationTable } from "../../db/schema";
import { loader as challengeLoader } from "../../routes/altcha-challenge";
import { handleRpcRequest } from "../handler.server";

/*===== Isolated Test Database =====*/

if (process.env.NODE_ENV !== "test") {
  throw new Error("Integration tests require NODE_ENV=test so requests use TEST_DATABASE_URL.");
}

const serializer = new RPCSerializer();
const createdIds: string[] = [];
const validSubmission = {
  gender: "unknown",
  age: " ۲۱ ",
  maritalStatus: "unknown",
  email: " USER@Example.COM ",
  mobile: "۰۹۱۲-۱۲۳-۴۵۶۷",
  faculty: "unknown",
  major: "unknown",
  question: "  برای انتخاب مسیر تحصیلی خود به راهنمایی نیاز دارم.  ",
};

/*===== RPC and Signed Challenge Helpers =====*/

async function requestSubmission(input: unknown) {
  const response = await handleRpcRequest({
    request: new Request("http://localhost/rpc/onlineConsultation/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(serializer.serialize(input)),
    }),
  });
  const body = serializer.deserialize(await response.json());
  // Register successful writes immediately so assertion failures still clean up their rows.
  let record;
  if (response.status === 201) {
    [record] = await db
      .select()
      .from(onlineConsultationTable)
      .where(eq(onlineConsultationTable.trackingCode, (body as { trackingCode: string }).trackingCode));
    if (record) createdIds.push(record.id);
  }
  return { response, body, record };
}

async function solve(challenge: Challenge) {
  const solution = await solveChallenge({ challenge, deriveKey: sha.deriveKey, timeout: 30_000 });
  if (!solution) throw new Error("The test challenge could not be solved.");
  return Buffer.from(JSON.stringify({ challenge, solution })).toString("base64");
}

async function createEasyPayload(expiresAt = new Date(Date.now() + 20 * 60 * 1000)) {
  return solve(
    await createChallenge({
      algorithm: "SHA-256",
      cost: 1,
      deriveKey: sha.deriveKey,
      expiresAt,
      hmacSignatureSecret: env.altchaHmacSecret,
      keyPrefix: "0",
    }),
  );
}

afterEach(async () => {
  for (const id of createdIds.splice(0)) {
    await db.delete(onlineConsultationTable).where(eq(onlineConsultationTable.id, id));
  }
});
afterAll(async () => {
  await dbPool.end();
});

/*===== Consultation Safety Net =====*/

describe("online consultation API", () => {
  it("saves a normalized pending question using the public widget challenge", async () => {
    const challengeResponse = await challengeLoader({} as Parameters<typeof challengeLoader>[0]);
    const challenge = (await challengeResponse.json()) as Challenge;
    expect(challengeResponse.headers.get("Cache-Control")).toBe("no-store");
    const result = await requestSubmission({ ...validSubmission, altcha: await solve(challenge) });

    expect(result.response.status).toBe(201);
    expect(result.body).toMatchObject({
      status: "pending",
      trackingCode: expect.stringMatching(/^HUT-[A-HJ-NP-Z2-9]{16}$/),
    });
    expect(result.record).toMatchObject({
      gender: "unknown",
      age: 21,
      maritalStatus: "unknown",
      email: "user@example.com",
      mobile: "09121234567",
      faculty: "unknown",
      major: "unknown",
      question: validSubmission.question.trim(),
      status: "pending",
      altchaNonce: challenge.parameters.nonce,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("rejects a blank question without saving or consuming the proof", async () => {
    const altcha = await createEasyPayload();
    const nonce = JSON.parse(Buffer.from(altcha, "base64").toString("utf8")).challenge.parameters.nonce;
    const rejected = await requestSubmission({ ...validSubmission, question: " ", altcha });

    expect(rejected.response.status).toBe(422);
    expect(rejected.body).toMatchObject({ code: "INVALID_INPUT", data: { fields: { question: expect.any(String) } } });
    expect(
      await db.select().from(onlineConsultationTable).where(eq(onlineConsultationTable.altchaNonce, nonce)),
    ).toHaveLength(0);
    expect((await requestSubmission({ ...validSubmission, altcha })).response.status).toBe(201);
  });

  it("rejects malformed, tampered, and expired proofs", async () => {
    const tampered = JSON.parse(Buffer.from(await createEasyPayload(), "base64").toString("utf8"));
    const nonce = tampered.challenge.parameters.nonce;
    tampered.challenge.parameters.salt = "changed";
    for (const altcha of [
      "not base64!",
      Buffer.from(JSON.stringify(tampered)).toString("base64"),
      await createEasyPayload(new Date(Date.now() - 1000)),
    ]) {
      const result = await requestSubmission({ ...validSubmission, altcha });
      expect(result.response.status).toBe(422);
      expect(result.body).toMatchObject({ code: "INVALID_ALTCHA", data: { fields: { altcha: expect.any(String) } } });
    }
    expect(
      await db.select().from(onlineConsultationTable).where(eq(onlineConsultationTable.altchaNonce, nonce)),
    ).toHaveLength(0);
  });

  it("rejects proof reuse without creating a second question", async () => {
    const submission = { ...validSubmission, altcha: await createEasyPayload() };
    const accepted = await requestSubmission(submission);
    expect(accepted.response.status).toBe(201);

    const replay = await requestSubmission(submission);
    expect(replay.response.status).toBe(422);
    expect(replay.body).toMatchObject({ code: "INVALID_ALTCHA" });
    expect(
      await db
        .select()
        .from(onlineConsultationTable)
        .where(eq(onlineConsultationTable.altchaNonce, accepted.record!.altchaNonce)),
    ).toHaveLength(1);
  });
});
