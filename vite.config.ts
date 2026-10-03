import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  /*===== Development Server =====*/
  plugins: [
    {
      name: "quiet-chrome-devtools-discovery",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          // Chrome probes for automatic workspaces. Decline before React Router
          // handles the request as an unmatched page and logs a stack trace.
          if (request.url?.split("?")[0] === "/.well-known/appspecific/com.chrome.devtools.json") {
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
});
