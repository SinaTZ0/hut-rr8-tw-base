# Page navigation

Use React Router's `Link` for internal page navigation. The current `/` ↔ `/complaints-and-feedback` and `/` ↔ `/online-consultation` links opt into a native **200 ms, ease-out cross-fade**. The header and footer stay visually steady.

## Enabling the fade

Add `viewTransition` to the links in both directions:

```tsx
import { Link } from "react-router";

<Link to="/complaints-and-feedback" viewTransition>
  ثبت شکایات و پیشنهادات
</Link>;
```

When composing a university primitive, pass the Router link through its existing `render` prop:

```tsx
<LinkTile render={<Link to="/complaints-and-feedback" viewTransition />}>صدای شما برای ما مهم است</LinkTile>
```

For programmatic navigation with `useNavigate`, use `navigate(destination, { viewTransition: true })`. React Router manages the browser transition; no animation library or manual `document.startViewTransition()` call is needed.

The shared [Brand](../app/components/site/brand.tsx) enables its home-link transition from `/complaints-and-feedback` and `/online-consultation`. Extend that pathname condition when adding another page that should fade back to home; clicking the logo on home should remain unanimated.

## Shared styling and behavior

The “Page View Transitions” section in [app.css](../app/app.css) owns the animation. The root snapshot cross-fades; `.site-header` and `.site-footer` create separate named snapshots whose old images are hidden and whose new images appear immediately. Reuse `SiteHeader` and `SiteFooter` on new pages, and keep each transition name unique within a page.

Reduced-motion preferences disable the animations. Browsers without the View Transition API navigate normally. Initial loads and ordinary native anchors do not trigger this client-side fade. React Router reuses opted-in transitions for back/forward navigation along visited paths, while `ScrollRestoration` continues to manage scrolling.

When extending navigation, check both directions, keyboard activation, back/forward, navigation from a scrolled page, mobile/desktop, light/dark themes, and reduced motion.
