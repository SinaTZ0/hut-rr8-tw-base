import { cva } from "class-variance-authority";
import { composeStyles, defineStyles } from "../styles";

/*===== Shared Styles =====*/

const twSharedStyles = defineStyles({
  layout: "shrink-0",
  geometry: "data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
});

/*===== Appearance =====*/

const twVariant = defineStyles({
  default: {
    appearance: "bg-border",
  },
  inverse: {
    appearance: "bg-white/20",
  },
});

/*===== Class Composition =====*/

const separatorVariants = cva(Object.values(twSharedStyles), {
  variants: {
    variant: composeStyles(twVariant),
  },
  defaultVariants: { variant: "default" },
});

export { separatorVariants, twVariant };
