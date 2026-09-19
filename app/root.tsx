import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { DirectionProvider } from "./components/ui/direction";
import { TooltipProvider } from "./components/ui/tooltip";
import { readThemePreference, serializeThemePreference } from "./theme/theme-cookie.server";
import { ThemeProvider, ThemeScript } from "./theme/theme-provider";
import { DEFAULT_THEME, isThemePreference, THEME_ACTION_INTENT, type ThemeActionData } from "./theme/theme";

/*===== Theme Data =====*/

export async function loader({ request }: Route.LoaderArgs) {
  const theme = await readThemePreference(request);
  return data({ theme }, { headers: { Vary: "Cookie" } });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const theme = formData.get("theme");

  if (intent !== THEME_ACTION_INTENT || !isThemePreference(theme)) {
    return data({ ok: false, error: "Invalid theme preference." } satisfies ThemeActionData, { status: 400 });
  }

  return data({ ok: true, theme } satisfies ThemeActionData, {
    headers: { "Set-Cookie": await serializeThemePreference(theme) },
  });
}

export function headers({ actionHeaders, errorHeaders, loaderHeaders }: Route.HeadersArgs) {
  const headers = new Headers();
  const setCookie = actionHeaders.get("Set-Cookie");
  const varyValues = [loaderHeaders.get("Vary"), actionHeaders.get("Vary"), errorHeaders?.get("Vary")]
    .flatMap((value) => value?.split(",") ?? [])
    .map((value) => value.trim())
    .filter(Boolean);

  if (!varyValues.some((value) => value.toLowerCase() === "cookie")) varyValues.push("Cookie");
  headers.set("Vary", varyValues.join(", "));

  // Defining route headers makes this function responsible for forwarding the action's persistence cookie.
  if (setCookie) headers.set("Set-Cookie", setCookie);

  return headers;
}

/*===== Document Layout =====*/

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useRouteLoaderData<typeof loader>("root")?.theme ?? DEFAULT_THEME;

  return (
    <html lang="fa" dir="rtl" className={theme === "system" ? undefined : theme} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <ThemeScript theme={theme} />
        <Links />
      </head>
      <body>
        <ThemeProvider initialTheme={theme}>
          <DirectionProvider direction="rtl">
            <TooltipProvider>{children}</TooltipProvider>
          </DirectionProvider>
        </ThemeProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/*===== Application =====*/

export default function App() {
  return <Outlet />;
}

/*===== Root Error Boundary =====*/

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
