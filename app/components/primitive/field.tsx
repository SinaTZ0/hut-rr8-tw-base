import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Label } from "./label";
import { Separator } from "./separator";
import { composeStyles, defineStyles } from "./styles";

/*===== Fieldset Styles =====*/

const twFieldSetStyles = defineStyles({
  layout: "flex min-w-0 flex-col gap-4",
  state: "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
});

/*===== Legend Styles =====*/

const twFieldLegendStyles = defineStyles({
  geometry: "mb-1.5",
  typography: "font-medium wrap-break-word",
  state: "data-[variant=label]:text-sm data-[variant=legend]:text-base",
});

// The source uses data-variant selectors for both options; retain that contract while
// exposing the existing axis through the repository's typed CVA pattern.
const twFieldLegendVariant = defineStyles({
  legend: {},
  label: {},
});

const fieldLegendVariants = cva(Object.values(twFieldLegendStyles), {
  variants: {
    variant: composeStyles(twFieldLegendVariant),
  },
  defaultVariants: {
    variant: "legend",
  },
});

type FieldLegendProps = React.ComponentProps<"legend"> & {
  variant?: NonNullable<VariantProps<typeof fieldLegendVariants>["variant"]>;
};

/*===== Field Group Styles =====*/

const twFieldGroupStyles = defineStyles({
  layout: "group/field-group @container/field-group flex w-full min-w-0 flex-col gap-5",
  state: "data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
});

/*===== Field Styles =====*/

const twFieldStyles = defineStyles({
  layout: "group/field flex w-full min-w-0 gap-2",
  state: "data-[invalid=true]:text-destructive",
});

const twOrientation = defineStyles({
  vertical: {
    layout: "flex-col *:w-full [&>.sr-only]:w-auto",
  },
  horizontal: {
    layout: "flex-row items-center",
    state:
      "has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
  },
  responsive: {
    layout: "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto",
    state:
      "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
  },
});

const fieldVariants = cva(Object.values(twFieldStyles), {
  variants: {
    orientation: composeStyles(twOrientation),
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

/*===== Field Content Styles =====*/

const twFieldContentStyles = defineStyles({
  layout: "group/field-content flex min-w-0 flex-1 flex-col gap-0.5",
  typography: "leading-snug wrap-break-word",
});

/*===== Field Label Styles =====*/

const twFieldLabelStyles = defineStyles({
  layout: "group/field-label peer/field-label flex w-fit min-w-0 gap-2 leading-snug wrap-break-word",
  geometry:
    "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5",
  appearance: "has-data-checked:border-primary/70 has-data-checked:bg-primary/5 dark:has-data-checked:bg-primary/10",
  disabled: "group-data-[disabled=true]/field:text-muted-foreground",
  hover: "has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-muted/50",
  focus:
    "has-[>[data-slot=field]]:has-[:focus-visible]:border-ring has-[>[data-slot=field]]:has-[:focus-visible]:ring-3 has-[>[data-slot=field]]:has-[:focus-visible]:ring-ring",
});

/*===== Field Title Styles =====*/

const twFieldTitleStyles = defineStyles({
  layout: "flex w-fit min-w-0 items-center gap-2",
  typography: "text-sm font-medium wrap-break-word",
  disabled: "group-data-[disabled=true]/field:text-muted-foreground",
});

/*===== Field Description Styles =====*/

const twFieldDescriptionStyles = defineStyles({
  typography: "text-start text-sm leading-normal font-normal wrap-break-word",
  appearance: "text-muted-foreground",
  state: "group-has-data-horizontal/field:text-balance last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
  interaction: "[&>a]:underline [&>a]:underline-offset-4",
  hover: "[&>a:hover]:text-primary",
});

/*===== Field Separator Styles =====*/

const twFieldSeparatorStyles = defineStyles({
  layout: "relative",
  geometry: "-my-2 h-5",
  typography: "text-sm",
  state: "group-data-[variant=outline]/field-group:-mb-2",
});

const twFieldSeparatorLineStyles = defineStyles({
  layout: "absolute inset-0 top-1/2",
});

const twFieldSeparatorContentStyles = defineStyles({
  layout: "relative mx-auto block w-fit max-w-full wrap-break-word",
  geometry: "px-2",
  appearance: "bg-background text-muted-foreground",
});

/*===== Field Error Styles =====*/

const twFieldErrorStyles = defineStyles({
  typography: "text-sm font-normal wrap-break-word",
  appearance: "text-destructive",
});

const twFieldErrorListStyles = defineStyles({
  layout: "flex flex-col gap-1",
  geometry: "ms-4",
  typography: "list-disc",
});

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
  fieldLegendVariants,
  fieldVariants,
  twFieldLegendVariant,
  twOrientation,
};
