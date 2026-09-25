import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { separatorVariants } from "./separator.styles";

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

export { Separator };
export default Separator;
