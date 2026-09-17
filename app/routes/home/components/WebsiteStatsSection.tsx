import { cx, Icon, useReveal, styles } from "./common";

type WebsiteStats = {
  todayVisits: number;
  totalVisits: number;
  todayUsers: number;
};

const metrics = [
  ["todayVisits", "بازدید امروز"],
  ["totalVisits", "کل بازدیدها"],
  ["todayUsers", "کاربران امروز"],
] as const;

function formatNumber(value: number) {
  return value.toLocaleString("fa-IR");
}

export function WebsiteStatsSection({ stats }: { stats: WebsiteStats | null }) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section className={cx(styles["hut-section"], styles["hut-website-stats"])} aria-labelledby="hutWebsiteStatsTitle">
      <div className={styles["hut-container"]}>
        <div ref={reveal.ref} className={cx(styles["hut-website-stats__inner"], reveal.className)}>
          <div className={styles["hut-website-stats__intro"]}>
            <span className={styles["hut-eyebrow"]}>آمار وب‌سایت</span>
            <h2 id="hutWebsiteStatsTitle">نگاهی به بازدیدهای وب‌سایت</h2>
            <p>آمار بازدیدهای ثبت‌شده در پایگاه اطلاع‌رسانی دانشگاه صنعتی همدان.</p>
          </div>

          <div className={styles["hut-website-stats__panel"]}>
            <span className={styles["hut-website-stats__icon"]}>
              <Icon name="chart" />
            </span>
            {stats ? (
              <div className={styles["hut-website-stats__grid"]}>
                {metrics.map(([key, label]) => (
                  <div className={styles["hut-website-stats__item"]} key={key}>
                    <strong className={styles["hut-website-stats__value"]}>{formatNumber(stats[key])}</strong>
                    <span className={styles["hut-website-stats__label"]}>{label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className={styles["hut-website-stats__status"]} role="status">
                آمار در دسترس نیست
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
