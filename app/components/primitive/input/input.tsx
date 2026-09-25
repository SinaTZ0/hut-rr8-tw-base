import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";
import { twInputStyles } from "./input.styles";

/*===== Input =====*/

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const classes = Object.values(twInputStyles).join(" ");

  return <InputPrimitive type={type} data-slot="input" className={cn(classes, className)} {...props} />;
}

export { Input };
