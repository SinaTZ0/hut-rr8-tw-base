---
name: create-primitive
description: "Create or extract a reusable university UI primitive through four serial delegated stages: source-compatible shadcn/Base UI copying, defineStyles architecture, WCAG 2.2 AA hardening, and justified variants/sizes with a colocated Storybook story. Use when adding a primitive or implementing an identified extraction candidate; ordinary page composition does not require this skill."
---

# Create a primitive

Create a reusable university component whose API, behavior, and styles are easy to locate and change. Preserve the source appearance and behavior during extraction unless a later stage or the user explicitly requests a redesign.

## Required serial delegation

This workflow is four delegated implementation stages, not one blended task. Delegate exactly one agent for each stage and run the agents strictly in series. Every stage must start from a complete, compiling artifact produced by the previous stage; a later agent must not be asked to repair an incomplete handoff from an earlier stage.

- Request every stage agent with maximum reasoning (`model: gpt-5.6-luna`, `reasoning_effort: max`).
- Start only stage 1. Wait for its artifact and validation report before starting stage 2; repeat the same gate between stages 2→3 and 3→4. Never run these implementation agents in parallel.
- Give each agent the repository root, the exact primitive path, the source chosen, and the preceding handoff report. The agent may modify only the requested primitive slice and explicitly requested consumers; it must preserve unrelated user changes.
- Require each agent to return the changed files, public API, source/behavior decisions, commands run, validation results, and unresolved limitations. If its compile gate fails, keep the work in that stage until the artifact is fixed and revalidated.
- If delegation or the required Luna/max-reasoning request is unavailable, do not claim that the four-stage workflow ran; report that the workflow is blocked instead of silently collapsing stages into one agent.

The stage boundaries are deliberate:

1. **Source-compatible copy:** find the best shadcn or requested source and copy the complete public surface into `app/components/primitive/<name>.tsx`, producing a compilation-ready baseline. Do not redesign it yet.
2. **Repository style architecture:** convert the baseline to this repository's `defineStyles`/`composeStyles` organization without losing its API or behavior.
3. **WCAG hardening:** audit and fix the component for WCAG 2.2 Level AA, RTL, themes, keyboard behavior, and reduced motion.
4. **Design-system completion:** add only sensible, reusable variants or sizes when needed, add a colocated Storybook story, migrate requested consumers, and perform final verification.

Each agent reads the applicable repository `AGENTS.md` before editing. Work from the repository root. Inspect `git status` first and preserve all pre-existing user changes in tracked or untracked files; do not reset, overwrite, or clean them. Put temporary scripts, generated source, diagnostics, and logs in `.tmp-codex/`, never in deliverable source locations.

## Ground the design

Before stage 1, read the applicable `AGENTS.md`, [design principles](../../../docs/design-principles.md), [component conventions](../../../docs/components.md), and [style and typography guide](../../../docs/style-and-typography.md). Inspect the requested source and its consumers, the current `app/components/primitive/` inventory, and relevant `app/components/ui/` counterparts. Reuse or extend an existing primitive when it already owns the same semantic role. Keep a composition local to its flat route slice when it has no shared consumer or clear design-system responsibility; an explicitly requested new control can have that responsibility before it has multiple consumers.

Read the closest implementation and story as working examples:

- [Button](../../../app/components/primitive/button.tsx) for Base UI wrappers, callback-aware classes, variants, and sizes.
- [Card](../../../app/components/primitive/card.tsx) for native elements, `render`, compound parts, and a full public subcomponent surface.
- [LinkTile](../../../app/components/primitive/link-tile.tsx) for grouped multi-part variants.
- Dialog, sheet, or navigation menu for portals, direction, overlays, and customization of internal parts when relevant.

Do not mix the primitive and `app/components/ui/` versions of the same control in one feature. Import values and types directly from their owning files; do not add directory barrel files.

## Stage 1 — find and copy the source

Stage 1 owns source discovery and a faithful, compilation-ready copy. It is deliberately narrower than the later style, accessibility, and design-system stages.

### Source discovery order

1. Identify the requested component, semantic role, current consumers, and every public subcomponent or named export that consumers may use.
2. When a shadcn/ui equivalent exists, prefer the existing `app/components/ui/<name>.tsx` counterpart. It is the repository's installed and tested dependency shape—especially its Base UI imports, `cn` alias, native props, and local component API—and is a more reliable source than copying a different upstream revision.
3. If that counterpart is missing, inspect the installed shadcn CLI/package and the official shadcn registry source for the requested component. Treat those sources as read-only input: do not run an add/generate command that silently modifies unrelated `app/components/ui/` files. If a CLI command writes files, direct its output to `.tmp-codex/` or inspect the package/registry source without writing into the application, then copy only the needed source into the target primitive slice.
4. If there is no shadcn equivalent, use the requested local source and its consumers as the extraction source. Preserve the same public surface and behavior contract even though the source-discovery path is non-shadcn.

Compare the chosen source with nearby primitives and the installed package types before editing. Record which source was chosen and why, any upstream/local revision differences, and the public exports that must survive the copy.

### Faithful copy contract

- Create or update `app/components/primitive/<name>.tsx`. Copy the full upstream public subcomponent surface, not only the root component: every public named subcomponent, public prop/type contract, supported render/portal/part helper, and intended default export must remain available. A Card-like source must retain all of its public parts, for example `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter`.
- Adapt import paths, local aliases, component names, and other wiring only as much as necessary for this repository's source to compile. Use installed dependencies and the repository's direct import conventions. Do not silently replace Base UI with another primitive library, change a native element into a generic element, or remove a dependency merely to make the copy smaller.
- Preserve Base UI behavior, refs, native props, `render` support, controlled and uncontrolled state, event handlers, state callbacks, portal/direction behavior, and `data-slot` markers. Preserve `className` callbacks that receive Base UI state; do not flatten them into a string or drop the caller's classes. Keep prop spread ordering intentional so caller props, callbacks, refs, and native semantics are not lost.
- Preserve the source's complete internal composition and public part relationships. Do not omit an icon, trigger/header/panel pair, overlay/portal part, or other public subcomponent because current consumers do not use it yet. Keep public names and `data-slot` values stable unless the source cannot compile without a narrowly documented local adaptation.
- Keep this stage source-compatible. Do not style-redesign, add a WCAG audit/fix pass, invent variants or sizes, migrate consumers, or add stories in stage 1. Preserve existing source variants only when they are part of the copied public API; do not add new choices based on taste. Do not reorganize classes into `defineStyles` yet—that is stage 2.
- Do not modify unrelated `app/components/ui/` files, routes, primitives, or shared configuration to make the copy look complete. Make only the target primitive change and strictly necessary local support changes, and explain any support change in the handoff.

### Stage 1 gate and handoff

The stage 1 agent must leave a clean, compilation-ready primitive file before handoff. Check that the target imports resolve, all public exports are present, the source's refs/props/state callbacks remain type-safe, and no unrelated files changed. Run `npm run typecheck` and the repository-required `npm run lint`; fix errors in the stage's scope before handing off. If an unrelated pre-existing failure prevents a repository-wide command, record the exact failure and still require the new primitive itself to compile; never edit an unrelated user file to hide it.

The handoff must include the target path, source path/registry revision, public surface copied, import/path adaptations, files changed, and the typecheck/lint results. Stage 2 may start only after this report describes a complete compiling artifact.

## Stage 2 — add the repository style architecture

Start from stage 1's compiling artifact and preserve its public API and behavior. Read the style sections in [component conventions](../../../docs/components.md), inspect the closest production primitives, and then reorganize only the primitive-owned classes in the same file. This is a style-ownership refactor, not a behavior, accessibility, or design-system expansion stage.

### Identify the classes Stage 2 owns

Inventory every class string in the copied primitive and classify it before moving anything:

- Move classes that define the primitive contract into named maps: root defaults, public compound parts, internal portal/overlay/popup parts, source-supported variants and sizes, descendant icon selectors, and state or motion selectors owned by that part.
- Keep classes supplied by `className`, `render` composition, stories, routes, or other consumers outside the primitive maps. Consumer classes continue to control surrounding layout and genuinely one-off composition; do not pull route spacing, editorial typography, or page-grid classes into the primitive.
- Preserve stateful classes (`data-open`, `data-disabled`, `data-starting-style`, `group-*`, and similar selectors) with the part that owns the state. Do not replace them with JavaScript state, new data attributes, or a different interaction implementation.

### Organize named style maps

- Import `defineStyles` and, only when named groups must be flattened for CVA, `composeStyles` from `./styles`. Wrap every owned style map in `defineStyles` so its keys stay typed and its Tailwind strings remain readable and sortable.
- Use the repository vocabulary (`layout`, `geometry`, `typography`, `appearance`, `interaction`, `hover`, `focus`, `disabled`, `state`, `motion`, and `icon`) and omit unused groups. Keep each component part's base map, option maps, CVA configuration, props, and rendering close together. Use names that expose ownership, such as `twButtonStyles`, `twOverlayStyles`, `twContentStyles`, `twHeaderStyles`, `twVariant`, and `twSize`.
- For one-part primitives, keep base groups and source-supported option maps together. For compound primitives, keep each layout/variant as one readable object with its parts nested beneath it (`root`, `icon`, `content`, and so on), then select a part for each part's CVA. This mirrors LinkTile and prevents a layout change from being scattered across unrelated maps.
- Keep state and motion classes in their named groups even when they are visually small. Preserve existing focus, disabled, open/closed, RTL, and reduced-motion classes as source behavior; Stage 3 owns deciding whether those contracts need hardening.

### Choose the composition helper deliberately

- Static maps whose values are already class strings do not need `composeStyles`. Join them at the rendered element (`Object.values(twPartStyles).join(" ")`) or pass their values as the CVA base classes (`cva(Object.values(twSharedStyles), ...)`), matching the existing Button, Card, Dialog, and Sheet patterns.
- Use `composeStyles` when a `defineStyles` map has option keys whose values are named group objects and must become CVA option strings, for example `composeStyles(twVariant)`, `composeStyles(twSize)`, or `composeStyles(twRadius)`. It retains the option keys so `VariantProps<typeof componentVariants>` continues to infer the exact prop union.
- For nested multi-part options, use a small local selector such as LinkTile's `composePartStyles("icon")` to call `composeStyles` for one part while retaining the same variant keys across all parts. Do not flatten the whole nested map into an untyped string or duplicate option names per part.
- Do not add a new composition helper, styling framework, or conflict-merging call inside a style map. `composeStyles` only joins the named groups; it does not replace CVA or `cn`, and it must not be used to introduce new stage-4 variants.

### Preserve CVA and render-site conflict behavior

- Keep every source-supported CVA axis, option name, and `defaultVariants` value unchanged unless compilation requires a narrowly documented type adaptation. Use `VariantProps<typeof componentVariants>` for props rather than manually repeating option unions or widening them to `string`. If the source has no variant axis, do not invent one in this stage.
- Compose base and option classes through the existing CVA configuration, then resolve Tailwind conflicts only at each rendered element with `cn(componentVariants(options), className)`. Do not call `cn` while defining maps or while flattening options; this keeps consumer overrides predictable and leaves surrounding layout consumer-owned.
- For a Base UI component whose `className` accepts a state callback, preserve that callback exactly at the render site: use `typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)`. The callback must receive Base UI's original state object. Never stringify, invoke early without state, or drop the callback. Preserve callback-aware classes on buttons, triggers, overlays, popups, titles, descriptions, and any other Base UI wrapper that supports them.
- Preserve the source's prop-spread order, `mergeProps`/`useRender` composition, refs, `render` callbacks, native props, event handlers, controlled/uncontrolled state, portals, direction handling, `data-slot` values, and child/part relationships. Moving a class must not change which caller value wins or which element receives it.

### Stage 2 boundary and handoff

Do not perform the Stage 3 WCAG audit or add accessibility remediation, contrast/target-size changes, keyboard behavior changes, RTL fixes, or new reduced-motion behavior here; preserve the source's existing behavior and report concerns for Stage 3. Do not add Stage 4 variants or sizes, stories, consumer migrations, or one-off API conveniences. Recheck existing consumers before changing any defaults, and document any unavoidable local adaptation for the repository's `cn` alias or installed Base UI version instead of introducing a second helper.

The stage 2 agent must compare the public exports, prop types, CVA defaults, rendered tags, `data-slot` markers, and callback/ref behavior before and after the refactor. Run `npm run typecheck` and the repository-required `npm run lint`; fix errors in the target scope before handoff. Stage 3 may start only after the target primitive and its style architecture compile cleanly, with a report containing the target path, maps/composition decisions, API/defaults and behavior-preservation check, files changed, commands/results, and unresolved limitations. If an unrelated pre-existing failure blocks a repository-wide command, record the exact failure while still proving the changed primitive compiles; never alter unrelated user files to hide it.

## Stage 3 — WCAG 2.2 Level AA hardening

Start from stage 2's compiling artifact. Audit the root, every public part, every existing source option, and any internal portal/overlay part. Make the smallest implementation changes needed for applicable WCAG 2.2 Level A and AA success criteria and this repository's RTL university UI. Do not add variants, sizes, stories, or consumer migrations in this stage. An accessibility fix may adjust an existing source option's geometry, state styles, or motion classes when that is necessary to preserve the option's contract.

This is an audit and remediation stage, not a claim that a component in isolation makes an entire page conform. Use the WCAG 2.2 Recommendation and its W3C Understanding material when interpreting a criterion; record the criterion number and evidence rather than copying long normative text into the code or this skill. Keep the existing `defineStyles`/`composeStyles` architecture, exports, prop types, defaults, `className` state callbacks, refs, `render` composition, `data-slot` markers, and Base UI behavior intact. If a consumer-supplied label, content, or layout is required to pass, preserve the API and document that dependency in the audit instead of inventing a Stage 4 prop or consumer migration.

### Conformance boundaries and exact AA thresholds

Distinguish the normative level from repository preferences and from automated findings:

- WCAG 2.2 AA includes all Level A criteria plus all Level AA criteria. A local design preference, an advisory technique, a linter rule, or an AAA criterion is not an AA failure by itself. Do not report AAA as an AA requirement: examples include 1.4.6 Contrast (Enhanced) (7:1/4.5:1 large text), 2.3.3 Animation from Interactions, 2.4.12 Focus Not Obscured (Enhanced), 2.4.13 Focus Appearance, and 2.5.5 Target Size (Enhanced) (44 × 44 CSS px).
- For 1.4.3 Contrast (Minimum), authored text and images of text need at least 4.5:1, or 3:1 for large-scale text (18pt regular or 14pt bold in the WCAG definition), subject to WCAG's inactive, pure-decoration, and logotype exceptions. Check actual foreground/background pairs in light and dark themes, including placeholder, hover, focus, selected, open, error, and overlay states; do not infer compliance from token names or opacity alone.
- For 1.4.11 Non-text Contrast, visual information needed to identify an authored control or its state, and meaningful graphics, needs at least 3:1 against adjacent colors. Inactive controls and unmodified user-agent controls are exceptions. Check borders, icons, selected/open indicators, and focus treatments where they carry that identifying information. Do not import the AAA 2px-perimeter/3:1 formula from 2.4.13 into an AA claim.
- For 2.5.8 Target Size (Minimum), the pointer target is at least 24 × 24 CSS px. An undersized target can pass only under a documented WCAG exception: spacing (imaginary 24px-diameter circles do not intersect targets), equivalent control on the same page, inline text/line-height constraint, unmodified user-agent control, or essential/legal presentation. A small icon inside a large button is not a small target; measure the actual target and its spacing. The repository's stronger design targets are approximately 40px compact (`h-10`), 44px default (`h-11`), and 48px prominent (`h-12`). These are local ergonomics, not WCAG thresholds; 40px exceeds AA but is not the AAA 44px target, while 44/48px satisfy that size dimension when the rest of the control is valid. Prefer the existing repository target contract and fix an under-24 existing option, without adding a new size axis.
- For 1.4.10 Reflow, test component-owned content at 320 CSS px for vertical-scrolling content (and 256 CSS px height for content designed to scroll horizontally), without loss of information/functionality or two-dimensional scrolling except for genuinely two-dimensional content. Also test 1.4.4 Resize Text at 200%. For 1.4.12 Text Spacing, user overrides must not lose content or functionality at line-height 1.5×, paragraph spacing 2×, letter spacing .12em, and word spacing .16em; authors do not have to set those values by default, and Persian/script exceptions apply only to properties the writing system does not use.

Do not treat contrast ratios, target sizes, 40/44/48px dimensions, or a passing automated scan as proof of overall conformance. They are evidence for particular checks only. In the handoff, label each criterion `fixed`, `passes`, `not applicable`, `consumer-dependent`, or `blocked`, with a short reason.

### Semantics, names, roles, values, and relationships

Audit both native controls and Base UI compound controls:

- Preserve semantic elements and their native behavior: use the source's `button`, `a`, `input`, heading, list, `nav`, or content element; do not replace one with a styled `div`. Keep `render` substitutions semantically compatible, and check Base UI's `nativeButton` setting when a trigger is rendered through another element. Do not create nested links/buttons or put an interactive child inside a whole-card link.
- For every interactive part, determine its accessible name, role, and current state in the accessibility tree. Visible Persian label text must be included in the accessible name under 2.5.3 Label in Name; an `aria-label` must not hide or contradict a visible label. Icon-only controls need a localized `aria-label`/`aria-labelledby`; decorative SVGs/icons need `aria-hidden="true"` and must not be the only name. Preserve native `disabled`, Base UI `data-disabled`/`aria-disabled`, `aria-expanded`, `aria-controls`, `aria-checked`/`aria-pressed`, `aria-current`, and other generated state relationships rather than replacing them with CSS-only state.
- Verify relationships, not just strings: form labels point to their controls; descriptions and errors are referenced with `aria-describedby`/`aria-errormessage` when appropriate; disclosure triggers control and label their panels; dialog/sheet popups have a programmatic title and optional description; heading levels remain meaningful; and content order remains meaningful when CSS changes layout. Avoid manually overriding Base UI-generated IDs or ARIA attributes unless the adaptation is necessary and documented.
- Preserve the complete compound surface and its relationships. For example, an accordion trigger/panel must expose expanded state and the controlled panel, a navigation menu must retain its `nav`/list/link semantics and active state, and a dialog/sheet must retain popup naming, description, close, and backdrop relationships. `data-*`/`data-slot` hooks are useful for styling and testing but never substitute for semantic HTML or ARIA.
- If a primitive accepts input or validation state, preserve native input purpose/autocomplete where applicable (1.3.5), label/instruction associations (3.3.2), and a usable error contract. Do not make consumers guess an undocumented relationship merely to satisfy the audit.

### Keyboard, focus, and pointer operation

Manually exercise the real rendered component, including `render` and callback forms:

- From a clean page, reach every operable part with `Tab` and `Shift+Tab`; activate with `Enter` and `Space` as appropriate; use the component's expected arrow/Home/End keys (for example accordion or navigation-menu movement); and confirm that focus order preserves meaning (2.1.1, 2.1.2, 2.4.3). Escape, outside dismissal, close controls, and any documented exit from a popup must work without a mouse. There must be no keyboard trap.
- Every keyboard-operable element has a visible focus indicator (2.4.7) that survives both themes, high zoom, and overlays. Do not remove a source focus style merely because a route has a visual preference. Check the focused component itself is not entirely hidden by author-created content (2.4.11 AA); do not claim the stricter AAA requirement that no part may be obscured. Test sticky regions, scroll containers, portaled popups, and narrow viewports while tabbing.
- Verify pointer activation does not fire irreversibly on `pointerdown` without a valid WCAG 2.5.2 Pointer Cancellation path: prefer completion on `pointerup` with an abort/undo path, or a documented essential exception. If the component uses a multipoint/path gesture, provide a single-pointer alternative (2.5.1). If it uses dragging, provide an equivalent single-pointer click/tap operation without dragging (2.5.7), unless dragging is essential or an unmodified user-agent function; keyboard support alone does not satisfy the dragging criterion.
- Check that pointer, keyboard, and touch activation expose the same state and name. Do not use hover-only operation, timing-sensitive key sequences, or color-only feedback. For content shown on hover/focus, apply 1.4.13 AA: it must be dismissible without moving focus/pointer (unless it is an error or does not obscure/replace content), hoverable, and persistent until the trigger is removed, dismissed, or the information is invalid.
- Disabled and read-only states are different contracts. Native `disabled` must remain programmatically disabled and must not accidentally activate; do not use `pointer-events-none`/opacity as the only semantics. Honor Base UI's disabled and `focusableWhenDisabled` behavior rather than forcing a custom tab stop. A read-only field generally remains discoverable/focusable and exposes its value while preventing editing; do not silently turn `readOnly` into `disabled` or block selection/scrolling. Make state differences perceivable without color alone, and retain the repository preference that disabled content remains readable even though WCAG contrast exceptions may apply to inactive controls.

### Contrast, color, text, motion, and RTL

- Test the computed colors of text, borders, icons, focus rings, overlays, and state indicators in both themes and against the surfaces on which portals can render. Use 1.4.1 so errors, selection, open/active state, and required actions have text, shape, icon, pattern, or programmatic state in addition to color. Do not weaken a semantic token or hide a state just to make an automated contrast result pass.
- Let Persian labels, descriptions, and error text wrap. Avoid fixed heights, clipped glyphs, `whitespace-nowrap` without a semantic reason, and overflow that makes content or controls unreachable. Keep component-owned line-height/padding compatible with text-spacing overrides; route/editorial layout remains consumer-owned. Use logical `ms`/`me`/`ps`/`pe`/`start`/`end` utilities and `text-start`; use `dir="ltr"`/language isolation for English, URLs, email addresses, and contact values when mixing them into Persian.
- Keep nonessential transitions and transforms behind the repository's `motion-safe`/`motion-reduce` patterns. Reduced motion must suppress animation/transition that is not needed for state or comprehension without removing the state change, causing a focus jump, or introducing layout shifts. WCAG 2.3.3 Animation from Interactions is AAA, not an AA gate, but respecting `prefers-reduced-motion` is a repository requirement. Check for flashing/auto-updating behavior if the primitive actually owns it; do not audit absent media or motion as though it exists.
- Check direction at the document, provider, and portaled element. Base UI's `DirectionProvider`, `useDirection`, and popup/positioner `dir` handling must reach content rendered under `body`; RTL should not be simulated with physical left/right classes where logical placement is intended. Directional icons and opening/closing translations must follow the Persian reading direction, while a deliberately right-anchored sheet must retain its documented product behavior. Keep English labels and URL/contact values isolated as needed and preserve caller `lang` rather than overwriting it.

### Errors, status messages, and overlays

- When the primitive owns or exposes validation, an automatically detected error identifies the affected item and describes it in text (3.3.1 A); labels/instructions exist (3.3.2 A); known correction suggestions are provided (3.3.3 AA); and legal/financial/data submissions have the applicable 3.3.4 AA reversible/check/confirm safeguard. Use `aria-invalid` and stable description/error IDs only when they reflect real state. Do not add fake error text or claim form-level conformance for a presentation-only primitive.
- When an action changes a result, progress, waiting state, or error without moving focus, expose the relevant status through an appropriate semantic role/property (4.1.3 AA, such as `role="status"`/`aria-live` where appropriate). Avoid making every visual update an interruptive alert and do not move focus merely to compensate for a missing status relationship.
- For dialogs, sheets, popovers, menus, and navigation content rendered through portals, verify: opening moves focus to the intended initial target; modal focus stays contained; `Tab`/`Shift+Tab` cycles correctly; Escape and an explicit close control dismiss; outside/pointer dismissal follows the configured policy; and closing returns focus to the trigger or a documented valid fallback. A modal or `modal="trap-focus"` dialog must offer a close path (including for touch screen-reader users). Preserve Base UI's focus manager, portal, `finalFocus`/`initialFocus`, refs, and dismissal behavior rather than reimplementing a trap. If the trigger is removed or disabled while open, test and document the fallback focus target. Confirm titles/descriptions, overlay contrast, scroll containment, focus-not-obscured behavior, and direction after portaling.

### Applicability, verification, and Stage 3 handoff

Do not mark a criterion not applicable by assumption. Decide applicability per primitive part and behavior, and record evidence. Examples include 2.5.7 when the primitive has no dragging, 3.3.1–3.3.4 when it does not collect or validate input, 4.1.3 when it creates no status message, 1.4.13 when it never reveals additional hover/focus content, and motion criteria when it has no authored animation. A criterion that depends on consumer content, route layout, or a runtime data state is `consumer-dependent`, not silently `passed`; note what the consumer must verify. Do not treat an exception (such as inline target size, inactive contrast, or essential two-dimensional content) as a generic waiver—identify the exact exception and evidence.

Automated checks (Storybook a11y/axe, type checks, DOM assertions, contrast tools, lint rules) assist discovery and regression testing but have false positives and false negatives; they do not prove WCAG conformance. Require concrete manual checks for the keyboard/focus, accessible-name and relationship, pointer cancellation/drag alternative, portal focus return/trapping/dismissal, disabled/read-only, RTL/Persian wrapping, 200% resize/400% reflow, text-spacing overrides, both themes, and status/error behavior relevant to the primitive. Use a screen reader or browser accessibility tree when available to inspect names, roles, states, relationships, and announcements, and record the environment for findings.

Before handoff, keep the target primitive compiling and run `npm run typecheck` plus the repository-required `npm run lint`; run focused interaction/a11y checks when available. The handoff must state the target path, unchanged public API/defineStyles contract, any existing option styles adjusted for accessibility, each applicable criterion and evidence/exception, automated checks with their limitations, manual checks and results, files changed, command results, and unresolved consumer-dependent or blocked items. Stage 4 may start only from this compiling report; it must not be asked to finish Stage 3's audit.

## Stage 4 — complete the design-system contract

Start from stage 3's compiling, audited artifact. Read the applicable `AGENTS.md` and the design/component/style guides before editing. Inspect the source API, every current production consumer (including the extraction-source consumers), the closest university primitives, the relevant `app/components/ui/` counterpart, and their stories. Record the evidence for each option decision before changing the API.

### Decide options before implementing them

Adding no new variant or size is a valid—and often the correct—Stage 4 outcome. Keep the existing API when its options already express the requested contexts, or when the only proposed difference is a route-specific spacing, content, width, or editorial treatment. Report that decision and the evidence; do not invent an option merely to make a gallery larger.

Add a variant or size only when all of the following support it:

- The source API or an explicitly requested contract requires it, or the current consumers and nearby primitives show a distinct reusable visual/behavioral purpose that cannot be expressed by an existing option.
- The closest existing option was compared and rejected for a concrete reason. Names such as `soft`, `muted`, and `subtle` are not separate contracts when they produce effectively the same result.
- The choice serves more than one realistic context, or is a deliberate system-wide contract requested by the user; a one-off page treatment is not evidence. Keep page composition and route-specific spacing in the consumer.

When an option is justified, extend the existing Stage 2 architecture in the same file: use `defineStyles` maps, `composeStyles` for named option groups, CVA's existing axes, and `VariantProps<typeof ...Variants>` for the inferred prop type. Preserve or deliberately document `defaultVariants`; do not manually repeat unions, widen options to `string`, create a parallel styling helper, or hide a route override behind a new prop. Export an option map only when a colocated story needs its keys to build controls or galleries; otherwise keep the map private. Check every existing option and every new option for its API/default, rendered semantics, themes, contrast, focus, target size, RTL, reduced motion, disabled/open/error behavior, and other applicable Stage 3 criteria. A justified option is not complete until those checks are recorded individually.

If changing a default or a primitive-wide contract is justified, inspect and deliberately migrate every affected consumer in scope. If no option change is justified, do not alter the CVA axes or maps just for Stage 4.

### Colocated Storybook contract

Create `app/components/primitive/<name>.stories.tsx` beside the implementation. Match this repository's Storybook shape:

- Import `Meta` and `StoryObj` from `@storybook/react-vite`; use `satisfies Meta<...>` and `StoryObj<typeof meta>` so the story follows the public API.
- Set `parameters: { a11y: { test: "error" } }` (additional configured parameters such as `layout` may be included) and use realistic Persian content inside an RTL/LTR-aware preview with `dir="rtl"` and `lang="fa"`. Add Base UI's `DirectionProvider` when the primitive's portal or direction contract needs it. Keep the global light/dark theme decorator in mind and add explicit contrasting surfaces or theme stories when the option materially changes across themes.
- Provide a controls story for the public props and a default story that exercises the primitive's own defaults (do not accidentally replace defaults with story-only values). Use the exported option maps to derive typed control and gallery options with `Object.keys(...)`; never maintain a second hardcoded array of variant/size names in the story. If no story needs an option map, do not export one solely for Storybook.
- Cover the full public compound surface and relationships in realistic compositions, not just the root. Include every applicable variant/size, enabled/disabled/open/active/error/focus state, long Persian text, optional content, and native/render/ref/callback contracts. Include a light/dark comparison when color, borders, overlays, or inherited foregrounds materially differ. Keep route/editorial layout wrappers in the story composition rather than expanding the primitive API.
- Add interaction checks for observable contracts: roles, accessible names/descriptions, native state and generated relationships, keyboard and focus movement, refs, callback counts/arguments, `render` semantics, consumer class callbacks/overrides, and portal dismissal/focus return/direction. For portaled content, query the owner document body, for example `within(canvasElement.ownerDocument.body)`, rather than limiting queries to the story canvas. Prefer role/state/relationship/focus/visible-content assertions; assert implementation classes only when the class callback or override itself is the public behavior under test, not merely to restate a style map.

Stories are both documentation and regression coverage. Run the a11y test for every relevant option and state, and keep any limitation (for example a browser-only or consumer-dependent check) in the handoff instead of weakening the story to avoid a finding.

### Consumer migration boundary

Migrate only consumers explicitly requested by the user or consumers that supplied the extraction source. Remove route overrides only when the primitive now owns that contract. Preserve links and native props, labels and relationships, controlled data flow, callback behavior, route slice boundaries, route exports, and route-only internals. Do not migrate the whole `app/components/ui/` collection, unrelated routes, or every visually similar call site. If no consumer migration was requested or needed, leave consumers unchanged and report that result.

### Stage 4 verification and final handoff

Use only commands configured by this repository; do not invent `npm test`, `npm run test`, or a Storybook interaction script. Format only the changed files, then run `npm run typecheck`, `npm run lint`, and `git diff --check`. Run `npm run build-storybook` to validate the Storybook build; that build is not an interaction or a11y run. When browser execution is available, run the configured Storybook Vitest project with `npx vitest --project storybook` for interaction/a11y stories, and distinguish browser/test-infrastructure failures from component or story failures. `npm run storybook` is a manual preview server, not a substitute for those checks. Do not change unrelated tooling to make a check pass.

Before handoff, review the entire skill for contradictory or repeated instructions, stale paths/commands, discoverability, and the skill-creator progressive-disclosure rules. Report the exact files changed, the option decision and evidence (including an explicit no-new-option decision when applicable), story coverage, migrated consumers, all four stage handoffs, command results, and unresolved limitations. Update component docs only when this work changes a shared convention.

## Non-shadcn extraction mode

When no shadcn/ui counterpart exists, the same four stages still apply. Stage 1 uses the requested component and its production consumers as the source of truth, preserves its complete public API and behavior, and creates the compilation-ready primitive baseline. Do not force an unrelated `app/components/ui/` implementation into the design. Stage 2 still introduces `defineStyles`/`composeStyles`, stage 3 still performs the WCAG 2.2 AA audit, and stage 4 still adds only justified variants/sizes and a story.

Keep route-specific sections and editorial composition in their route slice. Promote code only when multiple routes consume it or it clearly owns a design-system contract. A component extraction is not permission to migrate the entire `ui` collection or redesign unrelated consumers.

## Completion report

Report the final primitive API and public subcomponents, source and adaptations, variants/sizes and their rationale, migrated consumers, the four stage handoffs, validation commands/results, and any remaining limitation. Keep staging and committing separate unless the user requests a commit.
