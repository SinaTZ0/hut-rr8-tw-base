import * as React from "react";
import { cn } from "cn";
import { twTextareaStyles } from "./textarea.styles";

/*===== Textarea =====*/

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const classes = Object.values(twTextareaStyles).join(" ");

  return <textarea data-slot="textarea" className={cn(classes, className)} {...props} />;
}

export { Textarea };
