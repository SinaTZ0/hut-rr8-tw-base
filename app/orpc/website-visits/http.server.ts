import type { RpcHttpContext } from "../implementer.server";

/*===== Browser-visible Origin =====*/

/**
 * The built-in HTTP server can sit behind TLS termination without trusting proxy headers.
 * Browser same-origin fetch metadata may restore HTTPS only for the exact request host.
 * Cross-site requests cannot obtain that metadata through browser JavaScript.
 */
export function visitRequestOrigin({ reqHeaders, requestUrl }: RpcHttpContext) {
  if (!requestUrl) return undefined;
  const request = new URL(requestUrl);
  const origin = reqHeaders?.get("Origin");
  if (request.protocol === "http:" && origin && reqHeaders?.get("Sec-Fetch-Site") === "same-origin") {
    try {
      const browser = new URL(origin);
      if (browser.protocol === "https:" && browser.host === request.host) return browser.origin;
    } catch {
      // Malformed origins remain unmatched by the write guard.
    }
  }
  return request.origin;
}
