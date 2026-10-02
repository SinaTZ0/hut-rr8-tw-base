import { ShieldCheck } from "lucide-react";

import { Card, CardContent } from "~/components/primitive/card/card";
import { Eyebrow } from "~/components/primitive/eyebrow/eyebrow";

/*===== Follow-up Steps =====*/

const steps = [
  {
    title: "فرم را کامل کنید",
    description: "اطلاعات فردی و تحصیلی خود را وارد کنید و پرسش خود را روشن بنویسید.",
  },
  {
    title: "پرسش ثبت می‌شود",
    description: "پرسش شما در سامانه دانشگاه ثبت می‌شود تا برای بررسی به فرد یا واحد مناسب ارجاع داده شود.",
  },
  {
    title: "کد پیگیری را نگه دارید",
    description: "کد نمایش‌داده‌شده را برای مراجعات بعدی کپی کنید.",
  },
] as const;

/*===== Request Guide =====*/

export function FollowUpGuide() {
  return (
    <Card render={<aside aria-labelledby="follow-up-title" />} variant="muted" radius="lg">
      <CardContent size="lg">
        <Eyebrow className="mb-3">راهنمای ثبت درخواست</Eyebrow>
        <h2 id="follow-up-title" className="text-xl leading-9 font-bold text-foreground">
          فرایند مشاوره چگونه است؟
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          پس از ارسال موفق، کد پیگیری یکتای خود را مشاهده و ذخیره کنید.
        </p>

        <ol className="mt-7 grid gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-3">
              <span
                className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                aria-hidden="true"
              >
                {new Intl.NumberFormat("fa-IR").format(index + 1)}
              </span>
              <div>
                <h3 className="text-sm leading-7 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-xs leading-7 text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 flex gap-3 text-xs leading-7 text-muted-foreground">
          <ShieldCheck className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
          <span>اطلاعات شما فقط برای بررسی و پاسخ‌گویی به پرسش ثبت‌شده استفاده می‌شود.</span>
        </p>
      </CardContent>
    </Card>
  );
}
