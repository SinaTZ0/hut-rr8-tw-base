import { useEffect } from "react";
import { useResolvedPath, type NavigateProps } from "react-router";

import { useAppNavigate } from "./use-app-navigate";
import { isHashOnlyDestination } from "./view-transition";

/*===== Component Application Navigation =====*/

export type AppNavigateProps = NavigateProps & { viewTransition?: boolean };

/** Client-effect redirect with transitions. Prefer loader/action redirects for initial or server-side redirects. */
export function AppNavigate({ to, replace, state, relative, viewTransition }: AppNavigateProps) {
  const navigate = useAppNavigate();
  const destination = useResolvedPath(to, { relative });
  // Resolve before the effect so Strict Mode repeats the same destination, including relative routes.
  const jsonPath = JSON.stringify(destination);
  const transition = viewTransition ?? !isHashOnlyDestination(to);

  useEffect(() => {
    void navigate(JSON.parse(jsonPath), { replace, state, relative, viewTransition: transition });
  }, [navigate, jsonPath, replace, state, relative, transition]);

  return null;
}
