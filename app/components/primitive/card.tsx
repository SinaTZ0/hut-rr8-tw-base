import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { composeStyles, defineStyles } from "./styles";

/*===== Surface Styles =====*/

const twCardStyles = defineStyles({
  layout: "group/card flex flex-col overflow-hidden has-[>[data-slot=card-link]]:overflow-visible",
  geometry: "rounded-2xl",
  typography: "text-sm",
  appearance: "bg-card text-card-foreground ring-1 ring-border",
});

/*===== Whole-Card Link Styles =====*/

const twLinkStyles = defineStyles({
  layout: "group block overflow-hidden",
  geometry: "rounded-[inherit]",
  hover: "hover:bg-secondary/35 hover:shadow-md hover:shadow-primary/5",
  interaction: "transition-[background-color,box-shadow] duration-300",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring focus-visible:outline-solid",
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
const twFooterStyles = defineStyles({
  layout: "flex items-center",
  geometry: "p-4 sm:p-5",
  appearance: "border-t bg-muted/50",
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

/*===== Class Composition =====*/

const cardContentVariants = cva("", {
  variants: { size: composeStyles(twSize) },
  defaultVariants: { size: "default" },
});

/*===== Card =====*/

export type CardProps = ComponentProps<"div">;
export type CardLinkProps = ComponentProps<"a"> & { href: string };
export type CardContentProps = ComponentProps<"div"> & VariantProps<typeof cardContentVariants>;
export type CardHeaderProps = ComponentProps<"div">;
export type CardTitleProps = ComponentProps<"div">;
export type CardDescriptionProps = ComponentProps<"div">;
export type CardActionProps = ComponentProps<"div">;
export type CardFooterProps = ComponentProps<"div">;

function Card({ className, ...props }: CardProps) {
  return <div data-slot="card" {...props} className={cn(Object.values(twCardStyles).join(" "), className)} />;
}

function CardContent({ className, size, ...props }: CardContentProps) {
  return <div data-slot="card-content" {...props} className={cn(cardContentVariants({ size }), className)} />;
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

function CardTitle({ className, ...props }: CardTitleProps) {
  return <div data-slot="card-title" {...props} className={cn(Object.values(twTitleStyles).join(" "), className)} />;
}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div
      data-slot="card-description"
      {...props}
      className={cn(Object.values(twDescriptionStyles).join(" "), className)}
    />
  );
}

function CardAction({ className, ...props }: CardActionProps) {
  return <div data-slot="card-action" {...props} className={cn(Object.values(twActionStyles).join(" "), className)} />;
}

function CardFooter({ className, ...props }: CardFooterProps) {
  return <div data-slot="card-footer" {...props} className={cn(Object.values(twFooterStyles).join(" "), className)} />;
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
  cardContentVariants,
  twSize,
};
export default Card;
