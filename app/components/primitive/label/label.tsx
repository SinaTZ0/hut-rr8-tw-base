"use client";

import * as React from "react";
import { cn } from "cn";
import { twLabelStyles } from "./label.styles";

/*===== Label =====*/

function Label({ className, ...props }: React.ComponentProps<"label">) {
  const classes = Object.values(twLabelStyles).join(" ");

  return <label data-slot="label" className={cn(classes, className)} {...props} />;
}

export { Label };
