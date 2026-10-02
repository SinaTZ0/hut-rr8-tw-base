/*===== Public Visit Policy =====*/

export const VISIT_TIME_ZONE = "Asia/Tehran";
export const VISIT_REFRESH_MS = 60_000;
export const VISIT_ACTIVE_MS = 5 * 60_000;
export const VISIT_RETENTION_MS = 24 * 60 * 60_000;

const publicPathnames = new Set(["/", "/complaints-and-feedback", "/online-consultation"]);

export function normalizeVisitPathname(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

export function isPublicVisitPathname(pathname: string) {
  return publicPathnames.has(normalizeVisitPathname(pathname));
}
