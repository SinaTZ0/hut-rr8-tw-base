import { cva } from "class-variance-authority";
import { composeStyles, defineStyles } from "../styles";

/*===== Root Styles =====*/

const twSharedStyles = defineStyles({
  layout: "peer group/switch relative inline-flex shrink-0 items-center",
  geometry: "rounded-full border border-foreground/60 after:absolute after:-inset-x-3 after:-inset-y-2",
  interaction: "transition-all outline-none motion-reduce:transition-none",
  focus:
    "group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring",
  state:
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80",
  disabled:
    "data-readonly:cursor-not-allowed data-readonly:opacity-80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
});

/*===== Size Styles =====*/

const twSize = defineStyles({
  default: {
    geometry: "data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]",
  },
  sm: {
    geometry: "data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
  },
  lg: {
    geometry: "data-[size=lg]:h-6 data-[size=lg]:w-10",
  },
  xl: {
    geometry: "data-[size=xl]:h-7 data-[size=xl]:w-12",
  },
});

/*===== Thumb Styles =====*/

const twThumbStyles = defineStyles({
  layout: "pointer-events-none block",
  geometry:
    "rounded-full ring-0 group-data-[size=default]/switch:size-4 group-data-[size=lg]/switch:size-5 group-data-[size=sm]/switch:size-3 group-data-[size=xl]/switch:size-6 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=lg]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=xl]/switch:data-checked:translate-x-[calc(100%-2px)] rtl:group-data-[size=default]/switch:data-checked:-translate-x-[calc(100%-2px)] rtl:group-data-[size=lg]/switch:data-checked:-translate-x-[calc(100%-2px)] rtl:group-data-[size=sm]/switch:data-checked:-translate-x-[calc(100%-2px)] rtl:group-data-[size=xl]/switch:data-checked:-translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=lg]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 group-data-[size=xl]/switch:data-unchecked:translate-x-0 rtl:group-data-[size=default]/switch:data-unchecked:-translate-x-0 rtl:group-data-[size=lg]/switch:data-unchecked:-translate-x-0 rtl:group-data-[size=sm]/switch:data-unchecked:-translate-x-0 rtl:group-data-[size=xl]/switch:data-unchecked:-translate-x-0",
  appearance: "bg-background dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground",
  interaction: "transition-transform motion-reduce:transition-none",
});

/*===== Class Composition =====*/

const switchVariants = cva(Object.values(twSharedStyles), {
  variants: {
    size: composeStyles(twSize),
  },
  defaultVariants: {
    size: "default",
  },
});

export { switchVariants, twSize, twThumbStyles };
