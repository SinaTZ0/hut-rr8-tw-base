import { createCookie } from "react-router";
import { z } from "zod";

/*===== Anonymous Presence Cookie =====*/

// This identifier conveys no privileges and contains no personal information.
const visitorCookie = createCookie("hut-visit", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 30 * 60 });
const visitorIdSchema = z.uuid();

export async function readVisitorId(headers?: Headers) {
  try {
    const value = await visitorCookie.parse(headers?.get("Cookie") ?? null);
    const result = visitorIdSchema.safeParse(value);
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}

export function serializeVisitorId({ visitorId, requestUrl }: { visitorId: string; requestUrl?: string }) {
  return visitorCookie.serialize(visitorId, { secure: requestUrl ? new URL(requestUrl).protocol === "https:" : false });
}
