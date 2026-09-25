import type { LucideIcon } from "lucide-react";
import { BookOpen, Globe2, GraduationCap, Monitor, UserRound, Utensils } from "lucide-react";

/*===== Shared Link Contracts =====*/

export type UniversityLink = { label: string; href: string };

export type UniversitySearchGroup = {
  label: string;
  links: UniversityLink[];
};

/*===== University Destinations =====*/

export const destinations = {
  portal: "https://hut.ac.ir/",
  about: "https://hut.ac.ir/معرفی-دانشگاه",
  contact: "https://hut.ac.ir/ارتباط-با-ما",
  systems: "https://hut.ac.ir/سامانه-ها",
  administration: "https://hut.ac.ir/اداری-و-مالی",
  calendar: "https://hut.ac.ir/web/edu/تقویم-آموزشی",
  calendarAnnouncement: "https://hut.ac.ir/fa/w/-772?redirect=%2F",
  newStudents: "https://edu.hut.ac.ir/ngs1403",
  departments: "https://hut.ac.ir/groups",
  faculty: "https://hut.ac.ir/اعضای-هیات-علمی",
  forms: "https://hut.ac.ir/university-forms",
  phonebook: "https://hut.ac.ir/تلفن-داخلی",
  english: "https://en.hut.ac.ir/en",
  login: "https://hut.ac.ir/c/portal/login?p_l_id=13",
  growthCenter: "https://hut.ac.ir/web/roshd",
  eitaa: "https://eitaa.com/info_hut",
  aparat: "https://www.aparat.com/hut.university",
  linkedin: "https://www.linkedin.com/school/hamedan-university-of-technology/",
  email: "mailto:info@hut.ac.ir",
  phone: "tel:+988138411000",
  studentVideo:
    "https://www.hut.ac.ir/documents/38165/18249686/Jashan_k.mp4/edc8272b-fcd3-35f7-a75d-20655049dd8f?t=1768803535763",
} as const;

/*===== Navigation =====*/

export const navigationGroups: { label: string; description: string; links: UniversityLink[] }[] = [
  {
    label: "دانشگاه",
    description: "با دانشگاه صنعتی همدان آشنا شوید",
    links: [
      { label: "معرفی دانشگاه", href: destinations.about },
      { label: "اعضای هیئت علمی", href: destinations.faculty },
      { label: "حوزه ریاست", href: "https://hut.ac.ir/حوزه-ریاست" },
      { label: "فرم‌ها و آیین‌نامه‌ها", href: destinations.forms },
      { label: "دفترچه تلفن", href: destinations.phonebook },
    ],
  },
  {
    label: "آموزش",
    description: "مسیر یادگیری و خدمات آموزشی",
    links: [
      { label: "معاونت آموزشی", href: "https://hut.ac.ir/معاونت-آموزشی2" },
      { label: "گروه‌های آموزشی", href: destinations.departments },
      { label: "تقویم آموزشی", href: destinations.calendar },
      { label: "راهنمای نودانشجویان", href: destinations.newStudents },
    ],
  },
  {
    label: "پژوهش و فناوری",
    description: "از ایده تا ارتباط با صنعت",
    links: [
      { label: "مدیریت پژوهشی", href: "https://hut.ac.ir/معاون-پژوهشی-جدید" },
      { label: "آزمایشگاه‌ها", href: "https://hut.ac.ir/آزمایشگاه" },
      { label: "ارتباط با صنعت", href: "http://industry.hut.ac.ir/" },
      { label: "مرکز رشد و کارآفرینی", href: destinations.growthCenter },
      { label: "کتابخانه مرکزی", href: "http://library.hut.ac.ir" },
    ],
  },
  {
    label: "دانشجویی و فرهنگی",
    description: "زندگی و تجربه دانشجویی",
    links: [
      { label: "معاونت دانشجویی و فرهنگی", href: "https://hut.ac.ir/معاونت-دانشجویی-جدید" },
      { label: "خدمات رفاهی دانشجویان", href: "https://student.hut.ac.ir/خدمات-رفاهی-دانشجویی" },
      { label: "مرکز مشاوره و سبک زندگی", href: "http://counseling.hut.ac.ir" },
      { label: "کانون‌های فرهنگی و هنری", href: "https://student.hut.ac.ir/کانون-های-فرهنگی" },
    ],
  },
];

/*===== Service Shortcuts =====*/

export const services: (UniversityLink & { icon: LucideIcon; description: string })[] = [
  { label: "سامانه گلستان", href: "http://golestan.hut.ac.ir/", icon: GraduationCap, description: "خدمات آموزشی" },
  { label: "درس‌افزار", href: "https://ec.hut.ac.ir/", icon: Monitor, description: "یادگیری الکترونیکی" },
  { label: "سامانه تغذیه", href: "http://nutrition.hut.ac.ir/", icon: Utensils, description: "رزرو غذای دانشجویی" },
  { label: "کتابخانه مرکزی", href: "http://library.hut.ac.ir", icon: BookOpen, description: "منابع و پایگاه‌های علمی" },
  { label: "سامانه ساجد", href: "https://sajed.hut.ac.ir", icon: UserRound, description: "خدمات دانشگاهی" },
  { label: "آموزش‌های آزاد", href: "https://academics.hut.ac.ir", icon: Globe2, description: "دوره‌های مهارتی" },
];

/*===== Site Search =====*/

export const siteSearchGroups: UniversitySearchGroup[] = [
  {
    label: "سامانه‌ها و خدمات",
    links: services.map(({ label, href }) => ({ label, href })),
  },
  { label: "بخش‌های دانشگاه", links: navigationGroups.flatMap((group) => group.links) },
];
