import { cn } from "cn";
import { ArrowLeft, ArrowUpLeft, BookOpen } from "lucide-react";

import { Badge } from "~/components/primitive/badge";
import { Card, CardContent, CardLink } from "~/components/primitive/card";
import { Eyebrow } from "~/components/primitive/eyebrow";
import { Separator } from "~/components/primitive/separator";
import { TextLink } from "~/components/primitive/text-link";
import { PageContainer } from "~/components/site/page-container";
import { destinations } from "~/content/university-links";

import { achievements, courses, type UniversityStory } from "../content";
import { SectionHeading } from "./layout";

/*===== Achievement Story Cards =====*/
function AchievementCard({ story, featured }: { story: UniversityStory; featured: boolean }) {
  return (
    <article className={featured ? "lg:row-span-2" : ""}>
      <Card radius="lg" className="h-full">
        <CardLink
          id={story.id}
          href={story.href}
          className={cn("flex h-full scroll-mt-28 flex-col", !featured && "sm:flex-row")}
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
              <Badge variant="university" className="absolute start-4 top-4 sm:start-5 sm:top-5">
                در کانون توجه
              </Badge>
            )}
          </div>

          {/*------ Story Content ------*/}
          <div className={cn("flex min-w-0 flex-1 flex-col p-5 sm:p-6", featured && "sm:p-7")}>
            <Eyebrow marker="dot" size="sm" className="mb-3">
              {story.category}
            </Eyebrow>
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
              <Separator aria-hidden="true" className="mb-4" />
              <span className="flex items-center justify-between gap-3 text-xs font-semibold text-primary">
                بیشتر بخوانید
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpLeft className="size-4" aria-hidden="true" />
                </span>
              </span>
            </div>
          </div>
        </CardLink>
      </Card>
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
          <Eyebrow variant="highlight" className="mb-3">
            یادگیری ادامه دارد
          </Eyebrow>
          <h2 id="courses-title" className="text-2xl leading-[1.7] font-bold sm:text-3xl">
            رویدادها و<br /> دوره‌های آموزشی
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-8 text-white/80">
            از کلاس درس تا محیط کار؛ دوره‌های مهارتی و تخصصی در همراهی دانشگاه و صنعت.
          </p>
          <div className="mt-auto pt-8">
            <div>
              <Separator variant="inverse" aria-hidden="true" className="mb-5" />
              <TextLink href={destinations.growthCenter} variant="highlight" className="w-full justify-between">
                مرکز رشد و کارآفرینی
              </TextLink>
            </div>
          </div>
        </div>

        {/*------ Course List ------*/}
        <div className="grid gap-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardLink id={course.id} href={course.href} className="h-full scroll-mt-28">
                <CardContent className="h-full">
                  <div className="flex h-full items-center gap-4 sm:gap-5">
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
                      <Badge variant="secondary" className="mb-2">
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
                  </div>
                </CardContent>
              </CardLink>
            </Card>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
