import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { composeStyles, defineStyles } from "./styles";

/*===== Shared Styles =====*/

const twSharedStyles = defineStyles({
  layout: "flex items-center",
  typography: "font-semibold",
});

const twMarkerStyles = defineStyles({
  layout: "shrink-0",
  appearance: "bg-highlight",
});

/*===== Appearance =====*/

const twVariant = defineStyles({
  default: {
    appearance: "text-primary",
  },
  highlight: {
    appearance: "text-highlight",
  },
  inverse: {
    appearance: "text-white/90",
    typography: "font-medium",
  },
});

/*===== Typography Sizes =====*/

const twSize = defineStyles({
  default: {
    typography: "text-xs sm:text-sm",
  },
  sm: {
    typography: "text-xs",
  },
});

/*===== Marker Geometry =====*/

const twMarker = defineStyles({
  bar: {
    geometry: "h-1.5 w-5 rounded-full",
  },
  line: {
    geometry: "h-px w-8",
  },
  dot: {
    geometry: "size-1.5 rounded-full",
  },
});

const twMarkerSpacing = defineStyles({
  bar: {
    layout: "gap-2.5",
  },
  line: {
    layout: "gap-3",
  },
  dot: {
    layout: "gap-2",
  },
});

/*===== Class Composition =====*/

const eyebrowVariants = cva(Object.values(twSharedStyles), {
  variants: {
    variant: composeStyles(twVariant),
    size: composeStyles(twSize),
    marker: composeStyles(twMarkerSpacing),
  },
  defaultVariants: { variant: "default", size: "default", marker: "bar" },
});

const markerVariants = cva(Object.values(twMarkerStyles), {
  variants: { marker: composeStyles(twMarker) },
  defaultVariants: { marker: "bar" },
});

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

export { Eyebrow, eyebrowVariants, twVariant, twSize, twMarker };
export default Eyebrow;
