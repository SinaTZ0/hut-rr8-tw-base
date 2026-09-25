import { cva } from "class-variance-authority";
import { composeStyles, defineStyles } from "../styles";

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

export { eyebrowVariants, twVariant, twSize, twMarker, markerVariants };
