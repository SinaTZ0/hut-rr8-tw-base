/*===== Theme Model =====*/

export const DEFAULT_THEME = "system" as const;
export const THEME_ACTION_INTENT = "set-theme" as const;

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = Exclude<ThemePreference, "system">;

export type ThemeActionData = { ok: true; theme: ThemePreference } | { ok: false; error: string };

/*===== Theme Validation =====*/

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

/*===== Theme Resolution =====*/

export function resolveTheme({ theme, prefersDark }: { theme: ThemePreference; prefersDark: boolean }): ResolvedTheme {
  if (theme === "system") return prefersDark ? "dark" : "light";
  return theme;
}

export function getNextTheme(theme: ThemePreference): ThemePreference {
  if (theme === "system") return "light";
  if (theme === "light") return "dark";
  return "system";
}
