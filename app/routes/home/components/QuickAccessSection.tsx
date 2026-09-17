import { cx, Icon, useReveal, styles, type IconName } from "./common";

const quickLinks: Array<{ label: string; href: string; icon: IconName }> = [
  { label: "سامانه گلستان", href: "http://golestan.hut.ac.ir/", icon: "graduation" },
  { label: "درس‌افزار", href: "https://ec.hut.ac.ir/", icon: "desktop" },
  { label: "سامانه تغذیه", href: "http://nutrition.hut.ac.ir/", icon: "utensils" },
  { label: "کتابخانه مرکزی", href: "http://library.hut.ac.ir", icon: "book" },
  { label: "سامانه ساجد", href: "https://sajed.hut.ac.ir", icon: "user" },
  { label: "آموزش‌های آزاد", href: "https://academics.hut.ac.ir", icon: "globe" },
  { label: "همه سامانه‌ها", href: "https://hut.ac.ir/%D8%B3%D8%A7%D9%85%D8%A7%D9%86%D9%87-%D9%87%D8%A7", icon: "grid" },
];

export function QuickAccessSection() {
  const reveal = useReveal<HTMLDivElement>(true);

  return (
    <div
      ref={reveal.ref}
      className={cx(styles["hut-container"], styles["hut-quick-wrap"], reveal.className)}
      aria-label="دسترسی سریع به سامانه‌ها"
    >
      <div className={styles["hut-quick-grid"]}>
        {quickLinks.map((link) => (
          <a className={styles["hut-quick-link"]} href={link.href} key={link.label}>
            <span className={styles["hut-quick-link__icon"]}>
              <Icon name={link.icon} />
            </span>
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
