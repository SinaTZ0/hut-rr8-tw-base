import { oc } from "@orpc/contract";
import { call, implement } from "@orpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { altchaErrors } from "./altcha.errors";
import { verifyAltchaMiddleware } from "./altcha.middleware";

/*===== Isolated Infrastructure =====*/

const { verifyChallenge } = vi.hoisted(() => ({ verifyChallenge: vi.fn() }));
vi.mock("../../../lib/altcha.server", () => ({ verifyAltchaChallenge: verifyChallenge }));

/*===== Independent Feature Fixture =====*/

const consultation = implement({
  book: oc
    .errors(altchaErrors)
    .input(z.object({ topic: z.string(), altcha: z.string() }))
    .output(z.object({ bookingId: z.string() })),
});
const saveBooking = vi.fn(({ nonce }: { nonce: string }) => ({ bookingId: `booking-${nonce}` }));
const book = consultation.book.use(verifyAltchaMiddleware).handler(({ context }) => {
  return saveBooking({ nonce: context.altchaNonce });
});
const bookingInput = { topic: "مشاوره تحصیلی", altcha: "consultation-proof" };

/*===== ALTCHA Guard =====*/

beforeEach(() => {
  saveBooking.mockClear();
  verifyChallenge.mockReset();
  verifyChallenge.mockResolvedValue("verified-nonce");
});

describe("ALTCHA middleware with an independent feature", () => {
  it("injects the verified nonce into another feature's handler", async () => {
    expect(await call(book, bookingInput)).toEqual({ bookingId: "booking-verified-nonce" });
    expect(saveBooking).toHaveBeenCalledWith({ nonce: "verified-nonce" });
    expect(verifyChallenge).toHaveBeenCalledWith({ payload: bookingInput.altcha, hmacSecret: expect.any(String) });
  });

  it("rejects an invalid challenge before the feature saves anything", async () => {
    verifyChallenge.mockResolvedValue(null);
    await expect(call(book, bookingInput)).rejects.toMatchObject({ code: "INVALID_ALTCHA" });
    expect(saveBooking).not.toHaveBeenCalled();
  });
});
