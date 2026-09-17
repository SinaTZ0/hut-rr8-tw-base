import athletics from "../../../assets/news-athletics-olympiad.jpg";
import sustainableEnergy from "../../../assets/news-sustainable-energy-journal.jpg";
import biomedicalFaculty from "../../../assets/achievement-biomedical-faculty.jpg";
import controlledBlasting from "../../../assets/event-controlled-blasting-workshop.jpg";
import batteryTraining from "../../../assets/event-battery-maintenance-training.jpg";
import steamPlant from "../../../assets/event-steam-power-plant-training.jpg";
import { cx, useReveal, styles } from "./common";

type CardData = {
  href: string;
  image: string;
  imageAlt: string;
  category: string;
  title: string;
  description: string;
};

function ContentCard({ card }: { card: CardData }) {
  const reveal = useReveal<HTMLAnchorElement>();

  return (
    <a ref={reveal.ref} className={cx(styles["hut-card"], reveal.className)} href={card.href}>
      <div className={styles["hut-card__media"]}>
        <img src={card.image} alt={card.imageAlt} loading="lazy" />
      </div>
      <div className={styles["hut-card__body"]}>
        <div className={styles["hut-card__meta"]}>{card.category}</div>
        <h3>{card.title}</h3>
        <p>{card.description}</p>
      </div>
    </a>
  );
}

function CardsSection({
  eyebrow,
  title,
  description,
  link,
  cards,
  tone,
  labelledBy,
}: {
  eyebrow: string;
  title: string;
  description: string;
  link: { href: string; label: string };
  cards: CardData[];
  tone: "tint" | "white";
  labelledBy: string;
}) {
  const headingReveal = useReveal<HTMLElement>();

  return (
    <section className={cx(styles["hut-section"], styles[`hut-section--${tone}`])} aria-labelledby={labelledBy}>
      <div className={styles["hut-container"]}>
        <header ref={headingReveal.ref} className={cx(styles["hut-section__head"], headingReveal.className)}>
          <div>
            <span className={styles["hut-eyebrow"]}>{eyebrow}</span>
            <h2 id={labelledBy}>{title}</h2>
            <p>{description}</p>
          </div>
          <a className={styles["hut-text-link"]} href={link.href}>
            {link.label} <span aria-hidden="true">←</span>
          </a>
        </header>
        <div className={styles["hut-card-grid"]}>
          {cards.map((card) => (
            <ContentCard card={card} key={card.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

const achievementCards: CardData[] = [
  {
    href: "https://hut.ac.ir/achievements/athletics",
    image: athletics,
    imageAlt: "ورزشکاران دانشگاه",
    category: "ورزشی",
    title: "نتایج ورزشکاران دانشگاه در المپیاد سراسری",
    description: "کسب مدال طلای کاراته، مقام پنجم کشتی فرنگی و جایگاه هشتم تیراندازی.",
  },
  {
    href: "https://hut.ac.ir/achievements/isc",
    image: sustainableEnergy,
    imageAlt: "نشریه علمی دانشگاه",
    category: "پژوهش",
    title: "نمایه‌شدن نشریه انرژی پایدار و هوش مصنوعی در ISC",
    description: "نشریه علمی و پژوهشی دانشگاه در پایگاه استنادی علوم جهان اسلام نمایه شد.",
  },
  {
    href: "https://hut.ac.ir/achievements/faculty",
    image: biomedicalFaculty,
    imageAlt: "اعضای هیئت علمی مهندسی پزشکی",
    category: "هیئت علمی",
    title: "ارتقای علمی اعضای هیئت علمی گروه مهندسی پزشکی",
    description: "آخرین احکام ارتقای مرتبه علمی اعضای هیئت علمی گروه مهندسی پزشکی.",
  },
];

const eventCards: CardData[] = [
  {
    href: "https://hut.ac.ir/events/blasting-workshop",
    image: controlledBlasting,
    imageAlt: "کارگاه تخصصی آتشباری کنترل‌شده",
    category: "کارگاه تخصصی",
    title: "آشنایی با آتشباری کنترل‌شده",
    description: "آموزش کاربردی برای توسعه مهارت‌های تخصصی دانشجویان و فعالان صنعت.",
  },
  {
    href: "https://hut.ac.ir/events/battery-training",
    image: batteryTraining,
    imageAlt: "دوره آموزشی باتری و نگهداری",
    category: "آموزش صنعت",
    title: "دوره باتری و اصول نگهداری آن",
    description: "برگزاری دوره کوتاه‌مدت ویژه کارکنان نیروگاه شهید مفتح.",
  },
  {
    href: "https://hut.ac.ir/events/steam-plant",
    image: steamPlant,
    imageAlt: "دوره کنترل نیروگاه بخار",
    category: "همکاری دانشگاه و صنعت",
    title: "دوره آموزشی کنترل نیروگاه بخار",
    description: "ارتقای دانش فنی کارکنان صنعت با بهره‌گیری از ظرفیت علمی دانشگاه.",
  },
];

export function AchievementsSection() {
  return (
    <CardsSection
      eyebrow="علمی، پژوهشی و دانشجویی"
      title="دستاوردها و افتخارات"
      description="آخرین دستاوردهای ثبت‌شده دانشگاه"
      link={{ href: "https://hut.ac.ir/achievements", label: "مشاهده همه" }}
      cards={achievementCards}
      tone="tint"
      labelledBy="hutAchievementTitle"
    />
  );
}

export function EventsSection() {
  return (
    <CardsSection
      eyebrow="آموزش و فناوری"
      title="رویدادها و دوره‌های آموزشی"
      description="آخرین دوره‌های مرکز آموزش‌های آزاد و برنامه‌های مرتبط با صنعت"
      link={{ href: "https://hut.ac.ir/web/roshd", label: "صفحه مرکز رشد" }}
      cards={eventCards}
      tone="white"
      labelledBy="hutInnovationTitle"
    />
  );
}
