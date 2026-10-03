import { useCallback } from "react";
import { useNavigate, type NavigateFunction, type NavigateOptions, type To } from "react-router";

import { isHashOnlyDestination } from "./view-transition";

/*===== Imperative Application Navigation =====*/

/** Preserves Router's overloads and return value. History deltas use Router's recorded transition behavior. */
export function useAppNavigate(): NavigateFunction {
  const navigate = useNavigate();

  return useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === "number") return navigate(to);
      return navigate(to, {
        ...options,
        viewTransition: options?.viewTransition ?? !isHashOnlyDestination(to),
      });
    },
    [navigate],
  );
}
