import { cva } from "class-variance-authority";
import { composeStyles, defineStyles } from "../styles";

/*===== Shared Styles =====*/

const twSharedStyles = defineStyles({
  layout: "group/link-tile flex min-w-0",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:outline-solid",
  motion: "motion-reduce:transition-none",
});

const twIconStyles = defineStyles({
  layout: "inline-flex shrink-0 items-center justify-center",
  appearance: "text-primary",
  icon: "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  motion: "motion-reduce:transition-none",
});

const twLabelStyles = defineStyles({
  typography: "font-semibold",
  motion: "motion-reduce:transition-none",
});

const twDescriptionStyles = defineStyles({
  appearance: "text-muted-foreground",
});

const twArrowStyles = defineStyles({
  layout: "shrink-0",
  appearance: "text-primary",
  motion: "motion-reduce:transition-none",
});

/*===== Tile Layouts =====*/

const twVariant = defineStyles({
  row: {
    root: {
      layout: "items-start gap-4",
      geometry: "rounded-xl px-3 py-7",
      hover: "hover:bg-card/80 hover:shadow-sm",
      focus: "focus-visible:bg-card/80 focus-visible:shadow-sm",
      interaction: "transition-[background-color,box-shadow] duration-200",
    },
    icon: {
      geometry: "size-11 rounded-xl border border-border",
      appearance: "bg-card",
      interaction: "transition-colors duration-200",
      hover:
        "group-hover/link-tile:border-primary group-hover/link-tile:bg-primary group-hover/link-tile:text-primary-foreground",
      focus:
        "group-focus-visible/link-tile:border-primary group-focus-visible/link-tile:bg-primary group-focus-visible/link-tile:text-primary-foreground",
    },
    content: {
      layout: "min-w-0 flex-1",
    },
    label: {
      layout: "block",
      typography: "text-base leading-7 break-words",
      interaction: "transition-colors duration-200",
      hover: "group-hover/link-tile:text-primary",
      focus: "group-focus-visible/link-tile:text-primary",
    },
    description: {
      layout: "mt-1 block",
      typography: "text-xs leading-7",
    },
    arrow: {
      geometry: "mt-2 size-4",
      interaction: "transition-transform duration-200",
      hover: "motion-safe:group-hover/link-tile:-translate-x-1 motion-safe:group-hover/link-tile:-translate-y-1",
      focus:
        "motion-safe:group-focus-visible/link-tile:-translate-x-1 motion-safe:group-focus-visible/link-tile:-translate-y-1",
    },
  },
  stacked: {
    root: {
      layout: "relative min-w-0 flex-col items-center justify-center gap-2",
      geometry: "min-h-28 px-3 py-4",
      typography: "text-center",
      hover: "hover:bg-muted",
      focus: "focus-visible:z-10 focus-visible:bg-muted focus-visible:outline-offset-2",
      interaction: "transition-colors",
    },
    icon: {},
    content: {
      layout: "flex flex-col items-center gap-2",
    },
    label: {
      typography: "text-sm leading-6",
    },
    description: {
      typography: "text-[11px] leading-5",
    },
    arrow: {
      layout: "absolute top-3 left-3",
      geometry: "size-3.5",
      appearance: "opacity-0",
      interaction: "transition-opacity",
      hover: "group-hover/link-tile:opacity-100",
      focus: "group-focus-visible/link-tile:opacity-100",
    },
  },
});

/*===== Class Composition =====*/

// Keep each layout together for editing, then select one part for CVA.
function composePartStyles(part: keyof typeof twVariant.row) {
  return composeStyles({ row: twVariant.row[part], stacked: twVariant.stacked[part] });
}

const linkTileVariants = cva(Object.values(twSharedStyles), {
  variants: { variant: composePartStyles("root") },
  defaultVariants: { variant: "row" },
});

const iconVariants = cva(Object.values(twIconStyles), {
  variants: { variant: composePartStyles("icon") },
  defaultVariants: { variant: "row" },
});

const contentVariants = cva("", {
  variants: { variant: composePartStyles("content") },
  defaultVariants: { variant: "row" },
});

const labelVariants = cva(Object.values(twLabelStyles), {
  variants: { variant: composePartStyles("label") },
  defaultVariants: { variant: "row" },
});

const descriptionVariants = cva(Object.values(twDescriptionStyles), {
  variants: { variant: composePartStyles("description") },
  defaultVariants: { variant: "row" },
});

const arrowVariants = cva(Object.values(twArrowStyles), {
  variants: { variant: composePartStyles("arrow") },
  defaultVariants: { variant: "row" },
});

export {
  linkTileVariants,
  twVariant,
  iconVariants,
  contentVariants,
  labelVariants,
  descriptionVariants,
  arrowVariants,
};
