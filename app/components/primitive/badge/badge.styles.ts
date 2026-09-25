import { cva } from "class-variance-authority";
import { composeStyles, defineStyles } from "../styles";

/*===== Shared Styles =====*/

const twSharedStyles = defineStyles({
  layout: "inline-flex w-fit max-w-full items-center justify-center",
  geometry: "rounded-4xl",
  typography: "text-center font-medium break-words",
});

/*===== Appearance =====*/

const twVariant = defineStyles({
  secondary: {
    appearance: "bg-secondary text-secondary-foreground",
  },
  surface: {
    appearance: "bg-card text-foreground",
  },
  university: {
    appearance: "bg-university text-white",
  },
});

/*===== Geometry =====*/

const twSize = defineStyles({
  default: {
    // Let height follow the responsive text and padding so Persian glyphs are not clipped.
    geometry: "px-2.5 py-1",
    typography: "text-[10px] sm:text-xs",
  },
});

/*===== Class Composition =====*/

const badgeVariants = cva(Object.values(twSharedStyles), {
  variants: {
    variant: composeStyles(twVariant),
    size: composeStyles(twSize),
  },
  defaultVariants: {
    variant: "secondary",
    size: "default",
  },
});

export { badgeVariants, twVariant, twSize };
