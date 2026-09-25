import type { Meta, StoryObj } from "@storybook/react-vite";
import { BookOpen, GraduationCap, MessagesSquare } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { expect, fn } from "storybook/test";

import { Button } from "../button/button";
import { LinkTile, type LinkTileProps } from "./link-tile";
import { twVariant } from "./link-tile.styles";

/*===== Story Options =====*/

const variantOptions = Object.keys(twVariant) as Array<keyof typeof twVariant>;

/*===== Metadata =====*/

const meta = {
  title: "Primitive/LinkTile",
  component: LinkTile,
  decorators: [
    (Story) => (
      <div dir="rtl" lang="fa" className="w-[min(40rem,90vw)] rounded-2xl bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered", a11y: { test: "error" } },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: variantOptions },
    children: { control: "text" },
    description: { control: "text" },
    icon: { control: false },
    className: { control: false },
    ref: { control: false },
    render: { control: false },
    onClick: { control: false },
  },
  args: {
    href: "https://hut.ac.ir/",
    children: "صدای شما برای ما مهم است",
    description: "راه‌های ارتباط با دانشگاه و ارسال دیدگاه‌ها و پیشنهادات",
    icon: <MessagesSquare strokeWidth={1.5} />,
    variant: "row",
    onClick: fn((event: MouseEvent<HTMLAnchorElement>) => event.preventDefault()),
  },
} satisfies Meta<typeof LinkTile>;

export default meta;
type Story = StoryObj<typeof meta>;

/*===== Preview Helper =====*/

function TilePreview(props: LinkTileProps) {
  return (
    <div
      className={
        props.variant === "stacked" ? "overflow-hidden rounded-2xl border bg-card" : "rounded-2xl bg-secondary/45 p-3"
      }
    >
      <LinkTile {...props} />
    </div>
  );
}

/*===== Controls and Defaults =====*/

export const Controls = { render: (args) => <TilePreview {...args} /> } satisfies Story;

export const Default = {
  args: { variant: undefined },
  render: (args) => <TilePreview {...args} />,
} satisfies Story;

/*===== Layout Gallery =====*/

export const Variants = {
  argTypes: { variant: { control: false } },
  render: (args) => (
    <div className="grid gap-6">
      {variantOptions.map((variant) => (
        <div key={variant} className="grid gap-2">
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {variant}
          </span>
          <TilePreview {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
} satisfies Story;

export const ServiceShortcut = {
  args: {
    variant: "stacked",
    children: "سامانه گلستان",
    description: "خدمات آموزشی",
    icon: <GraduationCap strokeWidth={1.5} />,
  },
  render: (args) => <TilePreview {...args} />,
} satisfies Story;

/*===== Optional Content and Wrapping =====*/

export const WithoutDescription = {
  args: { description: undefined },
  render: (args) => <TilePreview {...args} />,
} satisfies Story;

export const WithoutIcon = {
  args: { icon: undefined },
  render: (args) => <TilePreview {...args} />,
} satisfies Story;

export const LabelOnly = {
  args: { icon: undefined, description: undefined },
  render: (args) => <TilePreview {...args} />,
} satisfies Story;

export const LongContent = {
  args: {
    children: "دسترسی به منابع علمی و خدمات آموزشی جامعه دانشگاهی",
    description: "راهنمای استفاده از منابع کتابخانه، پایگاه‌های پژوهشی و خدمات الکترونیکی دانشگاه صنعتی همدان",
  },
  render: (args) => (
    <div className="max-w-80">
      <TilePreview {...args} />
    </div>
  ),
} satisfies Story;

/*===== Native Attributes and Keyboard =====*/

export const NativeAttributes = {
  args: { target: "_blank", rel: "noopener noreferrer", title: "ارتباط با دانشگاه", "aria-describedby": "tile-hint" },
  render: (args) => (
    <div>
      <TilePreview {...args} />
      <p id="tile-hint" className="mt-3 text-xs text-muted-foreground">
        در پنجره جدید باز می‌شود
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link");
    await expect(link).toHaveAttribute("href", "https://hut.ac.ir/");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link).toHaveAttribute("title", "ارتباط با دانشگاه");
    await expect(link).toHaveAccessibleDescription("در پنجره جدید باز می‌شود");
    await expect(link.querySelector('[data-slot="link-tile-icon"]')).toHaveAttribute("aria-hidden", "true");
    await expect(link.querySelector('[data-slot="link-tile-arrow"]')).toHaveAttribute("aria-hidden", "true");
  },
} satisfies Story;

export const CustomLinkRenderer = {
  render: () => (
    <LinkTile
      render={<a href="/complaints-and-feedback" />}
      icon={<MessagesSquare strokeWidth={1.5} />}
      description="مسیر داخلی با مسیریاب برنامه"
    >
      ثبت شکایات و پیشنهادات
    </LinkTile>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link")).toHaveAttribute("href", "/complaints-and-feedback");
  },
} satisfies Story;

export const KeyboardNavigation = {
  render: (args) => (
    <div className="grid gap-4">
      <TilePreview {...args} />
      <TilePreview {...args} variant="stacked" icon={<BookOpen strokeWidth={1.5} />}>
        کتابخانه مرکزی
      </TilePreview>
    </div>
  ),
  play: async ({ canvas, args, userEvent }) => {
    const [firstLink, secondLink] = canvas.getAllByRole("link");
    firstLink.focus();
    await expect(firstLink).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    await expect(secondLink).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
} satisfies Story;

/*===== Native Anchor Ref =====*/

function RefPreview(args: LinkTileProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  return (
    <div className="grid gap-4">
      <LinkTile {...args} ref={linkRef} />
      <Button variant="outline" onClick={() => linkRef.current?.focus()}>
        تمرکز بر پیوند
      </Button>
    </div>
  );
}

export const NativeRef = {
  render: (args) => <RefPreview {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "تمرکز بر پیوند" }));
    await expect(canvas.getByRole("link")).toHaveFocus();
  },
} satisfies Story;
