import { os } from "../implementer";

/*===== Procedure Timing =====*/

export const performanceMiddleware = os.middleware(async ({ next, path }) => {
  const startedAt = performance.now();
  let outcome = "ok";

  try {
    return await next();
  } catch (error) {
    outcome = "error";
    throw error;
  } finally {
    // This measures the matched procedure pipeline, including validation.
    const durationMs = (performance.now() - startedAt).toFixed(1);
    console.info(`[oRPC] ${path.join(".")} ${outcome} ${durationMs}ms`);
  }
});
