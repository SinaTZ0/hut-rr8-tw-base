import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { composeStyles, defineStyles } from "./styles";

/*===== Surface Styles =====*/

const twCardStyles = defineStyles({
  layout: "group/card flex flex-col overflow-hidden has-[>[data-slot=card-link]]:overflow-visible",
  geometry: "rounded-2xl",
  typography: "text-sm",
  appearance: "border border-border bg-card text-card-foreground",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary focus-visible:outline-solid",
});

const twVariant = defineStyles({
  default: {},
  muted: {
    appearance: "bg-muted/60",
  },
});

const twRadius = defineStyles({
  default: {},
  lg: {
    geometry: "sm:rounded-3xl",
  },
});

/*===== Whole-Card Link Styles =====*/

const twLinkStyles = defineStyles({
  layout: "group block overflow-hidden",
  geometry: "rounded-[inherit]",
  hover: "hover:bg-secondary/35 hover:shadow-md hover:shadow-primary/5",
  interaction: "transition-[background-color,box-shadow] duration-300",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:outline-solid",
  motion: "motion-reduce:transition-none",
});

/*===== Compound Part Styles =====*/

const twHeaderStyles = defineStyles({
  layout:
    "group/card-header @container/card-header grid auto-rows-min items-start gap-1 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
  geometry: "p-4 sm:p-5",
});
const twTitleStyles = defineStyles({
  typography: "font-heading text-base leading-7 font-medium",
});
const twDescriptionStyles = defineStyles({
  typography: "text-sm",
  appearance: "text-muted-foreground",
});
const twActionStyles = defineStyles({
  layout: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
});

const twActionVariant = defineStyles({
  default: {},
  highlight: {
    layout: "flex items-center justify-center self-center",
    geometry: "size-11 rounded-full",
    appearance: "bg-highlight/20 text-foreground",
  },
});

const twFooterStyles = defineStyles({
  layout: "flex items-center",
  geometry: "p-4 sm:p-5",
});

const twFooterVariant = defineStyles({
  default: {
    appearance: "border-t border-border bg-muted/50",
  },
  seamless: {
    appearance: "bg-muted/50",
  },
});

/*===== Content Spacing =====*/

const twSize = defineStyles({
  default: {
    geometry: "p-4 sm:p-5",
  },
  lg: {
    geometry: "p-6 sm:p-7",
  },
});

const twContentVariant = defineStyles({
  default: {},
  divided: {
    appearance: "divide-y divide-border",
  },
});

/*===== Class Composition =====*/

const cardContentVariants = cva("", {
  variants: {
    size: composeStyles(twSize),
    variant: composeStyles(twContentVariant),
  },
  defaultVariants: { size: "default", variant: "default" },
});

const cardVariants = cva(Object.values(twCardStyles), {
  variants: {
    variant: composeStyles(twVariant),
    radius: composeStyles(twRadius),
  },
  defaultVariants: { variant: "default", radius: "default" },
});

const cardActionVariants = cva(Object.values(twActionStyles), {
  variants: { variant: composeStyles(twActionVariant) },
  defaultVariants: { variant: "default" },
});

const cardFooterVariants = cva(Object.values(twFooterStyles), {
  variants: { variant: composeStyles(twFooterVariant) },
  defaultVariants: { variant: "default" },
});

/*===== Card =====*/

export type CardProps = useRender.ComponentProps<"div"> & VariantProps<typeof cardVariants>;
export type CardLinkProps = ComponentProps<"a"> & { href: string };
export type CardContentProps = ComponentProps<"div"> & VariantProps<typeof cardContentVariants>;
export type CardHeaderProps = ComponentProps<"div">;
export type CardTitleProps = useRender.ComponentProps<"h3">;
export type CardDescriptionProps = useRender.ComponentProps<"p">;
export type CardActionProps = ComponentProps<"div"> & VariantProps<typeof cardActionVariants>;
export type CardFooterProps = ComponentProps<"div"> & VariantProps<typeof cardFooterVariants>;

/**
 * A styled surface that renders as a div by default.
 * Use `render` when the surface needs a more specific semantic element, such as an aside or article.
 */
function Card({ className, render, variant, radius, ...props }: CardProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(cardVariants({ variant, radius }), className),
      },
      props,
    ),
    render,
    state: { slot: "card", variant, radius },
  });
}

function CardContent({ className, size, variant, ...props }: CardContentProps) {
  return <div data-slot="card-content" {...props} className={cn(cardContentVariants({ size, variant }), className)} />;
}

/*===== Whole-Card Link =====*/

/**
 * A native anchor placed directly inside Card, inheriting its radius and forwarding attributes and refs.
 * Card lets the link's shadow and focus outline extend outside its surface; the link clips its own content.
 * Keep nested links and buttons outside CardLink, and supply height, scroll offset, and editorial layout in consumers.
 */
function CardLink({ className, ...props }: CardLinkProps) {
  return <a data-slot="card-link" {...props} className={cn(Object.values(twLinkStyles).join(" "), className)} />;
}

/*===== Compound Parts =====*/

function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div data-slot="card-header" {...props} className={cn(Object.values(twHeaderStyles).join(" "), className)} />;
}

/**
 * Renders a level-three heading by default so card titles participate in the document outline.
 * Use `render` when the surrounding page requires a different heading level or semantic element.
 */
function CardTitle({ className, render, ...props }: CardTitleProps) {
  return useRender({
    defaultTagName: "h3",
    props: mergeProps<"h3">(
      {
        className: cn(Object.values(twTitleStyles).join(" "), className),
      },
      props,
    ),
    render,
    state: { slot: "card-title" },
  });
}

/**
 * Renders a paragraph by default for descriptive card copy.
 * Use `render` when the description contains a different semantic structure.
 */
function CardDescription({ className, render, ...props }: CardDescriptionProps) {
  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(
      {
        className: cn(Object.values(twDescriptionStyles).join(" "), className),
      },
      props,
    ),
    render,
    state: { slot: "card-description" },
  });
}

function CardAction({ className, variant, ...props }: CardActionProps) {
  return <div data-slot="card-action" {...props} className={cn(cardActionVariants({ variant }), className)} />;
}

function CardFooter({ className, variant, ...props }: CardFooterProps) {
  return <div data-slot="card-footer" {...props} className={cn(cardFooterVariants({ variant }), className)} />;
}

export {
  Card,
  CardLink,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  cardActionVariants,
  cardVariants,
  cardContentVariants,
  cardFooterVariants,
  twActionVariant,
  twContentVariant,
  twFooterVariant,
  twRadius,
  twVariant,
  twSize,
};
export default Card;
