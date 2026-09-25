import { defineStyles } from "../styles";

/*===== Static Styles =====*/

const twRootStyles = defineStyles({
  layout: "flex w-full flex-col",
});

const twItemStyles = defineStyles({
  appearance: "not-last:border-b not-last:border-border",
});

const twHeaderStyles = defineStyles({
  layout: "flex",
});

const twTriggerStyles = defineStyles({
  layout: "group/accordion-trigger relative flex flex-1 items-center justify-between",
  geometry: "min-h-11 rounded-lg border border-transparent px-3 py-2",
  typography: "text-start text-base font-medium",
  interaction: "transition-[background-color,border-color,color] outline-none",
  hover: "hover:bg-muted/70 hover:underline",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:outline-solid",
  state: "aria-expanded:bg-muted/50",
  disabled:
    "disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60 data-disabled:pointer-events-none data-disabled:opacity-60",
  motion: "motion-reduce:transition-none",
});

const twIconStyles = defineStyles({
  layout: "ms-auto shrink-0",
  geometry: "size-4",
  appearance: "text-muted-foreground",
  interaction: "pointer-events-none",
});

const twPanelStyles = defineStyles({
  layout: "overflow-hidden",
  typography: "text-sm",
  geometry: "h-(--accordion-panel-height)",
  state: "data-ending-style:h-0 data-starting-style:h-0",
  interaction: "transition-[height] duration-200 ease-out",
  motion: "motion-reduce:transition-none",
});

const twContentStyles = defineStyles({
  geometry: "pb-2.5",
});

export { twRootStyles, twItemStyles, twHeaderStyles, twTriggerStyles, twIconStyles, twPanelStyles, twContentStyles };
