import { useCallback } from "react";
import { useSubmit, type SubmitFunction } from "react-router";

/*===== Imperative Application Submission =====*/

/** Defaults navigating submissions to a transition without changing serialization, fetcher behavior, or promises. */
export function useAppSubmit(): SubmitFunction {
  const submit = useSubmit();

  return useCallback<SubmitFunction>(
    (target, options) => submit(target, { ...options, viewTransition: options?.viewTransition ?? true }),
    [submit],
  );
}
