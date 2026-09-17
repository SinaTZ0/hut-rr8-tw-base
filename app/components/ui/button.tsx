import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

/*===== Visual Variants =====*/

const twButtonVariantClasses = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  outline:
    "border-border bg-background text-foreground shadow-sm hover:border-primary hover:bg-primary hover:text-primary-foreground aria-expanded:border-primary aria-expanded:bg-primary aria-expanded:text-primary-foreground",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
  highlight: "bg-highlight text-highlight-foreground shadow-lg shadow-highlight/20 hover:bg-highlight/80",
  glass:
    "border-foreground/32 bg-foreground/9 text-foreground shadow-sm backdrop-blur-[10px] hover:border-foreground/45 hover:bg-foreground/16 focus-visible:border-foreground/65 focus-visible:ring-foreground/50",
  ghost: "text-foreground hover:bg-muted aria-expanded:bg-muted",
  destructive:
    "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
  link: "text-primary underline-offset-4 hover:underline",
} as const;

/*===== Sizes =====*/

// Hut's standard action is 48px tall; compact and prominent sizes share its spacing scale.
const twButtonSizeClasses = {
  xs: "min-h-8 gap-1.5 rounded-lg px-3 py-1 text-xs has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3.5",
  sm: "min-h-10 gap-2 px-4 py-2 text-xs has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
  default: "min-h-12 gap-2 px-5 py-2.5 has-data-[icon=inline-end]:pe-4 has-data-[icon=inline-start]:ps-4",
  lg: "min-h-14 gap-2.5 px-6 py-3 text-base has-data-[icon=inline-end]:pe-5 has-data-[icon=inline-start]:ps-5 [&_svg:not([class*='size-'])]:size-5",
  xl: "min-h-16 gap-3 px-8 py-4 text-base has-data-[icon=inline-end]:pe-6 has-data-[icon=inline-start]:ps-6 [&_svg:not([class*='size-'])]:size-5",
} as const;

const twButtonIconSizeClasses = {
  "icon-xs": "size-8 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
  "icon-sm": "size-10",
  icon: "size-12",
  "icon-lg": "size-14 [&_svg:not([class*='size-'])]:size-5",
  "icon-xl": "size-16 [&_svg:not([class*='size-'])]:size-5",
} as const;

/*===== Shared Styles =====*/

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-black whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform,translate] duration-200 outline-none select-none motion-safe:hover:not-aria-[haspopup]:-translate-y-0.5 motion-safe:active:not-aria-[haspopup]:translate-y-0 motion-reduce:transition-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: twButtonVariantClasses,
      size: {
        ...twButtonSizeClasses,
        ...twButtonIconSizeClasses,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/*===== Component =====*/

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants, twButtonVariantClasses, twButtonSizeClasses, twButtonIconSizeClasses };
