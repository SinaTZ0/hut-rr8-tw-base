# University UI Design Principles

Use this guide when creating a page or component, or when making a substantial visual change. Read it together with [component conventions](./components.md) and the [style and typography guide](./style-and-typography.md).

## Product Character

The university interface is calm, welcoming, academic, and content-rich. It combines a restrained shadcn-inspired aesthetic with comfortable ergonomics and clear hierarchy.

- Prefer clarity and confidence over novelty.
- Keep the interface modern and minimal without making controls faint or cramped.
- Let university content, Persian typography, and campus imagery carry the visual identity.
- Treat each change as part of one coherent design system, not an isolated redesign.

## Hierarchy and Composition

- Establish an obvious page title, introduction, section order, and primary action.
- Use whitespace as the main separator between structural regions.
- Use semantic headings independently of their visual size, and keep heading levels sequential.
- Keep route-specific sections and editorial compositions in their route slice.
- Use plain semantic elements for page structure and layout. Use primitives for reusable controls, interactive patterns, and styled surfaces.
- Avoid decorative containers that do not improve grouping, hierarchy, or interaction.

## Controls and Density

Interactive controls should be comfortable for pointer and touch input without making desktop layouts feel oversized.

- Prefer approximately `h-11` (44px) for default controls.
- Use approximately `h-10` (40px) for intentionally compact controls.
- Use approximately `h-12` (48px) for prominent controls and calls to action.
- Keep icon-only hit targets at least 40px in compact contexts and 44px normally; enlarge the target rather than the icon.
- Preserve meaningful compact, default, and large sizes instead of making every control large.
- Use existing size props before adding another size or overriding dimensions in a consumer.

## Boundaries and Surfaces

Controls and elevated surfaces must remain distinguishable from their surroundings in both themes.

- Give inputs, outlined controls, dialogs, sheets, popovers, menus, and command surfaces a visible boundary.
- Combine semantic surface colors, restrained borders, and subtle depth; do not compensate for an unclear border with arbitrary color changes.
- Use cards for actionable items, selectable choices, or standalone content groups. Do not turn structural layout wrappers into cards by default.
- Keep shadows restrained and purposeful.
- Use semantic tokens from `app/app.css`; do not introduce arbitrary palette colors for individual components.

## Interaction States and Motion

Every interactive component needs understandable default, hover, active, focus, and disabled states.

- Make hover and active feedback perceptible through restrained color, border, or shadow changes.
- Avoid interaction effects that shift layout.
- Keep keyboard focus obvious, high-contrast, and consistent across primitives.
- Never remove a focus outline without an equally visible replacement.
- Keep disabled content readable while clearly inactive.
- Respect reduced-motion preferences and avoid motion that does not communicate state or hierarchy.

## Forms

- Treat labels, descriptions, controls, validation messages, and actions as one coherent system.
- Keep labels close enough to make their association clear.
- Give fields comfortable padding, visible boundaries, readable placeholder text, and clear validation states.
- Use consistent parent gaps for form rhythm instead of unrelated margins on individual controls.
- Preserve native semantics and accessible label relationships.

## Persian Content and RTL

- Design with realistic Persian content, including long headings, labels, and summaries.
- Allow adequate vertical room for Persian glyphs and avoid tightly fixed text containers.
- Prefer logical spacing and positioning utilities such as `ms`, `me`, `ps`, `pe`, `start`, and `end`.
- Isolate English text, URLs, and contact values with `dir="ltr"` where appropriate.
- Keep directional icons consistent with the RTL reading direction.
- Follow [style and typography](./style-and-typography.md) for current tokens and type hierarchy.

## Responsive Behavior

Check representative layouts near 375px, 768px, 1280px, and 1440px.

- Prevent unnecessary horizontal overflow.
- Preserve comfortable touch targets on narrow screens.
- Let content wrap before reducing it to an unreadable size.
- Avoid desktop layouts that feel artificially enlarged because of mobile requirements.
- Validate overlay placement, long content, and responsive navigation at both narrow and wide widths.

## Accessibility and Behavior

- Preserve semantic HTML, keyboard navigation, accessible names, label associations, and disabled-state semantics.
- Preserve behavior supplied by Base UI unless a deliberate product requirement calls for a change.
- Do not replace native controls with generic elements for styling convenience.
- Maintain sufficient contrast in light and dark themes.
- Verify focus order and portal-based overlays with keyboard interaction.

## Design-System Decisions

- Search existing primitives, variants, and production usages before creating or extending an API.
- Preserve a primitive's established contract for one-off page needs.
- Change shared tokens or primitive defaults only when the decision should apply system-wide.
- Add a variant only for a distinct, reusable visual or behavioral contract.
- Avoid near-duplicate variants with different names but equivalent results.
- Prefer the smallest change that remains consistent with the existing system.

## UI Workflow

Before implementation:

1. Read this guide, [component conventions](./components.md), and [style and typography](./style-and-typography.md).
2. Inspect comparable production pages and component usages.
3. Search the primitive inventory and existing variants.
4. Separate page composition from reusable component responsibilities.
5. Choose the smallest design-system-consistent change.

Before completion:

1. Check realistic Persian content and RTL behavior.
2. Check representative mobile and desktop widths.
3. Check light and dark themes.
4. Check hover, active, focus, disabled, and reduced-motion behavior where applicable.
5. Check keyboard behavior and accessible names.
6. Run the repository's required lint, type, build, and relevant Storybook checks.
