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

/*===== Submission and Normalization =====*/

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

  it.each([
    {
      input: {
        age: "1",
        email: "",
        mobile: "",
        question: "س".repeat(10),
        gender: "male",
        maritalStatus: "single",
        faculty: "electrical-computer",
        major: "organic-chemistry",
      },
      expected: { age: 1, email: null, mobile: null, question: "س".repeat(10) },
    },
    {
      input: {
        age: "۱۲۰",
        email: undefined,
        mobile: undefined,
        question: ` ${"س".repeat(5000)} `,
        gender: "female",
        maritalStatus: "married",
        faculty: "basic-sciences",
        major: "engineering-physics",
      },
      expected: { age: 120, email: null, mobile: null, question: "س".repeat(5000) },
    },
    {
      input: { age: "٢٣", mobile: "+٩٨ ٩١٢-١٢٣٤٥٦٧", faculty: "technical-engineering", major: "computer" },
      expected: {
        age: 23,
        email: "user@example.com",
        mobile: "09121234567",
        question: "برای انتخاب مسیر تحصیلی خود به راهنمایی نیاز دارم.",
      },
    },
  ])("accepts boundary ages and independent academic choices: $input.age", async ({ input, expected }) => {
    const result = await requestSubmission({ ...validSubmission, ...input, altcha: await createEasyPayload() });
    expect(result.response.status).toBe(201);
    expect(result.record).toMatchObject(expected);
  });

  it.each(["electrical", "industrial", "polymer", "civil", "mechanical"])(
    "accepts the documented major %s",
    async (major) => {
      const result = await requestSubmission({ ...validSubmission, major, altcha: await createEasyPayload() });
      expect(result.response.status).toBe(201);
      expect(result.record?.major).toBe(major);
    },
  );

  /*------ Rejected Values Leave the Proof Available ------*/

  it("reports every invalid field without persisting or consuming the proof", async () => {
    const altcha = await createEasyPayload();
    const nonce = JSON.parse(Buffer.from(altcha, "base64").toString("utf8")).challenge.parameters.nonce;
    const invalidFields = [
      { field: "age", value: "" },
      { field: "age", value: "0" },
      { field: "age", value: "121" },
      { field: "age", value: "-1" },
      { field: "age", value: "21.5" },
      { field: "age", value: "1e2" },
      { field: "age", value: "سن" },
      { field: "age", value: "٢١٫٥" },
      { field: "gender", value: "other" },
      { field: "maritalStatus", value: "divorced" },
      { field: "faculty", value: "science" },
      { field: "major", value: "biology" },
      { field: "mobile", value: "123" },
      { field: "mobile", value: "+981234567890" },
      { field: "email", value: "user@.example.com" },
      { field: "email", value: "a".repeat(321) },
      { field: "question", value: "  " },
      { field: "question", value: "س".repeat(9) },
      { field: "question", value: "س".repeat(5001) },
    ];
    for (const { field, value } of invalidFields) {
      const result = await requestSubmission({ ...validSubmission, [field]: value, altcha });
      expect(result.response.status).toBe(422);
      expect(result.body).toMatchObject({ code: "INVALID_INPUT", data: { fields: { [field]: expect.any(String) } } });
    }
    const multiple = await requestSubmission({ ...validSubmission, age: "", question: "", gender: "invalid", altcha });
    expect(multiple.body).toMatchObject({
      data: { fields: { age: expect.any(String), question: expect.any(String), gender: expect.any(String) } },
    });
    expect(
      await db.select().from(onlineConsultationTable).where(eq(onlineConsultationTable.altchaNonce, nonce)),
    ).toHaveLength(0);
    expect((await requestSubmission({ ...validSubmission, altcha })).response.status).toBe(201);
  });

  /*------ Security and Transport Boundaries ------*/

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

  it("allows exactly one concurrent submission and rejects later replay", async () => {
    const input = { ...validSubmission, altcha: await createEasyPayload() };
    const results = await Promise.all([requestSubmission(input), requestSubmission(input)]);
    expect(results.map(({ response }) => response.status).sort()).toEqual([201, 422]);
    expect(results.find(({ response }) => response.status === 422)?.body).toMatchObject({ code: "INVALID_ALTCHA" });
    const replay = await requestSubmission(input);
    expect(replay.response.status).toBe(422);
    expect(replay.body).toMatchObject({ code: "INVALID_ALTCHA" });
  });

  it("rejects missing required fields, unexpected fields, and non-string values", async () => {
    const altcha = await createEasyPayload();
    for (const overrides of [
      { age: 21 },
      { gender: undefined },
      { question: undefined },
      { email: null },
      { unexpected: "value" },
      { altcha: "" },
    ]) {
      const result = await requestSubmission({ ...validSubmission, altcha, ...overrides });
      expect(result.response.status).toBe(422);
      expect(result.body).toMatchObject({ code: "BAD_REQUEST" });
    }
  });
});
