/// <reference types="vitest/config" />
import { join } from "node:path";

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vite";

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  /*===== Development Server =====*/
  plugins: [
    {
      name: "quiet-chrome-devtools-discovery",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          // Chrome probes for automatic workspaces. Decline before React Router
          // handles the request as an unmatched page and logs a stack trace.
          if (
            request.url?.split("?")[0] ===
            "/.well-known/appspecific/com.chrome.devtools.json"
          ) {
            response.statusCode = 404;
            response.end();
            return;
          }

          next();
        });
      },
    },
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        // Browser stories use the same isolated Vite config as Storybook's previews.
        // Inheriting React Router's application plugin requires its missing page preamble.
        extends: join(import.meta.dirname, ".storybook/vite.config.ts"),
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: join(import.meta.dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
});
