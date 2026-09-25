import { defineStyles } from "../styles";

/*===== Root and List Styles =====*/

const twRootStyles = defineStyles({
  layout: "relative flex max-w-full flex-1 items-center justify-center",
});

const twListStyles = defineStyles({
  layout: "flex max-w-full flex-1 list-none flex-wrap items-center justify-center gap-0.5",
});

const twItemStyles = defineStyles({
  layout: "relative",
});

/*===== Trigger and Link Styles =====*/

const twTriggerStyles = defineStyles({
  layout: "group/navigation-menu-trigger inline-flex max-w-full items-center justify-center",
  geometry: "min-h-11 rounded-lg px-3 py-1.5",
  typography: "text-[13px] font-medium",
  interaction: "transition-[background-color,color] outline-none",
  hover: "hover:bg-muted",
  focus:
    "focus:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:outline-solid",
  state: "data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted",
  disabled:
    "disabled:pointer-events-none disabled:opacity-60 data-disabled:pointer-events-none data-disabled:opacity-60",
  motion: "motion-reduce:transition-none",
});

const twIconStyles = defineStyles({
  layout: "relative top-px ms-1",
  geometry: "size-3",
  interaction: "transition-transform duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180",
  motion: "motion-reduce:transition-none",
});

const twLinkStyles = defineStyles({
  // The header and popup have distinct roles; their existing typography needs no caller-facing axis.
  layout: "flex items-center gap-2 in-data-[slot=navigation-menu-content]:justify-between",
  geometry: "min-h-11 rounded-lg px-3 py-2 in-data-[slot=navigation-menu-content]:rounded-md",
  typography: "text-[13px] in-data-[slot=navigation-menu-content]:text-sm",
  interaction: "transition-[background-color,color] outline-none",
  hover: "hover:bg-muted",
  focus:
    "focus:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:outline-solid",
  state: "data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus:bg-muted",
  icon: "[&_svg:not([class*='size-'])]:size-4",
  motion: "motion-reduce:transition-none",
});

/*===== Content and Portal Styles =====*/

const twContentStyles = defineStyles({
  geometry: "h-full w-auto p-4",
  interaction: "transition-[opacity,transform,translate] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]",
  state: "data-ending-style:opacity-0 data-starting-style:opacity-0",
  stateTranslation:
    "data-ending-style:data-[activation-direction=left]:translate-x-1/2 data-starting-style:data-[activation-direction=left]:-translate-x-1/2 data-ending-style:data-[activation-direction=right]:-translate-x-1/2 data-starting-style:data-[activation-direction=right]:translate-x-1/2",
  stateRtlTranslation:
    "rtl:data-ending-style:data-[activation-direction=left]:-translate-x-1/2 rtl:data-starting-style:data-[activation-direction=left]:translate-x-1/2 rtl:data-ending-style:data-[activation-direction=right]:translate-x-1/2 rtl:data-starting-style:data-[activation-direction=right]:-translate-x-1/2",
  motion: "motion-reduce:translate-none motion-reduce:transition-none",
});

const twPositionerStyles = defineStyles({
  layout: "isolate z-50",
  geometry: "h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)",
  interaction: "transition-[top,left,right,bottom] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]",
  state: "data-instant:transition-none",
  motion: "motion-reduce:transition-none",
});

const twPopupStyles = defineStyles({
  layout: "relative max-h-[calc(100dvh-2rem)] origin-(--transform-origin) overflow-y-auto overscroll-contain",
  geometry: "h-(--popup-height) w-(--popup-width) rounded-lg",
  appearance: "border border-border bg-popover text-popover-foreground shadow-lg",
  interaction:
    "transition-[opacity,transform,width,height,scale,translate] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none",
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:outline-solid",
  state:
    "data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0",
  motion: "motion-reduce:scale-none motion-reduce:transition-none",
});

const twViewportStyles = defineStyles({
  layout: "relative size-full max-h-[calc(100dvh-2rem)] overflow-x-hidden overflow-y-auto overscroll-contain",
});

const twIndicatorStyles = defineStyles({
  layout: "inline-flex items-center justify-center",
  geometry: "size-3",
  interaction: "transition-transform duration-300",
  state: "data-popup-open:rotate-180",
  motion: "motion-reduce:transition-none",
});

export {
  twRootStyles,
  twListStyles,
  twItemStyles,
  twTriggerStyles,
  twIconStyles,
  twLinkStyles,
  twContentStyles,
  twPositionerStyles,
  twPopupStyles,
  twViewportStyles,
  twIndicatorStyles,
};
