import { useDirection } from "@base-ui/react/direction-provider";
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cn } from "cn";
import { ChevronDown } from "lucide-react";
import { defineStyles } from "./styles";

/*===== Root and List Styles =====*/

const twRootStyles = defineStyles({
  layout: "relative flex max-w-max flex-1 items-center justify-center",
});
const twListStyles = defineStyles({
  layout: "flex flex-1 list-none items-center justify-center gap-0.5",
});
const twItemStyles = defineStyles({
  layout: "relative",
});

/*===== Trigger and Link Styles =====*/

const twTriggerStyles = defineStyles({
  layout: "group/navigation-menu-trigger inline-flex w-max items-center justify-center",
  geometry: "min-h-11 rounded-lg px-3 py-1.5",
  typography: "text-[13px] font-medium",
  interaction: "transition-colors outline-none",
  hover: "hover:bg-muted",
  focus: "focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1",
  state: "data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted",
  disabled:
    "disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
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
  interaction: "transition-colors outline-none",
  hover: "hover:bg-muted",
  focus: "focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1",
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
  layout: "relative origin-(--transform-origin)",
  geometry: "h-(--popup-height) w-(--popup-width) rounded-lg",
  appearance: "bg-popover text-popover-foreground shadow ring-1 ring-foreground/10",
  interaction:
    "transition-[opacity,transform,width,height,scale,translate] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none",
  state:
    "data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0",
  motion: "motion-reduce:scale-none motion-reduce:transition-none",
});

const twViewportStyles = defineStyles({
  layout: "relative size-full overflow-hidden",
});
const twIndicatorStyles = defineStyles({
  layout: "inline-flex items-center justify-center",
  geometry: "size-3",
  interaction: "transition-transform duration-300",
  state: "data-popup-open:rotate-180",
  motion: "motion-reduce:transition-none",
});

/*===== Root, List, and Item =====*/

export type NavigationMenuProps<Value = unknown> = NavigationMenuPrimitive.Root.Props<Value> &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align"> & {
    /** Set false when composing NavigationMenuPositioner explicitly inside the root. */
    positioner?: boolean;
  };
export type NavigationMenuListProps = NavigationMenuPrimitive.List.Props;
export type NavigationMenuItemProps = NavigationMenuPrimitive.Item.Props;
export type NavigationMenuTriggerProps = NavigationMenuPrimitive.Trigger.Props;
export type NavigationMenuContentProps = NavigationMenuPrimitive.Content.Props;
export type NavigationMenuLinkProps = NavigationMenuPrimitive.Link.Props;
export type NavigationMenuPositionerProps = NavigationMenuPrimitive.Positioner.Props;
export type NavigationMenuViewportProps = NavigationMenuPrimitive.Viewport.Props;
export type NavigationMenuIndicatorProps = NavigationMenuPrimitive.Icon.Props;

function NavigationMenu<Value>({
  align = "start",
  positioner = true,
  className,
  children,
  ...props
}: NavigationMenuProps<Value>) {
  const classes = Object.values(twRootStyles).join(" ");
  return (
    <NavigationMenuPrimitive.Root<Value>
      data-slot="navigation-menu"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    >
      {children}
      {positioner && <NavigationMenuPositioner align={align} />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }: NavigationMenuListProps) {
  const classes = Object.values(twListStyles).join(" ");
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

function NavigationMenuItem({ className, ...props }: NavigationMenuItemProps) {
  const classes = Object.values(twItemStyles).join(" ");
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

/*===== Trigger, Content, and Link =====*/

function NavigationMenuTrigger({ className, children, ...props }: NavigationMenuTriggerProps) {
  const classes = Object.values(twTriggerStyles).join(" ");
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    >
      {children} <ChevronDown aria-hidden="true" className={cn(Object.values(twIconStyles).join(" "))} />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }: NavigationMenuContentProps) {
  const classes = Object.values(twContentStyles).join(" ");
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

function NavigationMenuLink({ className, ...props }: NavigationMenuLinkProps) {
  const classes = Object.values(twLinkStyles).join(" ");
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

/*===== Positioner, Popup, and Viewport =====*/

/**
 * Keeps Base UI's portal and RTL anchor positioning. Use positioner={false} on the root to place this explicitly.
 * Explicit children replace the default popup/viewport when composing a custom positioner.
 */
function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  children,
  ...props
}: NavigationMenuPositionerProps) {
  const direction = useDirection();
  const classes = Object.values(twPositionerStyles).join(" ");
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        data-slot="navigation-menu-positioner"
        side={side}
        sideOffset={sideOffset}
        align={align}
        dir={direction}
        {...props}
        className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
      >
        {children ?? (
          <NavigationMenuPrimitive.Popup className={cn(Object.values(twPopupStyles).join(" "))}>
            <NavigationMenuViewport />
          </NavigationMenuPrimitive.Popup>
        )}
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

function NavigationMenuViewport({ className, ...props }: NavigationMenuViewportProps) {
  const classes = Object.values(twViewportStyles).join(" ");
  return (
    <NavigationMenuPrimitive.Viewport
      data-slot="navigation-menu-viewport"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

/** Shadcn's Base UI indicator is a trigger icon, rather than a separately positioned popup pointer. */
function NavigationMenuIndicator({ className, children, ...props }: NavigationMenuIndicatorProps) {
  const classes = Object.values(twIndicatorStyles).join(" ");
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    >
      {children ?? <ChevronDown aria-hidden="true" className="size-3" />}
    </NavigationMenuPrimitive.Icon>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPositioner,
  NavigationMenuViewport,
  NavigationMenuIndicator,
};
export default NavigationMenu;
