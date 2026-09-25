import { useMemo } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Label } from "../label/label";
import { Separator } from "../separator/separator";
import {
  twFieldSetStyles,
  fieldLegendVariants,
  twFieldGroupStyles,
  fieldVariants,
  twFieldContentStyles,
  twFieldLabelStyles,
  twFieldTitleStyles,
  twFieldDescriptionStyles,
  twFieldSeparatorStyles,
  twFieldSeparatorLineStyles,
  twFieldSeparatorContentStyles,
  twFieldErrorStyles,
  twFieldErrorListStyles,
} from "./field.styles";

type FieldLegendProps = React.ComponentProps<"legend"> & {
  variant?: NonNullable<VariantProps<typeof fieldLegendVariants>["variant"]>;
};

/*===== Fieldset and Legend =====*/

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset data-slot="field-set" className={cn(Object.values(twFieldSetStyles).join(" "), className)} {...props} />
  );
}

function FieldLegend({ className, variant = "legend", ...props }: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(fieldLegendVariants({ variant }), className)}
      {...props}
    />
  );
}

/*===== Field Group and Root =====*/

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="field-group" className={cn(Object.values(twFieldGroupStyles).join(" "), className)} {...props} />
  );
}

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

/*===== Field Content and Label =====*/

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(Object.values(twFieldContentStyles).join(" "), className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label data-slot="field-label" className={cn(Object.values(twFieldLabelStyles).join(" "), className)} {...props} />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="field-label" className={cn(Object.values(twFieldTitleStyles).join(" "), className)} {...props} />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(Object.values(twFieldDescriptionStyles).join(" "), className)}
      {...props}
    />
  );
}

/*===== Field Separator =====*/

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { children?: React.ReactNode }) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(Object.values(twFieldSeparatorStyles).join(" "), className)}
      {...props}
    >
      <Separator className={cn(Object.values(twFieldSeparatorLineStyles).join(" "))} />
      {children && (
        <span
          className={cn(Object.values(twFieldSeparatorContentStyles).join(" "))}
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

/*===== Field Error =====*/

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className={cn(Object.values(twFieldErrorListStyles).join(" "))}>
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(Object.values(twFieldErrorStyles).join(" "), className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
