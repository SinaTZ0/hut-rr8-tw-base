import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, type ComponentProps } from "react";
import { expect, fn } from "storybook/test";

import { Button } from "../button/button";
import { Input } from "./input";

/*===== Story Options =====*/

const typeOptions = ["text", "email", "search", "password"] as const;
type InputType = (typeof typeOptions)[number];

const typeExamples: ReadonlyArray<{
  type: InputType;
  label: string;
  placeholder: string;
  defaultValue?: string;
  autoComplete?: string;
  dir?: "ltr" | "rtl";
}> = [
  {
    type: "text",
    label: "نام و نام خانوادگی",
    placeholder: "مثلاً سارا احمدی",
    defaultValue: "سارا احمدی",
  },
  {
    type: "email",
    label: "رایانامه دانشگاهی",
    placeholder: "student@hut.ac.ir",
    defaultValue: "student@hut.ac.ir",
    autoComplete: "email",
    dir: "ltr",
  },
  {
    type: "search",
    label: "جستجو در سایت",
    placeholder: "عنوان خبر یا خدمت را جستجو کنید",
  },
  {
    type: "password",
    label: "گذرواژه",
    placeholder: "گذرواژه خود را وارد کنید",
    defaultValue: "رمز-دانشگاه",
    autoComplete: "current-password",
    dir: "ltr",
  },
];

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Input",
  component: Input,
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
    type: { control: "select", options: typeOptions },
    defaultValue: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
    onChange: { control: false },
    className: { control: false },
    ref: { control: false },
  },
  args: {
    type: "text",
    placeholder: "نام و نام خانوادگی را وارد کنید",
    defaultValue: "",
    disabled: false,
    readOnly: false,
    "aria-invalid": false,
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/*===== Story Composition =====*/

type InputFieldProps = Omit<ComponentProps<typeof Input>, "id"> & {
  id: string;
  label: string;
  description?: string;
  error?: string;
};

/** Keeps labels and validation copy in the story while exercising Input's native API. */
function InputField({ id, label, description, error, "aria-describedby": ariaDescribedBy, ...props }: InputFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid w-full gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input id={id} {...props} aria-describedby={describedBy} />
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

/*===== Controls and Defaults =====*/

export const Controls = {
  render: (args) => (
    <div className="w-[min(100%,28rem)]">
      <InputField
        {...args}
        id="input-controls"
        label="نام و نام خانوادگی"
        description="این مقدار با ویژگی‌های بومی input قابل ویرایش است."
      />
    </div>
  ),
} satisfies Story;

export const Default = {
  // Let the native input and primitive supply their own defaults.
  args: {
    type: undefined,
    placeholder: undefined,
    defaultValue: undefined,
    disabled: undefined,
    readOnly: undefined,
    "aria-invalid": undefined,
  },
  render: (args) => (
    <div className="w-[min(100%,28rem)]">
      <InputField {...args} id="input-default" label="نام کاربری دانشگاه" />
    </div>
  ),
} satisfies Story;

/*===== Native Input Types =====*/

export const NativeTypes = {
  argTypes: {
    type: { control: false },
    defaultValue: { control: false },
    placeholder: { control: false },
  },
  render: () => (
    <div className="grid w-[min(100%,32rem)] gap-5">
      {typeExamples.map(({ type, ...example }) => (
        <InputField key={type} {...example} id={`input-type-${type}`} type={type} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const text = canvas.getByRole("textbox", { name: "نام و نام خانوادگی" });
    const email = canvas.getByRole("textbox", { name: "رایانامه دانشگاهی" });
    const search = canvas.getByRole("searchbox", { name: "جستجو در سایت" });
    const password = canvas.getByLabelText("گذرواژه");

    await expect(text).toHaveAttribute("type", "text");
    await expect(email).toHaveAttribute("type", "email");
    await expect(search).toHaveAttribute("type", "search");
    await expect(password).toHaveAttribute("type", "password");
    await expect(email).toHaveAttribute("autocomplete", "email");
    await expect(password).toHaveAttribute("autocomplete", "current-password");
  },
} satisfies Story;

/*===== Native Semantics =====*/

export const NativeSemantics = {
  render: () => (
    <form
      aria-label="فرم اطلاعات دانشجو"
      className="grid w-[min(100%,28rem)] gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <InputField
        id="input-native-semantics"
        label="رایانامه دانشگاهی"
        type="email"
        name="email"
        autoComplete="email"
        defaultValue="student@hut.ac.ir"
        required
        placeholder="student@hut.ac.ir"
      />
    </form>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "رایانامه دانشگاهی" });

    await expect(input).toHaveAttribute("id", "input-native-semantics");
    await expect(input).toHaveAttribute("name", "email");
    await expect(input).toHaveAttribute("autocomplete", "email");
    await expect(input).toHaveAttribute("type", "email");
    await expect(input).toBeRequired();
    await expect(input).toHaveValue("student@hut.ac.ir");
  },
} satisfies Story;

/*===== Validation Relationship =====*/

export const InvalidWithDescription = {
  render: () => (
    <div className="w-[min(100%,28rem)]">
      <InputField
        id="input-invalid"
        label="رایانامه دانشگاهی"
        type="email"
        defaultValue="student"
        aria-invalid="true"
        description="نشانی را با قالب رایانامه دانشگاهی وارد کنید."
        error="خطا: بخش دامنه رایانامه وارد نشده است."
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "رایانامه دانشگاهی" });

    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAttribute("aria-describedby", "input-invalid-description input-invalid-error");
    await expect(input).toHaveAccessibleDescription(
      "نشانی را با قالب رایانامه دانشگاهی وارد کنید. خطا: بخش دامنه رایانامه وارد نشده است.",
    );
  },
} satisfies Story;

/*===== Disabled and Read-Only =====*/

export const DisabledAndReadOnly = {
  render: () => (
    <div className="grid w-[min(100%,28rem)] gap-5">
      <InputField id="input-disabled" label="فیلد غیرفعال" defaultValue="این مقدار قابل ویرایش نیست" disabled />
      <InputField id="input-read-only" label="فیلد فقط‌خواندنی" defaultValue="این مقدار فقط برای خواندن است" readOnly />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const disabled = canvas.getByRole("textbox", { name: "فیلد غیرفعال" });
    const readOnly = canvas.getByRole("textbox", { name: "فیلد فقط‌خواندنی" });

    await expect(disabled).toBeDisabled();
    await expect(readOnly).toHaveAttribute("readonly");
    await userEvent.tab();
    await expect(readOnly).toHaveFocus();
    await userEvent.type(readOnly, "تغییر");
    await expect(readOnly).toHaveValue("این مقدار فقط برای خواندن است");
  },
} satisfies Story;

/*===== Keyboard Focus =====*/

export const KeyboardFocus = {
  render: () => (
    <div className="grid w-[min(100%,28rem)] gap-5">
      <InputField id="input-focus-first" label="نام کوچک" />
      <InputField id="input-focus-second" label="نام خانوادگی" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const first = canvas.getByRole("textbox", { name: "نام کوچک" });
    const second = canvas.getByRole("textbox", { name: "نام خانوادگی" });

    await userEvent.tab();
    await expect(first).toHaveFocus();
    await userEvent.tab();
    await expect(second).toHaveFocus();
  },
} satisfies Story;

/*===== Native Ref =====*/

function RefPreview() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid w-[min(100%,28rem)] gap-4">
      <InputField id="input-ref" label="شناسه دانشجویی" ref={inputRef} defaultValue="۱۴۰۳۱۲۳۴" />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.focus()}>
        تمرکز بر فیلد
      </Button>
    </div>
  );
}

export const NativeRef = {
  render: () => <RefPreview />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "شناسه دانشجویی" });

    await userEvent.click(canvas.getByRole("button", { name: "تمرکز بر فیلد" }));
    await expect(input).toHaveFocus();
  },
} satisfies Story;

/*===== Change Callback =====*/

export const OnChangeCallback = {
  args: { onChange: fn(), defaultValue: undefined },
  render: (args) => (
    <div className="w-[min(100%,28rem)]">
      <InputField {...args} id="input-change" label="نام کاربری" />
    </div>
  ),
  play: async ({ canvas, args, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "نام کاربری" });

    await userEvent.type(input, "x");
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ target: input }));
  },
} satisfies Story;

/*===== Long Persian Content =====*/

export const LongPersianValue = {
  render: () => (
    <div className="w-[min(100%,36rem)]">
      <InputField
        id="input-long-persian"
        label="عنوان کامل درخواست استفاده از سامانه پذیرش و خدمات الکترونیکی دانشگاه"
        defaultValue="درخواست بررسی و ثبت‌نام در دوره‌های تخصصی پژوهش و فناوری دانشگاه صنعتی همدان"
        placeholder="عنوان درخواست را وارد کنید"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", {
      name: "عنوان کامل درخواست استفاده از سامانه پذیرش و خدمات الکترونیکی دانشگاه",
    });

    await expect(input).toHaveValue("درخواست بررسی و ثبت‌نام در دوره‌های تخصصی پژوهش و فناوری دانشگاه صنعتی همدان");
  },
} satisfies Story;

/*===== Consumer ClassName =====*/

export const ConsumerClassNameOverride = {
  render: () => (
    <div className="w-[min(100%,32rem)]">
      <InputField id="input-class-name" label="فیلد با عرض سفارشی" className="w-64" />
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "فیلد با عرض سفارشی" });

    // className is a public escape hatch for consumer-owned layout overrides.
    await expect(input).toHaveClass("w-64");
    await expect(input).not.toHaveClass("w-full");
  },
} satisfies Story;
