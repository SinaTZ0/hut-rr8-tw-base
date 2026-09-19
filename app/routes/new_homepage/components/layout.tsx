import type { ReactNode } from "react";
import { cn } from "cn";
import { Eyebrow } from "~/components/primitive/eyebrow";
import { TextLink } from "~/components/primitive/text-link";

/*===== Page Layout =====*/
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10", className)}>{children}</div>;
}

/*===== Section Heading =====*/

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  link,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 sm:mb-10">
      <div>
        <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
        <h2 id={id} className="text-foreground text-2xl leading-relaxed font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && <p className="text-muted-foreground mt-2 text-sm leading-7">{description}</p>}
      </div>
      {link && <TextLink href={link.href}>{link.label}</TextLink>}
    </div>
  );
}
