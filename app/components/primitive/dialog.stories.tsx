import { DirectionProvider } from "@base-ui/react/direction-provider";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { expect, fn, waitFor, within } from "storybook/test";

import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
  type DialogProps,
} from "./dialog";

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Dialog",
  component: Dialog,
  decorators: [
    (Story) => (
      <DirectionProvider direction="rtl">
        <div dir="rtl" lang="fa" className="rounded-2xl bg-background p-6 text-foreground">
          <Story />
        </div>
      </DirectionProvider>
    ),
  ],
  parameters: { layout: "centered", a11y: { test: "error" } },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: "boolean" },
    disablePointerDismissal: { control: "boolean" },
    open: { control: false },
    onOpenChange: { control: false },
    children: { control: false },
  },
  args: { onOpenChange: fn() },
  render: (args) => <DialogPreview {...args} />,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/*===== Search Composition =====*/

function DialogPreview({ overlayProps, ...props }: DialogProps & Pick<DialogContentProps, "overlayProps">) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog {...props}>
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="جستجو در دانشگاه" />}>
        <Search aria-hidden="true" />
      </DialogTrigger>
      <DialogContent lang="fa" className="sm:max-w-xl" initialFocus={inputRef} overlayProps={overlayProps}>
        {/*===== Search Header =====*/}
        <DialogHeader>
          <div>
            <DialogTitle>جستجو در دانشگاه</DialogTitle>
            <DialogDescription className="mt-1">سامانه‌ها و بخش‌های دانشگاه</DialogDescription>
          </div>
          <DialogClose render={<Button variant="ghost" size="icon" aria-label="بستن جستجو" />}>
            <X aria-hidden="true" />
          </DialogClose>
        </DialogHeader>
        {/*===== Search Input =====*/}
        <div className="grid gap-4 px-5 pb-5">
          <input
            ref={inputRef}
            aria-label="عبارت جستجو"
            placeholder="چه چیزی را جستجو می‌کنید؟"
            className="min-h-11 rounded-lg border bg-background px-3 focus-visible:outline-2 focus-visible:outline-ring"
          />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>بازگشت به صفحه</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/*===== Defaults and Open State =====*/

export const Default = {} satisfies Story;
export const InitiallyOpen = { args: { defaultOpen: true } } satisfies Story;

export const LongContent = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent lang="fa" className="sm:max-w-xl">
        <DialogHeader>
          <div>
            <DialogTitle>راهنمای استفاده از سامانه</DialogTitle>
            <DialogDescription className="mt-1">اطلاعات کامل و قابل پیمایش درباره خدمات دانشگاه</DialogDescription>
          </div>
          <DialogClose render={<Button variant="ghost" size="icon" aria-label="بستن راهنما" />}>
            <X aria-hidden="true" />
          </DialogClose>
        </DialogHeader>
        <div className="grid gap-4 px-5 pb-5 leading-7">
          <p>
            این متن طولانی برای بررسی رفتار پنجره در اندازه‌های کوچک، بزرگ‌نمایی مرورگر و فاصله‌گذاری متن نوشته شده است.
          </p>
          <p>
            کاربران باید بتوانند بدون پیمایش افقی به همه اطلاعات دسترسی داشته باشند و هنگام استفاده از صفحه‌کلید، مسیر
            تمرکز را به‌سادگی دنبال کنند.
          </p>
          <p>
            راهنمای خدمات آموزشی، پژوهشی و رفاهی دانشگاه در این بخش ارائه می‌شود تا محتوای پنجره در ارتفاع‌های مختلف نیز
            قابل مشاهده و پیمایش باقی بماند.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole("dialog", { name: "راهنمای استفاده از سامانه" });
    await expect(dialog).toHaveAttribute("dir", "rtl");
    await expect(getComputedStyle(dialog).overflowY).toBe("auto");
    await expect(body.getByText(/این متن طولانی برای بررسی رفتار پنجره/)).toBeInTheDocument();
  },
} satisfies Story;

/*===== Backdrop Customization =====*/

export const CustomOverlay = {
  render: (args) => (
    <DialogPreview {...args} overlayProps={{ className: (state) => (state.open ? "bg-black/40" : undefined) }} />
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "جستجو در دانشگاه" }));
    const body = canvasElement.ownerDocument.body;
    await within(body).findByRole("dialog", { name: "جستجو در دانشگاه" });
    const overlay = body.querySelector('[data-slot="dialog-overlay"]');
    await expect(overlay).toHaveClass("bg-black/40", "fixed", "inset-0");
    await expect(overlay).not.toHaveClass("bg-black/10");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(body).queryByRole("dialog")).not.toBeInTheDocument());
  },
} satisfies Story;

/*===== Controlled State and Keyboard Focus =====*/

function ControlledPreview({ onOpenChange, ...props }: DialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <DialogPreview
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
    const trigger = canvas.getByRole("button", { name: "جستجو در دانشگاه" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const dialog = await body.findByRole("dialog", { name: "جستجو در دانشگاه" });
    const input = body.getByRole("textbox", { name: "عبارت جستجو" });
    await waitFor(() => expect(input).toHaveFocus());
    await expect(dialog).toHaveAttribute("dir", "rtl");
    await expect(dialog).toHaveAccessibleDescription("سامانه‌ها و بخش‌های دانشگاه");
    for (let index = 0; index < 4; index += 1) {
      await userEvent.tab();
      await waitFor(() => expect(dialog.contains(canvasElement.ownerDocument.activeElement)).toBe(true));
    }
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenCalledTimes(2);
  },
} satisfies Story;

/*===== State Classes, Refs, and Render Composition =====*/

function RenderPreview() {
  const popupRef = useRef<HTMLDivElement>(null);
  return (
    <Dialog>
      <DialogTrigger
        render={(props, state) => (
          <Button {...props} variant={state.open ? "outline" : "default"}>
            نمایش راهنما
          </Button>
        )}
      />
      <DialogContent
        ref={popupRef}
        lang="fa"
        className={(state) => (state.open ? "ring-2 sm:max-w-xl" : "sm:max-w-xl")}
        initialFocus={popupRef}
      >
        <DialogHeader>
          <div>
            <DialogTitle>راهنمای دانشگاه</DialogTitle>
            <DialogDescription className="mt-1">اطلاعات مورد نیاز شما</DialogDescription>
          </div>
          <DialogClose render={<Button variant="ghost" size="icon" aria-label="بستن راهنما" />}>
            <X aria-hidden="true" />
          </DialogClose>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export const RenderComposition = {
  render: () => <RenderPreview />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "نمایش راهنما" }));
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: "راهنمای دانشگاه" });
    await waitFor(() => expect(dialog).toHaveFocus());
    await expect(dialog).toHaveClass("ring-2");
    await expect(dialog).not.toHaveClass("ring-1");
    await userEvent.keyboard("{Escape}");
  },
} satisfies Story;
