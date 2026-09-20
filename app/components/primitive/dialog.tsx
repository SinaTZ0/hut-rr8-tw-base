import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useDirection } from "@base-ui/react/direction-provider";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { defineStyles } from "./styles";

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
