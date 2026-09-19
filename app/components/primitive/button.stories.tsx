import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { expect, fn } from "storybook/test";

import { Button, twSize, twVariant, type ButtonProps } from "./button";

/*===== Story Options =====*/

const variantOptions = Object.keys(twVariant) as Array<keyof typeof twVariant>;
const sizeOptions = Object.keys(twSize) as Array<keyof typeof twSize>;
const textSizeOptions = sizeOptions.filter((size) => !size.startsWith("icon"));

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Button",
  component: Button,
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
    disabled: { control: "boolean" },
    onClick: { control: false },
    className: { control: false },
    render: { control: false },
  },
  args: {
    children: "ثبت درخواست",
    variant: "default",
    size: "default",
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/*===== Preview Helper =====*/

/** Gives icon sizes an icon and an accessible name instead of overflowing text. */
function ButtonPreview({ children, size, ...props }: ButtonProps) {
  const isIcon = size?.startsWith("icon") ?? false;

  return (
    <Button
      {...props}
      size={size}
      aria-label={
        isIcon ? (props["aria-label"] ?? (typeof children === "string" ? children : "دکمه")) : props["aria-label"]
      }
    >
      {isIcon ? <Plus aria-hidden="true" /> : children}
    </Button>
  );
}

/*===== Controls and Defaults =====*/

export const Controls = {
  render: (args) => <ButtonPreview {...args} />,
} satisfies Story;

export const Default = {
  // Let the component supply its defaults rather than the story's default args.
  args: { variant: undefined, size: undefined },
  render: (args) => <ButtonPreview {...args} />,
} satisfies Story;

/*===== Variant Gallery =====*/

export const Variants = {
  argTypes: { variant: { control: false } },
  render: (args) => (
    <div className="flex flex-wrap gap-6">
      {variantOptions.map((variant) => (
        <div key={variant} className="grid justify-items-center gap-3">
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {variant}
          </span>
          <ButtonPreview {...args} variant={variant} />
          {/* Colored surfaces demonstrate inherited foregrounds such as inverse-outline. */}
          <div className="rounded-xl bg-university-deep p-3 text-white">
            <ButtonPreview {...args} variant={variant} />
          </div>
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
          <ButtonPreview {...args} size={size} />
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {size}
          </span>
        </div>
      ))}
    </div>
  ),
} satisfies Story;

/*===== Text and Icon =====*/

export const WithIcon = {
  argTypes: { size: { options: textSizeOptions } },
  render: ({ children, ...args }) => (
    <Button {...args}>
      <Plus aria-hidden="true" />
      {children}
    </Button>
  ),
} satisfies Story;

/*===== Enabled and Disabled States =====*/

export const States = {
  argTypes: {
    variant: { control: false },
    disabled: { control: false },
  },
  render: (args) => (
    <div className="grid gap-4">
      {variantOptions.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          <span dir="ltr" lang="en" className="w-28 text-xs text-muted-foreground">
            {variant}
          </span>
          <ButtonPreview {...args} variant={variant} disabled={false} />
          <ButtonPreview {...args} variant={variant} disabled />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas, args, userEvent }) => {
    const buttons = canvas.getAllByRole("button");
    let activationCount = 0;

    for (let index = 0; index < buttons.length; index += 2) {
      const enabledButton = buttons[index];
      const disabledButton = buttons[index + 1];

      await expect(enabledButton).toBeEnabled();
      await expect(disabledButton).toBeDisabled();
      enabledButton.focus();
      await expect(enabledButton).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");
      activationCount += 2;
      await expect(args.onClick).toHaveBeenCalledTimes(activationCount);

      // Programmatic clicks bypass CSS and verify the native disabled guard.
      disabledButton.click();
      await expect(args.onClick).toHaveBeenCalledTimes(activationCount);

      if (index + 2 < buttons.length) {
        await userEvent.tab();
        await expect(buttons[index + 2]).toHaveFocus();
      }
    }
  },
} satisfies Story;
