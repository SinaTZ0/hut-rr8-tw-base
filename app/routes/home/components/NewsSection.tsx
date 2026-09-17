import staffMeeting from "../../../assets/news-staff-meeting.jpg";
import athletics from "../../../assets/news-athletics-olympiad.jpg";
import sustainableEnergy from "../../../assets/news-sustainable-energy-journal.jpg";
import { cx, Icon, useReveal, styles } from "./common";

type NewsCardData = {
  href: string;
  image: string;
  imageAlt: string;
  date: string;
  title: string;
  description: string;
  featured?: boolean;
};

const newsCards: NewsCardData[] = [
  {
    href: "https://hut.ac.ir/news/staff-meeting",
    image: staffMeeting,
    imageAlt: "نشست رئیس دانشگاه با کارکنان",
    date: "۱۰ شهریور ۱۴۰۵",
    title: "دیدار رئیس دانشگاه صنعتی همدان با کارکنان غیرهیئت‌علمی به مناسبت هفته دولت",
    description: "نشست رئیس دانشگاه و اعضای هیئت‌رئیسه با کارکنان، با حضور معاونان و جمعی از همکاران دانشگاه برگزار شد.",
    featured: true,
  },
  {
    href: "https://hut.ac.ir/news/athletics",
    image: athletics,
    imageAlt: "ورزشکاران دانشگاه صنعتی همدان",
    date: "۹ شهریور ۱۴۰۵",
    title: "نتایج ورزشکاران دانشگاه در هفدهمین المپیاد ورزشی دانشجویان",
    description: "کسب مدال طلای کاراته، مقام پنجم کشتی فرنگی و جایگاه هشتم تیراندازی.",
  },
  {
    href: "https://hut.ac.ir/news/isc",
    image: sustainableEnergy,
    imageAlt: "نشریه انرژی پایدار و هوش مصنوعی",
    date: "۷ مرداد ۱۴۰۵",
    title: "نشریه علمی دانشگاه صنعتی همدان در پایگاه ISC نمایه شد",
    description: "نشریه «انرژی پایدار و هوش مصنوعی» به جمع نشریات نمایه‌شده پیوست.",
  },
];

function NewsCard({ card }: { card: NewsCardData }) {
  const reveal = useReveal<HTMLAnchorElement>();

  return (
    <a
      ref={reveal.ref}
      className={cx(
        styles["hut-news-card"],
        card.featured && styles["hut-news-card--featured"],
        reveal.className,
      )}
      href={card.href}
    >
      <div className={styles["hut-news-card__media"]}>
        <img src={card.image} alt={card.imageAlt} loading="lazy" />
        {card.featured ? <span className={styles["hut-news-card__tag"]}>خبر ویژه</span> : null}
      </div>
      <div className={styles["hut-news-card__body"]}>
        <span className={styles["hut-news-card__date"]}>
          {card.featured ? <Icon name="clock" /> : null}
          {card.date}
        </span>
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <span className={styles["hut-text-link"]}>
          ادامه خبر <span aria-hidden="true">←</span>
        </span>
      </div>
    </a>
  );
}

const notices = [
  ["۱۵", "شهریور", "مهلت دفاع از پایان‌نامه کارشناسی ارشد در نیمسال دوم", "معاونت آموزشی و پژوهشی"],
  ["۱۵", "شهریور", "برگزاری جلسه دفاع از سمینار کارشناسی ارشد مهندسی معدن", "گروه مهندسی معدن"],
  ["۱۴", "شهریور", "اطلاعیه مهم انتخاب واحد نیم‌سال اول سال تحصیلی ۱۴۰۶–۱۴۰۵", "اداره خدمات آموزشی"],
  ["۱۴", "شهریور", "ثبت درخواست مجوز ادامه تحصیل برای دانشجویان مشروطی", "اداره خدمات آموزشی"],
] as const;

function NoticesPanel() {
  const reveal = useReveal<HTMLElement>();

  return (
    <aside ref={reveal.ref} className={cx(styles["hut-notices"], reveal.className)} aria-labelledby="hutNoticesTitle">
      <div className={styles["hut-notices__head"]}>
        <h2 id="hutNoticesTitle">اطلاعیه‌ها</h2>
        <span>
          <Icon name="bell" />
        </span>
      </div>
      {notices.map(([day, month, title, owner]) => (
        <a className={styles["hut-notice-item"]} href="https://hut.ac.ir/notices" key={title}>
          <span className={styles["hut-notice-date"]}>
            <strong>{day}</strong>
            <small>{month}</small>
          </span>
          <span>
            <h3>{title}</h3>
            <p>{owner}</p>
          </span>
        </a>
      ))}
      <a className={styles["hut-text-link"]} href="https://hut.ac.ir/notices">
        همه اطلاعیه‌ها <span aria-hidden="true">←</span>
      </a>
    </aside>
  );
}

export function NewsSection() {
  const headingReveal = useReveal<HTMLElement>();

  return (
    <section className={cx(styles["hut-section"], styles["hut-section--tint"])} aria-labelledby="hutNewsTitle">
      <div className={styles["hut-container"]}>
        <header ref={headingReveal.ref} className={cx(styles["hut-section__head"], headingReveal.className)}>
          <div>
            <span className={styles["hut-eyebrow"]}>اخبار دانشگاه</span>
            <h2 id="hutNewsTitle">آخرین اخبار</h2>
            <p>آخرین مطالب منتشرشده در پایگاه اطلاع‌رسانی دانشگاه</p>
          </div>
          <a className={styles["hut-text-link"]} href="https://hut.ac.ir/news">
            مشاهده همه اخبار <span aria-hidden="true">←</span>
          </a>
        </header>

        <div className={styles["hut-news-layout"]}>
          <div className={styles["hut-news-grid"]}>
            {newsCards.map((card) => (
              <NewsCard card={card} key={card.title} />
            ))}
          </div>
          <NoticesPanel />
        </div>
      </div>
    </section>
  );
}
