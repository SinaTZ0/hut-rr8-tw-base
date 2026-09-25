import { defineStyles } from "../styles";

/*===== Static Styles =====*/

const twOverlayStyles = defineStyles({
  layout: "fixed inset-0 z-50",
  appearance: "bg-black/20 supports-backdrop-filter:backdrop-blur-xs",
  interaction: "transition-opacity duration-150",
  state: "data-ending-style:opacity-0 data-starting-style:opacity-0",
  motion: "motion-reduce:transition-none",
});

const twContentStyles = defineStyles({
  layout: "fixed inset-y-0 right-0 z-50 flex h-full max-h-dvh flex-col gap-4 overflow-y-auto overscroll-contain",
  appearance: "border-s border-border bg-popover bg-clip-padding text-popover-foreground shadow-lg",
  typography: "text-sm",
  interaction: "transition-[opacity,translate] duration-200 ease-in-out",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring focus-visible:outline-solid",
  state:
    "data-ending-style:translate-x-10 data-ending-style:opacity-0 data-starting-style:translate-x-10 data-starting-style:opacity-0 rtl:data-ending-style:-translate-x-10 rtl:data-starting-style:-translate-x-10",
  motion: "motion-reduce:transition-none",
});

const twHeaderStyles = defineStyles({
  layout: "flex flex-col gap-0.5",
  geometry: "p-6",
  appearance: "border-b border-border",
});

const twTitleStyles = defineStyles({
  typography: "font-heading text-base font-medium",
  appearance: "text-foreground",
});

const twDescriptionStyles = defineStyles({
  typography: "text-sm",
  appearance: "text-muted-foreground",
});

const twFooterStyles = defineStyles({
  layout: "flex flex-col gap-2",
  geometry: "p-6",
  appearance: "border-t border-border",
});

export { twOverlayStyles, twContentStyles, twHeaderStyles, twTitleStyles, twDescriptionStyles, twFooterStyles };
