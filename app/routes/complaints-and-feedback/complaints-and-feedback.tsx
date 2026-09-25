import type { Route } from "./+types/complaints-and-feedback";

import { Eyebrow } from "~/components/primitive/eyebrow/eyebrow";
import { PageContainer } from "~/components/site/page-container";
import { SiteFooter } from "~/components/site/site-footer";
import { SiteHeader } from "~/components/site/site-header";

import { ComplaintsAndFeedbackForm } from "./components/complaints-and-feedback-form";
import { FollowUpGuide } from "./components/follow-up-guide";
import { ComplaintsQueryProvider } from "./components/query-provider";

/*===== Page Metadata =====*/

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "ثبت شکایات و پیشنهادات | دانشگاه صنعتی همدان" },
    {
      name: "description",
      content: "ثبت شکایت، پیشنهاد یا انتقاد برای بررسی و پیگیری در دانشگاه صنعتی همدان.",
    },
    { name: "theme-color", content: "#103d40" },
  ];
}

/*===== Complaints and Feedback Page =====*/

export default function ComplaintsAndFeedbackPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-highlight/40">
      <a
        href="#complaints-main"
        className="fixed top-3 right-5 z-[100] -translate-y-24 rounded-xl bg-highlight px-5 py-3 text-sm font-semibold text-highlight-foreground transition-transform focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight focus-visible:outline-solid motion-reduce:transition-none"
      >
        پرش به محتوای اصلی
      </a>
      <SiteHeader />

      <main id="complaints-main" tabIndex={-1} className="scroll-mt-24 outline-none">
        {/*===== Compact Page Introduction =====*/}
        <section aria-labelledby="complaints-title" className="bg-university-deep py-10 text-white sm:py-14">
          <PageContainer>
            <Eyebrow variant="inverse" marker="line" className="mb-4">
              سامانه ارتباط با دانشگاه
            </Eyebrow>
            <h1 id="complaints-title" className="text-3xl leading-[1.5] font-extrabold tracking-tight sm:text-4xl">
              ثبت شکایات و پیشنهادات
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-white/80 sm:text-base">
              دیدگاه‌ها و تجربه‌های خود را با ما در میان بگذارید تا برای بهبود خدمات دانشگاه بررسی و پیگیری شود.
            </p>
          </PageContainer>
        </section>

        {/*===== Form and Follow-up Guide =====*/}
        <section aria-labelledby="complaint-form-title" className="bg-muted/30 py-12 sm:py-16">
          <PageContainer>
            <ComplaintsQueryProvider>
              <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
                <div className="order-2 lg:order-1">
                  <ComplaintsAndFeedbackForm />
                </div>
                <div className="order-1 lg:sticky lg:top-6 lg:order-2">
                  <FollowUpGuide />
                </div>
              </div>
            </ComplaintsQueryProvider>
          </PageContainer>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
