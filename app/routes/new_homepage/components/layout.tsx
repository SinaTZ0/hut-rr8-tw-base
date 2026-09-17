import type { ReactNode } from "react";
import { cn } from "cn";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";

/*===== Page Layout =====*/
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10", className)}>{children}</div>;
}

/*===== Editorial Labels =====*/
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("mb-3 flex items-center gap-2.5 text-xs font-semibold text-primary sm:text-sm", className)}>
      <span className="h-1.5 w-5 rounded-full bg-highlight" aria-hidden="true" />
      {children}
    </p>
  );
}

export function TextLink({
  children,
  href,
  className,
  external = false,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  external?: boolean;
}) {
  const Icon = external ? ArrowUpLeft : ArrowLeft;
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md text-sm font-semibold text-primary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
    >
      {children}
      <Icon className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
    </a>
  );
}

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
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className="text-2xl leading-relaxed font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>}
      </div>
      {link && <TextLink href={link.href}>{link.label}</TextLink>}
    </div>
  );
}
