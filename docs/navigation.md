# Page navigation

Local client navigation uses the unstyled adapters in `app/navigation/`. Page and query navigation enable React Router's native **200 ms, ease-out cross-fade** by default. The header and footer stay visually steady. No route whitelist or per-link opt-in is needed.

## Links and primitives

Import each adapter directly from its owning module and compose it with university primitives:

```tsx
import { AppLink } from "~/navigation/app-link";
import { LinkTile } from "~/components/primitive/link-tile/link-tile";

<LinkTile render={<AppLink to="/complaints-and-feedback" />}>صدای شما برای ما مهم است</LinkTile>;
```

`AppLink` preserves Router's link props and anchor ref. `AppNavLink` additionally preserves active/pending/transitioning render callbacks. Neither adapter supplies visual styles; compose them with the existing university primitives, including `NavigationMenuLink`'s `render` prop.

Links whose resolved pathname and query match the current URL do not animate by default. Same-page hash links such as skip links and article anchors should remain native `<a href="#section">` elements so their existing scrolling and focus behavior is preserved. For an intentional exception, pass `viewTransition={false}` to an adapter.

External URLs, protocol-relative URLs, downloads, email, telephone, and document navigation stay native. In mixed destination lists, use `isLocalHref` from `~/navigation/view-transition` to select an `AppLink` for app-relative destinations and a native anchor for the others. Absolute URLs are treated as document destinations, even if deployed on the same origin; use an app-relative URL for client navigation.

## Programmatic navigation, queries, and forms

| Router API        | Application adapter                                            |
| ----------------- | -------------------------------------------------------------- |
| `Link`            | `AppLink` from `~/navigation/app-link`                         |
| `NavLink`         | `AppNavLink` from `~/navigation/app-nav-link`                  |
| `Navigate`        | `AppNavigate` from `~/navigation/app-navigate`                 |
| `Form`            | `AppForm` from `~/navigation/app-form`                         |
| `useNavigate`     | `useAppNavigate` from `~/navigation/use-app-navigate`          |
| `useSubmit`       | `useAppSubmit` from `~/navigation/use-app-submit`              |
| `useSearchParams` | `useAppSearchParams` from `~/navigation/use-app-search-params` |

```tsx
const navigate = useAppNavigate();
await navigate("/privacy-and-data-protection");
await navigate("/", { viewTransition: false });

const [searchParams, setSearchParams] = useAppSearchParams();
setSearchParams({ tab: "research" }, { preventScrollReset: true });
```

The hooks preserve Router's options and return values, including functional query updates. Hash-only `navigate` calls do not opt into a fade. Numeric history navigation, such as `navigate(-1)`, delegates unchanged to Router.

`AppForm` and `useAppSubmit` enable transitions for navigating submissions, including their client redirects. `navigate={false}`, fetcher submissions, and `reloadDocument` retain Router's behavior. Existing RPC forms and theme fetchers are not navigation and do not acquire page fades. `AppNavigate` adds an optional `viewTransition` prop to Router's `NavigateProps`; it runs in a client effect, so prefer loader/action redirects for server-side or initial redirects.

Oxlint rejects direct imports of these Router navigation APIs outside `app/navigation/`. Other Router APIs and type-only imports remain available. Avoid bypassing the adapters with native anchors for local pages or with raw history/location changes.

## Shared styling and behavior

React Router owns transition timing and navigation commits through its supported `viewTransition` props/options. Do not patch router internals or call `document.startViewTransition()` from application code. See the [React Router guide](https://reactrouter.com/how-to/view-transitions).

The “Page View Transitions” section in [app.css](../app/app.css) owns the animation. The root snapshot cross-fades; `.site-header` and `.site-footer` create separate named snapshots whose old images are hidden and whose new images appear immediately. Reuse `SiteHeader` and `SiteFooter` on new pages, and keep each transition name unique within a page.

Reduced-motion preferences disable the animations. Browsers without the View Transition API navigate normally. Initial loads and native anchors do not trigger this client-side fade. React Router reuses recorded transitions for back/forward navigation along visited paths; this does not force animations for arbitrary history entries. `ScrollRestoration` continues to manage scrolling.

When extending navigation, check both directions, keyboard activation, back/forward, navigation from a scrolled page, mobile/desktop, light/dark themes, and reduced motion.
