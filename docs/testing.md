# Testing

Before adding or expanding tests, read the [Testing policy for agents](./testing-policy.md). It explains why this project keeps tests small and how to choose worthwhile coverage for a new feature.

Keep a small safety net for consequential behavior. Run commands from the repository root, and choose only tests relevant to the change. Lint is required after code changes; typecheck is appropriate for TypeScript contract changes, and a production build for bundling or runtime concerns. Browser smoke tests are optional. Do not repeat a build already performed by Playwright.

## What the tests protect

The application has **10 API cases and 3 browser smoke tests**:

| Area                     | Retained cases                                                                                                                                                                                                        | What a failure means                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Consultation API (4)     | Saves normalized input and returns a tracking code; rejects a blank question without saving or consuming its proof; rejects malformed, tampered, and expired proofs; rejects proof reuse without a second submission. | Consultation persistence, validation, or CAPTCHA protection may be broken.          |
| Complaints API (3)       | Saves normalized input and returns a tracking code; rejects a blank message without saving or consuming its proof; rejects proof reuse without a second submission.                                                   | Complaints persistence, validation, or single-use CAPTCHA protection may be broken. |
| Visit statistics API (3) | Concurrent deliveries and retries count once; DNT prevents tracking and cookies; GPC prevents tracking and cookies.                                                                                                   | Visit counts may be inflated or a privacy preference may be ignored.                |
| Browser smoke (3)        | Navigate from home and submit each form, displaying its tracking code; consultation preserves input after a network failure and succeeds on retry.                                                                    | A primary form flow may be unusable in the browser.                                 |

Both forms share the CAPTCHA verification middleware, so malformed, tampered, and expired proofs are checked through consultation only. Each feature's persistence layer still has its own proof-reuse test.

Tests focus on representative public behavior. Logging, timing, animation internals, exhaustive validation matrices, and automated theme/viewport accessibility scans are outside this small suite. Manual review remains necessary for visual and accessibility changes.

## API integration tests

Configure `DATABASE_URL`, `TEST_DATABASE_URL`, and `ALTCHA_HMAC_SECRET`. `TEST_DATABASE_URL` must point to a separate, migrated test database; the application rejects a test URL selecting the application database. Tests create and clean up their own submission rows and isolated visit records. Statistics tests freeze the date in 2090 to separate their daily counters from normal development data.

```sh
npm run test:integration
npm run test:integration -- app/orpc/online-consultation/integration.test.ts
npm run test:integration -- app/orpc/complaints-and-feedback/integration.test.ts
npm run test:integration -- app/orpc/website-visits/integration.test.ts
```

The command sets `NODE_ENV=test` so requests use the test database. Database preparation is an explicit setup step, not part of routine agent validation. If prerequisites are unavailable, report the limitation instead of automatically provisioning a database or pushing its schema.

## Optional browser smoke tests

An existing Playwright Chromium installation and a free `127.0.0.1:5183` port are required.

```sh
npm run test:e2e
npm run test:e2e -- app/routes/online-consultation
npm run test:e2e -- app/routes/complaints-and-feedback
npm run test:e2e -- --grep "network failure"
```

Playwright builds the app, starts an isolated production server, and stops it after the run. The server uses a test-only ALTCHA secret and an unreachable database URL. Tests solve the real public challenge but mock form submission responses and the three statistics procedures, so no database is required. These smoke tests verify browser behavior; the API tests above verify actual persistence. The fixture rejects unexpected RPC calls and uncaught browser errors.

Failure screenshots and traces are written to `.tmp-codex/e2e-results/`. If Chromium is missing, report that prerequisite rather than automatically downloading it during a coding task.

## Storybook as UI documentation

```sh
npm run storybook
```

All story files, controls, callback actions, and existing `play` functions are preserved. A `play` function performs interactions and assertions when its story is opened. The automatic Vitest Storybook runner is disabled; stories are not part of routine application test runs. Use the previews and accessibility panel for manual UI review.
