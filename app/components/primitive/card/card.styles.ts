import { cva } from "class-variance-authority";
import { composeStyles, defineStyles } from "../styles";

/*===== Surface Styles =====*/

const twCardStyles = defineStyles({
  layout: "group/card flex flex-col overflow-hidden has-[>[data-slot=card-link]]:overflow-visible",
  geometry: "rounded-2xl",
  typography: "text-sm",
  appearance: "border border-border bg-card text-card-foreground",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary focus-visible:outline-solid",
});

const twVariant = defineStyles({
  default: {},
  muted: {
    appearance: "bg-muted/60",
  },
});

const twRadius = defineStyles({
  default: {},
  lg: {
    geometry: "sm:rounded-3xl",
  },
});

/*===== Whole-Card Link Styles =====*/

const twLinkStyles = defineStyles({
  layout: "group block overflow-hidden",
  geometry: "rounded-[inherit]",
  hover: "hover:bg-secondary/35 hover:shadow-md hover:shadow-primary/5",
  interaction: "transition-[background-color,box-shadow] duration-300",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:outline-solid",
  motion: "motion-reduce:transition-none",
});

/*===== Compound Part Styles =====*/

const twHeaderStyles = defineStyles({
  layout:
    "group/card-header @container/card-header grid auto-rows-min items-start gap-1 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
  geometry: "p-4 sm:p-5",
});

const twTitleStyles = defineStyles({
  typography: "font-heading text-base leading-7 font-medium",
});

const twDescriptionStyles = defineStyles({
  typography: "text-sm",
  appearance: "text-muted-foreground",
});

const twActionStyles = defineStyles({
  layout: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
});

const twActionVariant = defineStyles({
  default: {},
  highlight: {
    layout: "flex items-center justify-center self-center",
    geometry: "size-11 rounded-full",
    appearance: "bg-highlight/20 text-foreground",
  },
});

const twFooterStyles = defineStyles({
  layout: "flex items-center",
  geometry: "p-4 sm:p-5",
});

const twFooterVariant = defineStyles({
  default: {
    appearance: "border-t border-border bg-muted/50",
  },
  seamless: {
    appearance: "bg-muted/50",
  },
});

/*===== Content Spacing =====*/

const twSize = defineStyles({
  default: {
    geometry: "p-4 sm:p-5",
  },
  lg: {
    geometry: "p-6 sm:p-7",
  },
});

const twContentVariant = defineStyles({
  default: {},
  divided: {
    appearance: "divide-y divide-border",
  },
});

/*===== Class Composition =====*/

const cardContentVariants = cva("", {
  variants: {
    size: composeStyles(twSize),
    variant: composeStyles(twContentVariant),
  },
  defaultVariants: { size: "default", variant: "default" },
});

const cardVariants = cva(Object.values(twCardStyles), {
  variants: {
    variant: composeStyles(twVariant),
    radius: composeStyles(twRadius),
  },
  defaultVariants: { variant: "default", radius: "default" },
});

const cardActionVariants = cva(Object.values(twActionStyles), {
  variants: { variant: composeStyles(twActionVariant) },
  defaultVariants: { variant: "default" },
});

const cardFooterVariants = cva(Object.values(twFooterStyles), {
  variants: { variant: composeStyles(twFooterVariant) },
  defaultVariants: { variant: "default" },
});

export {
  cardActionVariants,
  cardVariants,
  cardContentVariants,
  cardFooterVariants,
  twActionVariant,
  twContentVariant,
  twFooterVariant,
  twRadius,
  twVariant,
  twSize,
  twLinkStyles,
  twHeaderStyles,
  twTitleStyles,
  twDescriptionStyles,
};
