---
name: create-primitive
description: Create or extract styled university UI primitives using this repository's readable Tailwind groups, Base UI behavior, CVA variants, and colocated Storybook stories. Use when adding a primitive or implementing an identified extraction candidate; ordinary page composition does not require this skill.
---

# Create a primitive

Create a reusable university component whose styles are easy to locate and change. Preserve existing appearance and behavior when extracting unless the user requests a redesign.

## Ground the design

Read the applicable `AGENTS.md`, [component conventions](../../../docs/components.md), and [style and typography guide](../../../docs/style-and-typography.md). Paths in this skill are relative to its directory; run project commands from the repository root.

Inspect the requested source and its consumers, the current `app/components/primitive/` inventory, and relevant `app/components/ui/` counterparts. Reuse or extend an existing primitive when it already owns the same semantic role. Keep a composition local to its route when it has no shared consumer or clear design-system responsibility. An explicitly requested new control can have that responsibility before it has multiple consumers.

Read the closest implementation and story as a working example:

- [Button](../../../app/components/primitive/button.tsx) for Base UI wrappers, variants, and state-based classes.
- [Card](../../../app/components/primitive/card.tsx) for native elements and compound parts.
- [LinkTile](../../../app/components/primitive/link-tile.tsx) for grouping multiple parts under a variant.
- Dialog, sheet, or navigation menu for portals and customization of internal parts, when relevant.

## Implement the component

Place the implementation in `app/components/primitive/<name>.tsx` and its stories in `<name>.stories.tsx`. Keep style definitions, CVA configuration, props, and rendering together. Follow the repository's section dividers, direct imports, and meaningful comments.

When a primitive has a shadcn/ui equivalent, implement and export its full set of public subcomponents, even if the primitive itself or its current consumers do not use them. Inspect the equivalent component to establish the complete set. For example, a Card primitive must export `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter`. Apply the repository's primitive styling and behavior conventions to every part.

Use the existing [style helpers](../../../app/components/primitive/styles.ts): wrap class maps in `defineStyles`, join variant groups with `composeStyles`, and resolve conflicts only at the rendered element with `cn(componentVariants(options), className)`. Use the group vocabulary in the component conventions; omit unused groups. Keep multi-part variant styles together so a whole layout can be edited in one place. Do not introduce a second composition helper or styling framework.

Use CVA when there are meaningful variant axes. Derive variant prop types from the actual configuration and expose only choices supported by the design. Export option maps where stories need to discover their keys. Keep surrounding section spacing and route-specific content in consumers. Read current theme tokens and typography instead of hardcoding a new palette or type scale.

For interactive controls, use the installed Base UI behavior when appropriate. Inspect its local types and an existing wrapper rather than assuming a different primitive library's API. Preserve refs, native attributes, event handlers, `render`, and state-based `className` where the underlying component supports them. Native elements should retain native semantics. Add stable `data-slot` names for meaningful parts.

Keep customization reachable: recurring choices belong in variants, one-off styling in `className`, and necessary inner-part customization in composition or narrowly scoped props. Avoid inserting an automatic internal part that consumers cannot replace or configure. Preserve accessible naming, keyboard behavior, Persian RTL layout, focus visibility, dark-theme contrast, and reduced-motion behavior.

## Integrate and verify

Migrate the consumers requested by the user, removing overrides now supplied by the primitive. Preserve route links, content, data flow, and accessibility semantics. Keep route exports and route-only internals inside their flat route slice. Do not turn a component extraction into an unrelated migration of the whole `ui` collection.

Add colocated stories with Persian content and the relevant variants, sizes, themes, and states. Include long-text or optional-content cases where they can expose layout problems. For behavioral or composition changes, cover the affected keyboard, focus, ref, or override contract with meaningful interaction checks.

Format changed files, run `npm run typecheck`, and lint the changed scope. Run relevant Storybook checks for behavior changes; distinguish test-infrastructure failures from component failures. Avoid changing unrelated tooling merely to make a check pass. Update the component docs only if this work changes a shared convention.

Report the component API, migrated consumers, validation performed, and any remaining limitation. Keep staging and committing separate unless requested.
