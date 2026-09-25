import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import type { ComponentProps } from "react";
import { twIconStyles, textLinkVariants } from "./text-link.styles";

/*===== TextLink =====*/

export type TextLinkProps = ComponentProps<"a"> &
  VariantProps<typeof textLinkVariants> & { href: string; external?: boolean };

/**
 * A native link that forwards anchor attributes and refs.
 * `external` selects the diagonal arrow only; target and rel remain caller-owned.
 * The highlight variant is intended for the university's dark surface so its gold text remains AA-contrast.
 */
function TextLink({ className, children, external = false, variant, size, ...props }: TextLinkProps) {
  const Icon = external ? ArrowUpLeft : ArrowLeft;

  return (
    <a data-slot="text-link" {...props} className={cn(textLinkVariants({ variant, size }), className)}>
      {children}
      <Icon className={cn(Object.values(twIconStyles).join(" "))} aria-hidden="true" />
    </a>
  );
}

export { TextLink };
export default TextLink;
