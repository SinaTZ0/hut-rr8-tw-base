# Transport

Use this reference when serving or calling oRPC over HTTP, exposing OpenAPI endpoints, changing serializers, or mounting a framework adapter. Identify the existing handler and matching client link before making changes.

## RPC

`RPCHandler` and `RPCLink` speak the oRPC protocol. Read [RPC Handler](https://orpc.dev/docs/rpc/handler), [RPC Link](https://orpc.dev/docs/rpc/link), and [RPC Protocol](https://orpc.dev/docs/rpc/protocol) for routing, methods, status responses, interceptors, and plugins. Read [RPC Serializer](https://orpc.dev/docs/rpc/serializer) when transmitting values beyond plain JSON or customizing serialization. Keep the link URL and handler prefix consistent.

## OpenAPI

`OpenAPIHandler` exposes HTTP endpoints for OpenAPI clients; `OpenAPILink` calls that transport. Read [OpenAPI Handler](https://orpc.dev/docs/openapi/handler), [OpenAPI Link](https://orpc.dev/docs/openapi/link), and [OpenAPI Routing](https://orpc.dev/docs/openapi/routing) before configuring paths and methods. For generated descriptions, read [OpenAPI Specification](https://orpc.dev/docs/openapi/specification). For request and response shape or non-JSON values, read [Input and Output Mapping](https://orpc.dev/docs/openapi/input-and-output-mapping) and [OpenAPI Serializer](https://orpc.dev/docs/openapi/serializer).

RPC and OpenAPI have different serialization behavior. Check [Expanding Type Support for OpenAPI Link](https://orpc.dev/docs/openapi/expanding-type-support-for-link) before assuming an OpenAPI client restores `Date`, `bigint`, or other native types.

## Framework Adapter

Read the adapter page for the host runtime from `docs/orpc.md`. For this repository's React Router Framework Mode integration, read [React Router Adapter](https://orpc.dev/docs/adapters/react-router) and [Fetch API Adapter](https://orpc.dev/docs/adapters/fetch-api). The resource route delegates its `loader` and `action` requests to a server-side handler, passes the route prefix, and returns the handler response or a 404 when no procedure matches. Inspect `app/routes.ts`, `app/routes/rpc.ts`, and `app/orpc/handler.server.ts` for the actual mount path and local conventions.

When changing methods, CORS, headers, request limits, or error responses, read the relevant handler and plugin pages from `docs/orpc.md`; these behaviors depend on the chosen transport and its configured plugins.
