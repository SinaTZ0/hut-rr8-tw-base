import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { composeStyles, defineStyles } from "./styles";

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

/*===== Separator =====*/

export type SeparatorProps = SeparatorPrimitive.Props & VariantProps<typeof separatorVariants>;

/**
 * A semantic horizontal or vertical rule with the university's border tones.
 * Use inverse on dark university surfaces; surrounding spacing and decorative hiding remain consumer-owned.
 */
function Separator({ className, orientation = "horizontal", variant, ...props }: SeparatorProps) {
  const classes = separatorVariants({ variant });

  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

export { Separator, separatorVariants, twVariant };
export default Separator;
