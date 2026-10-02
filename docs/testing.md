# Testing

Run project commands from the repository root.

## Application browser tests

```sh
npx playwright install chromium
npm run test:e2e
```

The Playwright suite builds the app, starts an isolated production server on `127.0.0.1:5183`, and stops it after the run. Leave that port free. It supplies its own ALTCHA secret and a deliberately unreachable database URL, so no application or test database is required. Tests solve the real security challenge and explicitly mock submission responses. An unmocked RPC call or an uncaught browser error fails the test.

Route tests live beside their route modules as `*.e2e.test.ts`. Shared browser fixtures and helpers live in `tests/e2e/`. The suite covers consultation validation, normalization, submission states, security reset, copying, keyboard focus, navigation, both forms' responsive accessibility, and the complaints flow's shared components.

Run one route or test while developing:

```sh
npm run test:e2e -- app/routes/online-consultation
npm run test:e2e -- --grep "network failure"
npm run test:e2e -- --headed
```

Failure screenshots and traces are written to the gitignored `.tmp-codex/e2e-results/`. Inspect a trace with `npx playwright show-trace <trace.zip>`. Accessibility scans use axe and supplement the keyboard and behavior assertions; they do not replace manual accessibility review.

See the Playwright documentation for [managed test servers](https://playwright.dev/docs/test-webserver), [API mocking](https://playwright.dev/docs/mock), and [accessibility testing](https://playwright.dev/docs/accessibility-testing).

## API integration tests

```sh
NODE_ENV=test npm run db:push
npm run test:integration
```

Integration tests exercise the actual API, persistence, validation, challenge replay protection, error handling, and request timings. Configure `DATABASE_URL`, `TEST_DATABASE_URL`, and `ALTCHA_HMAC_SECRET`; the test database must differ from the application database. These tests create and clean up their own submission rows.

## Component tests and static checks

Storybook interaction tests remain separate from application browser tests:

```sh
npx vitest run --project=storybook
npm run lint
npm run typecheck
npm run build
```
