# Website visit statistics

The shared footer displays today's and yesterday's visits, total recorded visits, and anonymous browser sessions active within five minutes. A visit means opening or reloading a public document. Day boundaries use `Asia/Tehran`; counts display Persian digits. Total visits begin when tracking is enabled, without importing historical counts.

## Counting and privacy

Production browser builds record one visit when a public document first becomes visible on `/`, `/online-consultation`, or `/complaints-and-feedback`. Hard refreshes create a new visit. The root visit runtime captures the document's entry path once; client navigation, including back/forward navigation, does not add visits or restart the refresh timer. Query/fragment changes, revalidation, prefetching, resource requests, and errors do not count. Add new public paths to the shared allowlist in the website-visits feature. Development builds read statistics without tracking writes.

Each document visit has a UUID. PostgreSQL inserts its receipt and increments a daily aggregate in one transaction, so retries and concurrent delivery increment once. Receipts expire after 24 hours; daily aggregates remain permanently. Existing totals are preserved; older visits may have included client navigation under the previous counting rule. Counting requires JavaScript and can be reduced by browser blocking or network failures.

A random `hut-visit` cookie identifies online presence. It is HttpOnly, SameSite=Lax, secure over HTTPS, and renewed for 30 minutes. Presence is established only when the browser returns the cookie; blocked cookies still permit anonymous visit counting. If a heartbeat receives no valid cookie, it issues a replacement without establishing presence or adding a visit; the next heartbeat returning that cookie restores presence. Multiple tabs share presence once the cookie is established. Visible, online tabs refresh every minute and immediately on returning to visibility or connectivity. Presence expires after five minutes, and writes prune inactive presence rows older than 24 hours.

Recognized bots, DNT, and GPC opt-outs produce no tracking writes or visitor cookies. Statistics remain readable. Stored data contains only counters, calendar dates, random identifiers, and timestamps; no IP addresses, user agents, URLs, queries, or referrers are persisted.

## API and setup

The contract-first oRPC feature exposes POST procedures `websiteVisits.summary`, `websiteVisits.record({ eventId, pathname })`, and `websiteVisits.heartbeat`. Each returns `today`, `yesterday`, and `total` as decimal strings, `online` as an integer, and `updatedAt` as an ISO timestamp. Responses use `Cache-Control: no-store`.

The built-in server can run behind HTTPS termination while preserving the public Host header. Browser same-origin fetch metadata and a matching HTTPS Origin allow secure visitor cookies without trusting arbitrary forwarded hosts. Other origins are rejected for writes.

Use the existing application database configuration and apply the additive schema:

```sh
npm run db:push
NODE_ENV=test npm run db:push
```

## Shared client state

The root layout owns one shared query client for visit statistics and route form submissions, plus a Jotai provider for shared client state. Jotai's store survives client navigation and is isolated for each SSR request.

`WebsiteVisitsRuntime` mounts once beside the route outlet and manages document visits and presence using the existing TanStack Query hooks. It is the sole writer of `websiteVisitsStateAtom`, publishing the query's statistics and combined query/tracking failure state in an effect. The footer reads that snapshot with `useAtomValue`; TanStack Query remains responsible for fetching and caching.

Statistics are fetched only in the browser, with no loader reads, server prefetching, or persisted atom values. SSR and initial hydration show placeholders. Browser reads keep database failures out of server page rendering, and the footer preserves its last successful values if refreshes fail.

For future shared client state, use the root Jotai provider and keep atom modules beside their feature consumers. Keep route-only atoms in their route slice, and import atoms directly from their owning files.
