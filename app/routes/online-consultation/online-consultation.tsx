import type { Route } from "./+types/online-consultation";

import { Button } from "~/components/primitive/button/button";
import { SubmissionQueryProvider } from "~/components/forms/query-provider";
import { Eyebrow } from "~/components/primitive/eyebrow/eyebrow";
import { PageContainer } from "~/components/site/page-container";
import { SiteFooter } from "~/components/site/site-footer";
import { SiteHeader } from "~/components/site/site-header";

import { OnlineConsultationForm } from "./components/online-consultation-form";
import { FollowUpGuide } from "./components/follow-up-guide";

/*===== Page Metadata =====*/

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "مشاوره آنلاین | دانشگاه صنعتی همدان" },
    {
      name: "description",
      content: "ثبت پرسش برای دریافت مشاوره و راهنمایی در دانشگاه صنعتی همدان.",
    },
    { name: "theme-color", content: "#103d40" },
  ];
}

/*===== Online Consultation Page =====*/

export default function OnlineConsultationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-highlight/40">
      <Button
        nativeButton={false}
        role="link"
        variant="highlight"
        size="lg"
        render={<a href="#consultation-main" />}
        className="fixed top-3 right-5 z-[100] -translate-y-24 focus:translate-y-0"
      >
        پرش به محتوای اصلی
      </Button>
      <SiteHeader />

      <main id="consultation-main" tabIndex={-1} className="scroll-mt-24 outline-none">
        {/*===== Compact Page Introduction =====*/}
        <section aria-labelledby="consultation-title" className="bg-university-deep py-10 text-white sm:py-14">
          <PageContainer>
            <Eyebrow variant="inverse" marker="line" className="mb-4">
              سامانه ارتباط با دانشگاه
            </Eyebrow>
            <h1 id="consultation-title" className="text-3xl leading-[1.5] font-extrabold tracking-tight sm:text-4xl">
              مشاوره آنلاین
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-white/80 sm:text-base">
              پرسش خود را با ما در میان بگذارید تا برای بررسی و پاسخ‌گویی به فرد یا واحد مناسب ارجاع داده شود.
            </p>
          </PageContainer>
        </section>

        {/*===== Form and Follow-up Guide =====*/}
        <section aria-label="ثبت درخواست مشاوره" className="bg-muted/30 py-12 sm:py-16">
          <PageContainer>
            <SubmissionQueryProvider>
              <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
                <div className="order-2 lg:order-1">
                  <OnlineConsultationForm />
                </div>
                <div className="order-1 lg:sticky lg:top-6 lg:order-2">
                  <FollowUpGuide />
                </div>
              </div>
            </SubmissionQueryProvider>
          </PageContainer>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
