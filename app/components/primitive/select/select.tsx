import { useDirection } from "@base-ui/react/direction-provider";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import type { VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { useSelectScrolling } from "./use-select-scrolling";
import {
  selectTriggerVariants,
  twValueStyles,
  twIconStyles,
  twPositionerStyles,
  twContentStyles,
  twListStyles,
  twScrollArrowStyles,
  twScrollUpStyles,
  twScrollDownStyles,
  twGlyphStyles,
  twItemStyles,
  twItemTextStyles,
  twIndicatorStyles,
  twGroupStyles,
  twLabelStyles,
  twSeparatorStyles,
} from "./select.styles";

/*===== Root and Trigger =====*/

// Base UI's root preserves single/multiple value inference and defaults to modal behavior.
const Select = SelectPrimitive.Root;
export type SelectProps<Value, Multiple extends boolean | undefined = false> = SelectPrimitive.Root.Props<
  Value,
  Multiple
>;
export type SelectTriggerProps = SelectPrimitive.Trigger.Props & {
  size?: NonNullable<VariantProps<typeof selectTriggerVariants>["size"]>;
};
export type SelectContentProps = SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger">;

function SelectTrigger({ className, size = "default", children, ...props }: SelectTriggerProps) {
  const classes = selectTriggerVariants({ size });
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    >
      {children}
      <SelectPrimitive.Icon
        render={<ChevronDownIcon aria-hidden="true" className={Object.values(twIconStyles).join(" ")} />}
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  const classes = Object.values(twValueStyles).join(" ");
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

/*===== Portaled Popup =====*/

/**
 * Includes the positioner and a list with wheel inertia and a native scrollbar. Base UI owns modal locks and focus.
 * Portals inherit the direction provider; data-lenis-prevent isolates the list from document scrolling.
 * Supply aria-label or aria-labelledby to name the options list, rather than the presentation-only popup.
 * Defaults to anchored positioning so viewport collisions can flip or shift the popup.
 */
function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: SelectContentProps) {
  const direction = useDirection();
  const [list, setList] = useState<HTMLDivElement | null>(null);
  useSelectScrolling(list);
  const classes = Object.values(twContentStyles).join(" ");
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        collisionPadding={8}
        collisionAvoidance={{ side: "flip", align: "shift" }}
        className={Object.values(twPositionerStyles).join(" ")}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          data-lenis-prevent
          dir={direction}
          {...props}
          className={
            typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)
          }
        >
          {/* Base UI hides the scrollbar when scroll arrows are mounted, so the default list uses the scrollbar. */}
          <SelectPrimitive.List
            ref={setList}
            data-slot="select-list"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={Object.values(twListStyles).join(" ")}
          >
            {/* A separate content element lets Lenis track option-height changes while the list stays constrained. */}
            <div>{children}</div>
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

/*===== Items and Groups =====*/

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  const classes = Object.values(twGroupStyles).join(" ");
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  const classes = Object.values(twLabelStyles).join(" ");
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  const classes = Object.values(twItemStyles).join(" ");
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    >
      <SelectPrimitive.ItemText className={Object.values(twItemTextStyles).join(" ")}>
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator render={<span className={Object.values(twIndicatorStyles).join(" ")} />}>
        <CheckIcon aria-hidden="true" className={Object.values(twGlyphStyles).join(" ")} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  const classes = Object.values(twSeparatorStyles).join(" ");
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    />
  );
}

/*===== Scroll Arrows =====*/

function SelectScrollUpButton({ className, ...props }: SelectPrimitive.ScrollUpArrow.Props) {
  const classes = cn(Object.values(twScrollArrowStyles), Object.values(twScrollUpStyles));
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    >
      <ChevronUpIcon aria-hidden="true" className={Object.values(twGlyphStyles).join(" ")} />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({ className, ...props }: SelectPrimitive.ScrollDownArrow.Props) {
  const classes = cn(Object.values(twScrollArrowStyles), Object.values(twScrollDownStyles));
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      {...props}
      className={typeof className === "function" ? (state) => cn(classes, className(state)) : cn(classes, className)}
    >
      <ChevronDownIcon aria-hidden="true" className={Object.values(twGlyphStyles).join(" ")} />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
