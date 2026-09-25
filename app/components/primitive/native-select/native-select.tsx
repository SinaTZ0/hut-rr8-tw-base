import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { ChevronDownIcon } from "lucide-react";
import {
  nativeSelectVariants,
  twNativeSelectWrapperStyles,
  twNativeSelectIconStyles,
  twNativeSelectOptionStyles,
} from "./native-select.styles";

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

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
