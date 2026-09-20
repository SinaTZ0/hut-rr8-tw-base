# Repository Instructions

These instructions apply to the entire repository unless overridden by a more specific `AGENTS.md` in a subdirectory.

This is a React Router v8 application using Framework Mode. The application's user-facing content is in Persian.

## Working Directory

- Run project commands from the repository root.
- After making code changes, run `npm run lint` and fix all errors.
- Put temporary scripts, diagnostics, experiments, and logs in `./.tmp-codex/`.
- Create `./.tmp-codex/` as needed. It is gitignored and must never contain deliverable source files.

## Route Module Slices (Framework Mode)

- **Keep Route Slices Flat:** In this repository, route module directories under `app/routes/` (or the configured `appDirectory`) must be flat. URL hierarchy does not imply folder nesting (e.g. use `dashboard_user/`, never `dashboard/user/`).
- **Colocate Route Internals:** A route module file, its route exports (`loader`, `action`, `clientLoader`, `clientAction`, `ErrorBoundary`, `meta`, `headers`), `./+types/...` imports, and route-only internals (components, hooks, queries, schemas) must live inside that route's slice.
- **Promote Only When Shared:** Keep code with its immediate route consumer. Only move it to a shared or broader domain location when multiple routes consume it or it clearly belongs to a broader domain abstraction.

```text
app/routes/
  dashboard/
  dashboard_user/
  dashboard_user_setting/
    dashboard-user-setting.tsx  # route module
    components/
    hooks/
    queries.ts
    schema.ts
```

## Code Conventions

Preserve established local conventions unless a rule below explicitly says otherwise.

### Primitive-First UI

- Before creating a page or component, or making a substantial visual change, read `docs/design-principles.md`, `docs/components.md`, and `docs/style-and-typography.md`.
- Build user-facing controls and reusable visual surfaces with the university primitives in `app/components/primitive/`. Before creating a component or variant, search the primitive inventory, existing variants, and production usages for a suitable contract to reuse or extend.
- Reuse an existing primitive whenever its semantic role matches. A missing convenience prop or an imperfect page fit is not sufficient reason to create a parallel primitive.
- Use `app/components/ui/` only when no university primitive provides the required control. Do not mix the primitive and `ui` versions of the same control in one feature.
- Use plain HTML elements for page layout, document semantics, and route-specific composition: for example, page sections, grid or flex wrappers, articles, headings, paragraphs, and lists. Do not use plain elements to recreate a button, link treatment, card, badge, dialog, navigation control, or another contract already owned by a primitive.
- Consumers may use `className` to control surrounding layout and placement, such as grid or flex participation, width, margin, responsive visibility, positioning, and scroll offsets. Keep a primitive's colors, borders, radius, shadow, typography, internal padding and sizing, focus and hover treatment, and motion inside the primitive.
- Do not cancel or replace a primitive's styles from a consumer, such as applying `border-0`, a new background, a different radius, or custom padding. If the requested design cannot be expressed by the current API, update the primitive instead of working around it in the route.
- Add a named variant, size, or compound part only when it represents an intentional reusable design-system choice. Do not modify a primitive or add a variant solely to satisfy a one-off page treatment; keep route-specific layout and composition consumer-owned.
- Before adding a variant, compare its visual and behavioral contract with every existing option. Reuse or extend the closest option instead of introducing near-duplicates such as `soft`, `muted`, and `subtle` for effectively the same treatment. Add a distinct variant only when its purpose and behavior are materially different.
- You may change a primitive's default styles or API when the design-system contract should change for every consumer. Inspect existing consumers and colocated stories first, migrate affected call sites deliberately, and update or add stories for the changed behavior.
- Create a new primitive when no existing primitive can own a distinct reusable UI contract. Keep route data, page orchestration, and editorial section composition in the route slice.
- Import primitives directly from their owning files. Do not introduce barrel exports.

#### When Styling Ownership Is Unclear

- Preserve the existing primitive contract.
- Avoid introducing a one-off visual override or variant.
- Inspect similar production usages before deciding where the styling belongs.
- Make the smallest change consistent with the existing design system.

### Imports

Import values and types directly from their owning modules. Do not create directory barrel files such as `index.ts`.

### Function Parameters

Prefer a single object parameter when a function has multiple meaningful inputs. Use positional parameters when there is only one input or the ordering is conventional and obvious.

### Section Dividers

Use major dividers between top-level sections to improve code navigation and readability:

```ts
/*===== Section Name =====*/
```

Inside JSX:

```tsx
{
  /*===== Section Name =====*/
}
```

Use minor dividers for distinct phases inside longer functions or JSX:

```ts
/*------ Step Name ------*/
```

```tsx
{
  /*------ SubSection Name ------*/
}
```

Use dividers generously.

### Comments

Comment non-obvious decisions, constraints, edge cases, invariants, and domain-specific reasoning. Prefer explaining **why** over restating what the code already says.

Avoid comments for self-explanatory code.

### Documentation

Add JSDoc to functions, methods, and classes when their purpose, contract, side effects, constraints, or error behavior are not obvious from the code.

Document relevant parameters, return behavior, thrown errors, side effects, and important invariants. Avoid redundant documentation.
