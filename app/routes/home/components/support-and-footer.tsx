import { ArrowLeft, ArrowUpLeft, GraduationCap, Mail, MapPin, MessagesSquare, Phone } from "lucide-react";

import { Button } from "~/components/primitive/button";
import { LinkTile } from "~/components/primitive/link-tile";
import { TextLink } from "~/components/primitive/text-link";

import { destinations, services } from "../content";
import { Brand } from "./brand";
import { PageContainer } from "./layout";

/*===== Student Guidance and University Contact =====*/
export function StudentSupport() {
  return (
    <section
      id="university-contact"
      tabIndex={-1}
      aria-labelledby="support-title"
      className="scroll-mt-28 py-14 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-solid sm:py-20"
    >
      <PageContainer>
        <div className="grid overflow-hidden rounded-3xl border bg-secondary/45 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative overflow-hidden bg-primary p-7 text-primary-foreground sm:p-9 lg:p-10">
            <GraduationCap
              className="absolute -bottom-5 -left-5 size-44 rotate-[-15deg] opacity-[0.07]"
              strokeWidth={1}
              aria-hidden="true"
            />
            <p className="mb-3 text-xs text-primary-foreground/80">شروع یک مسیر تازه</p>
            <h2 id="support-title" className="text-2xl leading-10 font-bold">
              به جمع ما خوش آمدید
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-8 text-primary-foreground/85">
              هر آنچه برای آغاز مسیر دانشگاهی نیاز دارید؛ از آشنایی با گروه‌های آموزشی تا راهنمای ثبت‌نام.
            </p>
            <div className="relative mt-6 flex flex-wrap gap-3">
              <Button
                nativeButton={false}
                role="link"
                variant="highlight"
                size="lg"
                render={<a href={destinations.newStudents} />}
              >
                راهنمای نودانشجویان <ArrowLeft aria-hidden="true" />
              </Button>
              <Button
                nativeButton={false}
                role="link"
                variant="inverse-outline"
                size="lg"
                render={<a href={destinations.departments} />}
              >
                گروه‌های آموزشی <ArrowUpLeft className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-center divide-y divide-border px-7 sm:px-9 lg:px-10">
            <LinkTile
              href={destinations.contact}
              icon={<MessagesSquare strokeWidth={1.5} />}
              description="راه‌های ارتباط با دانشگاه و ارسال دیدگاه‌ها و پیشنهادات"
              className="-mx-3"
            >
              صدای شما برای ما مهم است
            </LinkTile>
            <LinkTile
              href="http://counseling.hut.ac.ir"
              icon={<Phone strokeWidth={1.5} />}
              description="دریافت راهنمایی از مرکز مشاوره و سبک زندگی دانشگاه"
              className="-mx-3"
            >
              همراه شما در مسیر دانشگاه
            </LinkTile>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

/*===== Footer Destinations =====*/
const quickLinks = [
  { label: "معرفی دانشگاه", href: destinations.about },
  { label: "اعضای هیئت علمی", href: destinations.faculty },
  { label: "گروه‌های آموزشی", href: destinations.departments },
  { label: "فرم‌ها و آیین‌نامه‌ها", href: destinations.forms },
  { label: "دفترچه تلفن", href: destinations.phonebook },
];

const socialLinks = [
  { label: "ایتا", href: destinations.eitaa },
  { label: "آپارات", href: destinations.aparat },
  { label: "لینکدین", href: destinations.linkedin },
];

/*===== Institutional Footer =====*/
export function Footer() {
  return (
    <footer className="bg-university-deep pt-12 text-white sm:pt-16">
      <PageContainer>
        <div className="grid gap-x-8 gap-y-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.1fr]">
          <div>
            <Brand inverse />
            <p className="mt-5 max-w-xs text-xs leading-8 text-white/70">
              پایگاه اطلاع‌رسانی دانشگاه صنعتی همدان؛ اخبار، آموزش، پژوهش و خدمات جامعه دانشگاهی.
            </p>
            <nav aria-label="شبکه‌های اجتماعی دانشگاه" className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex min-h-11 items-center gap-1 rounded-lg border border-white/15 px-3 text-[11px] text-white/80 transition-[background-color,border-color,color] hover:border-white/40 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight focus-visible:outline-solid"
                >
                  {link.label}
                  <ArrowUpLeft className="size-3" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold">پیوندهای دانشگاه</h2>
            <nav aria-label="پیوندهای دانشگاه در پایین صفحه" className="grid">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex min-h-10 items-center rounded-md text-xs text-white/70 transition-[background-color,color] hover:text-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight focus-visible:outline-solid"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold">سامانه‌ها و خدمات</h2>
            <nav aria-label="خدمات دانشگاه در پایین صفحه" className="grid">
              {services.slice(0, 5).map((service) => (
                <a
                  key={service.label}
                  href={service.href}
                  className="flex min-h-10 items-center rounded-md text-xs text-white/70 transition-[background-color,color] hover:text-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight focus-visible:outline-solid"
                >
                  {service.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h2 className="mb-5 text-sm font-semibold">ارتباط با دانشگاه</h2>
            <address className="grid gap-4 text-xs leading-7 text-white/70 not-italic">
              <p className="flex gap-2.5">
                <MapPin className="mt-1 size-4 shrink-0 text-highlight" aria-hidden="true" />
                همدان، پل پژوهش، بلوار شهید فهمیده، خیابان مردم
              </p>
              <a
                href={destinations.phone}
                className="flex min-h-10 items-center gap-2.5 rounded-md hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight focus-visible:outline-solid"
              >
                <Phone className="size-4 text-highlight" aria-hidden="true" />
                <span dir="ltr">۰۸۱–۳۸۴۱۱۰۰۰</span>
              </a>
              <a
                href={destinations.email}
                className="flex min-h-10 items-center gap-2.5 rounded-md hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight focus-visible:outline-solid"
              >
                <Mail className="size-4 text-highlight" aria-hidden="true" />
                <span dir="ltr">info@hut.ac.ir</span>
              </a>
            </address>
            <TextLink href={destinations.contact} variant="highlight" size="sm" className="mt-3">
              ارتباط با ما
            </TextLink>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 py-6 text-[10px] leading-6 text-white/65">
          <p>کلیه حقوق این وب‌سایت متعلق به دانشگاه صنعتی همدان است.</p>
          <span lang="en" dir="ltr" className="tracking-[0.14em]">
            HAMEDAN · IRAN
          </span>
        </div>
      </PageContainer>
    </footer>
  );
}
