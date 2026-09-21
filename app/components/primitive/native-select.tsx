import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { ChevronDownIcon } from "lucide-react";
import { composeStyles, defineStyles } from "./styles";

/*===== Wrapper Styles =====*/

const twNativeSelectWrapperStyles = defineStyles({
  layout: "group/native-select relative w-fit max-w-full",
});

/*===== Select Styles =====*/

const twNativeSelectStyles = defineStyles({
  layout: "w-full max-w-full min-w-0",
  geometry: "h-8 rounded-lg border py-1 ps-2.5 pe-8",
  typography: "text-sm",
  appearance:
    "border-primary/70 bg-transparent selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50",
  interaction: "appearance-none transition-colors outline-none select-none",
  focus: "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring",
  disabled:
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:text-muted-foreground dark:disabled:bg-input/80",
  state:
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  motion: "motion-reduce:transition-none",
});

const twSize = defineStyles({
  default: {},
  sm: {
    geometry: "data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5",
  },
});

/*===== Icon and Option Styles =====*/

const twNativeSelectIconStyles = defineStyles({
  layout: "pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2",
  geometry: "size-4",
  appearance: "text-muted-foreground",
  interaction: "select-none",
});

const twNativeSelectOptionStyles = defineStyles({
  appearance: "bg-[Canvas] text-[CanvasText]",
});

/*===== Class Composition =====*/

const nativeSelectVariants = cva(Object.values(twNativeSelectStyles), {
  variants: {
    size: composeStyles(twSize),
  },
  defaultVariants: {
    size: "default",
  },
});

/*===== Native Select =====*/

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: NonNullable<VariantProps<typeof nativeSelectVariants>["size"]>;
};

function NativeSelect({ className, size = "default", ...props }: NativeSelectProps) {
  return (
    <div
      className={cn(Object.values(twNativeSelectWrapperStyles).join(" "), className)}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select data-slot="native-select" data-size={size} className={cn(nativeSelectVariants({ size }))} {...props} />
      <ChevronDownIcon
        className={cn(Object.values(twNativeSelectIconStyles).join(" "))}
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn(Object.values(twNativeSelectOptionStyles).join(" "), className)}
      {...props}
    />
  );
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(Object.values(twNativeSelectOptionStyles).join(" "), className)}
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption, nativeSelectVariants, twSize };
