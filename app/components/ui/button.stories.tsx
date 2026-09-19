import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Plus } from "lucide-react";
import type { ComponentProps } from "react";
import { expect, fn } from "storybook/test";

import { Button } from "./button";

/*===== Story Options =====*/

type ButtonProps = ComponentProps<typeof Button>;
const variantOptions = [
  "default",
  "highlight",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const satisfies ReadonlyArray<NonNullable<ButtonProps["variant"]>>;
const buttonSizeOptions = ["default", "xs", "sm", "lg"] as const satisfies ReadonlyArray<
  NonNullable<ButtonProps["size"]>
>;
const iconSizeOptions = ["icon", "icon-xs", "icon-sm", "icon-lg"] as const satisfies ReadonlyArray<
  NonNullable<ButtonProps["size"]>
>;
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

export const Controls = {
  render: (args) => (
    <div className="flex min-h-40 w-full items-center justify-center bg-background p-6 text-foreground">
      <Button {...args} />
    </div>
  ),
} satisfies Story;

// Leave these unset so this story reflects the component's own defaults.
export const Default = {
  args: {
    variant: undefined,
    size: undefined,
    children: "ثبت درخواست",
  },
} satisfies Story;

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

/*===== Themes And States =====*/

export const ThemesAndStates = {
  argTypes: {
    variant: { control: false },
    children: { control: false },
    disabled: { control: false },
  },
  render: (args) => (
    <div className="grid gap-3 rounded-2xl bg-background p-6 text-foreground">
      {variantOptions.map((variant) => (
        <div key={variant} className={sectionClassName}>
          <Button {...args} variant={variant} disabled={false}>
            {variant}
          </Button>
          <Button {...args} variant={variant} disabled>
            غیرفعال
          </Button>
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

      // A native click bypasses the CSS pointer guard and verifies disabled behavior.
      disabledButton.click();
      await expect(args.onClick).toHaveBeenCalledTimes(activationCount);

      if (index + 2 < buttons.length) {
        await userEvent.tab();
        await expect(buttons[index + 2]).toHaveFocus();
      }
    }
  },
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
        <div key={size} className="flex flex-col items-center gap-2">
          <Button {...args} size={size}>
            دکمه
          </Button>
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {size}
          </span>
        </div>
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
    "aria-label": { control: false },
  },
  render: (args) => (
    <div className={sectionClassName}>
      {iconSizeOptions.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Button {...args} aria-label={`افزودن (${size})`} size={size}>
            <Plus aria-hidden="true" />
          </Button>
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {size}
          </span>
        </div>
      ))}
    </div>
  ),
} satisfies Story;
