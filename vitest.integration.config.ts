import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["app/**/*.integration.test.ts", "app/**/integration.test.ts"],
    testTimeout: 30_000,
  },
});
