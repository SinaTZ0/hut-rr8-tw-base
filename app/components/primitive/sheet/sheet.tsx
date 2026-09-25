import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { useDirection } from "@base-ui/react/direction-provider";
import { cn } from "cn";
import type { ComponentProps } from "react";
import {
  twOverlayStyles,
  twContentStyles,
  twHeaderStyles,
  twTitleStyles,
  twDescriptionStyles,
  twFooterStyles,
} from "./sheet.styles";

/*===== Root, Trigger, and Close =====*/

export type SheetProps<Payload = unknown> = SheetPrimitive.Root.Props<Payload>;
export type SheetTriggerProps<Payload = unknown> = ComponentProps<typeof SheetPrimitive.Trigger<Payload>>;
export type SheetCloseProps = SheetPrimitive.Close.Props;
export type SheetContentProps = SheetPrimitive.Popup.Props & {
  /** Customizes the built-in backdrop, including state-based className and refs. */
  overlayProps?: SheetOverlayProps;
};
export type SheetPortalProps = SheetPrimitive.Portal.Props;
export type SheetOverlayProps = SheetPrimitive.Backdrop.Props;
export type SheetHeaderProps = ComponentProps<"div">;
export type SheetFooterProps = ComponentProps<"div">;
export type SheetTitleProps = SheetPrimitive.Title.Props;
export type SheetDescriptionProps = SheetPrimitive.Description.Props;

function Sheet<Payload>(props: SheetProps<Payload>) {
  return <SheetPrimitive.Root<Payload> {...props} />;
}

function SheetTrigger<Payload>(props: SheetTriggerProps<Payload>) {
  return <SheetPrimitive.Trigger<Payload> data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: SheetCloseProps) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

/*===== Portaled Right Drawer =====*/

function SheetPortal(props: SheetPortalProps) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: SheetOverlayProps) {
  const classes = Object.values(twOverlayStyles).join(" ");
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

/**
 * The homepage drawer stays physically right-aligned in RTL.
 * Consumers supply width, an accessible title, overlayProps, and explicit close controls; Base UI owns modal behavior.
 */
function SheetContent({ className, children, overlayProps, ...props }: SheetContentProps) {
  const direction = useDirection();
  const classes = Object.values(twContentStyles).join(" ");

  return (
    <SheetPortal>
      <SheetOverlay {...overlayProps} />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        dir={direction}
        {...props}
        className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
      >
        {children}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

/*===== Header and Accessible Naming =====*/

function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return <div data-slot="sheet-header" {...props} className={cn(Object.values(twHeaderStyles).join(" "), className)} />;
}

function SheetFooter({ className, ...props }: SheetFooterProps) {
  return <div data-slot="sheet-footer" {...props} className={cn(Object.values(twFooterStyles).join(" "), className)} />;
}

function SheetTitle({ className, ...props }: SheetTitleProps) {
  const classes = Object.values(twTitleStyles).join(" ");
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  const classes = Object.values(twDescriptionStyles).join(" ");
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
export default Sheet;
