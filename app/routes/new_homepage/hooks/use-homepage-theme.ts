import { useEffect, useSyncExternalStore } from "react";

/*===== Theme Preference Store =====*/
type Theme = "light" | "dark";
const storageKey = "hut-new-homepage-theme";
const changeEvent = "hut-new-homepage-theme-change";
let sessionTheme: Theme = "light";

function getSnapshot(): Theme {
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved === "light" || saved === "dark" ? saved : sessionTheme;
  } catch {
    // The preference remains usable when private browsing denies storage.
    return sessionTheme;
  }
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(listener: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) listener();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(changeEvent, listener);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(changeEvent, listener);
  };
}

function toggleTheme() {
  sessionTheme = getSnapshot() === "dark" ? "light" : "dark";
  try {
    window.localStorage.setItem(storageKey, sessionTheme);
  } catch {
    // A storage failure must not prevent a user from changing the theme.
  }
  window.dispatchEvent(new Event(changeEvent));
}

/*===== Route Theme Lifecycle =====*/
/**
 * Applies the saved route preference to the document, including portaled UI.
 * Restores the previous document theme when leaving this standalone preview.
 * The server snapshot stays light so hydration never reads browser storage.
 */
export function useHomepageTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");
    const previousColorScheme = root.style.colorScheme;
    const previousActive = root.getAttribute("data-homepage-active");

    const applyPreference = () => {
      const currentTheme = getSnapshot();
      root.classList.toggle("dark", currentTheme === "dark");
      root.style.colorScheme = currentTheme;
      root.setAttribute("data-homepage-active", "");
    };

    applyPreference();
    const unsubscribe = subscribe(applyPreference);

    return () => {
      unsubscribe();
      root.classList.toggle("dark", wasDark);
      root.style.colorScheme = previousColorScheme;
      if (previousActive === null) root.removeAttribute("data-homepage-active");
      else root.setAttribute("data-homepage-active", previousActive);
    };
  }, []);

  return { theme, toggleTheme };
}
