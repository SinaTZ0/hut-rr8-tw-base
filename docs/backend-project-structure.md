# Feature-Based oRPC Project Structure

Organize code by feature so everything needed to understand or change a capability stays together. Give each layer one
clear job, pass dependencies explicitly, and return explicit outcomes from the service. Keep shared infrastructure
outside feature folders.

```text
app/
  orpc/
    contract.ts                    # combines feature contracts
    router.ts                      # combines feature procedures
    feature-name/
      feature-name.contract.ts
      feature-name.procedure.ts
      feature-name.service.ts
      feature-name.repository.ts
      feature-name.mapper.ts       # only when a conversion is needed
      feature-name.integration.test.ts
  db/
    schema.ts
  routes/
    rpc.ts                         # mounts the shared oRPC handler
```

Not every feature needs every file. Add a repository only when the feature owns persistence, and add a mapper only
when its internal data differs from its public API representation.

## Feature Files

- **Contract** defines the public input and output shapes, metadata, and declared API errors. Use Zod here to reject
  malformed requests and keep the client type-safe. Keep database and business logic out of this file.
- **Procedure** adapts oRPC to the service: pass input and dependencies, translate service outcomes into declared API
  errors, and return the public output. Keep the handler thin.
- **Service** owns product rules, normalization, and orchestration. Use a local Zod schema to trim and transform values,
  validate domain constraints, and produce typed values ready for persistence. Return a discriminated success or failure
  outcome; do not throw oRPC or HTTP errors here.
- **Repository** contains focused database reads and writes. It should not know about oRPC, HTTP, or API errors.
- **Mapper** converts database or domain values into stable public DTOs.
- **Integration test** exercises the feature through its public API and covers successful behavior and important failure
  outcomes.

## Request Flow

```text
resource route -> oRPC handler -> contract validation -> procedure -> service -> repository -> database
                                     public shape          API mapping   product rules  persistence
```

The service calls `safeParse` on its local Zod schema, uses the parsed output for database writes, and turns the first
relevant issue into a field-specific failure. The procedure maps that failure to a declared oRPC error. Database errors
that represent product outcomes, such as reusing an accepted challenge, are handled by the service; unexpected errors
still propagate. This keeps transport details at the edge and makes the business path readable from top to bottom.

Keep independent side effects, such as CAPTCHA verification, in focused helpers called by the service. A resource route
may call the same feature helper when it must serve a non-oRPC protocol, such as a widget's plain JSON challenge.

## Implementing a Feature

Implement features in this order:

```text
contract -> repository and service -> optional mapper -> procedure -> integration test
```

Dependencies point inward: procedures depend on services, services coordinate repositories, and repositories depend only
on persistence infrastructure. Add a repository only for persistence and a mapper only when the internal and public
representations differ.

## Validation and Business Rules

The contract schema checks the request's structural shape: required fields, types, unknown fields, and output type. The
service schema checks what those values mean for this feature. Use Zod's `trim`, `transform`, `min`, `max`, `regex`,
`email`, `enum`, and `pipe` where they make normalization and validation clearer than manual branches. For example,
optional blank text can become `null`, Persian and Arabic digits can become ASCII digits, and a select value can be
checked against the feature's allowed options in one schema. Avoid duplicating those rules in the contract.

Some rules require a database read or a side effect rather than a schema. Check them in the service after parsing and
return an explicit outcome. Keep the repository focused on the query or write. This separation lets another caller use
the same service without importing oRPC, while the procedure remains responsible for the public error response.
