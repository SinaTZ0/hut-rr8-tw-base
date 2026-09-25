import { cva } from "class-variance-authority";
import { composeStyles, defineStyles } from "../styles";

/*===== Shared Styles =====*/

const twSharedStyles = defineStyles({
  layout: "group/text-link inline-flex min-w-0 items-center",
  geometry: "gap-2 rounded-md px-1",
  typography: "font-semibold",
  interaction: "transition-[background-color,color,border-color]",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:outline-solid",
  motion: "motion-reduce:transition-none",
});

const twIconStyles = defineStyles({
  geometry: "size-4 shrink-0",
  interaction: "transition-transform",
  hover: "motion-safe:group-hover/text-link:-translate-x-1",
  motion: "motion-reduce:transition-none",
});

/*===== Appearance =====*/

const twVariant = defineStyles({
  default: {
    appearance: "text-primary",
    hover: "hover:text-foreground",
    focus: "focus-visible:outline-primary",
  },
  highlight: {
    appearance: "text-highlight",
    hover: "hover:text-white",
    focus: "focus-visible:outline-highlight",
  },
});

/*===== Typography Sizes =====*/

const twSize = defineStyles({
  default: {
    geometry: "min-h-11",
    typography: "text-sm",
  },
  sm: {
    geometry: "min-h-10",
    typography: "text-xs",
  },
});

/*===== Class Composition =====*/

const textLinkVariants = cva(Object.values(twSharedStyles).join(" "), {
  variants: {
    variant: composeStyles(twVariant),
    size: composeStyles(twSize),
  },
  defaultVariants: { variant: "default", size: "default" },
});

export { textLinkVariants, twVariant, twSize, twIconStyles };
