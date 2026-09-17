import { Icon, styles } from "./common";

export function FloatingLinks() {
  return (
    <div className={styles["hut-side-links"]} aria-label="پیوندهای شناور">
      <a className={styles["hut-side-link"]} href="https://eitaa.com/info_hut">
        <Icon name="mail" />
        <span>کانال ایتا</span>
      </a>
      <a
        className={styles["hut-side-link"]}
        href="https://hut.ac.ir/%D8%A7%D8%B1%D8%AA%D8%A8%D8%A7%D8%B7-%D8%A8%D8%A7-%D9%85%D8%A7"
      >
        <Icon name="pin" />
        <span>ارتباط با ما</span>
      </a>
    </div>
  );
}
