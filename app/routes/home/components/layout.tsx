import { Eyebrow } from "~/components/primitive/eyebrow";
import { TextLink } from "~/components/primitive/text-link";

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
        <h2 id={id} className="text-2xl leading-relaxed font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>}
      </div>
      {link && <TextLink href={link.href}>{link.label}</TextLink>}
    </div>
  );
}
