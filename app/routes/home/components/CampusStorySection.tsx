import { useState } from "react";

import campusStory from "../../../assets/campus-story-overview.jpg";
import { cx, PersianNumber, useReveal, styles } from "./common";

const stats = [
  [2300, "دانشجو"],
  [115, "عضو هیئت علمی"],
  [2200, "دانش‌آموخته"],
  [2400, "مقاله علمی"],
  [8, "گروه آموزشی"],
  [75, "کارمند"],
] as const;

export function CampusStorySection() {
  const [videoStarted, setVideoStarted] = useState(false);
  const videoReveal = useReveal<HTMLDivElement>();
  const contentReveal = useReveal<HTMLDivElement>();

  return (
    <section className={cx(styles["hut-section"], styles["hut-story"])} aria-labelledby="hutStoryTitle">
      <div className={cx(styles["hut-container"], styles["hut-story__grid"])}>
        <div ref={videoReveal.ref} className={cx(styles["hut-video"], videoReveal.className)}>
          <img src={campusStory} alt="نمایی از دانشگاه صنعتی همدان" loading="lazy" />
          {videoStarted ? (
            <video
              src="https://www.hut.ac.ir/documents/38165/18249686/Jashan_k.mp4/edc8272b-fcd3-35f7-a75d-20655049dd8f?t=1768803535763"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <div className={styles["hut-video__overlay"]}>
              <button
                className={styles["hut-play"]}
                type="button"
                aria-label="پخش ویدیوی معرفی دانشگاه"
                onClick={() => setVideoStarted(true)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m8 5 11 7-11 7V5Z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div ref={contentReveal.ref} className={cx(styles["hut-story__content"], contentReveal.className)}>
          <span className={styles["hut-eyebrow"]}>معرفی دانشگاه</span>
          <h2 id="hutStoryTitle">دانشگاه صنعتی همدان در یک نگاه</h2>
          <p>
            دانشگاه صنعتی همدان در حوزه آموزش و پژوهش رشته‌های مهندسی فعالیت می‌کند. آمار زیر اطلاعات کلی دانشگاه را
            نشان می‌دهد.
          </p>
          <div className={styles["hut-stats"]}>
            {stats.map(([value, label]) => (
              <div className={styles["hut-stat"]} key={label}>
                <strong>
                  <PersianNumber value={value} />
                </strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
