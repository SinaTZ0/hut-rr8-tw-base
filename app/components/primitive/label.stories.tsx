import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState, type ComponentProps } from "react";
import { expect, fn } from "storybook/test";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Label",
  component: Label,
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
    children: { control: "text" },
    htmlFor: { control: "text" },
    onClick: { control: false },
    className: { control: false },
    ref: { control: false },
  },
  args: {
    children: "نام و نام خانوادگی",
    htmlFor: "label-controls-input",
    onClick: fn(),
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

/*===== Defaults and Controls =====*/

export const Controls = {
  render: (args) => {
    const inputId = args.htmlFor ?? "label-controls-input";

    return (
      <div className="grid w-[min(100%,28rem)] gap-2">
        <Label {...args} htmlFor={inputId}>
          {args.children ?? "نام و نام خانوادگی"}
        </Label>
        <Input id={inputId} defaultValue="سارا احمدی" />
      </div>
    );
  },
} satisfies Story;

export const Default = {
  // Label has no visual axis or prop default; the story supplies only the native relationship needed for a usable example.
  args: { children: undefined, htmlFor: undefined, onClick: undefined },
  render: (args) => (
    <div className="grid w-[min(100%,28rem)] gap-2">
      <Label {...args} htmlFor="label-default-input">
        عنوان درخواست
      </Label>
      <Input id="label-default-input" placeholder="عنوان را وارد کنید" />
    </div>
  ),
} satisfies Story;

/*===== Native Relationship =====*/

export const NativeRelationship = {
  render: () => (
    <div className="grid w-[min(100%,28rem)] gap-2">
      <Label htmlFor="label-email">رایانامه دانشگاهی</Label>
      <Input id="label-email" type="email" autoComplete="email" placeholder="student@hut.ac.ir" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const label = canvas.getByText("رایانامه دانشگاهی");
    const input = canvas.getByRole("textbox", { name: "رایانامه دانشگاهی" });

    await expect(label).toHaveAttribute("for", "label-email");
    await expect(canvas.getByLabelText("رایانامه دانشگاهی")).toBe(input);
    await userEvent.click(label);
    await expect(input).toHaveFocus();
  },
} satisfies Story;

/*===== Disabled Group Behavior =====*/

export const DisabledPeerAndGroup = {
  render: () => (
    <div className="grid w-[min(100%,32rem)] gap-6">
      <div className="grid gap-2">
        <Input id="label-peer-disabled" className="peer" disabled defaultValue="حساب غیرفعال" />
        <Label htmlFor="label-peer-disabled">حساب کاربری غیرفعال</Label>
      </div>
      <div data-disabled="true" className="group grid gap-2">
        <Label htmlFor="label-group-disabled">ارسال اعلان‌های گروهی</Label>
        <Input id="label-group-disabled" disabled defaultValue="این گزینه در دسترس نیست" />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const peerInput = canvas.getByRole("textbox", { name: "حساب کاربری غیرفعال" });
    const groupInput = canvas.getByRole("textbox", { name: "ارسال اعلان‌های گروهی" });

    await expect(peerInput).toBeDisabled();
    await expect(groupInput).toBeDisabled();
    await expect(canvas.getByText("ارسال اعلان‌های گروهی")).toHaveAttribute("for", "label-group-disabled");
    await expect(canvas.getByText("ارسال اعلان‌های گروهی").parentElement).toHaveAttribute("data-disabled", "true");
  },
} satisfies Story;

/*===== Ref and Callback =====*/

type LabelCallbackProps = Pick<ComponentProps<typeof Label>, "onClick">;

function LabelRefPreview({ onClick }: LabelCallbackProps) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const [refTag, setRefTag] = useState("مرجع بررسی نشده است");

  return (
    <div className="grid w-[min(100%,32rem)] gap-4">
      <Label ref={labelRef} htmlFor="label-ref-input" onClick={onClick}>
        برچسب قابل بررسی
      </Label>
      <Input id="label-ref-input" defaultValue="مقدار نمونه" />
      <Button type="button" onClick={() => setRefTag(labelRef.current?.tagName ?? "نامشخص")}>
        بررسی مرجع برچسب
      </Button>
      <output aria-live="polite" className="text-sm text-muted-foreground">
        {refTag}
      </output>
    </div>
  );
}

export const RefAndCallback = {
  args: { onClick: fn() },
  render: (args) => <LabelRefPreview {...args} />,
  play: async ({ canvas, args, userEvent }) => {
    const label = canvas.getByText("برچسب قابل بررسی");
    const input = canvas.getByRole("textbox", { name: "برچسب قابل بررسی" });
    const checkRefButton = canvas.getByRole("button", { name: "بررسی مرجع برچسب" });

    await userEvent.click(checkRefButton);
    await expect(canvas.getByText("LABEL")).toBeInTheDocument();
    await userEvent.click(label);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(input).toHaveFocus();
  },
} satisfies Story;

/*===== Persian Wrapping =====*/

export const LongPersianLabel = {
  render: () => (
    <div className="grid w-[min(100%,15rem)] gap-2">
      <Label htmlFor="label-long-input">
        عنوان کامل درخواست استفاده از سامانه پذیرش و خدمات الکترونیکی دانشگاه صنعتی همدان
      </Label>
      <Input id="label-long-input" defaultValue="درخواست پژوهشی" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("textbox", {
        name: "عنوان کامل درخواست استفاده از سامانه پذیرش و خدمات الکترونیکی دانشگاه صنعتی همدان",
      }),
    ).toBeInTheDocument();
  },
} satisfies Story;
