import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { badgeVariants } from "./badge.styles";

/*===== Badge =====*/

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

/**
 * Renders a noninteractive label with native span props and refs.
 * Use variant/size for badge styles and className for consumer layout.
 */
function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span data-slot="badge" {...props} className={cn(badgeVariants({ variant, size }), className)} />;
}

export { Badge };
export default Badge;
