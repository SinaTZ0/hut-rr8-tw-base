---
name: orpc
description: Build and maintain oRPC APIs. Use for procedures, routers, contracts, middleware, context, typed errors, RPC or OpenAPI handlers and clients, framework adapters, streaming, and oRPC integrations such as TanStack Query. Do not use for ordinary React Router pages that do not change oRPC behavior.
---

# oRPC

oRPC has different API shapes for implementation-first and contract-first APIs, and different transports for RPC and OpenAPI. Identify the shape already in use before changing an API. Follow the matching reference below, then read the relevant official documentation linked from the repository's [oRPC documentation index](../../../docs/orpc.md).

## Identify the Existing Shape

- Inspect `package.json` or the lockfile for installed `@orpc/*` versions. In a beta release, check installed exports and `.d.ts` signatures before adopting an example from the website.
- Look for `oc` from `@orpc/contract` and `implement(contract)` from `@orpc/server` to identify contract-first APIs. Look for procedures built directly with `os` to identify implementation-first APIs.
- Find the server router, handler, route or adapter, client link, and any query utilities. Keep their path, protocol, and error contracts aligned.
- In this repository, start with `app/orpc/`, `app/routes/rpc.ts`, and the relevant feature's consumers. Preserve the existing contract-first arrangement unless the task calls for a change.

## Load the Relevant Reference

| Work | Reference |
| --- | --- |
| Procedures, routers, contracts, middleware, context, errors, and tests | [Procedures and contracts](references/procedures-and-contracts.md) |
| RPC or OpenAPI transport, handlers, links, adapters, serialization, and HTTP behavior | [Transport](references/transport.md) |
| Browser or server clients, TanStack Query, validation libraries, and streams | [Clients and integrations](references/clients-and-integrations.md) |

Load only the references that apply to the task. For plugins, helpers, other adapters, and migrations, use the matching entry in `docs/orpc.md` and read its linked documentation page.

## Documentation and Version Checks

`docs/orpc.md` is an index with summaries and links, not the full API documentation. Read the linked oRPC page for the behavior being changed. The current site documents oRPC v2; use the v1 documentation or the [v1 migration guide](https://orpc.dev/docs/migrations/from-v1) when the installed code is v1 or the task is an upgrade.

When a current documentation example differs from the installed release, inspect the installed package's exports and type declarations, then adapt the example to that release. Keep browser imports free of server-only implementations and secrets; contract types and client packages can cross that boundary.
