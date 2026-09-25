import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { eyebrowVariants, markerVariants } from "./eyebrow.styles";

/*===== Eyebrow =====*/

export type EyebrowProps = ComponentProps<"p"> & VariantProps<typeof eyebrowVariants>;

/**
 * An editorial label with a decorative marker and native paragraph props and refs.
 * Use variant, size, and marker for styling; surrounding spacing belongs to the consumer.
 * The highlight variant is intended for the university's dark surface so its gold text remains AA-contrast.
 */
function Eyebrow({ className, children, variant, size, marker, ...props }: EyebrowProps) {
  return (
    <p data-slot="eyebrow" {...props} className={cn(eyebrowVariants({ variant, size, marker }), className)}>
      <span data-slot="eyebrow-marker" className={cn(markerVariants({ marker }))} aria-hidden="true" />
      {children}
    </p>
  );
}

export { Eyebrow };
export default Eyebrow;
