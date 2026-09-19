---
name: find-primitive-candidates
description: Review this repository, or a specified folder, route, or component, for reusable UI primitive candidates and opportunities to adopt or extend existing primitives. Use for primitive discovery and extraction planning, not general bug reviews. Report evidence and recommendations without implementing them unless requested.
---

# Find primitive candidates

Find UI abstractions that would make styles easier to maintain and consumers simpler. Prefer a small set of justified candidates over extracting every repeated element.

## Resolve the review scope

Use the user's supplied files, folder, route, component, or diff as the primary scope. Resolve a route name or URL through the route configuration to its flat slice; resolve a component name to its implementation and relevant consumers. Ask for clarification only if multiple plausible targets materially change the review.

Without a supplied scope, review the application's source, beginning with routes and shared components. Exclude dependencies, generated output, build artifacts, and temporary files. Read stories for intended behavior, but do not count story instances as production reuse.

Read applicable `AGENTS.md` instructions, [component conventions](../../../docs/components.md), and the [style and typography guide](../../../docs/style-and-typography.md). These links are relative to this skill directory. Inspect existing primitives and their APIs before proposing additions, plus relevant `ui` components where no primitive exists.

For a scoped review, follow imports and references outside the target only to understand ownership, reuse, and existing alternatives. Keep recommendations anchored to the requested target and label evidence from outside it. Do not silently broaden a component review into a repository-wide refactor.

## Inspect evidence

Use file and text searches to locate repeated structures, recurring class groups, and repeated overrides on existing controls. Read the surrounding JSX and behavior before deciding that two occurrences share a component contract. Long class strings alone are not evidence of a missing primitive.

Look for:

- The same semantic role, visual treatment, and interaction pattern repeated in production consumers.
- Repeated overrides that should become an existing primitive's default, variant, size, or part.
- A stable presentation pattern with variable content and a small, understandable API.
- Existing primitives that can replace duplicated markup without inventing a new abstraction.
- A clear reusable design-system control whose accessibility or styling contract deserves one owner, even if currently used once.

Check each candidate against the actual theme, Persian typography, RTL behavior, responsiveness, and interaction states. Explain which styling decisions belong inside it and which spacing, data, and route behavior should remain with consumers.

## Choose the right recommendation

Distinguish these outcomes:

| Recommendation | When it fits |
| --- | --- |
| Reuse an existing primitive | The current API already expresses the design. |
| Extend an existing primitive | A recurring style or composition need belongs to its existing role. |
| Create a new primitive | A distinct, stable UI contract belongs to the shared design system. |
| Keep or extract locally | The pattern is a route-specific section or domain composition. |

Avoid promoting loaders, actions, route types, content models, page orchestration, or entire editorial sections into primitives. Similar colors or rounded corners do not by themselves imply a shared API. A new primitive should not need a large collection of unrelated boolean switches to accommodate its proposed consumers.

Rank recommendations by demonstrated reuse, consistency benefit, accessibility value, and migration cost. Treat frequency and severity as separate concerns. Do not invent a numeric score or require an arbitrary minimum number of occurrences.

## Report actionable candidates

This is a read-only review unless the user also requests implementation. Do not modify source or create a report file merely because the skill was invoked.

State the inspected scope and any material coverage limits. For each worthwhile candidate, include:

- A suggested name and whether to reuse, extend, create, or keep local.
- Concrete file-and-line references to the observed pattern and relevant existing component. Give counts only when verified.
- The shared responsibility and why centralizing it would improve future edits.
- A small proposed API or variant change, likely first consumers, and what remains consumer-owned.
- Any meaningful compatibility or accessibility constraint affecting extraction.

Use a compact comparison table when helpful, with short supporting notes for complex candidates. Lead with the strongest opportunities, avoid duplicate recommendations for the same abstraction, and mention convincing near-misses only when they clarify the boundary. If no new primitive is justified, say so and identify existing reuse opportunities instead. Do not fill the report with speculative components.

If implementation is also requested, apply the agreed scope using the repository's creation conventions; an audit alone does not authorize all proposed extractions.
