import type { Route } from "./+types/privacy-and-data-protection";

import { ArrowUp, ShieldCheck } from "lucide-react";

import { Badge } from "~/components/primitive/badge/badge";
import { Button } from "~/components/primitive/button/button";
import { Eyebrow } from "~/components/primitive/eyebrow/eyebrow";
import { Separator } from "~/components/primitive/separator/separator";
import { TextLink } from "~/components/primitive/text-link/text-link";
import { PageContainer } from "~/components/site/page-container";
import { SiteFooter } from "~/components/site/site-footer";
import { SiteHeader } from "~/components/site/site-header";
import { destinations } from "~/content/university-links";

import { statementIntroduction, statementSections, statementTitle } from "./content";

/*===== Document Numbering =====*/

const sectionNumberFormatter = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2 });

/*===== Page Metadata =====*/

export function meta(_args: Route.MetaArgs) {
  return [
    { title: `${statementTitle} | دانشگاه صنعتی همدان` },
    { name: "description", content: statementIntroduction },
    { name: "theme-color", content: "#103d40" },
  ];
}

/*===== Privacy and Data Protection Page =====*/

export default function PrivacyAndDataProtectionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-highlight/40">
      <Button
        nativeButton={false}
        role="link"
        variant="highlight"
        size="lg"
        render={<a href="#privacy-main" />}
        className="fixed start-5 top-3 z-[100] -translate-y-24 focus:translate-y-0"
      >
        پرش به محتوای اصلی
      </Button>
      <SiteHeader />

      <main id="privacy-main" tabIndex={-1} className="scroll-mt-24 outline-none">
        {/*===== Statement Introduction =====*/}
        <section aria-labelledby="privacy-title" className="bg-university-deep py-12 text-white sm:py-16">
          <PageContainer>
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_12rem]">
              <div className="max-w-3xl">
                <Eyebrow variant="highlight" marker="line" className="mb-5">
                  حریم خصوصی و حفاظت از داده‌ها
                </Eyebrow>
                <h1
                  id="privacy-title"
                  className="scroll-mt-24 text-3xl leading-[1.6] font-extrabold tracking-tight sm:text-4xl"
                >
                  {statementTitle}
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-white/80 sm:text-base">{statementIntroduction}</p>
              </div>
              <ShieldCheck
                className="hidden size-32 justify-self-center text-highlight lg:block"
                strokeWidth={1}
                aria-hidden="true"
              />
            </div>
          </PageContainer>
        </section>

        {/*===== Policy Statement =====*/}
        <PageContainer className="py-10 sm:py-14 lg:py-16">
          <article aria-labelledby="privacy-title" className="mx-auto max-w-3xl space-y-8 sm:space-y-10">
            <Eyebrow marker="line">متن بیانیه</Eyebrow>
            {statementSections.map((section, index) => (
              <section key={section.id} aria-labelledby={section.id}>
                {index > 0 && <Separator aria-hidden="true" className="mb-8 sm:mb-10" />}
                <div className="flex items-baseline gap-3 sm:gap-4">
                  <Badge variant="secondary" aria-hidden="true" className="shrink-0">
                    {sectionNumberFormatter.format(index + 1)}
                  </Badge>
                  <h2
                    id={section.id}
                    className="scroll-mt-28 text-xl leading-relaxed font-bold text-foreground sm:text-2xl"
                  >
                    {section.title}
                  </h2>
                </div>
                <div className="mt-5 space-y-4 text-start text-sm leading-8 text-prose-foreground sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.id === "university-contact" && (
                  <TextLink href={destinations.contact} external className="mt-4">
                    تماس با ما
                  </TextLink>
                )}
              </section>
            ))}

            {/*------ Document Footer ------*/}
            <div>
              <Separator aria-hidden="true" className="mb-6" />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs leading-7 text-muted-foreground">دانشگاه صنعتی همدان · حریم خصوصی کاربران</p>
                <Button nativeButton={false} role="link" variant="ghost" render={<a href="#privacy-title" />}>
                  بازگشت به ابتدای بیانیه
                  <ArrowUp aria-hidden="true" />
                </Button>
              </div>
            </div>
          </article>
        </PageContainer>
      </main>

      <SiteFooter />
    </div>
  );
}
