"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { twThumbStyles, switchVariants } from "./switch.styles";

/*===== Switch =====*/

export type SwitchProps = SwitchPrimitive.Root.Props & {
  size?: NonNullable<VariantProps<typeof switchVariants>["size"]>;
};

/** Styles Base UI's switch root while preserving its refs, semantics, and state callbacks. */
function Switch({ className, size = "default", ...props }: SwitchProps) {
  const classes = switchVariants({ size });

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className={Object.values(twThumbStyles).join(" ")} />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
