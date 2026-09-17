import { cx, useReveal, styles } from "./common";

export function CallToActionSection() {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section className={styles["hut-cta"]}>
      <div ref={reveal.ref} className={cx(styles["hut-container"], styles["hut-cta__inner"], reveal.className)}>
        <div>
          <h2>اطلاعات مورد نیاز دانشجویان</h2>
          <p>فهرست گروه‌های آموزشی و راهنمای ثبت‌نام دانشجویان جدید در دسترس است.</p>
        </div>
        <div className={styles["hut-button-row"]}>
          <a className={cx(styles["hut-button"], styles["hut-button--light"])} href="https://hut.ac.ir/groups">
            گروه‌های آموزشی
          </a>
          <a className={cx(styles["hut-button"], styles["hut-button--gold"])} href="https://edu.hut.ac.ir/ngs1403">
            راهنمای نودانشجویان
          </a>
        </div>
      </div>
    </section>
  );
}
