import type { ComponentProps } from "react";
import { Link } from "react-router";

import { useLinkViewTransition } from "./view-transition";

/*===== Application Link =====*/

/** Unstyled Router link with page/query transitions by default; forwards anchor props and refs. */
export function AppLink(props: ComponentProps<typeof Link>) {
  const viewTransition = useLinkViewTransition(props);
  return <Link {...props} viewTransition={viewTransition} />;
}
