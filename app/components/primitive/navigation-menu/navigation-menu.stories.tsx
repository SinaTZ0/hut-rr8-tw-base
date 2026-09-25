import { DirectionProvider } from "@base-ui/react/direction-provider";
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpLeft } from "lucide-react";
import { useRef, useState } from "react";
import { expect, fn, waitFor, within } from "storybook/test";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuIndicator,
  NavigationMenuPositioner,
  NavigationMenuViewport,
  type NavigationMenuProps,
} from "./navigation-menu";
import { Button } from "../button/button";

/*===== Metadata =====*/

const meta = {
  title: "Primitive/NavigationMenu",
  component: NavigationMenu,
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
    align: { control: "select", options: ["start", "center", "end"] },
    value: { control: false },
    children: { control: false },
    className: { control: false },
    render: { control: false },
    onValueChange: { control: false },
  },
  args: { onValueChange: fn() },
  render: (args) => <NavigationPreview {...args} />,
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/*===== University Navigation Composition =====*/

function NavigationPreview(props: NavigationMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <NavigationMenu {...props} aria-label="منوی اصلی">
      <NavigationMenuList>
        <NavigationMenuItem value="university">
          <NavigationMenuTrigger
            ref={triggerRef}
            render={<button type="button" />}
            className={(state) => (state.open ? "text-primary" : undefined)}
          >
            دانشگاه
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-[min(80vw,310px)]" lang="fa">
            <p className="mb-3 border-b px-2 pb-3 text-xs leading-6 text-muted-foreground">
              با دانشگاه صنعتی همدان آشنا شوید
            </p>
            <NavigationMenuLink href="#معرفی" render={(props) => <a {...props} />}>
              معرفی دانشگاه <ArrowUpLeft aria-hidden="true" className="size-3.5 text-muted-foreground" />
            </NavigationMenuLink>
            <NavigationMenuLink href="#هیئت-علمی">اعضای هیئت علمی</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="education">
          <NavigationMenuTrigger>آموزش</NavigationMenuTrigger>
          <NavigationMenuContent className="w-[min(80vw,310px)]" lang="fa">
            <NavigationMenuLink href="#تقویم">تقویم آموزشی</NavigationMenuLink>
            <NavigationMenuLink href="#نودانشجویان">راهنمای نودانشجویان</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#اداری">اداری و مالی</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/*===== Defaults and Open State =====*/

export const Default = {} satisfies Story;
export const InitiallyOpen = { args: { defaultValue: "university" } } satisfies Story;

export const ActiveAndDisabled = {
  render: () => (
    <NavigationMenu aria-label="وضعیت پیوندها">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#دانشگاه" active>
            دانشگاه
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger disabled>آموزش</NavigationMenuTrigger>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "دانشگاه" })).toHaveAttribute("aria-current", "page");
    const disabled = canvas.getByRole("button", { name: "آموزش" });
    await expect(disabled).toHaveAttribute("aria-disabled", "true");
    disabled.click();
    await expect(disabled).not.toHaveAttribute("data-popup-open");
  },
} satisfies Story;

/*===== Controlled State and RTL Keyboard Navigation =====*/

/** The styled root can opt out of its default positioner for explicit composition. */
export const CustomPositioner = {
  render: () => (
    <NavigationMenu positioner={false} aria-label="منوی راهنما">
      <NavigationMenuList>
        <NavigationMenuItem value="guide">
          <NavigationMenuPrimitive.Trigger render={<Button variant="ghost" />}>
            راهنمای دانشگاه <NavigationMenuIndicator className={(state) => (state.open ? "text-primary" : undefined)} />
          </NavigationMenuPrimitive.Trigger>
          <NavigationMenuContent className="w-[min(80vw,310px)]" lang="fa">
            <NavigationMenuLink href="#معرفی">معرفی دانشگاه</NavigationMenuLink>
            <NavigationMenuLink href="#تقویم">تقویم آموزشی</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPositioner align="end" sideOffset={12} className={(state) => (state.open ? "z-50" : undefined)}>
        <NavigationMenuPrimitive.Popup className="relative h-(--popup-height) w-(--popup-width) rounded-lg bg-popover text-popover-foreground ring-1 ring-border">
          <NavigationMenuViewport render={<div />} className={() => "rounded-lg"} />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPositioner>
    </NavigationMenu>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "راهنمای دانشگاه" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const indicator = trigger.querySelector("[data-slot=navigation-menu-indicator]");
    await expect(indicator).toHaveAttribute("data-popup-open");
    await expect(indicator).toHaveClass("text-primary");
    const body = within(canvasElement.ownerDocument.body);
    const link = await body.findByRole("link", { name: "معرفی دانشگاه" });
    await userEvent.tab();
    await waitFor(() => expect(link).toHaveFocus());
    await expect(link.closest("[data-slot=navigation-menu-positioner]")).toHaveAttribute("dir", "rtl");
    await expect(canvasElement.ownerDocument.querySelectorAll('[data-slot="navigation-menu-positioner"]')).toHaveLength(
      1,
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
} satisfies Story;

function ControlledPreview({ onValueChange, ...props }: NavigationMenuProps) {
  const [value, setValue] = useState<unknown>(null);
  return (
    <NavigationPreview
      {...props}
      value={value}
      onValueChange={(nextValue, details) => {
        setValue(nextValue);
        onValueChange?.(nextValue, details);
      }}
    />
  );
}

export const Controlled = {
  render: (args) => <ControlledPreview {...args} />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const university = canvas.getByRole("button", { name: "دانشگاه" });
    const education = canvas.getByRole("button", { name: "آموزش" });
    university.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(education).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(university).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(university).toHaveAttribute("data-popup-open");
    await expect(university).toHaveClass("text-primary");
    const link = await body.findByRole("link", { name: "معرفی دانشگاه" });
    await expect(link).toHaveAttribute("href", "#معرفی");
    // Base UI uses Tab to enter its portaled viewport; arrows navigate within it.
    await userEvent.tab();
    await waitFor(() => expect(link).toHaveFocus());
    await userEvent.keyboard("{ArrowDown}");
    await expect(body.getByRole("link", { name: "اعضای هیئت علمی" })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(link).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(university).not.toHaveAttribute("data-popup-open"));
    await waitFor(() => expect(university).toHaveFocus());
  },
} satisfies Story;
