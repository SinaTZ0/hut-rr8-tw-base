import { useCallback } from "react";
import { useSearchParams, type SetURLSearchParams } from "react-router";

/*===== Application Query Navigation =====*/

/** Keeps Router's default values and functional updates while enabling transitions for query navigation. */
export function useAppSearchParams(
  defaultInit?: Parameters<typeof useSearchParams>[0],
): ReturnType<typeof useSearchParams> {
  const [searchParams, setSearchParams] = useSearchParams(defaultInit);
  const setAppSearchParams = useCallback<SetURLSearchParams>(
    (nextInit, options) => setSearchParams(nextInit, { ...options, viewTransition: options?.viewTransition ?? true }),
    [setSearchParams],
  );

  return [searchParams, setAppSearchParams];
}
