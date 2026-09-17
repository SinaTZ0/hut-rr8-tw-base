import { cx, useReveal, styles } from "./common";

const calendarItems = [
  ["۲۶ تا ۲۹", "بهمن ۱۴۰۴", "انتخاب واحد"],
  ["۲", "اسفند ۱۴۰۴", "شروع کلاس‌ها"],
  ["۱۰ تا ۱۱", "اسفند ۱۴۰۴", "حذف و اضافه"],
  ["۱۷ تا ۱۸", "خرداد ۱۴۰۵", "حذف تک درس"],
  ["۱۶ تا ۲۹", "خرداد ۱۴۰۵", "ارزشیابی اساتید", true],
  ["۳", "تیر ۱۴۰۵", "پایان کلاس‌ها"],
  ["۶ تا ۲۲", "تیر ۱۴۰۵", "امتحانات"],
] as const;

export function CalendarSection() {
  const headingReveal = useReveal<HTMLElement>();
  const calendarReveal = useReveal<HTMLDivElement>();

  return (
    <section className={cx(styles["hut-section"], styles["hut-section--white"])} aria-labelledby="hutCalendarTitle">
      <div className={styles["hut-container"]}>
        <header ref={headingReveal.ref} className={cx(styles["hut-section__head"], headingReveal.className)}>
          <div>
            <span className={styles["hut-eyebrow"]}>آموزش</span>
            <h2 id="hutCalendarTitle">تقویم آموزشی دانشگاه</h2>
            <p>زمان‌بندی ثبت‌نام، شروع کلاس‌ها، ارزشیابی و امتحانات</p>
          </div>
          <a className={styles["hut-text-link"]} href="https://hut.ac.ir/academic-calendar">
            تقویم کامل <span aria-hidden="true">←</span>
          </a>
        </header>

        <div
          ref={calendarReveal.ref}
          className={cx(styles["hut-calendar-shell"], calendarReveal.className)}
          tabIndex={0}
          aria-label="برای دیدن تمام تقویم، افقی پیمایش کنید"
        >
          <div className={styles["hut-calendar"]}>
            {calendarItems.map(([firstLine, secondLine, title, current]) => (
              <div className={cx(styles["hut-calendar__item"], current && styles["is-current"])} key={title}>
                <div className={styles["hut-calendar__date"]}>
                  {firstLine}
                  <br />
                  {secondLine}
                </div>
                <div className={styles["hut-calendar__marker"]} />
                <div className={styles["hut-calendar__title"]}>{title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
