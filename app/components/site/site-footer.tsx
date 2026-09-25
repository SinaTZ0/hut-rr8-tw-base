import { ArrowUpLeft, Mail, MapPin, Phone } from "lucide-react";

import { TextLink } from "~/components/primitive/text-link/text-link";
import { destinations, services } from "~/content/university-links";

import { Brand } from "./brand";
import { PageContainer } from "./page-container";

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

export function SiteFooter() {
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
