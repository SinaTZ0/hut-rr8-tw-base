import { defineStyles } from "../styles";

/*===== Label Styles =====*/

const twLabelStyles = defineStyles({
  layout: "flex min-w-0 items-center gap-2",
  typography: "text-sm leading-snug font-medium wrap-break-word",
  interaction: "select-none",
  disabled:
    "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:text-muted-foreground",
});

export { twLabelStyles };
