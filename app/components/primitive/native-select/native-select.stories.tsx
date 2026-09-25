import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { expect, fn } from "storybook/test";

import { Button } from "../button/button";
import { Label } from "../label/label";
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "./native-select";
import { twSize } from "./native-select.styles";

/*===== Story Options and Content =====*/

const sizeOptions = Object.keys(twSize) as Array<keyof typeof twSize>;

const degreeOptions = [
  { value: "undergraduate", label: "کارشناسی" },
  { value: "graduate", label: "کارشناسی ارشد" },
  { value: "doctoral", label: "دکتری" },
] as const;

const facultyOptions = [
  { value: "computer", label: "مهندسی کامپیوتر" },
  { value: "materials", label: "مهندسی مواد" },
] as const;

/*===== Metadata =====*/

const meta = {
  title: "Primitive/NativeSelect",
  component: NativeSelect,
  subcomponents: { NativeSelectOption, NativeSelectOptGroup },
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
    size: { control: "select", options: sizeOptions },
    defaultValue: { control: "select", options: degreeOptions.map(({ value }) => value) },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
    onChange: { control: false },
    className: { control: false },
    ref: { control: false },
    children: { control: false },
  },
  args: {
    size: "default",
    defaultValue: "undergraduate",
    disabled: false,
    required: false,
    "aria-invalid": false,
    onChange: fn(),
  },
} satisfies Meta<typeof NativeSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

/*===== Story Composition =====*/

type NativeSelectFieldProps = Omit<ComponentProps<typeof NativeSelect>, "id"> & {
  id: string;
  label: string;
  description?: string;
  children?: ReactNode;
};

function DefaultOptions() {
  return degreeOptions.map(({ value, label }) => (
    <NativeSelectOption key={value} value={value}>
      {label}
    </NativeSelectOption>
  ));
}

function NativeSelectField({ id, label, description, children, ...props }: NativeSelectFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className="grid min-w-0 gap-2">
      <Label htmlFor={id}>{label}</Label>
      <NativeSelect id={id} {...props} aria-describedby={descriptionId}>
        {children ?? <DefaultOptions />}
      </NativeSelect>
      {description ? (
        <p id={descriptionId} className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/*===== Defaults and Controls =====*/

export const Controls = {
  render: (args) => (
    <div className="w-[min(100%,28rem)]">
      <NativeSelectField
        {...args}
        id="native-select-controls"
        label="مقطع تحصیلی"
        description="گزینه مناسب را برای ادامه ثبت‌نام انتخاب کنید."
      />
    </div>
  ),
} satisfies Story;

export const Default = {
  // Let the primitive supply its default size and native select behavior.
  args: {
    size: undefined,
    defaultValue: undefined,
    disabled: undefined,
    required: undefined,
    "aria-invalid": undefined,
  },
  render: () => (
    <div className="w-[min(100%,28rem)]">
      <NativeSelectField id="native-select-default" label="مقطع تحصیلی" />
    </div>
  ),
} satisfies Story;

/*===== Native Options and Optgroups =====*/

export const OptionsAndOptgroups = {
  render: () => (
    <div className="w-[min(100%,30rem)]">
      <NativeSelectField id="native-select-groups" label="دانشکده" defaultValue="computer">
        <NativeSelectOption value="">یک گزینه را انتخاب کنید</NativeSelectOption>
        <NativeSelectOptGroup label="دانشکده مهندسی">
          {facultyOptions.map(({ value, label }) => (
            <NativeSelectOption
              key={value}
              value={value}
              className={value === "computer" ? "font-semibold" : undefined}
            >
              {label}
            </NativeSelectOption>
          ))}
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="مقطع تحصیلی">
          {degreeOptions.map(({ value, label }) => (
            <NativeSelectOption key={value} value={value}>
              {label}
            </NativeSelectOption>
          ))}
        </NativeSelectOptGroup>
      </NativeSelectField>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByRole("combobox", { name: "دانشکده" });

    await expect(select).toHaveValue("computer");
    await expect(canvas.getByRole("option", { name: "مهندسی کامپیوتر" })).toHaveClass("font-semibold");
    await expect(canvas.getByRole("option", { name: "مهندسی مواد" })).toBeInTheDocument();
    await userEvent.selectOptions(select, "materials");
    await expect(select).toHaveValue("materials");
  },
} satisfies Story;

/*===== Sizes =====*/

export const Sizes = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <div className="grid w-[min(100%,30rem)] gap-5">
      {sizeOptions.map((size) => (
        <NativeSelectField key={size} {...args} id={`native-select-${size}`} label={`اندازه ${size}`} size={size} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const size of sizeOptions) {
      await expect(canvas.getByRole("combobox", { name: `اندازه ${size}` })).toHaveAttribute("data-size", size);
    }
  },
} satisfies Story;

/*===== Native Semantics =====*/

export const NativeSemantics = {
  render: () => (
    <form
      aria-label="فرم انتخاب رشته"
      className="grid w-[min(100%,30rem)] gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <NativeSelectField
        id="native-select-semantics"
        label="رشته تحصیلی"
        name="major"
        autoComplete="off"
        defaultValue="computer"
        required
      >
        <NativeSelectOption value="computer">مهندسی کامپیوتر</NativeSelectOption>
        <NativeSelectOption value="materials">مهندسی مواد</NativeSelectOption>
      </NativeSelectField>
    </form>
  ),
  play: async ({ canvas }) => {
    const select = canvas.getByRole("combobox", { name: "رشته تحصیلی" });

    await expect(select.tagName).toBe("SELECT");
    await expect(select).toHaveAttribute("id", "native-select-semantics");
    await expect(select).toHaveAttribute("name", "major");
    await expect(select).toHaveAttribute("autocomplete", "off");
    await expect(select).toBeRequired();
    await expect(select).toHaveValue("computer");
  },
} satisfies Story;

/*===== Ref, Keyboard, and Callback =====*/

function NativeSelectRefPreview({ onChange }: Pick<ComponentProps<typeof NativeSelect>, "onChange">) {
  const selectRef = useRef<HTMLSelectElement>(null);

  return (
    <div className="grid w-[min(100%,30rem)] gap-4">
      <NativeSelect
        ref={selectRef}
        id="native-select-ref"
        aria-label="انتخاب رشته"
        defaultValue="undergraduate"
        onChange={onChange}
      >
        <DefaultOptions />
      </NativeSelect>
      <Button type="button" onClick={() => selectRef.current?.focus()}>
        تمرکز روی انتخابگر
      </Button>
    </div>
  );
}

export const RefKeyboardAndCallback = {
  args: { onChange: fn() },
  render: (args) => <NativeSelectRefPreview {...args} />,
  play: async ({ canvas, args, userEvent }) => {
    const select = canvas.getByRole("combobox", { name: "انتخاب رشته" });

    await userEvent.tab();
    await expect(select).toHaveFocus();
    await userEvent.selectOptions(select, "graduate");
    await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ target: select }));
    await userEvent.click(canvas.getByRole("button", { name: "تمرکز روی انتخابگر" }));
    await expect(select).toHaveFocus();
  },
} satisfies Story;

/*===== Disabled and Invalid =====*/

export const DisabledAndInvalid = {
  render: () => (
    <div className="grid w-[min(100%,30rem)] gap-5">
      <NativeSelectField id="native-select-disabled" label="گزینه غیرفعال" disabled defaultValue="graduate" />
      <NativeSelectField
        id="native-select-invalid"
        label="گزینه نامعتبر"
        aria-invalid="true"
        defaultValue="undergraduate"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "گزینه غیرفعال" })).toBeDisabled();
    await expect(canvas.getByRole("combobox", { name: "گزینه نامعتبر" })).toHaveAttribute("aria-invalid", "true");
  },
} satisfies Story;

/*===== Long Persian Content and Wrapper Classes =====*/

export const LongPersianContent = {
  render: () => (
    <div className="w-[min(100%,18rem)]">
      <NativeSelectField
        id="native-select-long"
        label="انتخاب دانشکده و گروه آموزشی برای ادامه فرایند ثبت درخواست پژوهشی"
        className="w-full"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const select = canvas.getByRole("combobox", {
      name: "انتخاب دانشکده و گروه آموزشی برای ادامه فرایند ثبت درخواست پژوهشی",
    });

    await expect(select.parentElement).toHaveClass("w-full");
  },
} satisfies Story;
