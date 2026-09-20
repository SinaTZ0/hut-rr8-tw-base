import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, type AccordionProps } from "./accordion";

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Accordion",
  component: Accordion,
  decorators: [
    (Story) => (
      <div dir="rtl" lang="fa" className="w-[min(80vw,380px)] rounded-2xl bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered", a11y: { test: "error" } },
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    className: { control: false },
    render: { control: false },
    value: { control: false },
    onValueChange: { control: false },
  },
  args: { multiple: false, disabled: false, onValueChange: fn() },
  render: (args) => <AccordionPreview {...args} />,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/*===== Navigation Composition =====*/

function AccordionPreview(props: AccordionProps) {
  return (
    <Accordion {...props}>
      <AccordionItem value="university">
        <AccordionTrigger>دانشگاه</AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-1 pb-3">
            <a href="#معرفی" className="flex min-h-11 items-center rounded-lg px-3 hover:bg-muted">
              معرفی دانشگاه
            </a>
            <a href="#هیئت-علمی" className="flex min-h-11 items-center rounded-lg px-3 hover:bg-muted">
              اعضای هیئت علمی
            </a>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="education">
        <AccordionTrigger>آموزش</AccordionTrigger>
        <AccordionContent>
          <p className="leading-7">تقویم آموزشی و راهنمای نودانشجویان</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/*===== Defaults and Interaction States =====*/

export const Default = {} satisfies Story;
export const Expanded = { args: { defaultValue: ["university"] } } satisfies Story;
export const Multiple = { args: { multiple: true, defaultValue: ["university", "education"] } } satisfies Story;
export const Disabled = {
  args: { disabled: true },
  play: async ({ canvas, args, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "دانشگاه" });
    await expect(trigger).toHaveAttribute("data-disabled");
    trigger.click();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
} satisfies Story;

/*===== Controlled State and Render Composition =====*/

function ControlledPreview() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Accordion value={value} onValueChange={setValue}>
      <AccordionItem value="research" className={(state) => (state.open ? "bg-muted/30" : undefined)}>
        <AccordionTrigger
          render={<button type="button" />}
          className={(state) => (state.open ? "text-primary" : undefined)}
        >
          پژوهش و فناوری
        </AccordionTrigger>
        <AccordionContent render={<section />} className={(state) => (state.open ? "text-foreground" : undefined)}>
          <p className="leading-7">از ایده تا ارتباط با صنعت</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export const Controlled = {
  render: () => <ControlledPreview />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "پژوهش و فناوری" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(trigger).toHaveClass("text-primary");
    await expect(canvas.getByText("از ایده تا ارتباط با صنعت").closest("section")).toHaveAttribute("data-open");
    await userEvent.keyboard(" ");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.tab();
    await expect(trigger).not.toHaveFocus();
  },
} satisfies Story;
