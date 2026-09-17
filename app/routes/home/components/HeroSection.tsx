import { useEffect, useState } from "react";

import { cx, useReveal, styles } from "./common";

const features = [
  {
    title: "تقویم آموزشی نیم‌سال اول سال تحصیلی ۱۴۰۶–۱۴۰۵",
    text: "تاریخ‌های مهم ثبت‌نام، انتخاب واحد و شروع کلاس‌ها را مشاهده کنید.",
    url: "https://hut.ac.ir/fa/w/-772?redirect=%2F",
  },
  {
    title: "نتایج ورزشکاران دانشگاه در المپیاد سراسری",
    text: "کسب مدال طلای کاراته، مقام پنجم کشتی فرنگی و جایگاه هشتم تیراندازی.",
    url: "https://hut.ac.ir/fa/w/%D8%AF%D8%B1%D8%AE%D8%B4%D8%B4-%D9%88%D8%B1%D8%B2%D8%B4%DA%A9%D8%A7%D8%B1%D8%A7%D9%86-%D8%AF%D8%A7%D9%86%D8%B4%DA%AF%D8%A7%D9%87-%D8%B5%D9%86%D8%B9%D8%AA%DB%8C-%D9%87%D9%85%D8%AF%D8%A7%D9%86-%D8%AF%D8%B1-%D9%87%D9%81%D8%AF%D9%87%D9%85%DB%8C%D9%86-%D8%A7?redirect=%2F",
  },
  {
    title: "نشریه انرژی پایدار و هوش مصنوعی در ISC نمایه شد",
    text: "نشریه علمی و پژوهشی دانشگاه در پایگاه استنادی علوم جهان اسلام نمایه شد.",
    url: "https://hut.ac.ir/fa/w/%D9%86%D8%B4%D8%B1%DB%8C%D9%87-%D8%B9%D9%84%D9%85%DB%8C-%D9%88-%D9%BE%DA%98%D9%88%D9%87%D8%B4%DB%8C-%D8%AF%D8%A7%D9%86%D8%B4%DA%AF%D8%A7%D9%87-%D8%B5%D9%86%D8%B9%D8%AA%DB%8C-%D9%87%D9%85%D8%AF%D8%A7%D9%86-%D8% در-%D9%BE%D8%A7%DB%8C%DA%AF%D8%A7%D9%87-?redirect=%2F",
  },
] as const;

export function HeroSection() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const heroCopy = useReveal<HTMLDivElement>(true);
  const featureCard = useReveal<HTMLElement>(true);
  const feature = features[currentFeature];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setCurrentFeature((current) => (current + 1) % features.length);
    }, 6500);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className={styles["hut-hero"]} aria-labelledby="hutHeroTitle">
      <div className={cx(styles["hut-container"], styles["hut-hero__inner"])}>
        <div ref={heroCopy.ref} className={heroCopy.className}>
          <span className={styles["hut-eyebrow"]}>پایگاه اطلاع‌رسانی</span>
          <h1 id="hutHeroTitle">دانشگاه صنعتی همدان</h1>
          <p className={styles["hut-hero__lead"]}>
            دسترسی به اخبار، اطلاعیه‌ها، برنامه‌های آموزشی، خدمات دانشجویی و سامانه‌های دانشگاه.
          </p>
          <div className={styles["hut-button-row"]}>
            <a className={cx(styles["hut-button"], styles["hut-button--gold"])} href="https://hut.ac.ir/%D9%85%D8%B9%D8%B1%D9%81%DB%8C-%D8%AF%D8%A7%D9%86%D8%B4%DA%AF%D8%A7%D9%87">
              آشنایی با دانشگاه <span aria-hidden="true">←</span>
            </a>
            <a className={cx(styles["hut-button"], styles["hut-button--ghost"])} href="https://edu.hut.ac.ir/ngs1403">
              راهنمای نودانشجویان
            </a>
          </div>
        </div>

        <article ref={featureCard.ref} className={cx(styles["hut-feature-card"], featureCard.className)} aria-live="polite">
          <span className={styles["hut-feature-card__label"]}>اطلاع‌رسانی</span>
          <h2>{feature.title}</h2>
          <p>{feature.text}</p>
          <div className={styles["hut-feature-card__controls"]}>
            <a className={styles["hut-feature-card__link"]} href={feature.url}>
              مشاهده جزئیات <span aria-hidden="true">←</span>
            </a>
            <div className={styles["hut-slider-dots"]} aria-label="انتخاب خبر ویژه">
              {features.map((item, index) => (
                <button
                  className={cx(styles["hut-slider-dot"], currentFeature === index && styles["is-active"])}
                  type="button"
                  key={item.title}
                  aria-label={`خبر ${index + 1}`}
                  aria-current={currentFeature === index ? "true" : undefined}
                  onClick={() => setCurrentFeature(index)}
                />
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
