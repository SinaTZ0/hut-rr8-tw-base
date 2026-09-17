import { ArrowLeft, ArrowUpLeft, CalendarDays, MapPin } from "lucide-react";

import campusImage from "~/assets/hero-campus-overview.png";
import { Button } from "~/components/ui/button";

import { destinations } from "../content";
import { PageContainer } from "./layout";

/*===== Campus-led Introduction =====*/
export function Hero() {
  return (
    <section
      aria-labelledby="homepage-title"
      className="relative isolate grid grid-rows-[1fr_auto] overflow-hidden bg-university-deep text-white lg:min-h-[clamp(480px,calc(100svh-275px),625px)]"
    >
      {/*------ Campus Backdrop ------*/}
      <img
        src={campusImage}
        alt="نمای دانشگاه صنعتی همدان در دامنه کوه‌های الوند"
        width={1647}
        height={955}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[42%_center] lg:object-[center_45%]"
      />
      {/* Darken the text side more heavily while retaining the campus across the full hero. */}
      <div
        className="absolute inset-0 -z-10 bg-linear-to-l from-university-deep/95 via-university-deep/75 to-university-deep/35"
        aria-hidden="true"
      />

      {/*------ University Identity ------*/}
      <PageContainer className="relative grid items-center gap-8 pt-10 pb-8 sm:pt-12 sm:pb-10 lg:grid-cols-[1fr_0.9fr] lg:py-6">
        <div className="max-w-xl">
          <p className="mb-4 flex items-center gap-3 text-xs font-medium text-white/90 sm:text-sm">
            <span className="h-px w-8 bg-highlight" aria-hidden="true" />
            دانش، فناوری، آینده
          </p>
          <h1
            id="homepage-title"
            className="text-[clamp(1.9rem,10.8vw,2.65rem)] leading-[1.4] font-extrabold tracking-tight sm:text-[3.4rem] lg:text-[3.5rem]"
          >
            دانشگاه صنعتی
            <br />
            <span className="text-highlight">همدان</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-8 text-white/90 sm:text-base sm:leading-8">
            جایی برای یادگیری، پژوهش و ساختن.
            <br />
            از ایده‌های امروز، تا دنیای فردا.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              role="link"
              variant="highlight"
              size="lg"
              className="min-h-12 gap-4 rounded-xl px-5 focus-visible:border-highlight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight motion-reduce:transition-none"
              render={<a href={destinations.about} />}
            >
              آشنایی با دانشگاه <ArrowLeft aria-hidden="true" />
            </Button>
            <Button
              nativeButton={false}
              role="link"
              variant="ghost"
              size="lg"
              className="min-h-12 gap-3 rounded-xl border-white/40 px-4 text-white hover:bg-white/10 hover:text-white focus-visible:border-highlight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight focus-visible:ring-highlight/50 motion-reduce:transition-none"
              render={<a href={destinations.newStudents} />}
            >
              راهنمای نودانشجویان <ArrowUpLeft aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/*------ Campus Caption ------*/}
        <div className="hidden h-full flex-col items-end justify-between py-5 lg:flex">
          <span className="inline-flex items-center gap-2 text-xs text-white">
            <MapPin className="size-3.5 text-highlight" aria-hidden="true" />
            همدان، در دامنه الوند
          </span>
          <p className="border-e-2 border-highlight pe-4 text-end text-sm leading-7 text-white">
            ریشه در دانش
            <br />
            <span className="text-xl font-bold">نگاه به آینده</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-[11px] text-white lg:hidden">
          <MapPin className="size-3.5 text-highlight" aria-hidden="true" />
          همدان، در دامنه الوند
        </span>
      </PageContainer>

      {/*------ Featured Academic Announcement ------*/}
      <PageContainer className="relative pb-12 sm:pb-16">
        <a
          id="academic-announcement"
          href={destinations.calendarAnnouncement}
          className="group flex min-h-14 scroll-mt-28 flex-wrap items-center gap-3 rounded-xl border-t border-white/25 py-3 transition-colors hover:bg-university-deep/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight motion-reduce:transition-none sm:gap-5"
        >
          <CalendarDays className="size-5 shrink-0 text-highlight" strokeWidth={1.5} aria-hidden="true" />
          <span className="min-w-0 flex-1 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1">
            <span className="block text-[11px] font-semibold text-highlight">اطلاع‌رسانی آموزشی</span>
            <span className="block text-xs leading-7 font-medium sm:text-sm">تقویم آموزشی نیم‌سال اول ۱۴۰۵–۱۴۰۶</span>
          </span>
          <span className="hidden text-xs text-white/90 sm:block">مشاهده تقویم</span>
          <ArrowLeft className="size-5 shrink-0 text-highlight" aria-hidden="true" />
        </a>
      </PageContainer>
    </section>
  );
}
