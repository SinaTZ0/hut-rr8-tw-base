# Component conventions

## Which components to use

- `app/components/primitive/` owns the university's styled, reusable components. Prefer these for new university UI. Edit their local style definitions when a design change should apply everywhere.
- `app/components/ui/` contains the existing shadcn-style component collection. Existing consumers remain supported; use it for controls that do not yet have a university primitive, such as `Command`. These components have different defaults and are not interchangeable aliases.
- Route-specific sections and compositions stay inside their route slice. Promote them only when shared or when they clearly belong to the design system.

Import directly from the component file. Avoid mixing both versions of the same control within one feature. When introducing a primitive, move repeated visual overrides into it and migrate its consumers deliberately.

## Editing styles

Each primitive keeps its style definitions, CVA variants, and rendering in the same file. Use `defineStyles` from `./styles` around style maps: it preserves their types and lets Prettier sort their Tailwind strings without merging classes.

```tsx
const twVariant = defineStyles({
  default: {
    appearance: "bg-primary text-primary-foreground",
    hover: "hover:bg-primary/80",
    focus: "focus-visible:outline-ring",
  },
});
```

Use the same group names across components; omit groups you do not need:

| Group                        | Contents                                              |
| ---------------------------- | ----------------------------------------------------- |
| `layout`                     | Display, alignment, positioning, and gaps             |
| `geometry`                   | Dimensions, padding, radius, and border width         |
| `typography`                 | Font family, size, weight, alignment, and line height |
| `appearance`                 | Colors, border colors, shadows, and opacity           |
| `interaction`                | Transitions, selection, and pointer behavior          |
| `hover`, `focus`, `disabled` | Styles belonging to each interaction state            |
| `state`                      | Open/closed, active, and enter/exit styles            |
| `motion`                     | Reduced-motion overrides                              |
| `icon`                       | Selectors affecting descendant icons                  |

For a long state sequence, use descriptive suffixes such as `stateTranslation` and `stateRtlTranslation`. Keep meaningful groups small enough to scan. Multi-part variants such as LinkTile group all parts under each layout (`row.root`, `row.icon`, etc.).

`composeStyles` joins variant groups for CVA and preserves the option keys. Resolve Tailwind conflicts only at the element: `cn(componentVariants({ variant, size }), className)`. Preserve state-based `className` callbacks on Base UI wrappers. Use props for recurring visual choices and consumer classes for surrounding layout or one-off overrides.

Style maps exported as `twVariant` and `twSize` let stories discover options. Consumers should use component props, not mutate those maps. Colors and shared radii belong in [app.css](../app/app.css); see the [style and typography guide](./style-and-typography.md).

## Composing overlays and navigation

Dialog and sheet content include their portal and backdrop. Customize that backdrop through `overlayProps`; popup `className` still targets the content. Supply explicit close controls and accessible titles.

```tsx
<DialogContent className="sm:max-w-xl" overlayProps={{ className: "bg-black/40" }}>
  <DialogTitle>راهنمای دانشگاه</DialogTitle>
  {/* Content and an explicit DialogClose */}
</DialogContent>
```

Navigation includes a positioner by default. For custom placement, disable that default and compose exactly one positioner inside the root:

```tsx
<NavigationMenu positioner={false}>
  {/* NavigationMenuList with items, triggers, and content */}
  <NavigationMenuPositioner align="end" sideOffset={12} />
</NavigationMenu>
```

The positioner accepts children for a custom popup/viewport. Wrap RTL compositions in Base UI's `DirectionProvider` and set DOM `dir="rtl"`; portals receive direction from the provider.

## Previewing changes

Run `npm run storybook`. Keep stories beside primitives, with Persian content, relevant variants, and long-text examples. Check light/dark themes and keyboard focus when changing interaction styles. Use `npm run typecheck` and focused Storybook interaction tests for API changes. Prettier reads `app/app.css` and sorts strings inside `defineStyles`, `cn`, and `cva`.
