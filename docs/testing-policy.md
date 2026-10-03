# Testing policy for agents

Read this document before adding or expanding tests for a feature. It explains the maintainer's priorities; [Testing](./testing.md) lists the current tests, prerequisites, and commands.

## Why we keep tests small

The maintainer uses AI agents to implement features and personally reviews the application code. That review often catches misunderstandings or changes made without considering the whole project. The maintainer then refactors those parts to fit the intended behavior and project structure.

Tests have received less personal review because the maintainer has less experience with them and plans to study them later. A large collection of agent-written tests can therefore accumulate without the maintainer understanding what it actually protects. Passing those tests does not establish that an agent understood the feature: assertions can encode the same misunderstanding as the implementation.

The maintainer reported that testing was taking roughly half of agent session time even though the project is small. Writing, running, and repairing extensive suites was slowing feature development. The chosen approach is a small, understandable safety net that protects important behavior while keeping development and review manageable.

## When to add a test

A new feature does not automatically require a new test file or tests for every layer. First inspect existing coverage and identify the concrete failure worth preventing.

Add or update a test when it protects consequential business behavior, a security or privacy boundary, data integrity, a primary user flow, or a meaningful regression. Prefer one representative successful case and only the failure cases that protect distinct important outcomes. There is no test-count or coverage-percentage target.

| Change                                                  | Appropriate validation                                                                                                             |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| A submission or persistent operation                    | Verify the public result and the saved state; cover a critical rejected operation that must not write data.                        |
| A security or privacy rule                              | Verify the prohibited action is rejected or suppressed, including its relevant side effects.                                       |
| A concrete bug                                          | Add a focused regression test when it meaningfully catches that bug returning.                                                     |
| A primary browser flow                                  | Update an existing smoke test, or add a small browser test if the important behavior cannot be covered adequately through the API. |
| Styling, copy, document content, or routine composition | Review the affected UI or document and run relevant static checks. Tests are usually unnecessary.                                  |
| A refactor with the same intended behavior              | Run directly relevant existing tests. Avoid creating tests that freeze the new internal structure.                                 |

Before writing a test, be able to explain in plain language what could break, why that matters, and why the existing tests do not already cover it. If the intended product behavior is unclear, resolve that uncertainty before turning an assumption into an assertion.

## Keep tests understandable

- Test observable behavior through the closest useful public interface. Prefer a feature API test over separate tests for its procedure, service, repository, and middleware when they protect the same outcome.
- Use descriptive names and ordinary representative inputs. Keep setup, mocks, helpers, and assertions small enough for the maintainer to follow.
- Avoid exhaustive field permutations, theme/viewport matrices, snapshots of incidental details, exact logging or timing checks, animation internals, and tests that repeat framework or library behavior.
- Extend existing coverage before adding another suite. Introduce shared test infrastructure only when it makes the retained tests easier to understand and maintain.
- When a test fails, check the intended behavior. Do not change correct application behavior solely to satisfy an outdated or mistaken assertion, or weaken a valid test merely to make it pass.

For new or materially changed coverage, briefly explain what it protects in the final handoff and update the inventory in [Testing](./testing.md). State which checks ran and any limitations. This lets the maintainer understand the safety net without first reading all its implementation details.

## Keep validation proportional

Run lint after code changes and only the existing tests directly relevant to the change. Browser smoke tests are optional for their covered flows or explicit requests. Use typecheck for TypeScript contract changes and a build for bundling or runtime concerns. Avoid repeating a check after it passes unless another change or unresolved concern justifies it; Playwright already performs a production build.

Do not automatically provision databases, push schemas, download browsers, add test dependencies, or introduce a runner merely to complete routine validation. Report unavailable prerequisites and complete the checks that are available. Explicitly requested test setup or broader coverage can expand the scope.

## Preserve Storybook documentation

The maintainer builds and maintains story files as UI documentation. Preserve their previews, controls, callback actions, and existing `play` functions during test cleanup. Those functions may still perform interactions and assertions when a story is opened manually.

The automatic Storybook test runner is disabled. Do not reintroduce it as part of a feature or run all stories as a routine validation step. Use Storybook's previews and accessibility panel for manual UI review. Update stories when the requested component work changes their documented contract; test cleanup alone is not a reason to edit or delete them.
