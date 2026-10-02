import { defineConfig, devices } from "playwright/test";

/*===== Application Browser Tests =====*/

const baseURL = "http://127.0.0.1:5183";

export default defineConfig({
  testDir: "./app/routes",
  testMatch: "**/*.e2e.test.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: "list",
  outputDir: "./.tmp-codex/e2e-results",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } }],
  webServer: {
    command: "npm run build && npm run start",
    url: baseURL,
    // Always start our isolated server; an existing developer server may use a real database.
    reuseExistingServer: false,
    gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
    env: {
      NODE_ENV: "production",
      HOST: "127.0.0.1",
      PORT: "5183",
      DATABASE_URL: "postgresql://e2e:e2e@127.0.0.1:1/e2e",
      ALTCHA_HMAC_SECRET: "e2e-only-altcha-verification-secret",
    },
  },
});
