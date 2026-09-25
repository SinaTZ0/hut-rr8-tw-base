import biomedicalFaculty from "~/assets/achievement-biomedical-faculty.jpg";
import batteryTraining from "~/assets/event-battery-maintenance-training.jpg";
import controlledBlasting from "~/assets/event-controlled-blasting-workshop.jpg";
import steamPlant from "~/assets/event-steam-power-plant-training.jpg";
import athletics from "~/assets/news-athletics-olympiad.jpg";
import staffMeeting from "~/assets/news-staff-meeting.jpg";
import sustainableEnergy from "~/assets/news-sustainable-energy-journal.jpg";
import { destinations, navigationGroups, services, type UniversityLink } from "~/content/university-links";

/*===== Content Contracts =====*/
export type UniversityStory = {
  id: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  imageAlt: string;
  href: string;
  date?: string;
};

/*===== News and Announcements =====*/
// The legacy mock article paths are not canonical CMS URLs. Until a permalink is
// available, stories point to the official portal rather than inventing pages.
export const news: UniversityStory[] = [
  {
    id: "staff-meeting",
    title: "دیدار رئیس دانشگاه با کارکنان به مناسبت هفته دولت",
    category: "دانشگاه",
    summary:
      "نشست رئیس دانشگاه صنعتی همدان و اعضای هیئت‌رئیسه با کارکنان غیرهیئت‌علمی، با حضور معاونان و جمعی از همکاران دانشگاه برگزار شد.",
    image: staffMeeting,
    imageAlt: "نشست رئیس دانشگاه صنعتی همدان با کارکنان",
    date: "۱۰ شهریور ۱۴۰۵",
    href: destinations.portal,
  },
  {
    id: "student-athletics",
    title: "درخشش ورزشکاران دانشگاه در المپیاد دانشجویان",
    category: "دانشجویی",
    summary: "کسب مدال طلای کاراته، مقام پنجم کشتی فرنگی و جایگاه هشتم تیراندازی در هفدهمین المپیاد ورزشی دانشجویان.",
    image: athletics,
    imageAlt: "نتایج ورزشکاران دانشگاه در المپیاد دانشجویان",
    date: "۹ شهریور ۱۴۰۵",
    href: destinations.portal,
  },
  {
    id: "isc-journal",
    title: "نمایه‌شدن نشریه علمی دانشگاه در پایگاه ISC",
    category: "پژوهش",
    summary: "نشریه انرژی پایدار و هوش مصنوعی دانشگاه در پایگاه استنادی علوم جهان اسلام نمایه شد.",
    image: sustainableEnergy,
    imageAlt: "نشریه انرژی پایدار و هوش مصنوعی و نشان ISC",
    date: "۷ مرداد ۱۴۰۵",
    href: destinations.portal,
  },
];

export const notices = [
  {
    id: "notice-thesis-defence",
    day: "۱۵",
    month: "شهریور",
    title: "مهلت دفاع از پایان‌نامه کارشناسی ارشد در نیم‌سال دوم",
    owner: "معاونت آموزشی و پژوهشی",
  },
  {
    id: "notice-mining-seminar",
    day: "۱۵",
    month: "شهریور",
    title: "برگزاری جلسه دفاع از سمینار کارشناسی ارشد مهندسی معدن",
    owner: "گروه مهندسی معدن",
  },
  {
    id: "notice-course-enrolment",
    day: "۱۴",
    month: "شهریور",
    title: "اطلاعیه انتخاب واحد نیم‌سال اول سال تحصیلی ۱۴۰۵–۱۴۰۶",
    owner: "اداره خدمات آموزشی",
  },
  {
    id: "notice-study-permission",
    day: "۱۴",
    month: "شهریور",
    title: "ثبت درخواست مجوز ادامه تحصیل برای دانشجویان مشروطی",
    owner: "اداره خدمات آموزشی",
  },
];

/*===== Academic Calendar =====*/
// These source dates belong to the second semester of 1404–1405. Keep the
// semester explicit and never imply that a hard-coded milestone is current.
export const academicCalendar = [
  { day: "۲۶–۲۹", month: "بهمن ۱۴۰۴", title: "انتخاب واحد" },
  { day: "۲", month: "اسفند ۱۴۰۴", title: "شروع کلاس‌ها" },
  { day: "۱۰–۱۱", month: "اسفند ۱۴۰۴", title: "حذف و اضافه" },
  { day: "۱۷–۱۸", month: "خرداد ۱۴۰۵", title: "حذف تک‌درس" },
  { day: "۱۶–۲۹", month: "خرداد ۱۴۰۵", title: "ارزشیابی اساتید" },
  { day: "۳", month: "تیر ۱۴۰۵", title: "پایان کلاس‌ها" },
  { day: "۶–۲۲", month: "تیر ۱۴۰۵", title: "امتحانات" },
];

/*===== University Profile =====*/
export const universityStats = [
  { value: 2300, label: "دانشجو", suffix: "+" },
  { value: 115, label: "عضو هیئت علمی" },
  { value: 8, label: "گروه آموزشی" },
  { value: 2200, label: "دانش‌آموخته", suffix: "+" },
  { value: 2400, label: "مقاله علمی", suffix: "+" },
  { value: 75, label: "کارمند" },
];

/*===== Achievements and Courses =====*/
export const achievements: UniversityStory[] = [
  {
    ...news[2],
    id: "achievement-isc",
    category: "دستاورد پژوهشی",
    title: "انرژی پایدار و هوش مصنوعی؛ در جمع نشریات ISC",
  },
  {
    id: "achievement-faculty",
    title: "ارتقای علمی اعضای هیئت علمی مهندسی پزشکی",
    category: "اعضای هیئت علمی",
    summary: "آخرین احکام ارتقای مرتبه علمی اعضای هیئت علمی گروه مهندسی پزشکی دانشگاه صنعتی همدان.",
    image: biomedicalFaculty,
    imageAlt: "اعضای هیئت علمی گروه مهندسی پزشکی",
    href: destinations.portal,
  },
  {
    ...news[1],
    id: "achievement-athletics",
    category: "افتخار دانشجویی",
    title: "افتخارآفرینی دانشجویان در میدان ورزش",
  },
];

export const courses: UniversityStory[] = [
  {
    id: "controlled-blasting",
    title: "آشنایی با آتشباری کنترل‌شده",
    category: "کارگاه تخصصی",
    summary: "آموزش کاربردی برای توسعه مهارت‌های تخصصی دانشجویان و فعالان صنعت.",
    image: controlledBlasting,
    imageAlt: "کارگاه تخصصی آتشباری کنترل‌شده",
    href: destinations.portal,
  },
  {
    id: "battery-training",
    title: "دوره باتری و اصول نگهداری آن",
    category: "آموزش صنعت",
    summary: "دوره کوتاه‌مدت ویژه کارکنان نیروگاه شهید مفتح با همکاری دانشگاه.",
    image: batteryTraining,
    imageAlt: "دوره آموزشی باتری و اصول نگهداری",
    href: destinations.portal,
  },
  {
    id: "steam-plant",
    title: "دوره آموزشی کنترل نیروگاه بخار",
    category: "دانشگاه و صنعت",
    summary: "ارتقای دانش فنی کارکنان صنعت با بهره‌گیری از ظرفیت علمی دانشگاه.",
    image: steamPlant,
    imageAlt: "برگزاری دوره آموزشی کنترل نیروگاه بخار",
    href: destinations.portal,
  },
];

/*===== Local Search Index =====*/
export const searchGroups: { label: string; links: UniversityLink[] }[] = [
  { label: "سامانه‌ها و خدمات", links: services.map(({ label, href }) => ({ label, href })) },
  { label: "بخش‌های دانشگاه", links: navigationGroups.flatMap((group) => group.links) },
  {
    label: "مطالب این صفحه",
    links: [
      { label: "تقویم آموزشی نیم‌سال اول ۱۴۰۵–۱۴۰۶", href: "#academic-announcement" },
      ...news.map((story) => ({ label: story.title, href: `#${story.id}` })),
      ...notices.map((notice) => ({ label: notice.title, href: `#${notice.id}` })),
      ...achievements.map((story) => ({ label: story.title, href: `#${story.id}` })),
      ...courses.map((story) => ({ label: story.title, href: `#${story.id}` })),
      { label: "اطلاعیه‌های دانشگاه", href: "#university-notices" },
      { label: "تقویم آموزشی دانشگاه", href: "#academic-calendar" },
      { label: "ارتباط با دانشگاه", href: "#university-contact" },
    ],
  },
];
