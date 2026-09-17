import { useEffect, useRef, useState, type ReactNode } from "react";

import styles from "../home.module.css";

export { styles };

export const cx = (...classNames: Array<string | false | null | undefined>) => classNames.filter(Boolean).join(" ");

export type IconName =
  | "bell"
  | "book"
  | "calendar"
  | "chart"
  | "chevron"
  | "clock"
  | "close"
  | "desktop"
  | "globe"
  | "grid"
  | "mail"
  | "menu"
  | "moon"
  | "pin"
  | "phone"
  | "search"
  | "sun"
  | "user"
  | "utensils"
  | "graduation";

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const iconClassName = cx(styles["hut-icon"], className);

  switch (name) {
    case "bell":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
        </svg>
      );
    case "book":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z" />
          <path d="M8 7h8M8 11h6" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "chart":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
        </svg>
      );
    case "chevron":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "clock":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "close":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "desktop":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 22h8M12 18v4M8 9h8M8 13h5" />
        </svg>
      );
    case "globe":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v18M3 12h18" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "grid":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "graduation":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3 10 9-5 9 5-9 5-9-5Z" />
          <path d="M7 12.5V17c3 2 7 2 10 0v-4.5M21 10v6" />
        </svg>
      );
    case "mail":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "menu":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "moon":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
        </svg>
      );
    case "pin":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "phone":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
        </svg>
      );
    case "search":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );
    case "sun":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
        </svg>
      );
    case "user":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "utensils":
      return (
        <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 3-2 7 0 9h3V3h-3ZM20 12v9" />
        </svg>
      );
  }
}

export function useReveal<T extends HTMLElement = HTMLElement>(initiallyVisible = false) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(initiallyVisible);

  useEffect(() => {
    if (initiallyVisible) return;

    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [initiallyVisible]);

  return {
    ref,
    className: cx(styles["hut-reveal"], visible && styles["is-visible"]),
    visible,
  };
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
}: {
  eyebrow: string;
  title: string;
  description: string;
  link?: { href: string; label: string };
}) {
  return (
    <div>
      <span className={styles["hut-eyebrow"]}>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {link ? (
        <a className={styles["hut-text-link"]} href={link.href}>
          {link.label} <span aria-hidden="true">←</span>
        </a>
      ) : null}
    </div>
  );
}

export function PersianNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let startTime: number | null = null;
    const animate = (time: number) => {
      if (startTime === null) startTime = time;
      const progress = Math.min((time - startTime) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(value * eased));
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <>{display.toLocaleString("fa-IR")}+</>;
}

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className={styles["hut-sr-only"]}>{children}</span>;
}
