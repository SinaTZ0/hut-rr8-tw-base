import type { Route } from "./+types/new-homepage";

import { CalendarSection } from "./components/calendar-section";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { NewsSection } from "./components/news-section";
import { ServiceShortcuts } from "./components/service-shortcuts";
import { AchievementsSection, CoursesSection } from "./components/stories-sections";
import { Footer, StudentSupport } from "./components/support-and-footer";
import { UniversityProfile } from "./components/university-profile";

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

/*===== Standalone Homepage =====*/
export default function NewHomepage() {
  return (
    <div className="bg-background text-foreground selection:bg-highlight/40 min-h-screen">
      <a
        href="#homepage-main"
        className="bg-highlight text-highlight-foreground fixed top-3 right-5 z-[100] -translate-y-24 rounded-xl px-5 py-3 text-sm font-semibold transition-transform focus:translate-y-0"
      >
        پرش به محتوای اصلی
      </a>
      <Header />
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
      <Footer />
    </div>
  );
}
