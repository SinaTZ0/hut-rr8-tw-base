import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
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
} from "./dialog.styles";

/*===== Root, Trigger, and Close =====*/

export type DialogProps<Payload = unknown> = DialogPrimitive.Root.Props<Payload>;
export type DialogTriggerProps<Payload = unknown> = ComponentProps<typeof DialogPrimitive.Trigger<Payload>>;
export type DialogCloseProps = DialogPrimitive.Close.Props;
export type DialogContentProps = DialogPrimitive.Popup.Props & {
  /** Customizes the built-in backdrop, including state-based className and refs. */
  overlayProps?: DialogOverlayProps;
};
export type DialogPortalProps = DialogPrimitive.Portal.Props;
export type DialogOverlayProps = DialogPrimitive.Backdrop.Props;
export type DialogHeaderProps = ComponentProps<"div">;
export type DialogFooterProps = ComponentProps<"div">;
export type DialogTitleProps = DialogPrimitive.Title.Props;
export type DialogDescriptionProps = DialogPrimitive.Description.Props;

function Dialog<Payload>(props: DialogProps<Payload>) {
  return <DialogPrimitive.Root<Payload> {...props} />;
}

function DialogTrigger<Payload>(props: DialogTriggerProps<Payload>) {
  return <DialogPrimitive.Trigger<Payload> data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/*===== Portaled Content =====*/

function DialogPortal(props: DialogPortalProps) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  const classes = Object.values(twOverlayStyles).join(" ");
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

/**
 * Styles Base UI's popup without replacing its focus, dismissal, or scroll handling.
 * Include a DialogTitle or an explicit accessible name; close buttons are composed explicitly.
 * className controls popup width and overlayProps styles the backdrop.
 */
function DialogContent({ className, children, overlayProps, ...props }: DialogContentProps) {
  const direction = useDirection();
  const classes = Object.values(twContentStyles).join(" ");

  return (
    <DialogPortal>
      <DialogOverlay {...overlayProps} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        dir={direction}
        {...props}
        className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

/*===== Header and Accessible Naming =====*/

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div data-slot="dialog-header" {...props} className={cn(Object.values(twHeaderStyles).join(" "), className)} />
  );
}

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div data-slot="dialog-footer" {...props} className={cn(Object.values(twFooterStyles).join(" "), className)} />
  );
}

function DialogTitle({ className, ...props }: DialogTitleProps) {
  const classes = Object.values(twTitleStyles).join(" ");
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  const classes = Object.values(twDescriptionStyles).join(" ");
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
export default Dialog;
