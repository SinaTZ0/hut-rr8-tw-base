import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Separator } from "./separator";
import { twVariant } from "./separator.styles";

/*===== Story Options =====*/

const variantOptions = Object.keys(twVariant) as Array<keyof typeof twVariant>;
const orientationOptions = ["horizontal", "vertical"] as const;

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Separator",
  component: Separator,
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
    orientation: { control: "select", options: orientationOptions },
    variant: { control: "select", options: variantOptions },
    className: { control: false },
    ref: { control: false },
  },
  args: { orientation: "horizontal", variant: "default" },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/*===== Defaults and Controls =====*/

export const Controls = {} satisfies Story;

export const Default = {
  args: { orientation: undefined, variant: undefined },
} satisfies Story;

/*===== Styling Galleries =====*/

export const Variants = {
  argTypes: { variant: { control: false } },
  render: (args) => (
    <div className="grid gap-4">
      {variantOptions.map((variant) => (
        <div
          key={variant}
          className={variant === "inverse" ? "rounded-xl bg-university-deep p-4 text-white" : "rounded-xl bg-card p-4"}
        >
          <p dir="ltr" lang="en" className="mb-3 text-xs text-muted-foreground">
            {variant}
          </p>
          <Separator {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
} satisfies Story;

export const Orientations = {
  argTypes: { orientation: { control: false } },
  render: (args) => (
    <div className="grid w-full gap-6">
      <div className="grid gap-3">
        <Separator {...args} orientation="horizontal" />
        <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
          horizontal
        </span>
      </div>
      <div className="flex h-20 items-center gap-3">
        <Separator {...args} orientation="vertical" />
        <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
          vertical
        </span>
      </div>
    </div>
  ),
} satisfies Story;

/*===== Accessibility Contract =====*/

export const SemanticRole = {
  play: async ({ canvas }) => {
    const separator = canvas.getByRole("separator");
    await expect(separator).toHaveAttribute("aria-orientation", "horizontal");
  },
} satisfies Story;

export const Decorative = {
  args: { "aria-hidden": true },
} satisfies Story;
