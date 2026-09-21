import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, type ComponentProps } from "react";
import { expect, fn } from "storybook/test";

import { Button } from "./button";
import { Label } from "./label";
import { Textarea } from "./textarea";

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Textarea",
  component: Textarea,
  decorators: [
    (Story) => (
      <div dir="rtl" lang="fa" className="min-w-0 rounded-2xl bg-background p-4 text-foreground sm:p-6">
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
    defaultValue: { control: "text" },
    placeholder: { control: "text" },
    rows: { control: "number" },
    maxLength: { control: "number" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
    onChange: { control: false },
    onFocus: { control: false },
    onBlur: { control: false },
    className: { control: false },
    ref: { control: false },
  },
  args: {
    placeholder: "توضیحات درخواست خود را وارد کنید",
    defaultValue: "",
    disabled: false,
    readOnly: false,
    "aria-invalid": false,
    onChange: fn(),
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

/*===== Story Composition =====*/

type TextareaFieldProps = Omit<ComponentProps<typeof Textarea>, "id"> & {
  id: string;
  label: string;
  description?: string;
  error?: string;
};

/** Keeps labels and validation relationships in the story while exercising native textarea props. */
function TextareaField({
  id,
  label,
  description,
  error,
  "aria-describedby": ariaDescribedBy,
  "aria-errormessage": ariaErrorMessage,
  ...props
}: TextareaFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid min-w-0 gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} {...props} aria-describedby={describedBy} aria-errormessage={errorId ?? ariaErrorMessage} />
      {description ? (
        <p id={descriptionId} className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm leading-6 text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/*===== Defaults and Controls =====*/

export const Controls = {
  render: (args) => (
    <div className="w-[min(100%,32rem)]">
      <TextareaField
        {...args}
        id="textarea-controls"
        label="شرح درخواست"
        description="این متن با ویژگی‌های بومی textarea قابل ویرایش است."
      />
    </div>
  ),
} satisfies Story;

export const Default = {
  // Let the native textarea and primitive supply their own defaults.
  args: {
    defaultValue: undefined,
    placeholder: undefined,
    rows: undefined,
    maxLength: undefined,
    disabled: undefined,
    readOnly: undefined,
    "aria-invalid": undefined,
  },
  render: (args) => (
    <div className="w-[min(100%,32rem)]">
      <TextareaField {...args} id="textarea-default" label="پیام برای دانشگاه" />
    </div>
  ),
} satisfies Story;

/*===== Native Semantics =====*/

export const NativeSemantics = {
  render: () => (
    <form
      aria-label="فرم توضیحات دانشجو"
      className="grid w-[min(100%,32rem)] gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <TextareaField
        id="textarea-native-semantics"
        label="شرح سوابق پژوهشی"
        name="research-summary"
        autoComplete="off"
        defaultValue="سابقه همکاری در آزمایشگاه سامانه‌های هوشمند دانشگاه"
        rows={5}
        maxLength={500}
        required
        spellCheck
      />
    </form>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole("textbox", { name: "شرح سوابق پژوهشی" });

    await expect(textarea.tagName).toBe("TEXTAREA");
    await expect(textarea).toHaveAttribute("id", "textarea-native-semantics");
    await expect(textarea).toHaveAttribute("name", "research-summary");
    await expect(textarea).toHaveAttribute("autocomplete", "off");
    await expect(textarea).toHaveAttribute("rows", "5");
    await expect(textarea).toHaveAttribute("maxlength", "500");
    await expect(textarea).toBeRequired();
    await expect(textarea).toHaveValue("سابقه همکاری در آزمایشگاه سامانه‌های هوشمند دانشگاه");
  },
} satisfies Story;

/*===== Validation Relationship =====*/

export const InvalidWithDescription = {
  render: () => (
    <div className="w-[min(100%,32rem)]">
      <TextareaField
        id="textarea-invalid"
        label="توضیح مسئله پژوهشی"
        defaultValue=""
        aria-invalid="true"
        description="حداقل یک جمله درباره مسئله مورد نظر بنویسید."
        error="خطا: توضیح مسئله نباید خالی باشد."
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole("textbox", { name: "توضیح مسئله پژوهشی" });

    await expect(textarea).toHaveAttribute("aria-invalid", "true");
    await expect(textarea).toHaveAttribute("aria-describedby", "textarea-invalid-description textarea-invalid-error");
    await expect(textarea).toHaveAttribute("aria-errormessage", "textarea-invalid-error");
    await expect(textarea).toHaveAccessibleDescription(
      "حداقل یک جمله درباره مسئله مورد نظر بنویسید. خطا: توضیح مسئله نباید خالی باشد.",
    );
  },
} satisfies Story;

/*===== Disabled and Read-Only =====*/

export const DisabledAndReadOnly = {
  render: () => (
    <div className="grid w-[min(100%,32rem)] gap-5">
      <TextareaField
        id="textarea-disabled"
        label="توضیحات غیرفعال"
        defaultValue="این مقدار در وضعیت غیرفعال قابل ویرایش نیست."
        disabled
      />
      <TextareaField
        id="textarea-read-only"
        label="توضیحات فقط‌خواندنی"
        defaultValue="این مقدار فقط برای خواندن و کپی کردن نمایش داده می‌شود."
        readOnly
      />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const disabled = canvas.getByRole("textbox", { name: "توضیحات غیرفعال" });
    const readOnly = canvas.getByRole("textbox", { name: "توضیحات فقط‌خواندنی" });

    await expect(disabled).toBeDisabled();
    await expect(readOnly).toHaveAttribute("readonly");
    await userEvent.click(readOnly);
    await expect(readOnly).toHaveFocus();
    await userEvent.type(readOnly, "تغییر");
    await expect(readOnly).toHaveValue("این مقدار فقط برای خواندن و کپی کردن نمایش داده می‌شود.");
  },
} satisfies Story;

/*===== Ref, Focus, and Callbacks =====*/

type TextareaCallbackProps = Pick<ComponentProps<typeof Textarea>, "onChange" | "onFocus" | "onBlur">;

function TextareaRefPreview({ onChange, onFocus, onBlur }: TextareaCallbackProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="grid w-[min(100%,32rem)] gap-4">
      <Textarea
        ref={textareaRef}
        id="textarea-ref"
        aria-label="یادداشت آزمایشی"
        defaultValue="یادداشت اولیه"
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <Button type="button" onClick={() => textareaRef.current?.focus()}>
        تمرکز روی متن
      </Button>
    </div>
  );
}

export const RefAndCallbacks = {
  args: { onChange: fn(), onFocus: fn(), onBlur: fn() },
  render: (args) => <TextareaRefPreview {...args} />,
  play: async ({ canvas, args, userEvent }) => {
    const textarea = canvas.getByRole("textbox", { name: "یادداشت آزمایشی" });
    const focusButton = canvas.getByRole("button", { name: "تمرکز روی متن" });

    await userEvent.click(focusButton);
    await expect(textarea).toHaveFocus();
    await expect(args.onFocus).toHaveBeenCalledTimes(1);
    await userEvent.type(textarea, " جدید");
    await expect(args.onChange).toHaveBeenCalled();
    await userEvent.click(focusButton);
    await expect(args.onBlur).toHaveBeenCalledTimes(1);
  },
} satisfies Story;

/*===== Keyboard and Responsive Content =====*/

export const KeyboardFocus = {
  render: () => (
    <div className="grid w-[min(100%,32rem)] gap-5">
      <TextareaField id="textarea-first" label="هدف درخواست" />
      <TextareaField id="textarea-second" label="جزئیات تکمیلی" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const first = canvas.getByRole("textbox", { name: "هدف درخواست" });
    const second = canvas.getByRole("textbox", { name: "جزئیات تکمیلی" });

    await userEvent.tab();
    await expect(first).toHaveFocus();
    await userEvent.tab();
    await expect(second).toHaveFocus();
  },
} satisfies Story;

export const LongPersianContent = {
  render: () => (
    <div className="w-[min(100%,36rem)]">
      <TextareaField
        id="textarea-long-persian"
        label="شرح کامل درخواست همکاری پژوهشی و استفاده از امکانات آزمایشگاه‌های دانشگاه صنعتی همدان"
        defaultValue="این متن نمونه برای بررسی پیچش خط، خوانایی و امکان ویرایش محتوای فارسی طولانی در عرض‌های مختلف صفحه نوشته شده است."
        rows={4}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole("textbox", {
      name: "شرح کامل درخواست همکاری پژوهشی و استفاده از امکانات آزمایشگاه‌های دانشگاه صنعتی همدان",
    });

    await expect(textarea).toHaveValue(
      "این متن نمونه برای بررسی پیچش خط، خوانایی و امکان ویرایش محتوای فارسی طولانی در عرض‌های مختلف صفحه نوشته شده است.",
    );
  },
} satisfies Story;

/*===== Consumer Layout Override =====*/

export const ConsumerClassNameOverride = {
  render: () => (
    <div className="w-[min(100%,32rem)]">
      <TextareaField id="textarea-class-name" label="یادداشت کوتاه" className="w-64" />
    </div>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole("textbox", { name: "یادداشت کوتاه" });

    // className remains the public escape hatch for consumer-owned placement and width.
    await expect(textarea).toHaveClass("w-64");
  },
} satisfies Story;
