import { useState } from "react";
import { ArrowUpLeft, Play, VideoOff } from "lucide-react";

import studentLife from "~/assets/campus-story-overview.jpg";
import { Button } from "~/components/ui/button";

import { destinations, universityStats } from "../content";
import { Eyebrow, PageContainer } from "./layout";

/*===== On-demand Student Life Video =====*/
function StudentLifeVideo() {
  const [requested, setRequested] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <figure>
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-university-deep sm:rounded-3xl">
        {failed ? (
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-5 p-6 text-center">
            <VideoOff className="size-8 text-highlight" aria-hidden="true" />
            <p role="status" className="text-sm leading-7 text-white/80">
              ویدیو در دسترس نیست.
              <br />
              ویدیوهای دانشگاه را در آپارات تماشا کنید.
            </p>
            <Button
              nativeButton={false}
              role="link"
              variant="highlight"
              className="min-h-11 px-5"
              render={<a href={destinations.aparat} />}
            >
              تماشا در آپارات <ArrowUpLeft aria-hidden="true" />
            </Button>
            <button
              type="button"
              className="min-h-11 rounded-md px-3 text-xs text-white/80 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-highlight"
              onClick={() => {
                setRequested(false);
                setFailed(false);
              }}
            >
              بازگشت به تصویر ویدیو
            </button>
          </div>
        ) : requested ? (
          <video
            src={destinations.studentVideo}
            poster={studentLife}
            className="aspect-[16/10] w-full bg-black object-contain"
            controls
            autoPlay
            playsInline
            aria-label="ویدیوی جشن روز دانشجو در دانشگاه صنعتی همدان"
            onError={() => setFailed(true)}
          >
            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند. <a href={destinations.aparat}>ویدیوهای دانشگاه در آپارات</a>
          </video>
        ) : (
          <button
            type="button"
            className="group relative block aspect-[16/10] w-full focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-highlight"
            aria-label="پخش ویدیوی زندگی دانشجویی؛ جشن روز دانشجو"
            onClick={() => setRequested(true)}
          >
            <img
              src={studentLife}
              width={1920}
              height={1080}
              alt="جشن روز دانشجو در دانشگاه صنعتی همدان"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span
              className="absolute inset-0 bg-linear-to-t from-university-deep/85 via-black/10 to-black/10"
              aria-hidden="true"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full border-8 border-white/20 bg-highlight bg-clip-padding text-highlight-foreground transition-transform group-hover:scale-110">
                <Play className="ms-0.5 size-5 fill-current" aria-hidden="true" />
              </span>
            </span>
            <span className="absolute right-6 bottom-6 text-start">
              <span className="mb-1 block text-[10px] font-medium text-highlight">زندگی در دانشگاه</span>
              <span className="block text-lg font-semibold text-white">خاطره‌هایی که با هم می‌سازیم</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-4 flex items-center justify-between gap-4 text-[11px] text-white/70">
        <span>جشن روز دانشجو · دانشگاه صنعتی همدان</span>
        <a
          href={destinations.aparat}
          className="flex min-h-11 items-center gap-1 rounded-md hover:text-white focus-visible:outline-2 focus-visible:outline-highlight"
        >
          ویدیوهای بیشتر <ArrowUpLeft className="size-3" aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}

/*===== University in Numbers =====*/
export function UniversityProfile() {
  return (
    <section
      aria-labelledby="profile-title"
      className="relative isolate overflow-hidden bg-university py-14 text-white sm:py-20"
    >
      <div
        className="pointer-events-none absolute -top-48 -right-48 -z-10 size-[480px] rounded-full border border-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-72 -left-36 -z-10 size-[480px] rounded-full border border-white/10"
        aria-hidden="true"
      />
      <PageContainer className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <Eyebrow className="text-highlight">جامعه‌ای برای یادگیری و ساختن</Eyebrow>
          <h2 id="profile-title" className="text-2xl leading-[1.7] font-bold sm:text-3xl">
            دانشگاه صنعتی همدان
            <br />
            در یک نگاه
          </h2>
          <p className="mt-4 max-w-md text-sm leading-8 text-white/75">
            آموزش و پژوهش در رشته‌های مهندسی، با تکیه بر دانش اعضای هیئت علمی و همراهی دانشجویان؛ در پیوند با نیازهای
            جامعه و صنعت.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-x-5 gap-y-6">
            {universityStats.map((stat) => (
              <div key={stat.label} className="flex flex-col border-t border-white/20 pt-4">
                <dt className="order-2 mt-1 text-[11px] leading-6 text-white/80 sm:text-xs">{stat.label}</dt>
                <dd dir="ltr" className="order-1 text-right text-2xl leading-9 font-bold text-highlight sm:text-3xl">
                  {stat.suffix}
                  {stat.value.toLocaleString("fa-IR")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <StudentLifeVideo />
      </PageContainer>
    </section>
  );
}
