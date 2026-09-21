import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState, type ComponentProps } from "react";
import { expect } from "storybook/test";

import { Button } from "./button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  twFieldLegendVariant,
  twOrientation,
} from "./field";
import { Textarea } from "./textarea";

/*===== Story Options =====*/

const orientationOptions = Object.keys(twOrientation) as Array<keyof typeof twOrientation>;
const legendVariantOptions = Object.keys(twFieldLegendVariant) as Array<keyof typeof twFieldLegendVariant>;
type FieldOrientation = NonNullable<ComponentProps<typeof Field>["orientation"]>;

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Field",
  component: Field,
  subcomponents: {
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldContent,
    FieldTitle,
  },
  decorators: [
    (Story) => (
      <div dir="rtl" lang="fa" className="w-full min-w-0 rounded-2xl bg-background p-4 text-foreground sm:p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
    a11y: { test: "error" },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: orientationOptions },
    "aria-labelledby": { control: false },
    children: { control: false },
    className: { control: false },
    ref: { control: false },
  },
  args: { orientation: "vertical" },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

/*===== Reusable Preview =====*/

function OrientationField({
  id,
  orientation,
  label = "شیوه برگزاری",
}: {
  id: string;
  orientation?: FieldOrientation;
  label?: string;
}) {
  return (
    <Field orientation={orientation} aria-labelledby={`${id}-label`}>
      <FieldLabel id={`${id}-label`} htmlFor={`${id}-control`}>
        {label}
      </FieldLabel>
      <FieldContent>
        <FieldTitle>انتخاب شیوه برگزاری</FieldTitle>
        <FieldDescription id={`${id}-description`}>یکی از گزینه‌های موجود را انتخاب کنید.</FieldDescription>
      </FieldContent>
      {
        /* Keep the full-width control in its own flex item so horizontal fields can allocate space to FieldContent. */
      }
      <div className="min-w-0 flex-1">
        <Textarea
          id={`${id}-control`}
          aria-label={`توضیح ${label}`}
          aria-describedby={`${id}-description`}
          rows={2}
          defaultValue="حضوری"
        />
      </div>
    </Field>
  );
}

/*===== Defaults and Controls =====*/

export const Controls = {
  render: (args) => <OrientationField id="field-controls" orientation={args.orientation ?? undefined} />,
} satisfies Story;

export const Default = {
  // Let Field supply its vertical orientation default.
  args: { orientation: undefined },
  render: () => <OrientationField id="field-default" />,
} satisfies Story;

/*===== Orientations =====*/

export const Orientations = {
  argTypes: { orientation: { control: false } },
  render: () => (
    <div className="mx-auto w-[44rem] max-w-[calc(100vw-4rem)]">
      <FieldGroup>
        {orientationOptions.map((orientation) => (
          <div key={orientation} className="grid gap-2">
            <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
              {orientation}
            </span>
            <OrientationField
              id={`field-${orientation}`}
              orientation={orientation}
              label={`شیوه برگزاری ${orientation}`}
            />
          </div>
        ))}
      </FieldGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const orientation of orientationOptions) {
      await expect(canvas.getByRole("group", { name: `شیوه برگزاری ${orientation}` })).toBeInTheDocument();
    }
  },
} satisfies Story;

/*===== Full Compound Surface =====*/

export const CompoundParts = {
  render: () => (
    <FieldSet className="w-[min(100%,44rem)]" aria-labelledby="field-set-legend">
      <FieldLegend id="field-set-legend">اطلاعات درخواست پژوهشی</FieldLegend>
      <FieldDescription>اطلاعات زیر را با دقت وارد کنید تا درخواست شما برای کارشناس مربوط ارسال شود.</FieldDescription>
      <FieldGroup>
        <Field aria-labelledby="field-title-label">
          <FieldLabel id="field-title-label" htmlFor="field-title-control">
            عنوان درخواست
          </FieldLabel>
          <FieldContent>
            <FieldTitle>عنوان کوتاه و روشن</FieldTitle>
            <FieldDescription id="field-title-description">
              عنوان باید موضوع اصلی درخواست را به‌روشنی بیان کند.
            </FieldDescription>
          </FieldContent>
          <Textarea
            id="field-title-control"
            aria-describedby="field-title-description"
            defaultValue="همکاری پژوهشی در حوزه انرژی‌های نو"
            rows={2}
          />
        </Field>
        <FieldSeparator>یا اطلاعات تکمیلی</FieldSeparator>
        <Field data-invalid="true" aria-labelledby="field-question-label">
          <FieldLabel id="field-question-label" htmlFor="field-question-control">
            پرسش یا توضیح تکمیلی
          </FieldLabel>
          <Textarea
            id="field-question-control"
            aria-invalid="true"
            aria-describedby="field-question-description field-question-error"
            rows={3}
          />
          <FieldDescription id="field-question-description">جزئیات مورد نیاز کارشناس را بنویسید.</FieldDescription>
          <FieldError id="field-question-error" errors={[{ message: "شرح درخواست باید کامل‌تر باشد." }]} />
        </Field>
        <Field aria-labelledby="field-consent-label" orientation="horizontal">
          <FieldLabel id="field-consent-label" htmlFor="field-consent-control">
            <input id="field-consent-control" type="checkbox" defaultChecked className="size-4 accent-primary" />
            <FieldContent>
              <FieldTitle>تأیید اطلاعات</FieldTitle>
              <FieldDescription>صحت اطلاعات واردشده را بررسی کرده‌ام.</FieldDescription>
            </FieldContent>
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
  play: async ({ canvas }) => {
    const title = canvas.getByRole("textbox", { name: "عنوان درخواست" });
    const question = canvas.getByRole("textbox", { name: "پرسش یا توضیح تکمیلی" });

    await expect(title).toHaveAccessibleDescription("عنوان باید موضوع اصلی درخواست را به‌روشنی بیان کند.");
    await expect(question).toHaveAccessibleDescription(
      "جزئیات مورد نیاز کارشناس را بنویسید. شرح درخواست باید کامل‌تر باشد.",
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent("شرح درخواست باید کامل‌تر باشد.");
    await expect(canvas.getByRole("checkbox", { name: /تأیید اطلاعات/ })).toBeChecked();
    await expect(canvas.getByText("یا اطلاعات تکمیلی")).toBeInTheDocument();
    await expect(canvas.getByRole("group", { name: "عنوان درخواست" })).toBeInTheDocument();
  },
} satisfies Story;

/*===== Legend Variants =====*/

export const LegendVariants = {
  argTypes: { orientation: { control: false } },
  render: () => (
    <div className="grid w-[min(100%,36rem)] gap-6">
      {legendVariantOptions.map((variant) => (
        <FieldSet key={variant} aria-labelledby={`legend-${variant}`}>
          <FieldLegend id={`legend-${variant}`} variant={variant}>
            {variant === "legend" ? "عنوان گروه اطلاعات" : "برچسب گروه اطلاعات"}
          </FieldLegend>
          <FieldGroup>
            <OrientationField id={`legend-field-${variant}`} />
          </FieldGroup>
        </FieldSet>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const variant of legendVariantOptions) {
      await expect(
        canvas.getByText(variant === "legend" ? "عنوان گروه اطلاعات" : "برچسب گروه اطلاعات"),
      ).toHaveAttribute("data-variant", variant);
    }
  },
} satisfies Story;

/*===== FieldError Children and Errors =====*/

export const ErrorContent = {
  render: () => (
    <div className="mx-auto w-[36rem] max-w-[calc(100vw-4rem)]">
      <FieldGroup>
        <Field aria-labelledby="field-child-error-label">
          <FieldLabel id="field-child-error-label" htmlFor="field-child-error-control">
            خطای سفارشی
          </FieldLabel>
          <Textarea id="field-child-error-control" aria-invalid="true" aria-describedby="field-child-error-message" />
          <FieldError id="field-child-error-message" errors={[{ message: "این متن نباید نمایش داده شود." }]}>
            پیام خطای سفارشی برای این فیلد.
          </FieldError>
        </Field>
        <Field aria-labelledby="field-list-error-label">
          <FieldLabel id="field-list-error-label" htmlFor="field-list-error-control">
            چند خطا
          </FieldLabel>
          <Textarea id="field-list-error-control" aria-invalid="true" aria-describedby="field-list-error-message" />
          <FieldError
            id="field-list-error-message"
            errors={[
              { message: "مقدار واردشده کوتاه است." },
              { message: "قالب مقدار واردشده صحیح نیست." },
              { message: "مقدار واردشده کوتاه است." },
            ]}
          />
        </Field>
        <Field aria-labelledby="field-empty-error-label">
          <FieldLabel id="field-empty-error-label" htmlFor="field-empty-error-control">
            بدون خطا
          </FieldLabel>
          <Textarea id="field-empty-error-control" />
          <span data-testid="empty-error-host">
            <FieldError errors={[]} />
          </span>
        </Field>
      </FieldGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const alerts = canvas.getAllByRole("alert");

    await expect(alerts[0]).toHaveTextContent("پیام خطای سفارشی برای این فیلد.");
    await expect(canvas.queryByText("این متن نباید نمایش داده شود.")).not.toBeInTheDocument();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(2);
    await expect(canvas.getByText("مقدار واردشده کوتاه است.")).toBeInTheDocument();
    await expect(canvas.getByText("قالب مقدار واردشده صحیح نیست.")).toBeInTheDocument();
    await expect(canvas.getByTestId("empty-error-host")).toBeEmptyDOMElement();
  },
} satisfies Story;

/*===== Disabled and Invalid States =====*/

export const DisabledAndInvalid = {
  render: () => (
    <div className="mx-auto w-[36rem] max-w-[calc(100vw-4rem)]">
      <FieldGroup>
        <Field data-disabled="true" aria-labelledby="field-disabled-label">
          <FieldLabel id="field-disabled-label" htmlFor="field-disabled-control">
            فیلد غیرفعال
          </FieldLabel>
          <Textarea id="field-disabled-control" disabled defaultValue="این مقدار قابل ویرایش نیست." />
        </Field>
        <Field data-invalid="true" aria-labelledby="field-invalid-label">
          <FieldLabel id="field-invalid-label" htmlFor="field-invalid-control">
            فیلد نامعتبر
          </FieldLabel>
          <Textarea id="field-invalid-control" aria-invalid="true" defaultValue="مقدار ناقص" />
        </Field>
      </FieldGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "فیلد غیرفعال" })).toBeDisabled();
    await expect(canvas.getByRole("textbox", { name: "فیلد نامعتبر" })).toHaveAttribute("aria-invalid", "true");
  },
} satisfies Story;

/*===== Ref and Consumer Layout =====*/

function FieldRefPreview() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [refSlot, setRefSlot] = useState("مرجع بررسی نشده است");

  return (
    <div className="grid w-[min(100%,36rem)] gap-4">
      <Field ref={fieldRef} className="max-w-lg" aria-labelledby="field-ref-label">
        <FieldLabel id="field-ref-label" htmlFor="field-ref-control">
          فیلد با مرجع مستقیم
        </FieldLabel>
        <Textarea id="field-ref-control" />
      </Field>
      <Button type="button" onClick={() => setRefSlot(fieldRef.current?.dataset.slot ?? "نامشخص")}>
        بررسی مرجع فیلد
      </Button>
      <output aria-live="polite" className="text-sm text-muted-foreground">
        {refSlot}
      </output>
    </div>
  );
}

export const RefAndClassName = {
  render: () => <FieldRefPreview />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "بررسی مرجع فیلد" }));
    await expect(canvas.getByText("field")).toBeInTheDocument();
    await expect(canvas.getByRole("group", { name: "فیلد با مرجع مستقیم" })).toHaveClass("max-w-lg");
  },
} satisfies Story;
