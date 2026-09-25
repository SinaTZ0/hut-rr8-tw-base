import { cva } from "class-variance-authority";
import { composeStyles, defineStyles } from "../styles";

// Keep style exports outside the component module so Vite can Fast Refresh its React exports.

/*===== Select Styles =====*/

const twNativeSelectStyles = defineStyles({
  layout: "w-full max-w-full min-w-0",
  geometry: "h-11 rounded-lg border py-2 ps-3 pe-10",
  typography: "text-sm leading-6",
  appearance:
    "border-primary/70 bg-transparent text-foreground selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50",
  interaction:
    "appearance-none transition-[background-color,border-color,box-shadow] outline-none select-none hover:bg-muted/40",
  focus: "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  disabled:
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:text-muted-foreground dark:disabled:bg-input/80",
  state:
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  picker:
    "supports-[appearance:base-select]:[appearance:base-select] supports-[appearance:base-select]:[&::picker(select)]:max-h-[min(24rem,70dvh)] supports-[appearance:base-select]:[&::picker(select)]:[appearance:base-select] supports-[appearance:base-select]:[&::picker(select)]:rounded-xl supports-[appearance:base-select]:[&::picker(select)]:border supports-[appearance:base-select]:[&::picker(select)]:border-border supports-[appearance:base-select]:[&::picker(select)]:bg-card supports-[appearance:base-select]:[&::picker(select)]:p-2 supports-[appearance:base-select]:[&::picker(select)]:text-card-foreground supports-[appearance:base-select]:[&::picker(select)]:shadow-[0_0_32px_6px_color-mix(in_oklab,var(--color-foreground)_20%,transparent)] supports-[appearance:base-select]:dark:[&::picker(select)]:shadow-[0_0_32px_6px_rgb(0_0_0_/_0.55)] supports-[appearance:base-select]:[&::picker-icon]:hidden",
  motion: "motion-reduce:transition-none",
});

const twSize = defineStyles({
  default: {},
  sm: {
    geometry: "data-[size=sm]:h-10 data-[size=sm]:rounded-md data-[size=sm]:py-1.5",
  },
});

/*===== Class Composition =====*/

const nativeSelectVariants = cva(Object.values(twNativeSelectStyles), {
  variants: {
    size: composeStyles(twSize),
  },
  defaultVariants: {
    size: "default",
  },
});

/*===== Wrapper Styles =====*/

const twNativeSelectWrapperStyles = defineStyles({
  layout: "group/native-select relative w-fit max-w-full has-[select:disabled]:opacity-60",
});

/*===== Icon and Option Styles =====*/

const twNativeSelectIconStyles = defineStyles({
  layout: "pointer-events-none absolute end-3 top-1/2 -translate-y-1/2",
  geometry: "size-4",
  appearance: "text-muted-foreground",
  interaction: "select-none",
});

const twNativeSelectOptionStyles = defineStyles({
  geometry: "rounded-lg border-b border-border/70 px-3 py-2 last:border-b-0",
  appearance: "bg-[Canvas] text-[CanvasText]",
  interaction: "transition-colors",
  hover: "hover:bg-primary/10",
  focus: "focus-visible:bg-primary/10",
});

export {
  nativeSelectVariants,
  twSize,
  twNativeSelectWrapperStyles,
  twNativeSelectIconStyles,
  twNativeSelectOptionStyles,
};
