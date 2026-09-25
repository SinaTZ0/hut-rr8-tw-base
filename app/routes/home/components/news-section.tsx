import { ArrowLeft, Bell, Clock3 } from "lucide-react";

import { Badge } from "~/components/primitive/badge/badge";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardLink } from "~/components/primitive/card/card";
import { TextLink } from "~/components/primitive/text-link/text-link";
import { PageContainer } from "~/components/site/page-container";
import { destinations } from "~/content/university-links";

import { news, notices, type UniversityStory } from "../content";
import { SectionHeading } from "./layout";

/*===== Editorial News Cards =====*/
function NewsCard({ story, featured = false }: { story: UniversityStory; featured?: boolean }) {
  return (
    <Card className={featured ? "col-span-2" : undefined}>
      <CardLink
        id={story.id}
        href={story.href}
        className={`h-full scroll-mt-28 ${featured ? "md:grid md:grid-cols-[1.05fr_1fr]" : ""}`}
      >
        <div
          className={`relative overflow-hidden bg-muted ${featured ? "h-56 md:h-full md:min-h-64" : "h-36 sm:h-40"}`}
        >
          <img
            src={story.image}
            alt={story.imageAlt}
            width={1000}
            height={491}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {featured && (
            <Badge variant="secondary" className="absolute top-4 right-4">
              خبر ویژه
            </Badge>
          )}
        </div>
        <CardContent
          size={featured ? "lg" : "default"}
          className={featured ? "flex flex-col justify-center" : undefined}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground sm:text-xs">
            <span className="font-medium text-primary">{story.category}</span>
            <span aria-hidden="true">/</span>
            <span className="flex items-center gap-1">
              <Clock3 className="size-3" aria-hidden="true" />
              {story.date}
            </span>
          </div>
          <h3
            className={
              featured
                ? "text-lg leading-9 font-bold transition-colors group-hover:text-primary sm:text-xl"
                : "text-sm leading-7 font-semibold transition-colors group-hover:text-primary sm:text-base"
            }
          >
            {story.title}
          </h3>
          {featured && <p className="mt-3 text-xs leading-7 text-muted-foreground sm:text-sm">{story.summary}</p>}
          <span className="mt-5 flex items-center gap-2 text-xs font-semibold text-primary">
            ادامه خبر
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          </span>
        </CardContent>
      </CardLink>
    </Card>
  );
}

/*===== Dated Announcements =====*/
function NoticesPanel() {
  return (
    <Card
      render={<aside />}
      variant="muted"
      id="university-notices"
      tabIndex={-1}
      aria-labelledby="notices-title"
      className="scroll-mt-28"
    >
      <CardHeader>
        <div>
          <p className="mb-1 text-[10px] font-medium text-muted-foreground">آنچه باید بدانید</p>
          <h3 id="notices-title" className="text-xl font-bold">
            اطلاعیه‌ها
          </h3>
        </div>
        <CardAction variant="highlight">
          <Bell className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </CardAction>
      </CardHeader>
      <CardContent variant="divided" className="flex-1">
        {notices.map((notice) => (
          <a
            key={notice.title}
            id={notice.id}
            href={destinations.portal}
            className="group flex min-h-24 scroll-mt-28 items-start gap-3 rounded-md py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:outline-solid"
          >
            <span className="flex w-12 shrink-0 flex-col items-center gap-0.5 rounded-lg border bg-card px-1 py-2">
              <span className="text-lg leading-6 font-bold">{notice.day}</span>
              <span className="text-[9px] text-muted-foreground">{notice.month}</span>
            </span>
            <span>
              <span className="block text-xs leading-6 font-semibold transition-colors group-hover:text-primary sm:text-sm">
                {notice.title}
              </span>
              <span className="mt-1 block text-[10px] leading-5 text-muted-foreground">{notice.owner}</span>
            </span>
          </a>
        ))}
      </CardContent>
      <CardFooter variant="seamless">
        <TextLink href={destinations.portal} size="sm" className="w-full justify-between">
          همه اطلاعیه‌ها
        </TextLink>
      </CardFooter>
    </Card>
  );
}

/*===== University News =====*/
export function NewsSection() {
  return (
    <section aria-labelledby="news-title" className="border-b bg-muted/45 py-14 sm:py-20">
      <PageContainer>
        <SectionHeading
          id="news-title"
          eyebrow="اخبار و اطلاع‌رسانی"
          title="تازه‌های دانشگاه"
          description="روایت رویدادها، پژوهش‌ها و زندگی جامعه دانشگاهی"
          link={{ label: "همه اخبار دانشگاه", href: destinations.portal }}
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:gap-7">
          <div className="grid grid-cols-2 gap-5">
            {news.map((story, index) => (
              <NewsCard key={story.id} story={story} featured={index === 0} />
            ))}
          </div>
          <NoticesPanel />
        </div>
      </PageContainer>
    </section>
  );
}
