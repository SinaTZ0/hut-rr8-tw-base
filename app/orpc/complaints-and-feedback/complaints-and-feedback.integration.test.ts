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

  return { response, body };
}

async function getSolvedPayload(challenge: Challenge) {
  const solution = await solveChallenge({ challenge, deriveKey: sha.deriveKey, timeout: 30_000 });
  if (!solution) throw new Error("The test challenge could not be solved.");

  return Buffer.from(JSON.stringify({ challenge, solution })).toString("base64");
}

async function createEasyPayload(expiresAt = new Date(Date.now() + 20 * 60 * 1000)) {
  // Fast signed challenges keep failure tests focused on API behavior.
  const challenge = await createChallenge({
    algorithm: "SHA-256",
    cost: 1,
    deriveKey: sha.deriveKey,
    expiresAt,
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

/*===== Complaints and Feedback Integration =====*/

describe("complaints and feedback API", () => {
  it("serves widget-ready JSON and saves a normalized submission through oRPC", async () => {
    const challengeResponse = await challengeLoader({} as Parameters<typeof challengeLoader>[0]);
    const challenge = (await challengeResponse.json()) as Challenge;

    expect(challengeResponse.status).toBe(200);
    expect(challengeResponse.headers.get("Cache-Control")).toBe("no-store");
    expect(challenge).toMatchObject({
      parameters: { algorithm: "SHA-256", keyPrefix: "000" },
      signature: expect.any(String),
    });

    const altcha = await getSolvedPayload(challenge);
    const result = await requestSubmission({ ...validSubmission, altcha });

    expect(result.response.status).toBe(201);
    expect(result.body).toMatchObject({
      status: "pending",
      trackingCode: expect.stringMatching(/^HUT-[A-HJ-NP-Z2-9]{16}$/),
    });

    const [record] = await db
      .select()
      .from(complaintsAndFeedbackTable)
      .where(eq(complaintsAndFeedbackTable.trackingCode, (result.body as { trackingCode: string }).trackingCode));

    createdIds.push(record.id);
    expect(record).toMatchObject({
      firstName: "علی",
      lastName: "رضایی",
      mobile: "09121234567",
      email: "user@example.com",
      studentId: "123456",
      department: "ریاست دانشگاه",
      feedbackType: "suggestion",
      message: "پیشنهاد من برای بهبود خدمات دانشگاه است.",
      status: "pending",
      altchaNonce: challenge.parameters.nonce,
    });

    /*------ The accepted challenge is single-use ------*/

    const replay = await requestSubmission({ ...validSubmission, altcha });
    expect(replay.response.status).toBe(422);
    expect(replay.body).toMatchObject({
      code: "INVALID_ALTCHA",
      message: "اعتبارسنجی امنیتی قبلاً استفاده شده است.",
    });

    /*------ A new challenge creates a different code and stores empty optional fields as null ------*/

    const secondChallenge = (await (
      await challengeLoader({} as Parameters<typeof challengeLoader>[0])
    ).json()) as Challenge;
    const secondSubmission = await requestSubmission({
      ...validSubmission,
      altcha: await getSolvedPayload(secondChallenge),
      lastName: "",
      mobile: "",
      email: "",
      studentId: "",
    });
    expect(secondSubmission.response.status).toBe(201);
    expect((secondSubmission.body as { trackingCode: string }).trackingCode).not.toBe(record.trackingCode);

    const [secondRecord] = await db
      .select()
      .from(complaintsAndFeedbackTable)
      .where(
        eq(complaintsAndFeedbackTable.trackingCode, (secondSubmission.body as { trackingCode: string }).trackingCode),
      );
    createdIds.push(secondRecord.id);
    expect(secondRecord).toMatchObject({ lastName: null, mobile: null, email: null, studentId: null });
  });

  it("rejects invalid form fields without consuming the challenge", async () => {
    const altcha = await createEasyPayload();
    const invalidFields = [
      { field: "firstName", value: " " },
      { field: "lastName", value: "a".repeat(101) },
      { field: "mobile", value: "123" },
      { field: "email", value: "user@.example.com" },
      { field: "studentId", value: "12" },
      { field: "department", value: "واحد نامعتبر" },
      { field: "feedbackType", value: "question" },
      { field: "message", value: "short" },
    ] as const;

    for (const { field, value } of invalidFields) {
      const invalid = await requestSubmission({ ...validSubmission, [field]: value, altcha });
      expect(invalid.response.status).toBe(422);
      expect(invalid.body).toMatchObject({ code: "INVALID_INPUT", data: { field } });
    }

    const accepted = await requestSubmission({ ...validSubmission, altcha });
    expect(accepted.response.status).toBe(201);

    const [record] = await db
      .select()
      .from(complaintsAndFeedbackTable)
      .where(eq(complaintsAndFeedbackTable.trackingCode, (accepted.body as { trackingCode: string }).trackingCode));
    createdIds.push(record.id);
  });

  it("normalizes Arabic digits and the international mobile prefix", async () => {
    const result = await requestSubmission({
      ...validSubmission,
      altcha: await createEasyPayload(),
      mobile: "+٩٨ ٩١٢-١٢٣٤٥٦٧",
      studentId: "١٢٣٤٥٦",
    });

    expect(result.response.status).toBe(201);

    const [record] = await db
      .select()
      .from(complaintsAndFeedbackTable)
      .where(eq(complaintsAndFeedbackTable.trackingCode, (result.body as { trackingCode: string }).trackingCode));
    createdIds.push(record.id);
    expect(record).toMatchObject({ mobile: "09121234567", studentId: "123456" });
  });

  it("rejects malformed, tampered, and expired challenges", async () => {
    const validPayload = await createEasyPayload();
    const tampered = JSON.parse(Buffer.from(validPayload, "base64").toString("utf8"));
    const unusedNonce = tampered.challenge.parameters.nonce as string;
    tampered.challenge.parameters.salt = "changed";

    const cases = [
      "not base64!",
      Buffer.from(JSON.stringify(tampered)).toString("base64"),
      await createEasyPayload(new Date(Date.now() - 1000)),
    ];

    for (const altcha of cases) {
      const result = await requestSubmission({ ...validSubmission, altcha });
      expect(result.response.status).toBe(422);
      expect(result.body).toMatchObject({
        code: "INVALID_ALTCHA",
        message: "اعتبارسنجی امنیتی نامعتبر یا منقضی شده است.",
      });
    }

    const storedRows = await db
      .select()
      .from(complaintsAndFeedbackTable)
      .where(eq(complaintsAndFeedbackTable.altchaNonce, unusedNonce));
    expect(storedRows).toHaveLength(0);
  });

  it("rejects structurally invalid submissions", async () => {
    const result = await requestSubmission({ ...validSubmission, firstName: 42, altcha: await createEasyPayload() });

    expect(result.response.status).toBe(422);
    expect(result.body).toMatchObject({ code: "BAD_REQUEST" });
  });
});
