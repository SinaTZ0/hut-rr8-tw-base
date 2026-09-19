import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { composeStyles, defineStyles } from "./styles";

/*===== Shared Styles =====*/

const twSharedStyles = defineStyles({
  layout: "inline-flex w-fit shrink-0 items-center justify-center",
  geometry: "rounded-4xl",
  typography: "font-medium whitespace-nowrap",
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

/*===== Badge =====*/

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

/**
 * Renders a noninteractive label with native span props and refs.
 * Use variant/size for badge styles and className for consumer layout.
 */
function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span data-slot="badge" {...props} className={cn(badgeVariants({ variant, size }), className)} />;
}

export { Badge, badgeVariants, twVariant, twSize };
export default Badge;
