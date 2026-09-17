import { cn } from "cn";
import { ArrowLeft, ArrowUpLeft, BookOpen } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";

import { achievements, courses, destinations, type UniversityStory } from "../content";
import { Eyebrow, PageContainer, SectionHeading, TextLink } from "./layout";

/*===== Achievement Story Cards =====*/
function AchievementCard({ story, featured }: { story: UniversityStory; featured: boolean }) {
  return (
    <article className={featured ? "lg:row-span-2" : ""}>
      <a
        id={story.id}
        href={story.href}
        className={cn(
          "group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border bg-card transition-[border-color,box-shadow] duration-300 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:rounded-3xl",
          !featured && "sm:flex-row",
        )}
      >
        {/*------ Story Image ------*/}
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-muted",
            featured ? "aspect-[1.85]" : "aspect-[1.85] sm:aspect-auto sm:w-[38%]",
          )}
        >
          <img
            src={story.image}
            alt={story.imageAlt}
            width={1000}
            height={580}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
          />
          {featured && (
            <Badge className="absolute start-4 top-4 border-0 bg-university px-3 py-1.5 text-xs text-white sm:start-5 sm:top-5">
              در کانون توجه
            </Badge>
          )}
        </div>

        {/*------ Story Content ------*/}
        <div className={cn("flex min-w-0 flex-1 flex-col p-5 sm:p-6", featured && "sm:p-7")}>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary">
            <span className="size-1.5 shrink-0 rounded-full bg-highlight" aria-hidden="true" />
            {story.category}
          </p>
          <h3
            className={cn(
              "font-bold transition-colors group-hover:text-primary",
              featured ? "text-lg leading-9 sm:text-xl" : "text-base leading-8",
            )}
          >
            {story.title}
          </h3>
          <p className="mt-3 text-xs leading-7 text-muted-foreground sm:text-sm">{story.summary}</p>
          <div className="mt-auto pt-5">
            <span className="flex items-center justify-between gap-3 border-t pt-4 text-xs font-semibold text-primary">
              بیشتر بخوانید
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowUpLeft className="size-4" aria-hidden="true" />
              </span>
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}

/*===== Research and Community Achievements =====*/
export function AchievementsSection() {
  return (
    <section aria-labelledby="achievements-title" className="py-14 sm:py-20">
      <PageContainer>
        <SectionHeading
          id="achievements-title"
          eyebrow="ثمره تلاش جامعه دانشگاهی"
          title="دستاوردها و افتخارات"
          description="از پیشرفت‌های علمی تا افتخارآفرینی دانشجویان؛ روایت تلاش‌هایی که به ثمر می‌رسند."
          link={{ label: "دستاوردهای دانشگاه", href: destinations.portal }}
        />
        <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
          {achievements.map((story, index) => (
            <AchievementCard key={story.id} story={story} featured={index === 0} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

/*===== Continuing Education and Industry =====*/
export function CoursesSection() {
  return (
    <section aria-labelledby="courses-title" className="border-y bg-muted/55 py-14 sm:py-20">
      <PageContainer className="grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.6fr] lg:gap-8">
        {/*------ Learning Introduction ------*/}
        <div className="relative isolate flex flex-col overflow-hidden rounded-3xl bg-university p-6 text-white sm:p-8 lg:p-9">
          <div
            className="pointer-events-none absolute -start-20 -bottom-32 -z-10 size-80 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <span className="mb-8 flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-highlight">
            <BookOpen className="size-7" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <Eyebrow className="text-highlight">یادگیری ادامه دارد</Eyebrow>
          <h2 id="courses-title" className="text-2xl leading-[1.7] font-bold sm:text-3xl">
            رویدادها و<br /> دوره‌های آموزشی
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-8 text-white/80">
            از کلاس درس تا محیط کار؛ دوره‌های مهارتی و تخصصی در همراهی دانشگاه و صنعت.
          </p>
          <div className="mt-auto pt-8">
            <TextLink
              href={destinations.growthCenter}
              className="w-full justify-between rounded-none border-t border-white/20 pt-5 text-highlight hover:text-white focus-visible:outline-highlight"
            >
              مرکز رشد و کارآفرینی
            </TextLink>
          </div>
        </div>

        {/*------ Course List ------*/}
        <div className="grid gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-visible gap-0 rounded-2xl py-0 shadow-none ring-1 ring-border">
              <a
                id={course.id}
                href={course.href}
                className="group flex h-full scroll-mt-28 items-center gap-4 rounded-2xl p-4 transition-[background-color,box-shadow] duration-300 hover:bg-secondary/35 hover:shadow-md hover:shadow-primary/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:gap-5 sm:p-5"
              >
                <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-36 xl:w-44">
                  <img
                    src={course.image}
                    alt={course.imageAlt}
                    width={1000}
                    height={563}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                  />
                </div>
                <div className="min-w-0 flex-1 py-1">
                  <Badge variant="secondary" className="mb-2 border-0 px-2.5 py-1 text-[10px] sm:text-xs">
                    {course.category}
                  </Badge>
                  <h3 className="text-sm leading-7 font-semibold transition-colors group-hover:text-primary sm:text-base">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">{course.summary}</p>
                </div>
                <span className="hidden size-10 shrink-0 items-center justify-center rounded-full border text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground sm:flex">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </span>
              </a>
            </Card>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
