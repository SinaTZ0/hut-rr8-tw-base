import { LinkTile } from "~/components/primitive/link-tile";

import { services } from "../content";
import { PageContainer } from "./layout";

/*===== Everyday University Services =====*/
export function ServiceShortcuts() {
  return (
    <div className="bg-muted/45">
      <section aria-labelledby="services-title" className="relative z-10 -mt-6 sm:-mt-10">
        <PageContainer>
          <h2 id="services-title" className="sr-only">
            دسترسی سریع به خدمات دانشگاه
          </h2>
          {/* The negative margin moves the whole navigation surface without reserving an empty gap. */}
          <nav
            aria-labelledby="services-title"
            className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_6px_20px_-10px_rgba(11,47,50,0.25)] sm:grid-cols-3 lg:grid-cols-6"
          >
            {services.map((service) => (
              <div
                key={service.label}
                className="border-border not-last:border-e max-sm:nth-[-n+4]:border-b max-sm:nth-[2n]:border-e-0 sm:max-lg:nth-[-n+3]:border-b sm:max-lg:nth-[3n]:border-e-0"
              >
                <LinkTile
                  href={service.href}
                  variant="stacked"
                  icon={<service.icon strokeWidth={1.5} />}
                  description={service.description}
                >
                  {service.label}
                </LinkTile>
              </div>
            ))}
          </nav>
        </PageContainer>
      </section>
    </div>
  );
}
