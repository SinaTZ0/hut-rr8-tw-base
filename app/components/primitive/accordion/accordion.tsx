import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "cn";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  twRootStyles,
  twItemStyles,
  twHeaderStyles,
  twTriggerStyles,
  twIconStyles,
  twPanelStyles,
  twContentStyles,
} from "./accordion.styles";

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
