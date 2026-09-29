# Clients and Integrations

Use this reference for client setup, queries, mutations, validation integrations, streams, and client error handling. Trace the existing client back to its contract or router type and its transport link.

## Client Boundary

- Read [Client-Side Clients](https://orpc.dev/docs/client/client-side) and the matching [RPC Link](https://orpc.dev/docs/rpc/link) or [OpenAPI Link](https://orpc.dev/docs/openapi/link) page for remote calls.
- Read [Server-Side Clients](https://orpc.dev/docs/client/server-side) when calling procedures in the same process. Choose a local call when the server already has the router and an HTTP round trip is unnecessary.
- Read [Client Error Handling](https://orpc.dev/docs/client/error-handling) to distinguish declared, typed errors from unexpected errors. Preserve the public error definitions when editing UI handling.

In this repository, `app/orpc/client.ts` builds a browser RPC client from `app/orpc/contract.ts` and creates TanStack Query utilities. Keep server-only dependencies out of that import graph.

## TanStack Query

Read [TanStack Query Integration](https://orpc.dev/docs/integrations/tanstack-query) for `createTanstackQueryUtils`, query and mutation options, cache keys, invalidation, conditional queries, and SSR. Follow the installed `@orpc/tanstack-query` types for exact options because beta releases may differ from the website. Inspect existing consumers before adding a second query abstraction or changing key behavior.

## Schemas and Streams

Read [Standard Schema Integration](https://orpc.dev/docs/integrations/standard-schema) and the relevant library page, such as [Zod](https://orpc.dev/docs/integrations/zod), when changing schema support or OpenAPI generation. Check the installed schema and oRPC versions together.

For streamed procedures, read [AsyncIteratorObject (SSE)](https://orpc.dev/docs/async-iterator-object), [AsyncIteratorObject in Client](https://orpc.dev/docs/client/async-iterator-object), and the TanStack Query streamed or live query sections if that integration is used. Account for cancellation, disconnect cleanup, and SSR behavior described in those pages. For uploads or downloads, read [Binary Data](https://orpc.dev/docs/binary-data) and the selected transport's serializer docs.

Use the integration, plugin, and helper sections of `docs/orpc.md` to find focused documentation for other capabilities rather than assuming they share TanStack Query or RPC behavior.
