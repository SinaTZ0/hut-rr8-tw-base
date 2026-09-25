import { useDirection } from "@base-ui/react/direction-provider";
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cn } from "cn";
import { ChevronDown } from "lucide-react";
import {
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
} from "./navigation-menu.styles";

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
          <NavigationMenuPrimitive.Popup
            data-slot="navigation-menu-popup"
            className={cn(Object.values(twPopupStyles).join(" "))}
          >
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
