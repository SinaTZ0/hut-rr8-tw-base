import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { expect, fn } from "storybook/test";

import staffMeeting from "~/assets/news-staff-meeting.jpg";
import controlledBlasting from "~/assets/event-controlled-blasting-workshop.jpg";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle,
  twSize,
} from "./card";

/*===== Story Options =====*/

const sizeOptions = Object.keys(twSize) as Array<keyof typeof twSize>;

/*===== Metadata =====*/

const meta = {
  title: "Primitive/Card",
  component: CardContent,
  subcomponents: { Card, CardLink, CardHeader, CardTitle, CardDescription, CardAction, CardFooter },
  decorators: [
    (Story) => (
      <div dir="rtl" lang="fa" className="rounded-2xl bg-background p-4 text-foreground sm:p-6">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: sizeOptions },
    children: { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
  args: { children: "تازه‌های دانشگاه صنعتی همدان", size: "default" },
  render: (args) => (
    <Card className="w-[min(80vw,360px)]">
      <CardContent {...args} />
    </Card>
  ),
} satisfies Meta<typeof CardContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/*===== Defaults and Content Controls =====*/

export const Controls = {} satisfies Story;
export const Default = { args: { size: undefined } } satisfies Story;

export const ContentSizes = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <div className="flex flex-wrap gap-6">
      {sizeOptions.map((size) => (
        <div key={size} className="grid gap-3">
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {size}
          </span>
          <Card className="w-[min(80vw,300px)]">
            <CardContent {...args} size={size} />
          </Card>
        </div>
      ))}
    </div>
  ),
} satisfies Story;

/*===== Homepage Compositions =====*/

export const CompoundParts = {
  render: (args) => (
    <Card className="w-[min(80vw,420px)]">
      <CardHeader>
        <CardTitle>کارگاه تخصصی دانشگاه</CardTitle>
        <CardDescription>آموزش کاربردی در همراهی دانشگاه و صنعت</CardDescription>
        <CardAction>
          <Badge>ثبت‌نام باز است</Badge>
        </CardAction>
      </CardHeader>
      <CardContent {...args}>با دوره‌های تازه دانشگاه صنعتی همدان آشنا شوید.</CardContent>
      <CardFooter className="justify-end">
        <Button nativeButton={false} render={<a href="#دوره" />}>
          مشاهده دوره
        </Button>
      </CardFooter>
    </Card>
  ),
} satisfies Story;

export const News = {
  render: (args) => (
    <Card className="w-[min(80vw,360px)]">
      <CardLink href="#خبر">
        <img src={staffMeeting} alt="نشست رئیس دانشگاه با کارکنان" className="h-40 w-full object-cover" />
        <CardContent {...args}>
          <p className="mb-3 text-xs text-primary">دانشگاه · ۱۰ شهریور ۱۴۰۵</p>
          <h3 className="text-base leading-7 font-semibold group-hover:text-primary">دیدار رئیس دانشگاه با کارکنان</h3>
        </CardContent>
      </CardLink>
    </Card>
  ),
} satisfies Story;

export const FeaturedNews = {
  args: { size: "lg" },
  render: (args) => (
    <Card className="w-[min(80vw,700px)]">
      <CardLink href="#خبر" className="md:grid md:grid-cols-2">
        <img src={staffMeeting} alt="نشست رئیس دانشگاه با کارکنان" className="h-56 w-full object-cover md:h-full" />
        <CardContent {...args} className="flex flex-col justify-center">
          <Badge>خبر ویژه</Badge>
          <h3 className="mt-3 text-lg leading-9 font-bold group-hover:text-primary">
            روایت دیدار و گفت‌وگوی جامعه دانشگاهی
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            تازه‌ترین رویدادها و خبرهای دانشگاه صنعتی همدان.
          </p>
        </CardContent>
      </CardLink>
    </Card>
  ),
} satisfies Story;

export const Course = {
  render: (args) => (
    <Card className="w-[min(80vw,600px)]">
      <CardLink href="#دوره">
        <CardContent {...args} className="flex items-center gap-4 sm:gap-5">
          <img
            src={controlledBlasting}
            alt="کارگاه آتشباری کنترل‌شده"
            className="h-28 w-20 shrink-0 rounded-xl object-cover sm:w-36"
          />
          <div className="min-w-0">
            <Badge className="mb-2">کارگاه تخصصی</Badge>
            <h3 className="text-sm leading-7 font-semibold group-hover:text-primary sm:text-base">
              آشنایی با آتشباری کنترل‌شده
            </h3>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">آموزش کاربردی در همراهی دانشگاه و صنعت.</p>
          </div>
        </CardContent>
      </CardLink>
    </Card>
  ),
} satisfies Story;

/*===== Native Link Composition and Keyboard Focus =====*/

function NativeLinkPreview() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  return (
    <div className="grid gap-5">
      <Button variant="outline" onClick={() => linkRef.current?.focus()}>
        تمرکز روی کارت
      </Button>
      <Card className="w-[min(80vw,360px)] rounded-3xl">
        <CardLink ref={linkRef} href="#دوره" target="_self" aria-label="مشاهده دوره آموزشی">
          <CardContent>
            <h3 className="text-base font-semibold group-hover:text-primary">دوره آموزشی دانشگاه</h3>
            <p className="mt-2 text-sm text-muted-foreground">اطلاعات دوره و راهنمای ثبت‌نام</p>
          </CardContent>
        </CardLink>
      </Card>
    </div>
  );
}

export const KeyboardFocus = {
  render: () => <NativeLinkPreview />,
  play: async ({ canvas, userEvent }) => {
    const link = canvas.getByRole("link", { name: "مشاهده دوره آموزشی" });
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(link).toHaveFocus();
    await expect(link).toHaveAttribute("href", "#دوره");
    await expect(link).toHaveAttribute("target", "_self");
    const styles = getComputedStyle(link);
    await expect(styles.outlineWidth).toBe("2px");
    await expect(styles.borderRadius).toBe(getComputedStyle(link.parentElement!).borderRadius);
    await expect(getComputedStyle(link.parentElement!).overflow).toBe("visible");
    const activate = fn((event: Event) => event.preventDefault());
    link.addEventListener("click", activate, { once: true });
    await userEvent.keyboard("{Enter}");
    await expect(activate).toHaveBeenCalledOnce();
  },
} satisfies Story;
