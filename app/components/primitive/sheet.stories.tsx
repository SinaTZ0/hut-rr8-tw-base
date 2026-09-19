import { DirectionProvider } from "@base-ui/react/direction-provider";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { expect, fn, waitFor, within } from "storybook/test";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Button } from "./button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetContentProps,
  type SheetProps,
} from "./sheet";

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Sheet",
  component: Sheet,
  decorators: [
    (Story) => (
      <DirectionProvider direction="rtl">
        <div dir="rtl" lang="fa" className="rounded-2xl bg-background p-6 text-foreground">
          <Story />
        </div>
      </DirectionProvider>
    ),
  ],
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: "boolean" },
    disablePointerDismissal: { control: "boolean" },
    open: { control: false },
    onOpenChange: { control: false },
    children: { control: false },
  },
  args: { onOpenChange: fn() },
  render: (args) => <SheetPreview {...args} />,
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/*===== Mobile Navigation Composition =====*/

function SheetPreview({ overlayProps, ...props }: SheetProps & Pick<SheetContentProps, "overlayProps">) {
  const closeRef = useRef<HTMLButtonElement>(null);
  return (
    <Sheet {...props}>
      <SheetTrigger render={<Button variant="outline" size="icon" aria-label="باز کردن منو" />}>
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        lang="fa"
        className={(state) => (state.open ? "w-3/4 sm:max-w-sm" : "w-3/4 opacity-0 sm:max-w-sm")}
        initialFocus={closeRef}
        overlayProps={overlayProps}
      >
        {/*===== Drawer Header =====*/}
        <SheetHeader>
          <div className="flex items-center justify-between gap-3">
            <SheetTitle>منوی دانشگاه</SheetTitle>
            <SheetClose ref={closeRef} render={<Button variant="ghost" size="icon" aria-label="بستن منو" />}>
              <X aria-hidden="true" />
            </SheetClose>
          </div>
          <SheetDescription>دسترسی به بخش‌ها و خدمات دانشگاه صنعتی همدان</SheetDescription>
        </SheetHeader>
        {/*===== Navigation Groups =====*/}
        <nav className="px-6 pb-6" aria-label="منوی اصلی موبایل">
          <Accordion>
            <AccordionItem value="university">
              <AccordionTrigger>دانشگاه</AccordionTrigger>
              <AccordionContent>
                <a href="#معرفی" className="flex min-h-11 items-center rounded-lg px-3 hover:bg-muted">
                  معرفی دانشگاه
                </a>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="education">
              <AccordionTrigger>آموزش</AccordionTrigger>
              <AccordionContent>
                <p className="leading-7">تقویم آموزشی و راهنمای نودانشجویان</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </nav>
        <SheetFooter className="mt-auto">
          <SheetClose render={<Button variant="outline" />}>بازگشت به صفحه</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/*===== Defaults and Open State =====*/

export const Default = {} satisfies Story;
export const InitiallyOpen = { args: { defaultOpen: true } } satisfies Story;

/*===== Backdrop Customization =====*/

export const CustomOverlay = {
  render: (args) => <SheetPreview {...args} overlayProps={{ className: "bg-black/40" }} />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "باز کردن منو" }));
    const body = canvasElement.ownerDocument.body;
    await within(body).findByRole("dialog", { name: "منوی دانشگاه" });
    const overlay = body.querySelector('[data-slot="sheet-overlay"]');
    await expect(overlay).toHaveClass("bg-black/40", "fixed", "inset-0");
    await expect(overlay).not.toHaveClass("bg-black/10");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(body).queryByRole("dialog")).not.toBeInTheDocument());
  },
} satisfies Story;

/*===== Controlled State and Keyboard Focus =====*/

function ControlledPreview({ onOpenChange, ...props }: SheetProps) {
  const [open, setOpen] = useState(false);
  return (
    <SheetPreview
      {...props}
      open={open}
      onOpenChange={(nextOpen, details) => {
        setOpen(nextOpen);
        onOpenChange?.(nextOpen, details);
      }}
    />
  );
}

export const Controlled = {
  render: (args) => <ControlledPreview {...args} />,
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "باز کردن منو" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const dialog = await body.findByRole("dialog", { name: "منوی دانشگاه" });
    const close = body.getByRole("button", { name: "بستن منو" });
    await waitFor(() => expect(close).toHaveFocus());
    await expect(dialog).toHaveAttribute("dir", "rtl");
    await userEvent.tab();
    const disclosure = body.getByRole("button", { name: "دانشگاه" });
    await expect(disclosure).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(disclosure).toHaveAttribute("aria-expanded", "true");
    await userEvent.tab();
    await expect(body.getByRole("link", { name: "معرفی دانشگاه" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenCalledTimes(2);
  },
} satisfies Story;

export const CloseButton = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "باز کردن منو" });
    await userEvent.click(trigger);
    await userEvent.click(await body.findByRole("button", { name: "بستن منو" }));
    await waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
} satisfies Story;
