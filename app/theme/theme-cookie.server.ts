import { createCookie } from "react-router";

import { DEFAULT_THEME, isThemePreference, type ThemePreference } from "./theme";

/*===== Theme Cookie =====*/

const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// The preference is not security-sensitive, so integrity signing would add secret management without protecting privileges.
const themeCookie = createCookie("hut-theme", {
  httpOnly: true,
  maxAge: THEME_COOKIE_MAX_AGE,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

/** Reads a validated preference and treats absent or malformed cookies as the system default. */
export async function readThemePreference(request: Request): Promise<ThemePreference> {
  const value = await themeCookie.parse(request.headers.get("Cookie"));
  return isThemePreference(value) ? value : DEFAULT_THEME;
}

/** Produces the Set-Cookie value used by the root theme action. */
export function serializeThemePreference(theme: ThemePreference) {
  return themeCookie.serialize(theme);
}
