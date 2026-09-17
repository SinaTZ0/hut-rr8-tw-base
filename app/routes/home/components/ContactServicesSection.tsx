import { Link } from "react-router";

import { cx, Icon, useReveal, styles } from "./common";

const contactServices = [
  {
    href: "/online-consultation",
    icon: "phone" as const,
    title: "مشاوره آنلاین",
    description: "پرسش خود را ثبت کنید تا برای بررسی و پاسخ‌گویی به واحد مرتبط ارجاع شود.",
    action: "ثبت پرسش",
  },
  {
    href: "/complaints-and-feedback",
    icon: "mail" as const,
    title: "ثبت شکایات و پیشنهادات",
    description: "دیدگاه‌ها و تجربه‌های خود را برای بهبود خدمات دانشگاه با ما در میان بگذارید.",
    action: "ثبت پیام",
  },
] as const;

function ContactServiceCard({
  href,
  icon,
  title,
  description,
  action,
}: (typeof contactServices)[number]) {
  const reveal = useReveal<HTMLAnchorElement>();

  return (
    <Link ref={reveal.ref} className={cx(styles["hut-contact-service"], reveal.className)} to={href}>
      <span className={styles["hut-contact-service__icon"]}>
        <Icon name={icon} />
      </span>
      <span className={styles["hut-contact-service__body"]}>
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
      <span className={styles["hut-contact-service__action"]}>
        {action} <span aria-hidden="true">←</span>
      </span>
    </Link>
  );
}

export function ContactServicesSection() {
  const headingReveal = useReveal<HTMLElement>();

  return (
    <section
      className={cx(styles["hut-section"], styles["hut-section--white"], styles["hut-contact-services"])}
      aria-labelledby="hutContactServicesTitle"
    >
      <div className={styles["hut-container"]}>
        <header ref={headingReveal.ref} className={cx(styles["hut-section__head"], headingReveal.className)}>
          <div>
            <span className={styles["hut-eyebrow"]}>ارتباط با دانشگاه</span>
            <h2 id="hutContactServicesTitle">صدای شما برای ما مهم است</h2>
            <p>برای دریافت راهنمایی یا ثبت دیدگاه، از خدمات ارتباطی دانشگاه استفاده کنید.</p>
          </div>
        </header>

        <div className={styles["hut-contact-services__grid"]}>
          {contactServices.map((service) => (
            <ContactServiceCard key={service.href} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
