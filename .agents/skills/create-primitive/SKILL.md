---
name: create-primitive
description: "Create or extract a reusable university UI primitive using the repository's component, styling, accessibility, and Storybook conventions. Use for new primitives or identified extraction candidates; ordinary page composition does not require this skill."
---

# Create a primitive

Build a reusable component that fits the university design system and preserves the requested source behavior. Handle the work as a normal implementation: inspect the codebase, make the related changes together, and validate the result. There are no mandatory phases or intermediate handoff gates.

## Understand the component

- Read the applicable `AGENTS.md`. Before creating a component or making a substantial visual change, read [design principles](../../../docs/design-principles.md), [component conventions](../../../docs/components.md), and the [style and typography guide](../../../docs/style-and-typography.md).
- Check `git status` before editing and preserve existing tracked and untracked changes. Work from the repository root; put temporary diagnostics in `.tmp-codex/`.
- Inspect the primitive inventory, production usages, stories, and relevant `app/components/ui/` counterpart. Reuse or extend an existing primitive when it owns the same semantic role. Prefer the installed `app/components/ui/<name>.tsx` as an extraction source when it is the matching implementation; otherwise use the requested or official source as read-only input.

## Implement the primitive

- Give each primitive its own directory: `app/components/primitive/<name>/<name>.tsx`, `<name>.styles.ts`, and `<name>.stories.tsx`. Keep the shared style helpers in `app/components/primitive/styles.ts`; import them from the primitive's style module with `../styles`. Import primitives directly from their implementation file, such as `~/components/primitive/button/button`, and do not add `index.ts` barrels.
- Preserve the source's complete public contract unless a requested or documented adaptation requires a change: semantic elements, public parts, props, refs, `render` behavior, callbacks, controlled state, native attributes, portal and direction behavior, and `data-slot` markers. Adapt imports and wiring as needed, and document any meaningful behavior or API change.
- Keep primitive-owned classes in typed `defineStyles` maps from `../styles`; use `composeStyles` for named option maps passed to CVA. Use `VariantProps<typeof ...>` for variant prop types, keep `cn` at the render site, and preserve Base UI `className` callbacks and prop-spread order.
- Keep Vite React Fast Refresh boundaries consistent. A React component module should not mix component exports with runtime utilities such as CVA variant functions or `defineStyles` maps. Put those utilities in a colocated `<name>.styles.ts` module and import them directly from the component, stories, and other consumers. Type-only exports do not create runtime exports.
- Keep route layout and editorial styling in the consumer. Do not add a primitive prop or variant for a one-off page treatment, and do not override a primitive's owned colors, borders, radius, typography, internal sizing, focus, hover, or motion from the consumer.

## Accessibility, options, and stories

- Use semantic elements and preserve native behavior. Ensure interactive parts have appropriate accessible names, roles, state, and relationships; keep labels, descriptions, and errors connected to controls. Preserve visible keyboard focus, usable disabled/read-only behavior, and keyboard operation for the component's interactions.
- Check relevant states in light and dark themes. Keep Persian content readable and wrapping, use logical directional styles, verify portaled content inherits the intended direction, and respect reduced-motion preferences. When changing colors, check text and control contrast against their actual surfaces; automated scans alone do not establish WCAG conformance.
- Apply WCAG 2.2 Level A/AA criteria that are relevant to the component's behavior. A full criterion-by-criterion audit is appropriate when requested or when the primitive has complex interaction or accessibility risks; routine changes do not need a formal audit matrix. Record consumer-dependent requirements accurately rather than claiming page-level conformance.
- Add a colocated Storybook story for a new reusable primitive. Use realistic Persian content in an RTL-aware composition, show the public API and justified options, and include interaction checks for important observable behavior. Update existing stories when a change affects their documented contract.
- Add variants or sizes only for distinct, reusable design-system choices. Compare the closest existing option first, preserve defaults, and derive story controls from exported option maps when available. Keep an option map private unless a story or consumer needs it.

## Scope and validation

- Migrate only consumers requested by the user or needed to complete the extraction. Preserve labels, relationships, links, controlled data flow, and callback behavior. Avoid unrelated routes, primitives, configuration, and broad `ui` migrations.
- Run `npm run lint` after code changes, as required by the repository. Run `npm run typecheck` for component or TypeScript API changes. Use configured Storybook or interaction checks when they meaningfully cover the change; do not invent project commands or tooling.
- Finish with a concise handoff: what changed, notable API or option decisions, affected consumers, checks run and their results, and any remaining limitation. Keep staging and committing separate unless requested.
