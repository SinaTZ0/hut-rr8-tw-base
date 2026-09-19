import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "cn";
import { ChevronDown, ChevronUp } from "lucide-react";
import { defineStyles } from "./styles";

/*===== Static Styles =====*/

const twRootStyles = defineStyles({
  layout: "flex w-full flex-col",
});
const twItemStyles = defineStyles({
  appearance: "not-last:border-b",
});
const twHeaderStyles = defineStyles({
  layout: "flex",
});

const twTriggerStyles = defineStyles({
  layout: "group/accordion-trigger relative flex flex-1 items-center justify-between",
  geometry: "min-h-14 rounded-lg border border-transparent py-2.5",
  typography: "text-start text-base font-medium",
  interaction: "transition-colors outline-none",
  hover: "hover:underline",
  focus: "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  disabled:
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
  motion: "motion-reduce:transition-none",
});

const twIconStyles = defineStyles({
  layout: "ms-auto shrink-0",
  geometry: "size-4",
  appearance: "text-muted-foreground",
  interaction: "pointer-events-none",
});

const twPanelStyles = defineStyles({
  layout: "overflow-hidden",
  typography: "text-sm",
  geometry: "h-(--accordion-panel-height)",
  state: "data-ending-style:h-0 data-starting-style:h-0",
  interaction: "transition-[height] duration-200 ease-out",
  motion: "motion-reduce:transition-none",
});

const twContentStyles = defineStyles({
  geometry: "pb-2.5",
});

/*===== Root and Item =====*/

export type AccordionProps<Value = unknown> = AccordionPrimitive.Root.Props<Value>;
export type AccordionItemProps = AccordionPrimitive.Item.Props;
export type AccordionTriggerProps = AccordionPrimitive.Trigger.Props;
export type AccordionContentProps = AccordionPrimitive.Panel.Props;

function Accordion<Value>({ className, ...props }: AccordionProps<Value>) {
  const classes = Object.values(twRootStyles).join(" ");
  return (
    <AccordionPrimitive.Root<Value>
      data-slot="accordion"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionItemProps) {
  const classes = Object.values(twItemStyles).join(" ");
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

/*===== Trigger =====*/

function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const classes = Object.values(twTriggerStyles).join(" ");
  const iconClasses = Object.values(twIconStyles).join(" ");

  return (
    <AccordionPrimitive.Header className={cn(Object.values(twHeaderStyles).join(" "))}>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        {...props}
        className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
      >
        {children}
        <ChevronDown
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          className={cn(iconClasses, "group-aria-expanded/accordion-trigger:hidden")}
        />
        <ChevronUp
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          className={cn(iconClasses, "hidden group-aria-expanded/accordion-trigger:inline")}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/*===== Content =====*/

/**
 * Keeps Base UI's measured-height transition on the panel and padding inside it.
 * className and render target the panel, including state-based class callbacks.
 */
function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const classes = Object.values(twPanelStyles).join(" ");

  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    >
      <div className={cn(Object.values(twContentStyles).join(" "))}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export default Accordion;
