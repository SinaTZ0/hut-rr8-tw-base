import { DirectionProvider } from "@base-ui/react/direction-provider";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { expect, fn, waitFor, within } from "storybook/test";

import { Button } from "../button/button";
import { Label } from "../label/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectTriggerProps,
} from "./select";
import { twSize } from "./select.styles";

/*===== Options and Metadata =====*/

const sizeOptions = Object.keys(twSize) as Array<keyof typeof twSize>;
const units = [
  "ریاست دانشگاه",
  "معاونت اداری و مالی",
  "معاون آموزشی و پژوهشی",
  "مدیر حراست",
  "مدیر آموزش",
  "مدیر گروه ریاضی",
  "مدیر گروه مهندسی برق - مخابرات و الکترونیک",
  "مدیر گروه مهندسی برق - کنترل و قدرت",
  "مدیر گروه عمران",
  "مدیر گروه معارف",
  "مدیر گروه صنایع",
  "مدیر گروه مهندسی کامپیوتر",
  "مدیر گروه شیمی",
];

const meta = {
  title: "Primitive/Select",
  component: SelectTrigger,
  subcomponents: { Select, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator },
  decorators: [
    (Story) => (
      <DirectionProvider direction="rtl">
        <div dir="rtl" lang="fa" className="w-[min(100%,28rem)] bg-background p-4 text-foreground sm:p-6">
          <Story />
        </div>
      </DirectionProvider>
    ),
  ],
  parameters: { layout: "centered", a11y: { test: "error" } },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: sizeOptions },
    disabled: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
    className: { control: false },
    render: { control: false },
    ref: { control: false },
  },
  args: { size: "default", disabled: false, "aria-invalid": false },
  render: (args) => <SelectExample {...args} />,
} satisfies Meta<typeof SelectTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

/*===== Shared Composition =====*/

function SelectExample({ id = "select-unit", disabled, ...props }: SelectTriggerProps) {
  return (
    <div className="grid gap-2">
      <Label id={`${id}-label`} htmlFor={id}>
        واحد دانشگاه
      </Label>
      <Select disabled={disabled}>
        <SelectTrigger id={id} {...props}>
          <SelectValue placeholder="انتخاب کنید" />
        </SelectTrigger>
        <SelectContent aria-labelledby={`${id}-label`}>
          <SelectItem value={null}>انتخاب کنید</SelectItem>
          {units.map((unit) => (
            <SelectItem key={unit} value={unit}>
              {unit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/*===== Defaults and States =====*/

export const Controls = {} satisfies Story;
export const Default = { args: { size: undefined } } satisfies Story;
export const Sizes = {
  render: () => (
    <div className="grid gap-5">
      {sizeOptions.map((size) => (
        <SelectExample key={size} id={`select-${size}`} size={size} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const [index, size] of sizeOptions.entries()) {
      await expect(canvas.getAllByRole("combobox")[index]).toHaveAttribute("data-size", size);
    }
  },
} satisfies Story;
export const Disabled = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox")).toBeDisabled();
  },
} satisfies Story;
export const Invalid = { args: { "aria-invalid": true } } satisfies Story;

/*===== Groups and Disabled Options =====*/

export const GroupedOptions = {
  render: () => (
    <div className="grid gap-2">
      <Label id="select-grouped-label" htmlFor="select-grouped">
        بخش دانشگاه
      </Label>
      <Select
        defaultValue="education"
        items={{ education: "آموزش", housing: "امور خوابگاه‌ها (موقتاً غیرفعال)", research: "معاونت پژوهشی" }}
      >
        <SelectTrigger id="select-grouped">
          <SelectValue />
        </SelectTrigger>
        <SelectContent aria-labelledby="select-grouped-label">
          <SelectGroup>
            <SelectLabel>خدمات دانشجویی</SelectLabel>
            <SelectItem value="education">آموزش</SelectItem>
            <SelectItem value="housing" disabled>
              امور خوابگاه‌ها (موقتاً غیرفعال)
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>پژوهش و فناوری</SelectLabel>
            <SelectItem value="research">معاونت پژوهشی</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox"));
    const portal = within(canvasElement.ownerDocument.body);
    await expect(await portal.findByRole("option", { name: /امور خوابگاه/ })).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(await portal.findByRole("option", { name: "معاونت پژوهشی" }));
    await expect(canvas.getByRole("combobox")).toHaveTextContent("معاونت پژوهشی");
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).queryByRole("listbox")).toBeNull());
  },
} satisfies Story;

/*===== Long Lists and Keyboard Navigation =====*/

export const LongList = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole("combobox");
    const portal = within(canvasElement.ownerDocument.body);
    await userEvent.click(trigger);
    const popup = canvasElement.ownerDocument.querySelector('[data-slot="select-content"]');
    await expect(popup).toHaveAttribute("dir", "rtl");
    await expect(popup).toHaveAttribute("data-lenis-prevent");
    // Base UI schedules option focus; send each key after its focus transition has completed.
    await waitFor(() => expect(portal.getByRole("option", { name: "انتخاب کنید" })).toHaveFocus());
    await userEvent.keyboard("{End}");
    await waitFor(() => expect(portal.getByRole("option", { name: units.at(-1)! })).toHaveFocus());
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveTextContent(units.at(-1)!);
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).queryByRole("listbox")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.click(trigger);
    await waitFor(() => expect(portal.getByRole("option", { name: units.at(-1)! })).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).queryByRole("listbox")).toBeNull());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
} satisfies Story;

export const WheelHandoff = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const document = canvasElement.ownerDocument;
    const portal = within(document.body);
    await userEvent.click(canvas.getByRole("combobox"));
    const list = (await portal.findByRole("listbox")) as HTMLDivElement;
    await waitFor(() => expect(list).toHaveClass("lenis"));

    const wheel = (deltaY: number) => {
      list.dispatchEvent(new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }));
    };

    /*------ Keyboard Reveal Cancels Wheel Inertia ------*/
    wheel(200);
    await waitFor(() => expect(list.scrollTop).toBeGreaterThan(0));
    await userEvent.keyboard("{End}");
    await waitFor(() => expect(portal.getByRole("option", { name: units.at(-1)! })).toHaveFocus());
    await expect(list).not.toHaveClass("lenis-smooth");
    const keyboardPosition = list.scrollTop;
    wheel(-40);
    await waitFor(() => expect(Math.abs(list.scrollTop - (keyboardPosition - 40))).toBeLessThan(2));
    await waitFor(() => expect(list).not.toHaveClass("lenis-smooth"));

    /*------ Scrollbar Updates Before the Native Scroll Event ------*/
    list.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    const pointerPosition = Math.floor((list.scrollHeight - list.clientHeight) / 2);
    list.scrollTop = pointerPosition;
    // Deliberately start wheel input before the asynchronous native scroll event is delivered.
    wheel(30);
    await waitFor(() => expect(Math.abs(list.scrollTop - (pointerPosition + 30))).toBeLessThan(2));
    await waitFor(() => expect(list).not.toHaveClass("lenis-smooth"));

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(portal.queryByRole("listbox")).toBeNull());
    await userEvent.click(canvas.getByRole("combobox"));
    const reopenedList = (await portal.findByRole("listbox")) as HTMLDivElement;
    await waitFor(() => expect(reopenedList).toHaveClass("lenis"));
    await expect(reopenedList).not.toHaveClass("lenis-smooth");
    await waitFor(() => expect(portal.getByRole("option", { name: "انتخاب کنید" })).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(portal.queryByRole("listbox")).toBeNull());
  },
} satisfies Story;

/*===== Controlled Value, Form Data, and Refs =====*/

function ControlledExample() {
  const [value, setValue] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
      <Label id="select-controlled-label" htmlFor="select-controlled">
        نوع پیام
      </Label>
      <Select
        name="feedbackType"
        value={value}
        onValueChange={setValue}
        required
        items={{ complaint: "شکایات", suggestion: "پیشنهادات و انتقادات" }}
      >
        <SelectTrigger id="select-controlled" ref={triggerRef}>
          <SelectValue placeholder="انتخاب کنید" />
        </SelectTrigger>
        <SelectContent aria-labelledby="select-controlled-label">
          <SelectItem value="complaint">شکایات</SelectItem>
          <SelectItem value="suggestion">پیشنهادات و انتقادات</SelectItem>
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setValue(null);
          triggerRef.current?.focus();
        }}
      >
        پاک کردن انتخاب
      </Button>
    </form>
  );
}

export const Controlled = {
  render: () => <ControlledExample />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "نوع پیام" });
    await userEvent.click(trigger);
    await userEvent.click(
      await within(canvasElement.ownerDocument.body).findByRole("option", { name: "پیشنهادات و انتقادات" }),
    );
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).queryByRole("listbox")).toBeNull());
    await expect(trigger).toHaveTextContent("پیشنهادات و انتقادات");
    await expect(new FormData(canvasElement.querySelector("form")!).get("feedbackType")).toBe("suggestion");
    await userEvent.click(canvas.getByRole("button", { name: "پاک کردن انتخاب" }));
    await expect(trigger).toHaveTextContent("انتخاب کنید");
    await expect(trigger).toHaveFocus();
    await expect(new FormData(canvasElement.querySelector("form")!).get("feedbackType")).toBe("");
  },
} satisfies Story;

const onValueChange = fn();

export const ValueChange = {
  render: () => (
    <Select
      onValueChange={onValueChange}
      defaultValue="education"
      items={{ education: "مدیر آموزش", research: "معاونت پژوهشی" }}
    >
      <SelectTrigger
        aria-label="بخش آموزشی"
        className={(state) => (state.open ? "w-full" : undefined)}
        render={<button type="button" />}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} aria-label="بخش آموزشی">
        <SelectItem value="education">مدیر آموزش</SelectItem>
        <SelectItem value="research">معاونت پژوهشی</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox"));
    await userEvent.click(
      await within(canvasElement.ownerDocument.body).findByRole("option", { name: "معاونت پژوهشی" }),
    );
    await expect(onValueChange).toHaveBeenCalledWith("research", expect.anything());
    await expect(canvas.getByRole("combobox")).toHaveTextContent("معاونت پژوهشی");
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).queryByRole("listbox")).toBeNull());
  },
} satisfies Story;
