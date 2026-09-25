import { defineStyles } from "../styles";

/*===== Static Styles =====*/

const twOverlayStyles = defineStyles({
  layout: "fixed inset-0 isolate z-50",
  appearance: "bg-black/20 supports-backdrop-filter:backdrop-blur-xs",
  interaction: "duration-100",
  state: "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
  motion: "motion-reduce:animate-none motion-reduce:transition-none",
});

const twContentStyles = defineStyles({
  layout:
    "fixed start-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto overscroll-contain rtl:translate-x-1/2",
  geometry: "w-full max-w-[calc(100%-2rem)] rounded-2xl",
  typography: "text-sm",
  appearance: "border border-border bg-popover text-popover-foreground shadow-lg",
  interaction: "duration-100 outline-none",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring focus-visible:outline-solid",
  state:
    "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  motion: "motion-reduce:animate-none motion-reduce:transition-none",
});

const twHeaderStyles = defineStyles({
  layout: "flex items-center justify-between gap-2",
  geometry: "px-5 py-4",
  appearance: "border-b border-border",
});

const twTitleStyles = defineStyles({
  typography: "font-heading text-base leading-7 font-medium",
});

const twDescriptionStyles = defineStyles({
  typography: "text-xs",
  appearance: "text-muted-foreground",
});

const twFooterStyles = defineStyles({
  layout: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  geometry: "px-5 py-4",
  appearance: "border-t border-border bg-muted/50",
});

export { twOverlayStyles, twContentStyles, twHeaderStyles, twTitleStyles, twDescriptionStyles, twFooterStyles };
