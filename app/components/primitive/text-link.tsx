import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import type { ComponentProps } from "react";
import { composeStyles, defineStyles } from "./styles";

/*===== Shared Styles =====*/

const twSharedStyles = defineStyles({
  layout: "group/text-link inline-flex min-w-0 items-center",
  geometry: "gap-2 rounded-md px-1",
  typography: "font-semibold",
  interaction: "transition-[background-color,color,border-color]",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:outline-solid",
  motion: "motion-reduce:transition-none",
});

const twIconStyles = defineStyles({
  geometry: "size-4 shrink-0",
  interaction: "transition-transform",
  hover: "motion-safe:group-hover/text-link:-translate-x-1",
  motion: "motion-reduce:transition-none",
});

/*===== Appearance =====*/

const twVariant = defineStyles({
  default: {
    appearance: "text-primary",
    hover: "hover:text-foreground",
    focus: "focus-visible:outline-primary",
  },
  highlight: {
    appearance: "text-highlight",
    hover: "hover:text-white",
    focus: "focus-visible:outline-highlight",
  },
});

/*===== Typography Sizes =====*/

const twSize = defineStyles({
  default: {
    geometry: "min-h-11",
    typography: "text-sm",
  },
  sm: {
    geometry: "min-h-10",
    typography: "text-xs",
  },
});

/*===== Class Composition =====*/

const textLinkVariants = cva(Object.values(twSharedStyles).join(" "), {
  variants: {
    variant: composeStyles(twVariant),
    size: composeStyles(twSize),
  },
  defaultVariants: { variant: "default", size: "default" },
});

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

export { TextLink, textLinkVariants, twVariant, twSize };
export default TextLink;
