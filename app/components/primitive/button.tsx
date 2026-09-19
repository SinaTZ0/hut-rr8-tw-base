import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { composeStyles, defineStyles } from "./styles";

/*===== Shared Styles =====*/

const twSharedStyles = defineStyles({
  layout: "inline-flex shrink-0 items-center justify-center",
  geometry: "rounded-xl border",
  appearance: "border-transparent",
  typography: "text-sm font-medium whitespace-nowrap",
  interaction: "transition-colors outline-none select-none",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring focus-visible:outline-solid",
  disabled:
    "disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
  motion: "motion-reduce:transition-none",
  icon: "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
});

/*===== Appearance =====*/

const twVariant = defineStyles({
  default: {
    appearance: "bg-primary text-primary-foreground",
    hover: "hover:bg-primary/80",
  },
  highlight: {
    appearance: "bg-highlight text-highlight-foreground",
    hover: "hover:bg-highlight/85",
    focus: "focus-visible:outline-highlight",
  },
  outline: {
    appearance: "border-border bg-background text-foreground dark:border-input dark:bg-input/30",
    hover: "hover:bg-muted dark:hover:bg-input/50",
  },
  ghost: {
    appearance: "bg-transparent text-foreground",
    hover: "hover:bg-muted",
  },
  "inverse-outline": {
    // Colored surfaces can have different foregrounds in light and dark themes.
    appearance: "border-current/40 bg-transparent text-inherit",
    hover: "hover:bg-white/10",
    focus: "focus-visible:outline-current",
  },
});

/*===== Geometry =====*/

const twSize = defineStyles({
  default: {
    layout: "gap-2",
    geometry: "min-h-11 px-5 py-2",
  },
  lg: {
    layout: "gap-3",
    geometry: "min-h-12 px-5 py-2.5",
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
  compoundVariants: [{ size: "icon", className: "rounded-full" }],
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

/*===== Button =====*/

export type ButtonProps = ComponentProps<typeof ButtonPrimitive> & VariantProps<typeof buttonVariants>;

/**
 * Styles Base UI while preserving its refs, rendering, and interaction behavior.
 * Use variant/size for button styles and className for consumer layout.
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
