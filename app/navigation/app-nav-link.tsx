import type { ComponentProps } from "react";
import { NavLink } from "react-router";

import { useLinkViewTransition } from "./view-transition";

/*===== Application Navigation Link =====*/

/** Preserves Router's active/pending callbacks and refs while defaulting to page/query transitions. */
export function AppNavLink(props: ComponentProps<typeof NavLink>) {
  const viewTransition = useLinkViewTransition(props);
  return <NavLink {...props} viewTransition={viewTransition} />;
}
