import type { Route } from "./+types/home";

import { SiteFooter } from "~/components/site/site-footer";
import { SiteHeader } from "~/components/site/site-header";

import { CalendarSection } from "./components/calendar-section";
import { Hero } from "./components/hero";
import { NewsSection } from "./components/news-section";
import { ServiceShortcuts } from "./components/service-shortcuts";
import { AchievementsSection, CoursesSection } from "./components/stories-sections";
import { StudentSupport } from "./components/support-and-footer";
import { UniversityProfile } from "./components/university-profile";
import { searchGroups } from "./content";

/*===== Page Metadata =====*/
export function meta(_args: Route.MetaArgs) {
  return [
    { title: "دانشگاه صنعتی همدان | دانش، فناوری، آینده" },
    {
      name: "description",
      content:
        "پایگاه اطلاع‌رسانی دانشگاه صنعتی همدان؛ اخبار و اطلاعیه‌ها، تقویم آموزشی، پژوهش و فناوری، خدمات دانشجویی و سامانه‌های دانشگاه.",
    },
    { name: "theme-color", content: "#103d40" },
  ];
}

/*===== Homepage =====*/
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-highlight/40">
      <a
        href="#homepage-main"
        className="fixed top-3 right-5 z-[100] -translate-y-24 rounded-xl bg-highlight px-5 py-3 text-sm font-semibold text-highlight-foreground transition-transform focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight focus-visible:outline-solid motion-reduce:transition-none"
      >
        پرش به محتوای اصلی
      </a>
      <SiteHeader searchGroups={searchGroups} />
      <main id="homepage-main" tabIndex={-1} className="scroll-mt-24 outline-none">
        {/*===== Identity and Everyday Services =====*/}
        <Hero />
        <ServiceShortcuts />
        {/*===== University Information =====*/}
        <NewsSection />
        <CalendarSection />
        <UniversityProfile />
        {/*===== Research, Learning, and Support =====*/}
        <AchievementsSection />
        <CoursesSection />
        <StudentSupport />
      </main>
      <SiteFooter />
    </div>
  );
}
