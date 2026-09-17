import { ArrowUpLeft } from "lucide-react";

// import { destinations, services } from "../content";
// import { PageContainer, TextLink } from "./layout";
import { services } from "../content";
import { PageContainer } from "./layout";
/*===== Everyday University Services =====*/
export function ServiceShortcuts() {
  return (
    <div className="bg-muted/45">
      <section aria-labelledby="services-title" className="relative  z-10 -mt-6 sm:-mt-10">
        <PageContainer>
          {/* The negative margin moves the whole navigation surface without reserving an empty gap. */}
          <nav
            aria-labelledby="services-title"
            className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_6px_20px_-10px_rgba(11,47,50,0.25)] sm:grid-cols-3 lg:grid-cols-6"
          >
            {services.map((service) => (
              <a
                key={service.label}
                href={service.href}
                className="group relative flex min-h-28 min-w-0 flex-col items-center justify-center gap-2 border-border px-3 py-4 text-center transition-colors hover:bg-muted focus-visible:z-10 focus-visible:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none not-last:border-e max-sm:nth-[2n]:border-e-0 max-sm:nth-[-n+4]:border-b sm:max-lg:nth-[3n]:border-e-0 sm:max-lg:nth-[-n+3]:border-b"
              >
                <service.icon className="size-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-sm leading-6 font-semibold">{service.label}</span>
                <span className="text-[11px] leading-5 text-muted-foreground">{service.description}</span>
                <ArrowUpLeft
                  className="absolute top-3 left-3 size-3.5 text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>
          {/* <div className="flex min-h-11 items-center justify-between gap-4">
            <h2 id="services-title" className="text-xs font-semibold text-muted-foreground">
              دسترسی سریع
            </h2>
            <TextLink href={destinations.systems} className="text-xs motion-reduce:transition-none">
              همه سامانه‌ها
            </TextLink>
          </div> */}
        </PageContainer>
      </section>
    </div>
  );
}
