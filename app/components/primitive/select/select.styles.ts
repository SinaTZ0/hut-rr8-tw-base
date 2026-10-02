import { cva } from "class-variance-authority";
import { composeStyles, defineStyles } from "../styles";

/*===== Trigger and Sizes =====*/

const twTriggerStyles = defineStyles({
  layout: "flex w-full min-w-0 items-center justify-between gap-2",
  geometry: "min-h-11 rounded-lg border px-3 py-2",
  typography: "text-start text-sm leading-6",
  appearance: "border-primary/70 bg-transparent text-foreground dark:bg-input/30",
  interaction: "transition-[background-color,border-color,box-shadow] outline-none select-none",
  hover: "hover:bg-muted/40 dark:hover:bg-input/50",
  focus: "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  disabled: "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-60",
  state:
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:aria-invalid:ring-destructive/40",
  motion: "motion-reduce:transition-none",
});

const twSize = defineStyles({
  default: {},
  sm: { geometry: "data-[size=sm]:min-h-10 data-[size=sm]:py-1.5" },
});

const selectTriggerVariants = cva(Object.values(twTriggerStyles), {
  variants: { size: composeStyles(twSize) },
  defaultVariants: { size: "default" },
});

const twValueStyles = defineStyles({
  layout: "min-w-0 flex-1",
  typography: "text-start wrap-break-word",
});

const twIconStyles = defineStyles({
  geometry: "size-4 shrink-0",
  appearance: "text-muted-foreground",
  interaction: "pointer-events-none",
});

/*===== Popup and Scrolling =====*/

const twPositionerStyles = defineStyles({ layout: "isolate z-50" });

const twContentStyles = defineStyles({
  layout: "relative isolate z-50 flex flex-col overflow-hidden",
  geometry:
    "max-h-[min(var(--available-height),24rem)] w-(--anchor-width) max-w-[min(var(--available-width),calc(100vw-2rem))] min-w-36 rounded-xl border",
  typography: "text-sm leading-6",
  appearance:
    "border-border bg-card text-card-foreground shadow-[0_0_32px_6px_color-mix(in_oklab,var(--color-foreground)_40%,transparent)] dark:shadow-[0_0_32px_6px_rgb(0_0_0_/_0.55)]",
  interaction: "origin-(--transform-origin) duration-100 outline-none",
  state:
    "data-[align-trigger=true]:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  motion: "motion-reduce:animate-none motion-reduce:transition-none",
});

const twListStyles = defineStyles({
  layout: "min-h-0 [scrollbar-gutter:stable] overflow-x-hidden overflow-y-auto overscroll-contain",
  geometry: "p-2",
  appearance: "[scrollbar-width:thin] [scrollbar-color:var(--color-muted-foreground)_transparent]",
});

const twScrollArrowStyles = defineStyles({
  layout: "z-10 flex shrink-0 items-center justify-center",
  geometry: "min-h-6 w-full",
  appearance: "bg-card",
  interaction: "cursor-default",
});
const twScrollUpStyles = defineStyles({ layout: "top-0" });
const twScrollDownStyles = defineStyles({ layout: "bottom-0" });
const twGlyphStyles = defineStyles({ geometry: "size-4" });

/*===== Items and Groups =====*/

const twItemStyles = defineStyles({
  layout: "relative flex items-center gap-2",
  geometry: "min-h-11 rounded-lg border-b py-2 ps-3 pe-9 last:border-b-0",
  typography: "text-start text-sm leading-6",
  appearance: "border-border/70",
  interaction: "cursor-default outline-none select-none",
  state: "data-highlighted:bg-primary/10 data-highlighted:text-card-foreground",
  disabled: "data-disabled:pointer-events-none data-disabled:opacity-50",
});

const twItemTextStyles = defineStyles({
  layout: "min-w-0 flex-1",
  typography: "wrap-break-word",
});

const twIndicatorStyles = defineStyles({
  layout: "pointer-events-none absolute end-3 flex items-center justify-center",
  geometry: "size-4",
});

const twGroupStyles = defineStyles({ geometry: "scroll-my-1" });
const twLabelStyles = defineStyles({
  geometry: "px-3 py-2",
  typography: "text-xs leading-6 font-medium",
  appearance: "text-muted-foreground",
});
const twSeparatorStyles = defineStyles({
  geometry: "my-1 h-px",
  appearance: "bg-border",
  interaction: "pointer-events-none",
});

export {
  selectTriggerVariants,
  twSize,
  twValueStyles,
  twIconStyles,
  twPositionerStyles,
  twContentStyles,
  twListStyles,
  twScrollArrowStyles,
  twScrollUpStyles,
  twScrollDownStyles,
  twGlyphStyles,
  twItemStyles,
  twItemTextStyles,
  twIndicatorStyles,
  twGroupStyles,
  twLabelStyles,
  twSeparatorStyles,
};
