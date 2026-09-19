import { CalendarDays } from "lucide-react";

import { Badge } from "~/components/primitive/badge";

import { academicCalendar, destinations } from "../content";
import { PageContainer, SectionHeading } from "./layout";

/*===== Semester Timeline =====*/
export function CalendarSection() {
  return (
    <section
      id="academic-calendar"
      tabIndex={-1}
      aria-labelledby="calendar-title"
      className="focus-visible:outline-ring scroll-mt-28 py-14 outline-offset-[-4px] focus-visible:outline-2 sm:py-20"
    >
      <PageContainer>
        <SectionHeading
          id="calendar-title"
          eyebrow="مسیر نیم‌سال"
          title="تقویم آموزشی دانشگاه"
          description="زمان‌بندی انتخاب واحد، کلاس‌ها و امتحانات"
          link={{ label: "تقویم کامل آموزشی", href: destinations.calendar }}
        />
        <div className="bg-card rounded-2xl border p-5 sm:p-7 lg:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-5 sm:mb-8">
            <p className="flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="text-primary size-4" aria-hidden="true" />
              نیم‌سال دوم ۱۴۰۴–۱۴۰۵
            </p>
            <Badge variant="secondary">آرشیو تقویم آموزشی</Badge>
          </div>
          <ol className="md:before:bg-border relative md:grid md:grid-cols-7 md:before:absolute md:before:top-[66px] md:before:right-[7%] md:before:left-[7%] md:before:h-px">
            {academicCalendar.map((milestone) => (
              <li
                key={milestone.title}
                className="relative grid grid-cols-[12px_1fr_auto] items-center gap-3 border-b py-4 last:border-b-0 md:flex md:flex-col md:gap-3 md:border-0 md:px-1 md:py-0"
              >
                <span
                  className="border-primary/60 bg-card relative z-10 size-3 rounded-full border-2 md:order-2"
                  aria-hidden="true"
                />
                <div className="md:order-1 md:text-center">
                  <p className="text-lg leading-7 font-semibold">{milestone.day}</p>
                  <p className="text-muted-foreground mt-1 text-[10px] leading-4">{milestone.month}</p>
                </div>
                <h3 className="text-xs leading-6 font-medium md:order-3 lg:text-sm">{milestone.title}</h3>
              </li>
            ))}
          </ol>
        </div>
      </PageContainer>
    </section>
  );
}
