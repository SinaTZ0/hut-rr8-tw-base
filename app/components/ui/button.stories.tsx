import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Plus } from "lucide-react";
import type { ComponentProps } from "react";
import { fn } from "storybook/test";

import { Button, twButtonIconSizeClasses, twButtonSizeClasses, twButtonVariantClasses } from "./button";

/*===== Story Options =====*/

const variantOptions = Object.keys(twButtonVariantClasses) as Array<keyof typeof twButtonVariantClasses>;
const buttonSizeOptions = Object.keys(twButtonSizeClasses) as Array<keyof typeof twButtonSizeClasses>;
const iconSizeOptions = Object.keys(twButtonIconSizeClasses) as Array<keyof typeof twButtonIconSizeClasses>;
const iconPositionOptions = ["inline-start", "inline-end"] as const;
const sectionClassName = "flex flex-wrap items-center gap-3";

/*===== Metadata =====*/

const meta = {
  title: "UI/Button",
  component: Button,
  decorators: [
    (Story) => (
      <div dir="rtl" lang="fa">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: variantOptions,
    },
    size: {
      control: "select",
      options: buttonSizeOptions,
    },
    children: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
    onClick: {
      control: false,
    },
  },
  args: {
    children: "دکمه",
    variant: "default",
    size: "default",
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;
type ButtonWithIconArgs = ComponentProps<typeof Button> & {
  iconPosition: (typeof iconPositionOptions)[number];
};

/*===== Story Helpers =====*/

function StoryIcon({ position }: { position: (typeof iconPositionOptions)[number] }) {
  return <Plus aria-hidden="true" data-icon={position} />;
}

/*===== Controls =====*/

export const Controls = {} satisfies Story;

/*===== Variants =====*/

export const Variants = {
  // These args are fixed by the gallery, so editable controls would be misleading.
  argTypes: {
    variant: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <div className={sectionClassName}>
      {variantOptions.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
} satisfies Story;

/*===== Button Sizes =====*/

export const ButtonSizes = {
  argTypes: {
    size: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <div className={sectionClassName}>
      {buttonSizeOptions.map((size) => (
        <Button key={size} {...args} size={size}>
          دکمه
        </Button>
      ))}
    </div>
  ),
} satisfies Story;

/*===== Button With Icon =====*/

export const ButtonWithIcon = {
  argTypes: {
    iconPosition: {
      control: "inline-radio",
      options: iconPositionOptions,
    },
  },
  args: {
    iconPosition: "inline-start",
  },
  render: ({ children, iconPosition, ...args }) => {
    const icon = <StoryIcon position={iconPosition} />;

    return (
      <Button {...args}>
        {iconPosition === "inline-start" ? (
          <>
            {icon}
            {children}
          </>
        ) : (
          <>
            {children}
            {icon}
          </>
        )}
      </Button>
    );
  },
} satisfies StoryObj<ButtonWithIconArgs>;

/*===== Icon Button =====*/

export const IconButton = {
  argTypes: {
    children: { control: false },
    size: { options: iconSizeOptions },
    "aria-label": { control: "text" },
  },
  args: {
    size: "icon",
    "aria-label": "ارسال پیام",
  },
  render: (args) => (
    <Button {...args}>
      <Mail aria-hidden="true" />
    </Button>
  ),
} satisfies Story;

/*===== Icon Sizes =====*/

export const IconSizes = {
  argTypes: {
    size: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <div className={sectionClassName}>
      {iconSizeOptions.map((size) => (
        <Button key={size} {...args} aria-label={`افزودن (${size})`} size={size}>
          <Plus aria-hidden="true" />
        </Button>
      ))}
    </div>
  ),
} satisfies Story;
