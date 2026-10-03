import { useLocation, useResolvedPath, type LinkProps, type To } from "react-router";

/*===== Navigation Destinations =====*/

/** Identifies app-relative destinations; schemes and protocol-relative URLs remain native links. */
export function isLocalHref(href: string) {
  return !/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href);
}

/** Hash-only destinations scroll within the current document instead of fading the page. */
export function isHashOnlyDestination(to: To) {
  return typeof to === "string"
    ? to.startsWith("#")
    : to.pathname === undefined && to.search === undefined && to.hash !== undefined;
}

/*===== Link Transition Policy =====*/

/** Let Router resolve relative paths; comparing path and query keeps same-page links unanimated. */
export function useLinkViewTransition({
  to,
  relative,
  viewTransition,
}: Pick<LinkProps, "to" | "relative" | "viewTransition">) {
  const location = useLocation();
  const destination = useResolvedPath(to, { relative });

  return (
    viewTransition ??
    (!isHashOnlyDestination(to) &&
      (destination.pathname !== location.pathname || destination.search !== location.search))
  );
}
