import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import {
  twLinkStyles,
  twHeaderStyles,
  twTitleStyles,
  twDescriptionStyles,
  cardContentVariants,
  cardVariants,
  cardActionVariants,
  cardFooterVariants,
} from "./card.styles";

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

export { Card, CardLink, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter };
export default Card;
