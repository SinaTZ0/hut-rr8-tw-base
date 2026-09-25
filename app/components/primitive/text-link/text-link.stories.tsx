import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, type MouseEvent } from "react";
import { expect, fn } from "storybook/test";

import { TextLink, type TextLinkProps } from "./text-link";
import { twSize, twVariant } from "./text-link.styles";
import { Button } from "../button/button";

/*===== Story Options =====*/

const variantOptions = Object.keys(twVariant) as Array<keyof typeof twVariant>;
const sizeOptions = Object.keys(twSize) as Array<keyof typeof twSize>;

/*===== Metadata =====*/

const meta = {
  title: "Primitive/TextLink",
  component: TextLink,
  decorators: [
    (Story) => (
      <div dir="rtl" lang="fa" className="rounded-2xl bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered", a11y: { test: "error" } },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: variantOptions },
    size: { control: "select", options: sizeOptions },
    children: { control: "text" },
    external: { control: "boolean" },
    className: { control: false },
    ref: { control: false },
    onClick: { control: false },
  },
  args: {
    children: "همه اخبار دانشگاه",
    href: "https://hut.ac.ir/",
    variant: "default",
    size: "default",
    external: false,
    onClick: fn((event: MouseEvent<HTMLAnchorElement>) => event.preventDefault()),
  },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/*===== Preview Helper =====*/

/** Highlight links belong on the homepage's colored surfaces in both themes. */
function LinkPreview(props: TextLinkProps) {
  return (
    <div className={props.variant === "highlight" ? "rounded-xl bg-university-deep p-3 text-white" : "p-3"}>
      <TextLink {...props} />
    </div>
  );
}

/*===== Defaults and Controls =====*/

export const Controls = { render: (args) => <LinkPreview {...args} /> } satisfies Story;
export const Default = {
  args: { variant: undefined, size: undefined },
  render: (args) => <LinkPreview {...args} />,
} satisfies Story;

/*===== Styling Galleries =====*/

export const Variants = {
  argTypes: { variant: { control: false } },
  render: (args) => (
    <div className="flex flex-wrap gap-6">
      {variantOptions.map((variant) => (
        <div key={variant} className="grid gap-2">
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {variant}
          </span>
          <LinkPreview {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
} satisfies Story;

export const Sizes = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <div className="flex flex-wrap gap-6">
      {sizeOptions.map((size) => (
        <div key={size} className="grid gap-2">
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {size}
          </span>
          <LinkPreview {...args} size={size} />
        </div>
      ))}
    </div>
  ),
} satisfies Story;

/*===== Native Attributes and Keyboard =====*/

export const ExternalArrow = {
  args: { external: true, target: "_blank", rel: "noopener noreferrer", children: "مرکز رشد و کارآفرینی" },
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link");
    await expect(link).toHaveAttribute("href", "https://hut.ac.ir/");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  },
} satisfies Story;

export const KeyboardFocus = {
  play: async ({ canvas, args, userEvent }) => {
    const link = canvas.getByRole("link");
    link.focus();
    await expect(link).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
} satisfies Story;

/*===== Native Anchor Ref =====*/

function RefPreview(args: TextLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  return (
    <div className="grid justify-items-start gap-4">
      <TextLink {...args} ref={linkRef} />
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
