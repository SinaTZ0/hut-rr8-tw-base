import { Link } from "react-router";

import brandingLogo from "../../../assets/branding-navbar-logo.png";
import { cx, Icon, styles } from "./common";

const quickFooterLinks = [
  ["اعضای هیئت علمی", "https://hut.ac.ir/faculty"],
  ["گروه‌های آموزشی", "https://hut.ac.ir/groups"],
  ["فرم‌ها و آیین‌نامه‌ها", "https://hut.ac.ir/university-forms"],
  ["ثبت شکایات و پیشنهادات", "/complaints-and-feedback"],
  ["مشاوره آنلاین", "/online-consultation"],
  ["حریم خصوصی و حفاظت از داده‌ها", "/privacy-and-data-protection"],
  ["دفترچه تلفن", "https://hut.ac.ir/phonebook"],
  ["نقشه سایت", "https://hut.ac.ir/sitemap"],
] as const;

const serviceLinks = [
  ["سامانه گلستان", "http://golestan.hut.ac.ir/"],
  ["سامانه تغذیه", "http://nutrition.hut.ac.ir/"],
  ["آموزش آزاد و مجازی", "https://academics.hut.ac.ir"],
  ["کتابخانه مرکزی", "http://library.hut.ac.ir"],
  ["درگاه‌های پرداخت", "https://hut.ac.ir/payments"],
] as const;

export function FooterSection() {
  return (
    <footer className={styles["hut-footer"]}>
      <div className={cx(styles["hut-container"], styles["hut-footer__grid"])}>
        <div className={styles["hut-footer__column"]}>
          <a className={styles["hut-footer__brand"]} href="https://hut.ac.ir">
            <img src={brandingLogo} alt="نشان دانشگاه" loading="lazy" />
            <span>
              <strong>دانشگاه صنعتی همدان</strong>
              <span>پایگاه اطلاع‌رسانی دانشگاه</span>
            </span>
          </a>
          <p className={styles["hut-footer__about"]}>
            پایگاه اطلاع‌رسانی اخبار، اطلاعیه‌ها، خدمات آموزشی، پژوهشی، دانشجویی و اداری دانشگاه صنعتی همدان.
          </p>
          <div className={styles["hut-socials"]}>
            <a href="https://www.linkedin.com/school/hamedan-university-of-technology/?viewAsMember=true" aria-label="لینکدین">
              in
            </a>
            <a href="https://eitaa.com/info_hut" aria-label="ایتا">
              ایتا
            </a>
            <a href="https://www.aparat.com/hut.university" aria-label="آپارات">
              آپ
            </a>
            <a href="mailto:info@hut.ac.ir" aria-label="ایمیل">
              @
            </a>
          </div>
        </div>

        <div className={styles["hut-footer__column"]}>
          <h3>دسترسی سریع</h3>
          <nav className={styles["hut-footer__links"]}>
            {quickFooterLinks.map(([label, href]) =>
              href.startsWith("/") ? (
                <Link to={href} key={label}>
                  {label}
                </Link>
              ) : (
                <a href={href} key={label}>
                  {label}
                </a>
              ),
            )}
          </nav>
        </div>

        <div className={styles["hut-footer__column"]}>
          <h3>خدمات دانشگاهی</h3>
          <nav className={styles["hut-footer__links"]}>
            {serviceLinks.map(([label, href]) => (
              <a href={href} key={label}>
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className={styles["hut-footer__column"]}>
          <h3>ارتباط با دانشگاه</h3>
          <ul className={styles["hut-contact-list"]}>
            <li>
              <Icon name="pin" />
              <span>همدان، پل پژوهش، بلوار شهید فهمیده، خیابان مردم</span>
            </li>
            <li>
              <Icon name="phone" />
              <a href="tel:+988138411000">۰۸۱–۳۸۴۱۱۰۰۰</a>
            </li>
            <li>
              <Icon name="mail" />
              <a href="mailto:info@hut.ac.ir">info@hut.ac.ir</a>
            </li>
          </ul>

        </div>
      </div>
      <div className={cx(styles["hut-container"], styles["hut-footer__bottom"])}>
        <span>کلیه حقوق مادی و معنوی این وب‌سایت متعلق به دانشگاه صنعتی همدان است.</span>
        <span>دانشگاه صنعتی همدان</span>
      </div>
    </footer>
  );
}
