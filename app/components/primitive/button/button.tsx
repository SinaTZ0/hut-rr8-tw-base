import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { buttonVariants } from "./button.styles";

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

export { Button };
export default Button;
