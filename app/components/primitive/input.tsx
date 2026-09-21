import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";
import { defineStyles } from "./styles";

/*===== Input Styles =====*/

const twInputStyles = defineStyles({
  layout: "w-full min-w-0",
  geometry: "min-h-10 rounded-lg border px-2.5 py-1 file:inline-flex file:h-6 file:border-0",
  typography: "text-base file:text-sm file:font-medium md:text-sm",
  appearance:
    "border-primary/70 bg-transparent file:bg-transparent file:text-foreground placeholder:text-muted-foreground dark:bg-input/30",
  interaction: "transition-colors outline-none",
  focus: "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  disabled: "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 dark:disabled:bg-input/80",
  state:
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40",
  motion: "motion-reduce:transition-none",
});

/*===== Input =====*/

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const classes = Object.values(twInputStyles).join(" ");

  return <InputPrimitive type={type} data-slot="input" className={cn(classes, className)} {...props} />;
}

export { Input };
