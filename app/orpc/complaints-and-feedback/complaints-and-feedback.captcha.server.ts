import { createChallenge, sha, verifySolution } from "altcha/lib";
import { z } from "zod";

/*===== Challenge Settings =====*/

const challengeLifetimeMs = 20 * 60 * 1000;

// Keep unknown signed parameters when parsing: removing one would change the signed JSON.
const challengeParametersSchema = z.looseObject({
  algorithm: z.string(),
  nonce: z.string(),
  salt: z.string(),
  cost: z.number(),
  keyLength: z.number(),
  keyPrefix: z.string(),
  expiresAt: z.number(),
});

const payloadSchema = z.object({
  challenge: z.looseObject({
    parameters: challengeParametersSchema,
    signature: z.string(),
  }),
  solution: z.object({
    counter: z.number().int().nonnegative(),
    derivedKey: z.string(),
  }),
});

/*===== Challenge Generation =====*/

export function createComplaintChallenge(hmacSecret: string) {
  return createChallenge({
    algorithm: "SHA-256",
    cost: 1,
    deriveKey: sha.deriveKey,
    expiresAt: new Date(Date.now() + challengeLifetimeMs),
    hmacSignatureSecret: hmacSecret,
    keyPrefix: "000",
  });
}

/*===== Solution Verification =====*/

/** Returns the signed challenge nonce only after a valid, unexpired solution. */
export async function verifyComplaintChallenge({
  payload,
  hmacSecret,
}: {
  payload: string;
  hmacSecret: string;
}): Promise<string | null> {
  try {
    // ALTCHA submits Base64 JSON. Reject malformed or oversized data before verification.
    if (payload.length > 8192 || !/^[A-Za-z0-9+/]+={0,2}$/.test(payload)) return null;

    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    const parsed = payloadSchema.safeParse(decoded);
    if (!parsed.success) return null;

    const { challenge, solution } = parsed.data;
    if (challenge.parameters.algorithm !== "SHA-256") return null;
    if (!/^[a-f0-9]{32}$/.test(challenge.parameters.nonce)) return null;

    const result = await verifySolution({
      challenge,
      solution,
      deriveKey: sha.deriveKey,
      hmacSignatureSecret: hmacSecret,
    });

    return result.verified ? challenge.parameters.nonce : null;
  } catch {
    // Malformed payloads must fail validation rather than produce server errors.
    return null;
  }
}
