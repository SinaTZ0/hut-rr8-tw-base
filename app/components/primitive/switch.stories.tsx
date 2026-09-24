import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { expect, fn } from "storybook/test";

import { Button } from "./button";
import { Label } from "./label";
import { Switch, twSize, type SwitchProps } from "./switch";

/*===== Story Options =====*/

const sizeOptions = Object.keys(twSize) as Array<keyof typeof twSize>;

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Switch",
  component: Switch,
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
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
    onCheckedChange: { control: false },
    className: { control: false },
    inputRef: { control: false },
    ref: { control: false },
    render: { control: false },
  },
  args: {
    size: "default",
    defaultChecked: false,
    disabled: false,
    readOnly: false,
    required: false,
    "aria-invalid": false,
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

/*===== Preview Helpers =====*/

type SwitchFieldProps = Omit<SwitchProps, "id"> & {
  id: string;
  label: string;
  description?: string;
};

function SwitchField({ id, label, description, ...props }: SwitchFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className="grid min-w-0 gap-2">
      <label className="flex min-w-0 items-center gap-3 text-sm leading-snug font-medium wrap-break-word">
        <Switch {...props} id={id} aria-describedby={descriptionId} />
        <span>{label}</span>
      </label>
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
    <div className="w-[min(100%,32rem)]">
      <SwitchField
        {...args}
        id="switch-controls"
        label="دریافت اطلاعیه‌های آموزشی"
        description="با فعال‌سازی این گزینه، زمان انتشار اطلاعیه‌های مهم را از دست نمی‌دهید."
      />
    </div>
  ),
} satisfies Story;

export const Default = {
  // Let the primitive supply its default size and unchecked state.
  args: {
    size: undefined,
    defaultChecked: undefined,
    disabled: undefined,
    readOnly: undefined,
    required: undefined,
    "aria-invalid": undefined,
    onCheckedChange: undefined,
  },
  render: () => <SwitchField id="switch-default" label="نمایش رویدادهای پژوهشی در تقویم شخصی" />,
} satisfies Story;

/*===== Sizes =====*/

export const Sizes = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <div className="grid w-[min(100%,32rem)] gap-5">
      {sizeOptions.map((size) => (
        <SwitchField
          key={size}
          {...args}
          id={`switch-size-${size}`}
          size={size}
          label={`اندازه ${size}`}
          description="هدف لمسی کنترل از مسیر فضای پیرامونی آن نیز قابل دسترسی است."
        />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const size of sizeOptions) {
      await expect(canvas.getByRole("switch", { name: `اندازه ${size}` })).toHaveAttribute("data-size", size);
    }
  },
} satisfies Story;

/*===== Checked and Disabled States =====*/

export const States = {
  argTypes: {
    defaultChecked: { control: false },
    disabled: { control: false },
    readOnly: { control: false },
    "aria-invalid": { control: false },
  },
  render: () => (
    <div className="grid w-[min(100%,32rem)] gap-5">
      <SwitchField id="switch-state-off" label="اعلان‌های سامانه خاموش" />
      <SwitchField id="switch-state-on" label="اعلان‌های سامانه روشن" defaultChecked />
      <SwitchField id="switch-state-disabled" label="اعلان‌های غیرفعال" disabled />
      <SwitchField id="switch-state-readonly" label="اعلان‌های فقط‌خواندنی" readOnly defaultChecked />
      <SwitchField
        id="switch-state-invalid"
        label="تنظیمات نیازمند بررسی"
        aria-invalid="true"
        description="این گزینه با تنظیمات حساب کاربری شما سازگار نیست."
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("switch", { name: "اعلان‌های سامانه خاموش" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    await expect(canvas.getByRole("switch", { name: "اعلان‌های سامانه روشن" })).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getByRole("switch", { name: "اعلان‌های غیرفعال" })).toHaveAttribute("data-disabled", "");
    await expect(canvas.getByRole("switch", { name: "اعلان‌های فقط‌خواندنی" })).toHaveAttribute(
      "aria-readonly",
      "true",
    );
    await expect(canvas.getByRole("switch", { name: "تنظیمات نیازمند بررسی" })).toHaveAttribute("aria-invalid", "true");
  },
} satisfies Story;

/*===== Controlled State and Keyboard =====*/

function ControlledPreview({ onCheckedChange }: Pick<SwitchProps, "onCheckedChange">) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="grid w-[min(100%,32rem)] gap-3">
      <label className="flex items-center gap-3 text-sm leading-snug font-medium">
        <Switch
          checked={checked}
          onCheckedChange={(nextChecked, eventDetails) => {
            setChecked(nextChecked);
            onCheckedChange?.(nextChecked, eventDetails);
          }}
        />
        <span>همگام‌سازی خودکار پرونده آموزشی</span>
      </label>
      <output aria-live="polite" className="text-sm text-muted-foreground">
        {checked ? "همگام‌سازی فعال است" : "همگام‌سازی غیرفعال است"}
      </output>
    </div>
  );
}

export const ControlledAndKeyboard = {
  render: (args) => <ControlledPreview onCheckedChange={args.onCheckedChange} />,
  play: async ({ canvas, args, userEvent }) => {
    const switchControl = canvas.getByRole("switch", { name: "همگام‌سازی خودکار پرونده آموزشی" });

    await userEvent.tab();
    await expect(switchControl).toHaveFocus();
    await expect(switchControl).toHaveAttribute("aria-checked", "false");
    await userEvent.keyboard(" ");
    await expect(switchControl).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getByText("همگام‌سازی فعال است")).toBeInTheDocument();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  },
} satisfies Story;

/*===== Form Semantics =====*/

export const FormSemantics = {
  render: () => (
    <form
      aria-label="تنظیمات اطلاع‌رسانی"
      className="grid w-[min(100%,32rem)] gap-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <SwitchField
        id="switch-form-email"
        name="email-notifications"
        value="enabled"
        defaultChecked
        label="ارسال رایانامه‌های آموزشی"
      />
      <SwitchField
        id="switch-form-sms"
        name="sms-notifications"
        value="enabled"
        uncheckedValue="disabled"
        label="ارسال پیامک‌های ضروری"
      />
    </form>
  ),
  play: async ({ canvas }) => {
    const form = canvas.getByRole("form", { name: "تنظیمات اطلاع‌رسانی" });
    const emailInput = form.querySelector<HTMLInputElement>('input[type="checkbox"][name="email-notifications"]');
    const smsInput = form.querySelector<HTMLInputElement>('input[type="checkbox"][name="sms-notifications"]');

    await expect(emailInput).not.toBeNull();
    await expect(smsInput).not.toBeNull();
    await expect(emailInput).toBeChecked();
    await expect(smsInput).not.toBeChecked();
    await expect(form.querySelector('input[type="hidden"][name="sms-notifications"]')).toHaveValue("disabled");
  },
} satisfies Story;

/*===== Ref, Callback, and Render Composition =====*/

function RefPreview({ onCheckedChange }: Pick<SwitchProps, "onCheckedChange">) {
  const switchRef = useRef<HTMLElement>(null);
  const [refResult, setRefResult] = useState("مرجع بررسی نشده است");

  return (
    <div className="grid w-[min(100%,32rem)] gap-4">
      <label className="flex items-center gap-3 text-sm leading-snug font-medium">
        <Switch ref={switchRef} onCheckedChange={onCheckedChange} />
        <span>دریافت دعوت‌نامه‌های علمی</span>
      </label>
      <Button type="button" variant="outline" onClick={() => setRefResult(switchRef.current?.tagName ?? "نامشخص")}>
        بررسی مرجع کنترل
      </Button>
      <output aria-live="polite" className="text-sm text-muted-foreground">
        {refResult}
      </output>
    </div>
  );
}

export const RefAndCallback = {
  render: (args) => <RefPreview onCheckedChange={args.onCheckedChange} />,
  play: async ({ canvas, args, userEvent }) => {
    const switchControl = canvas.getByRole("switch", { name: "دریافت دعوت‌نامه‌های علمی" });

    await userEvent.click(switchControl);
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole("button", { name: "بررسی مرجع کنترل" }));
    await expect(canvas.getByText("SPAN")).toBeInTheDocument();
  },
} satisfies Story;

export const StateClassCallback = {
  args: { onCheckedChange: undefined },
  render: () => (
    <label className="flex items-center gap-3 text-sm leading-snug font-medium">
      <Switch
        className={(state) => (state.checked ? "data-state-callback-checked" : "data-state-callback-unchecked")}
      />
      <span>نمایش وضعیت با تابع کلاس</span>
    </label>
  ),
  play: async ({ canvas, userEvent }) => {
    const switchControl = canvas.getByRole("switch", { name: "نمایش وضعیت با تابع کلاس" });

    await expect(switchControl).toHaveClass("data-state-callback-unchecked");
    await userEvent.click(switchControl);
    await expect(switchControl).toHaveClass("data-state-callback-checked");
  },
} satisfies Story;

export const NativeButtonRender = {
  render: () => (
    <div className="flex items-center gap-3">
      <Label htmlFor="switch-native-button">پخش خودکار ویدئوهای آموزشی</Label>
      <Switch id="switch-native-button" nativeButton render={<button type="button" />} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const switchControl = canvas.getByRole("switch", { name: "پخش خودکار ویدئوهای آموزشی" });

    await expect(switchControl.tagName).toBe("BUTTON");
    await userEvent.click(switchControl);
    await expect(switchControl).toHaveAttribute("aria-checked", "true");
  },
} satisfies Story;

/*===== Persian Wrapping and Theme Comparison =====*/

export const LongLabel = {
  render: () => (
    <div className="grid w-[min(100%,18rem)] gap-4">
      <SwitchField
        id="switch-long-label"
        label="دریافت اعلان برای تغییرات زمان‌بندی کلاس‌ها و اطلاعیه‌های آموزشی دانشکده مهندسی"
        description="این توضیح نیز باید در اندازه‌های بزرگ‌نمایی و فاصله‌گذاری متن قابل خواندن باقی بماند."
      />
    </div>
  ),
} satisfies Story;

export const ThemeComparison = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl bg-background p-4 text-foreground">
        <SwitchField id="switch-theme-light" label="پوسته روشن" defaultChecked />
      </div>
      <div className="dark rounded-2xl bg-background p-4 text-foreground">
        <SwitchField id="switch-theme-dark" label="پوسته تیره" defaultChecked />
      </div>
    </div>
  ),
} satisfies Story;
