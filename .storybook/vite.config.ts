import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

/*===== Storybook Vite Configuration =====*/

export default defineConfig({
  // React Router's framework plugin requires the application Vite lifecycle,
  // so Storybook uses only the shared styling and import-resolution features.
  plugins: [tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
});
