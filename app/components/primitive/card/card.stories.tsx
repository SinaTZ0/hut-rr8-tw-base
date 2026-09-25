import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { expect, fn } from "storybook/test";

import staffMeeting from "~/assets/news-staff-meeting.jpg";
import controlledBlasting from "~/assets/event-controlled-blasting-workshop.jpg";
import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardLink, CardTitle } from "./card";
import { twContentVariant, twRadius, twVariant, twSize } from "./card.styles";

/*===== Story Options =====*/

const sizeOptions = Object.keys(twSize) as Array<keyof typeof twSize>;
const cardVariantOptions = Object.keys(twVariant) as Array<keyof typeof twVariant>;
const radiusOptions = Object.keys(twRadius) as Array<keyof typeof twRadius>;
const contentVariantOptions = Object.keys(twContentVariant) as Array<keyof typeof twContentVariant>;

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
  parameters: { layout: "centered", a11y: { test: "error" } },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: sizeOptions },
    variant: { control: "select", options: contentVariantOptions },
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

export const Variants = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {cardVariantOptions.map((variant) => (
        <div key={variant} className="grid gap-3">
          <span dir="ltr" lang="en" className="text-xs text-muted-foreground">
            {variant}
          </span>
          <Card className="w-[min(80vw,300px)]" variant={variant}>
            <CardContent>تازه‌ترین اطلاعیه‌های دانشگاه را دنبال کنید.</CardContent>
          </Card>
        </div>
      ))}
    </div>
  ),
} satisfies Story;

export const CompoundVariants = {
  render: () => (
    <div className="grid gap-6">
      {radiusOptions.map((radius) => (
        <Card key={radius} radius={radius} className="w-[min(80vw,360px)]">
          <CardHeader>
            <CardTitle>گزینه‌های ساختاری کارت</CardTitle>
            <CardAction variant="highlight">۱۲</CardAction>
          </CardHeader>
          <CardContent variant="divided">
            <p className="py-2">اطلاعیه آموزشی</p>
            <p className="py-2">رویداد پژوهشی</p>
          </CardContent>
          <CardFooter variant="seamless">پایان کارت</CardFooter>
        </Card>
      ))}
    </div>
  ),
} satisfies Story;

export const SemanticAside = {
  render: () => (
    <Card render={<aside aria-labelledby="notices-preview-title" />} variant="muted" className="w-[min(80vw,360px)]">
      <CardContent>
        <CardTitle id="notices-preview-title">اطلاعیه‌ها</CardTitle>
        <CardDescription className="mt-2">آخرین اطلاعیه‌های آموزشی و دانشگاهی</CardDescription>
      </CardContent>
    </Card>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole("complementary", { name: "اطلاعیه‌ها" });
    await expect(card.tagName).toBe("ASIDE");
    await expect(card).toHaveAttribute("data-slot", "card");
    await expect(card).toHaveAttribute("data-variant", "muted");
    await expect(canvas.getByRole("heading", { level: 3, name: "اطلاعیه‌ها" })).toBeInTheDocument();
    await expect(canvas.getByText("آخرین اطلاعیه‌های آموزشی و دانشگاهی").tagName).toBe("P");
  },
} satisfies Story;

export const SemanticHeadingOverride = {
  render: () => (
    <Card className="w-[min(80vw,360px)]">
      <CardContent>
        <CardTitle render={<h2 />}>رویدادهای آینده دانشگاه</CardTitle>
        <CardDescription>برنامه رویدادهای آموزشی و پژوهشی</CardDescription>
      </CardContent>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 2, name: "رویدادهای آینده دانشگاه" })).toBeInTheDocument();
    await expect(canvas.getByText("برنامه رویدادهای آموزشی و پژوهشی").tagName).toBe("P");
  },
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
