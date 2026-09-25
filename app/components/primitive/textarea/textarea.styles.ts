import { defineStyles } from "../styles";

/*===== Textarea Styles =====*/

const twTextareaStyles = defineStyles({
  layout: "flex w-full",
  geometry: "field-sizing-content min-h-16 rounded-lg border px-2.5 py-2",
  typography: "text-base wrap-break-word md:text-sm",
  appearance: "border-primary/70 bg-transparent placeholder:text-muted-foreground dark:bg-input/30",
  interaction: "transition-colors outline-none",
  focus: "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring",
  disabled: "disabled:cursor-not-allowed disabled:bg-input/50 disabled:text-muted-foreground dark:disabled:bg-input/80",
  state:
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  motion: "motion-reduce:transition-none",
});

export { twTextareaStyles };
