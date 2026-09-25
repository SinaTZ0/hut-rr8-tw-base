import { ArrowLeft, ArrowUpLeft, GraduationCap, MessagesSquare, Phone } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/primitive/button";
import { LinkTile } from "~/components/primitive/link-tile";
import { Separator } from "~/components/primitive/separator";
import { PageContainer } from "~/components/site/page-container";
import { destinations } from "~/content/university-links";

/*===== Student Guidance and University Contact =====*/

export function StudentSupport() {
  return (
    <section
      id="university-contact"
      tabIndex={-1}
      aria-labelledby="support-title"
      className="scroll-mt-28 py-14 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-solid sm:py-20"
    >
      <PageContainer>
        <div className="grid overflow-hidden rounded-3xl border bg-secondary/45 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative overflow-hidden bg-primary p-7 text-primary-foreground sm:p-9 lg:p-10">
            <GraduationCap
              className="absolute -bottom-5 -left-5 size-44 rotate-[-15deg] opacity-[0.07]"
              strokeWidth={1}
              aria-hidden="true"
            />
            <p className="mb-3 text-xs text-primary-foreground/80">شروع یک مسیر تازه</p>
            <h2 id="support-title" className="text-2xl leading-10 font-bold">
              به جمع ما خوش آمدید
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-8 text-primary-foreground/85">
              هر آنچه برای آغاز مسیر دانشگاهی نیاز دارید؛ از آشنایی با گروه‌های آموزشی تا راهنمای ثبت‌نام.
            </p>
            <div className="relative mt-6 flex flex-wrap gap-3">
              <Button
                nativeButton={false}
                role="link"
                variant="highlight"
                size="lg"
                render={<a href={destinations.newStudents} />}
              >
                راهنمای نودانشجویان <ArrowLeft aria-hidden="true" />
              </Button>
              <Button
                nativeButton={false}
                role="link"
                variant="inverse-outline"
                size="lg"
                render={<a href={destinations.departments} />}
              >
                گروه‌های آموزشی <ArrowUpLeft className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-center px-7 sm:px-9 lg:px-10">
            <LinkTile
              render={<Link to="/complaints-and-feedback" />}
              icon={<MessagesSquare strokeWidth={1.5} />}
              description="ثبت شکایت، پیشنهاد یا انتقاد و دریافت کد پیگیری"
              className="-mx-3"
            >
              صدای شما برای ما مهم است
            </LinkTile>
            <Separator aria-hidden="true" className="-mx-3" />
            <LinkTile
              href="http://counseling.hut.ac.ir"
              icon={<Phone strokeWidth={1.5} />}
              description="دریافت راهنمایی از مرکز مشاوره و سبک زندگی دانشگاه"
              className="-mx-3"
            >
              همراه شما در مسیر دانشگاه
            </LinkTile>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
