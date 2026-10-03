# Style and typography

This describes the current university homepage and its primitives. The visual character is calm, welcoming, and academic: deep teal establishes identity, warm gold highlights important actions, and campus photography gives the page a sense of place.

## Color and surfaces

Use semantic tokens from [app.css](../app/app.css), including their paired foreground colors, rather than copying hex values into components.

Use `text-prose-foreground` for long-form article paragraphs on the page background. It provides neutral charcoal text in light mode and follows `foreground` in dark mode. Headings and interface text continue to use their existing foreground tokens.

| Role                | Current treatment                                                                    |
| ------------------- | ------------------------------------------------------------------------------------ |
| Page                | Off-white `background` with dark teal `foreground`; deep teal surfaces in dark mode  |
| Primary action      | Teal `primary` with `primary-foreground`; a lighter mint tone in dark mode           |
| Highlight           | Warm gold `highlight` with dark `highlight-foreground` for prominent calls to action |
| Supporting surfaces | White `card`, pale green `secondary`, and quiet `muted` backgrounds in light mode    |
| University identity | Fixed deep teal `university` and `university-deep`, usually paired with white text   |

Cards use soft corners, thin borders or rings, and restrained hover shadows. Buttons are rounded rectangles; icon buttons and small markers are circular. Larger feature panels use more generous radii. Preserve contrast over photographs with a dark teal overlay.

## Typography

Vazirmatn Variable is the shared typeface. Both `font-sans` and `font-heading` currently resolve to it. Hierarchy comes from size, weight, spacing, and color rather than a second display font.

| Role                       | Existing scale and treatment                                  |
| -------------------------- | ------------------------------------------------------------- |
| Hero heading               | Responsive size, roughly 30–56px; extra-bold, line height 1.4 |
| Section heading            | 24px, increasing to 30px; bold with generous line height      |
| Editorial/card heading     | Usually 16–20px, semibold or bold; line height 28–36px        |
| Body and introductory copy | Usually 14–16px with line height 28–32px                      |
| Controls                   | Usually 14px medium; compact desktop navigation uses 13px     |
| Supporting labels          | Usually 12–14px; badges and minor metadata use 10–12px        |

Keep small type for short supporting labels. Persian copy needs room above and below glyphs: prefer padding and minimum heights to tightly fixed text containers. Let long labels wrap where the component supports it. Match heading semantics to the page hierarchy independently of visual size.

## Layout, direction, and motion

Sections have generous vertical space, typically `py-14 sm:py-20`. Cards commonly use `p-4 sm:p-5`; larger content uses `p-6 sm:p-7`. Primary controls start at a 44px minimum height, with 48px large buttons.

Persian content reads right to left. Prefer logical spacing (`ms`, `me`, `ps`, `pe`) and `text-start`. Isolate English labels, URLs, and contact values with `dir="ltr"` where needed. Directional link arrows follow the Persian reading direction.

Hover effects are subtle color, shadow, or short movement changes. Keyboard focus must remain clearly visible, and reduced-motion preferences should suppress nonessential transitions. Preview every change in both themes and with realistic Persian text.
