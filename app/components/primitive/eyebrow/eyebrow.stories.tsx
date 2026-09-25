import type { Meta, StoryObj } from "@storybook/react-vite";

import { Eyebrow, type EyebrowProps } from "./eyebrow";
import { twMarker, twSize, twVariant } from "./eyebrow.styles";

/*===== Story Options =====*/

const variantOptions = Object.keys(twVariant) as Array<keyof typeof twVariant>;
const sizeOptions = Object.keys(twSize) as Array<keyof typeof twSize>;
const markerOptions = Object.keys(twMarker) as Array<keyof typeof twMarker>;

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Eyebrow",
  component: Eyebrow,
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
    size: { control: "select", options: sizeOptions },
    marker: { control: "select", options: markerOptions },
    children: { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
  args: {
    children: "اخبار و اطلاع‌رسانی",
    variant: "default",
    size: "default",
    marker: "bar",
  },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

/*===== Preview Helper =====*/

/** Highlight and inverse labels are shown on the homepage's colored surfaces in both themes. */
function EyebrowPreview(props: EyebrowProps) {
  return (
    <div
      className={
        props.variant === "highlight" || props.variant === "inverse" ? "rounded-xl bg-university p-4 text-white" : "p-4"
      }
    >
      <Eyebrow {...props} />
    </div>
  );
}

/*===== Controls and Defaults =====*/

export const Controls = { render: (args) => <EyebrowPreview {...args} /> } satisfies Story;

export const Default = {
  args: { variant: undefined, size: undefined, marker: undefined },
  render: (args) => <EyebrowPreview {...args} />,
} satisfies Story;

/*===== Styling Galleries =====*/

export const Variants = {
  argTypes: { variant: { control: false } },
  render: (args) => (
    <div className="grid gap-4">
      {variantOptions.map((variant) => (
        <div key={variant} className="grid gap-2">
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {variant}
          </span>
          <EyebrowPreview {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
} satisfies Story;

export const Sizes = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <div className="grid gap-4">
      {sizeOptions.map((size) => (
        <div key={size} className="grid gap-2">
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {size}
          </span>
          <EyebrowPreview {...args} size={size} />
        </div>
      ))}
    </div>
  ),
} satisfies Story;

export const Markers = {
  argTypes: { marker: { control: false } },
  render: (args) => (
    <div className="grid gap-4">
      {markerOptions.map((marker) => (
        <div key={marker} className="grid gap-2">
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {marker}
          </span>
          <EyebrowPreview {...args} marker={marker} />
        </div>
      ))}
    </div>
  ),
} satisfies Story;

/*===== Homepage Examples =====*/

export const Hero = {
  args: { children: "دانش، فناوری، آینده", variant: "inverse", marker: "line" },
  render: (args) => <EyebrowPreview {...args} />,
} satisfies Story;

export const Category = {
  args: { children: "پژوهش و فناوری", size: "sm", marker: "dot" },
} satisfies Story;

export const LongLabel = {
  args: { children: "روایت تلاش‌های جامعه دانشگاهی در مسیر یادگیری، پژوهش و ساختن آینده" },
  render: (args) => (
    <div className="max-w-64">
      <Eyebrow {...args} />
    </div>
  ),
} satisfies Story;
