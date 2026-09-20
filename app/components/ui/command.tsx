"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { CheckIcon, SearchIcon } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { InputGroup, InputGroupAddon } from "~/components/ui/input-group";

const commandVariants = cva(
  "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
  {
    variants: {
      variant: {
        default: "",
        dialog: "rounded-none! p-3",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const commandInputGroupVariants = cva(
  "h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:ps-2!",
  {
    variants: { size: { default: "", lg: "h-12!" } },
    defaultVariants: { size: "default" },
  },
);

const commandInputVariants = cva("w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50", {
  variants: { size: { default: "", lg: "min-h-11 px-2" } },
  defaultVariants: { size: "default" },
});

const commandItemVariants = cva(
  "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
  {
    variants: { size: { default: "", lg: "min-h-11 gap-3 px-3 leading-6" } },
    defaultVariants: { size: "default" },
  },
);

function Command({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof CommandPrimitive> & VariantProps<typeof commandVariants>) {
  return <CommandPrimitive data-slot="command" className={cn(commandVariants({ variant }), className)} {...props} />;
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0", className)}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  size,
  ...props
}: Omit<React.ComponentProps<typeof CommandPrimitive.Input>, "size"> & VariantProps<typeof commandInputVariants>) {
  return (
    <div data-slot="command-input-wrapper" className="p-1 pb-0">
      <InputGroup className={cn(commandInputGroupVariants({ size }))}>
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(commandInputVariants({ size }), className)}
          {...props}
        />
        <InputGroupAddon>
          <SearchIcon className="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none", className)}
      {...props}
    />
  );
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  );
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  children,
  size,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item> & VariantProps<typeof commandItemVariants>) {
  return (
    <CommandPrimitive.Item data-slot="command-item" className={cn(commandItemVariants({ size }), className)} {...props}>
      {children}
      <CheckIcon className="ms-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
