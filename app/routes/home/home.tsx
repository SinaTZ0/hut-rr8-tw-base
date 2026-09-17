import { CalendarSection } from "./components/CalendarSection";
import { CallToActionSection } from "./components/CallToActionSection";
import { CampusStorySection } from "./components/CampusStorySection";
import { AchievementsSection, EventsSection } from "./components/CardSections";
import { styles } from "./components/common";
import { ContactServicesSection } from "./components/ContactServicesSection";
import { FloatingLinks } from "./components/FloatingLinks";
import { FooterSection } from "./components/FooterSection";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { NewsSection } from "./components/NewsSection";
import { QuickAccessSection } from "./components/QuickAccessSection";

export function meta() {
  return [
    { title: "دانشگاه صنعتی همدان" },
    {
      name: "description",
      content: "وب‌سایت دانشگاه صنعتی همدان؛ اخبار، اطلاعیه‌ها، آموزش، پژوهش و خدمات دانشجویی",
    },
    { name: "theme-color", content: "#073b4c" },
  ];
}

export function headers() {
  return {
    "Cache-Control": "no-store",
  };
}

export default function Home() {
  return (
    <div className={styles["hut-modern"]} id="hutModernPage">
      <a className={styles["hut-skip-link"]} href="#hut-main">
        پرش به محتوای اصلی
      </a>

      <Header />

      <main id="hut-main">
        <HeroSection />
        <QuickAccessSection />
        <NewsSection />
        <CalendarSection />
        <ContactServicesSection />
        <CampusStorySection />
        <AchievementsSection />
        <EventsSection />
        <CallToActionSection />
      </main>

      <FloatingLinks />
      <FooterSection />
    </div>
  );
}
