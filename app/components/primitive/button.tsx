import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { composeStyles, defineStyles } from "./styles";

/*===== Shared Styles =====*/

const twSharedStyles = defineStyles({
  layout: "inline-flex max-w-full items-center justify-center",
  geometry: "rounded-xl border",
  appearance: "border-transparent",
  typography: "text-center text-sm font-medium",
  interaction: "transition-[background-color,border-color,color,box-shadow,transform] outline-none select-none",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  active: "active:not-disabled:translate-y-px",
  disabled:
    "disabled:pointer-events-none disabled:opacity-60 data-disabled:pointer-events-none data-disabled:opacity-60",
  motion: "motion-reduce:transition-none",
  icon: "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
});

/*===== Appearance =====*/

const twVariant = defineStyles({
  default: {
    appearance: "bg-primary text-primary-foreground",
    hover: "hover:bg-primary/90",
  },
  highlight: {
    appearance: "bg-highlight text-highlight-foreground",
    hover: "hover:bg-highlight/85",
    focus: "focus-visible:outline-ring",
  },
  outline: {
    appearance: "border-primary/70 bg-background text-foreground dark:border-primary/60 dark:bg-input/30",
    hover: "hover:bg-muted dark:hover:bg-input/50",
  },
  ghost: {
    appearance: "bg-transparent text-foreground",
    hover: "hover:bg-muted",
  },
  "inverse-outline": {
    // Colored surfaces can have different foregrounds in light and dark themes.
    appearance: "border-current/60 bg-transparent text-inherit",
    hover: "hover:bg-white/10",
    focus: "focus-visible:outline-current",
  },
});

/*===== Geometry =====*/

const twSize = defineStyles({
  sm: {
    layout: "gap-2",
    geometry: "min-h-10 px-4 py-2",
  },
  default: {
    layout: "gap-2",
    geometry: "min-h-11 px-5 py-2",
  },
  lg: {
    layout: "gap-3",
    geometry: "min-h-12 px-6 py-2.5",
  },
  "icon-sm": {
    geometry: "size-10 p-0",
  },
  icon: {
    geometry: "size-11 p-0",
  },
});

/*===== Class Composition =====*/

const buttonVariants = cva(Object.values(twSharedStyles), {
  variants: {
    variant: composeStyles(twVariant),
    size: composeStyles(twSize),
  },
  compoundVariants: [
    { size: "icon-sm", className: "rounded-full" },
    { size: "icon", className: "rounded-full" },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

/*===== Button =====*/

export type ButtonProps = ComponentProps<typeof ButtonPrimitive> & VariantProps<typeof buttonVariants>;

/**
 * Styles Base UI while preserving its refs, rendering, and interaction behavior.
 * Use variant/size for button styles and className for consumer layout. Icon-only sizes must
 * provide an accessible name through `aria-label` or `aria-labelledby`.
 */
function Button({ className, variant, size, ...props }: ButtonProps) {
  const classes = buttonVariants({ variant, size });

  return (
    <ButtonPrimitive
      data-slot="button"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

export { Button, buttonVariants, twVariant, twSize };
export default Button;
