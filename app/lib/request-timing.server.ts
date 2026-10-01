/*===== Operation Timings =====*/

export type OperationTiming = {
  layer: "procedure" | "service" | "repository";
  name: string;
  durationMs: number;
};

export type Measure = <T>(options: {
  layer: OperationTiming["layer"];
  name: string;
  run: () => T | PromiseLike<T>;
}) => Promise<T>;

/** Collects inclusive elapsed times for one request, including failed operations and retries. */
export function createRequestTiming() {
  const timings: OperationTiming[] = [];
  const measure: Measure = async ({ layer, name, run }) => {
    const startedAt = performance.now();
    try {
      return await run();
    } finally {
      timings.push({ layer, name, durationMs: performance.now() - startedAt });
    }
  };

  return { timings, measure };
}
