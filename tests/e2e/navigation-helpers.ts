import { expect, type Page } from "playwright/test";

/*===== Native Transition Observation =====*/

type NavigationProbe = {
  documentId: string;
  calls: number;
  finished: number;
  errors: string[];
  styles: { rootDuration: string; rootAnimation: string; headerAnimation: string; footerAnimation: string }[];
};

type ProbedWindow = Window & { navigationProbe: NavigationProbe };

/** Observes the real browser API without replacing its rendering or animation behavior. Install before page.goto. */
export async function observeNavigation({
  page,
  disableViewTransitions = false,
}: {
  page: Page;
  disableViewTransitions?: boolean;
}) {
  await page.addInitScript((disable) => {
    const probe: NavigationProbe = { documentId: crypto.randomUUID(), calls: 0, finished: 0, errors: [], styles: [] };
    (window as unknown as ProbedWindow).navigationProbe = probe;
    if (disable) {
      Object.defineProperty(document, "startViewTransition", { value: undefined, configurable: true });
      return;
    }
    const start = document.startViewTransition.bind(document);

    document.startViewTransition = (update) => {
      probe.calls += 1;
      const transition = start(update);
      void transition.ready.then(
        () => {
          const root = getComputedStyle(document.documentElement, "::view-transition-new(root)");
          probe.styles.push({
            rootDuration: root.animationDuration,
            rootAnimation: root.animationName,
            headerAnimation: getComputedStyle(document.documentElement, "::view-transition-new(site-header)")
              .animationName,
            footerAnimation: getComputedStyle(document.documentElement, "::view-transition-new(site-footer)")
              .animationName,
          });
        },
        (error) => probe.errors.push(String(error)),
      );
      void transition.finished.then(
        () => {
          probe.finished += 1;
        },
        (error) => probe.errors.push(String(error)),
      );
      return transition;
    };
  }, disableViewTransitions);
}

export function readNavigationProbe(page: Page) {
  return page.evaluate(() => (window as unknown as ProbedWindow).navigationProbe);
}

/** A document identity check catches accidental full-page reloads that URL assertions alone miss. */
export async function expectClientNavigation({
  page,
  documentId,
  calls,
  pathname,
}: {
  page: Page;
  documentId: string;
  calls: number;
  pathname: string;
}) {
  await expect.poll(() => new URL(page.url()).pathname).toBe(pathname);
  await expect.poll(async () => (await readNavigationProbe(page)).finished).toBe(calls);
  const probe = await readNavigationProbe(page);
  expect(probe.documentId).toBe(documentId);
  expect(probe.calls).toBe(calls);
  expect(probe.errors).toEqual([]);
}
