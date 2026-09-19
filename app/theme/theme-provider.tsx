import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useFetcher } from "react-router";

import {
  getNextTheme,
  isThemePreference,
  resolveTheme,
  THEME_ACTION_INTENT,
  type ResolvedTheme,
  type ThemeActionData,
  type ThemePreference,
} from "./theme";

/*===== Theme DOM Utilities =====*/

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

function getPrefersDarkSnapshot() {
  return window.matchMedia(COLOR_SCHEME_QUERY).matches;
}

function getServerPrefersDarkSnapshot() {
  return false;
}

function subscribeToColorScheme(listener: () => void) {
  const media = window.matchMedia(COLOR_SCHEME_QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function applyTheme(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme);
}

/*===== Pre-Hydration Theme =====*/

function getThemeScript(theme: ThemePreference) {
  const preference = JSON.stringify(theme);

  return `(function(){var p=${preference};var d=p==='dark'||(p==='system'&&window.matchMedia&&window.matchMedia('${COLOR_SCHEME_QUERY}').matches);var r=d?'dark':'light';var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);}());`;
}

/** Applies the server-validated preference before styles load, preventing a system-dark light flash. */
export function ThemeScript({ theme }: { theme: ThemePreference }) {
  return <script dangerouslySetInnerHTML={{ __html: getThemeScript(theme) }} />;
}

/*===== Theme Context =====*/

type ThemeContextValue = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  isPending: boolean;
  setTheme: (theme: ThemePreference) => void;
  cycleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Keeps the document theme synchronized with an SSR-provided preference and persists changes through the root action.
 */
export function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme: ThemePreference }) {
  const fetcher = useFetcher<ThemeActionData>();
  const prefersDark = useSyncExternalStore(
    subscribeToColorScheme,
    getPrefersDarkSnapshot,
    getServerPrefersDarkSnapshot,
  );
  const submittedTheme = fetcher.formData?.get("theme");
  const confirmedTheme = fetcher.data?.ok === true ? fetcher.data.theme : initialTheme;
  const theme = isThemePreference(submittedTheme) ? submittedTheme : confirmedTheme;
  const resolvedTheme = resolveTheme({ theme, prefersDark });
  const isPending = fetcher.state !== "idle";

  /*------ Document and System Synchronization ------*/
  useLayoutEffect(() => {
    applyTheme(resolvedTheme);
  });

  /*------ Preference Mutation ------*/
  const setTheme = useCallback(
    (nextTheme: ThemePreference) => {
      if (fetcher.state !== "idle" || nextTheme === theme) return;

      applyTheme(resolveTheme({ theme: nextTheme, prefersDark: getPrefersDarkSnapshot() }));
      fetcher.submit({ intent: THEME_ACTION_INTENT, theme: nextTheme }, { action: "/", method: "post" });
    },
    [fetcher, theme],
  );

  const cycleTheme = useCallback(() => {
    setTheme(getNextTheme(theme));
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, isPending, setTheme, cycleTheme }),
    [cycleTheme, isPending, resolvedTheme, setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Returns the site-wide theme state and mutation controls. */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
