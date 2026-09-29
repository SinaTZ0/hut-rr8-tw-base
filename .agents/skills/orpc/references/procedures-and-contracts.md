# Procedures and Contracts

Use this reference for API shape, validation, middleware, context, typed errors, and procedure testing. First determine whether the existing API is contract-first or implementation-first; extend that pattern unless migration is requested.

## Choose the Source of Truth

- **Implementation-first:** A procedure builder defines input, output, middleware, and handler together. Start with [Getting Started](https://orpc.dev/docs/getting-started), then read [Procedure](https://orpc.dev/docs/procedure) and [Router](https://orpc.dev/docs/router).
- **Contract-first:** `@orpc/contract` describes the public input, output, errors, and metadata without a handler; `implement(contract)` supplies checked handlers. Start with [Contract-First](https://orpc.dev/docs/contract-first), [Procedure Contract](https://orpc.dev/docs/contract/procedure), [Router Contract](https://orpc.dev/docs/contract/router), and [Contract Implementation](https://orpc.dev/docs/contract/implementation).

For contract-first work, update the contract, implementation, and client consumer together when the API changes. Keep the client dependent on the contract rather than importing server implementations. In this repository, `app/orpc/contract.ts` and feature contracts define that boundary; inspect current files before editing because the API may have evolved.

## Read by Concern

| Concern | Documentation | Decision to check |
| --- | --- | --- |
| Input and output validation | [Procedure](https://orpc.dev/docs/procedure), [Standard Schema](https://orpc.dev/docs/integrations/standard-schema) | Check runtime validation and schema package support in the installed version. |
| Shared behavior and injected dependencies | [Middleware](https://orpc.dev/docs/middleware), [Context](https://orpc.dev/docs/context) | Decide which values arrive in initial request context and which middleware adds. |
| Public failure cases | [Error Handling](https://orpc.dev/docs/error-handling), [Client Error Handling](https://orpc.dev/docs/client/error-handling) | Define expected errors in the procedure or contract and handle their typed codes on the client. |
| HTTP status for errors | [RPC Handler](https://orpc.dev/docs/rpc/handler), [OpenAPI Handler](https://orpc.dev/docs/openapi/handler) | Check handler status mapping separately from the error contract. |
| Procedure tests | [Testing and Mocking](https://orpc.dev/docs/recipes/testing-and-mocking) | Test a procedure directly for logic, or through the handler when transport behavior matters. |
| Existing OpenAPI specification | [Generate Contract from OpenAPI](https://orpc.dev/docs/contract/generate-from-openapi) | Use the documented generator only when importing an existing specification. |

Read [Metadata](https://orpc.dev/docs/metadata) when middleware or tooling selects behavior from procedure metadata. Read [Validation Customization](https://orpc.dev/docs/recipes/validation-customization) before changing default validation behavior.
