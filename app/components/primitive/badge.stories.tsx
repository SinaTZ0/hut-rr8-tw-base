import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, twSize, twVariant } from "./badge";

/*===== Story Options =====*/

const variantOptions = Object.keys(twVariant) as Array<keyof typeof twVariant>;
const sizeOptions = Object.keys(twSize) as Array<keyof typeof twSize>;

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Badge",
  component: Badge,
  decorators: [
    (Story) => (
      <div dir="rtl" lang="fa" className="rounded-2xl bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: variantOptions },
    size: { control: "select", options: sizeOptions },
    children: { control: "text" },
    className: { control: false },
  },
  args: {
    children: "کارگاه تخصصی",
    variant: "secondary",
    size: "default",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

/*===== Controls and Defaults =====*/

export const Controls = {} satisfies Story;

export const Default = {
  // Let the component supply its defaults rather than the story's default args.
  args: { variant: undefined, size: undefined },
} satisfies Story;

/*===== Variant Gallery =====*/

export const Variants = {
  argTypes: { variant: { control: false } },
  render: (args) => (
    <div className="flex flex-wrap items-start gap-6">
      {variantOptions.map((variant) => (
        <div key={variant} className="grid justify-items-center gap-3">
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {variant}
          </span>
          <Badge {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
} satisfies Story;

/*===== Size Gallery =====*/

export const Sizes = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <div className="flex flex-wrap items-start gap-6">
      {sizeOptions.map((size) => (
        <div key={size} className="grid justify-items-center gap-3">
          <Badge {...args} size={size} />
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {size}
          </span>
        </div>
      ))}
    </div>
  ),
} satisfies Story;
