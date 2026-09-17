import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import brandingLogo from "../../../assets/branding-navbar-logo.png";
import { cx, Icon, styles } from "./common";

const navigationGroups = [
  {
    label: "دانشگاه",
    links: [
      ["معرفی دانشگاه", "https://hut.ac.ir/%D9%85%D8%B9%D8%B1%D9%81%DB%8C-%D8%AF%D8%A7%D9%86%D8%B4%DA%AF%D8%A7%D9%87"],
      ["اعضای هیئت علمی", "https://hut.ac.ir/%D8%A7%D8%B9%D8%B6%D8%A7%DB%8C-%D9%87%DB%8C%D8%A7%D8%AA-%D8%B9%D9%84%D9%85%DB%8C"],
      ["حوزه ریاست", "https://hut.ac.ir/%D8%AD%D9%88%D8%B2%D9%87-%D8%B1%DB%8C%D8%A7%D8%B3%D8%AA"],
      ["فرم‌ها و آیین‌نامه‌ها", "https://hut.ac.ir/university-forms"],
      ["دفترچه تلفن", "https://hut.ac.ir/%D8%AA%D9%84%D9%81%D9%86-%D8%AF%D8%A7%D8%AE%D9%84%DB%8C"],
      ["حریم خصوصی و حفاظت از داده‌ها", "/privacy-and-data-protection"],
    ],
  },
  {
    label: "آموزش",
    links: [
      ["معاونت آموزشی", "https://hut.ac.ir/%D9%85%D8%B9%D8%A7%D9%88%D9%86%D8%AA-%D8%A2%D9%85%D9%88%D8%B2%D8%B4%DB%8C2"],
      ["گروه‌های آموزشی", "https://hut.ac.ir/groups"],
      ["آموزش‌های آزاد", "https://hut.ac.ir/%D8%A2%D9%85%D9%88%D8%B2%D8%B4-%D8%A2%D8%B2%D8%A7%D8%AF"],
      ["تقویم آموزشی", "https://hut.ac.ir/web/edu/%D8%AA%D9%82%D9%88%DB%8C%D9%85-%D8%A2%D9%85%D9%88%D8%B2%D8%B4%DB%8C"],
    ],
  },
  {
    label: "پژوهش و فناوری",
    links: [
      ["مدیریت پژوهشی", "https://hut.ac.ir/%D9%85%D8%B9%D8%A7%D9%88%D9%86-%D9%BE%DA%98%D9%88%D9%87%D8%B4%DB%8C-%D8%AC%D8%AF%DB%8C%D8%AF"],
      ["آزمایشگاه‌ها", "https://hut.ac.ir/%D8%A2%D8%B2%D9%85%D8%A7%DB%8C%D8%B4%DA%AF%D8%A7%D9%87"],
      ["ارتباط با صنعت", "http://industry.hut.ac.ir/"],
      ["مرکز رشد و کارآفرینی", "https://hut.ac.ir/web/roshd"],
      ["کتابخانه مرکزی", "http://library.hut.ac.ir"],
    ],
  },
  {
    label: "دانشجویی و فرهنگی",
    links: [
      ["معاونت دانشجویی و فرهنگی", "https://hut.ac.ir/%D9%85%D8%B9%D8%A7%D9%88%D9%86%D8%AA-%D8%AF%D8%A7%D9%86%D8%B4%D8%AC%D9%88%DB%8C%DB%8C-%D8%AC%D8%AF%DB%8C%D8%AF"],
      ["خدمات رفاهی دانشجویان", "https://student.hut.ac.ir/%D8%AE%D8%AF%D9%85%D8%A7%D8%AA-%D8%B1%D9%81%D8%A7%D9%87%DB%8C-%D8%AF%D8%A7%D9%86%D8%B4%D8%AC%D9%88%DB%8C%DB%8C"],
      ["مرکز مشاوره و سبک زندگی", "http://counseling.hut.ac.ir"],
      ["کانون‌های فرهنگی و هنری", "https://student.hut.ac.ir/%DA%A9%D8%A7%D9%86%D9%88%D9%86-%D9%87%D8%A7%DB%8C-%D9%81%D8%B1%D9%87%D9%86%DA%AF%DB%8C"],
    ],
  },
] as const;

const directLinks = [
  ["اداری و مالی", "https://hut.ac.ir/%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C-%D9%88-%D9%85%D8%A7%D9%84%DB%8C"],
  ["سامانه‌ها", "https://hut.ac.ir/%D8%B3%D8%A7%D9%85%D8%A7%D9%86%D9%87-%D9%87%D8%A7"],
] as const;

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    let savedTheme: string | null = null;

    try {
      savedTheme = window.localStorage.getItem("hut-color-theme");
    } catch {
      // A private browsing context may deny storage access.
    }

    const nextTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : mediaQuery.matches ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.hutTheme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;

    const followSystemTheme = (event: MediaQueryListEvent) => {
      if (!savedTheme) {
        const systemTheme = event.matches ? "dark" : "light";
        setTheme(systemTheme);
        document.documentElement.dataset.hutTheme = systemTheme;
        document.documentElement.style.colorScheme = systemTheme;
      }
    };

    mediaQuery.addEventListener?.("change", followSystemTheme);
    return () => mediaQuery.removeEventListener?.("change", followSystemTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.hutTheme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    try {
      window.localStorage.setItem("hut-color-theme", nextTheme);
    } catch {
      // The selected theme still applies for this page view.
    }
  };

  const label = theme === "dark" ? "فعال‌کردن حالت روشن" : "فعال‌کردن حالت تاریک";

  return (
    <button
      className={cx(styles["hut-icon-button"], styles["hut-theme-toggle"])}
      type="button"
      aria-pressed={theme === "dark"}
      aria-label={label}
      title={label}
      onClick={toggleTheme}
    >
      <span className={styles["hut-theme-icon--moon"]}>
        <Icon name="moon" />
      </span>
      <span className={styles["hut-theme-icon--sun"]}>
        <Icon name="sun" />
      </span>
    </button>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        className={styles["hut-drawer-backdrop"]}
        hidden={!open}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="hutDrawer"
        className={cx(styles["hut-drawer"], open && styles["is-open"])}
        aria-label="منوی موبایل"
        aria-hidden={!open}
      >
        <div className={styles["hut-drawer__head"]}>
          <span className={styles["hut-brand__text"]}>
            <strong>منوی دانشگاه</strong>
            <span>دسترسی سریع به بخش‌ها</span>
          </span>
          <button
            className={styles["hut-icon-button"]}
            type="button"
            aria-label="بستن منو"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav className={styles["hut-drawer__nav"]}>
          {navigationGroups.map((group) => (
            <details key={group.label}>
              <summary>{group.label}</summary>
              <div>
                {group.links.slice(0, 3).map(([label, href]) => (
                  <a key={label} href={href} onClick={onClose}>
                    {label}
                  </a>
                ))}
              </div>
            </details>
          ))}
          {directLinks.map(([label, href]) => (
            <a key={label} className={styles["hut-drawer__direct"]} href={href} onClick={onClose}>
              {label}
            </a>
          ))}
          <a className={styles["hut-drawer__direct"]} href="https://en.hut.ac.ir/en" lang="en" onClick={onClose}>
            English
          </a>
        </nav>
      </aside>
    </>
  );
}

export function Header() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenMenu(null);
      setSearchOpen(false);
      setDrawerOpen(false);
    };

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const root = document.getElementById("hutModernPage");
    root?.classList.toggle(styles["is-drawer-open"], drawerOpen);
    if (drawerOpen) searchInputRef.current?.blur();
  }, [drawerOpen]);

  useEffect(() => {
    if (searchOpen) window.setTimeout(() => searchInputRef.current?.focus(), 30);
  }, [searchOpen]);

  return (
    <>
      <div className={styles["hut-topbar"]}>
        <div className={cx(styles["hut-container"], styles["hut-topbar__inner"])}>
          <div className={styles["hut-topbar__notice"]}>
            <span className={styles["hut-live-dot"]} />
            <span>پایگاه رسمی دانشگاه صنعتی همدان</span>
          </div>
          <nav className={styles["hut-topbar__links"]} aria-label="پیوندهای بالای صفحه">
            <a href="https://hut.ac.ir/fa/%D9%86%D9%82%D8%B4%D9%87-%D8%B3%D8%A7%DB%8C%D8%AA">نقشه سایت</a>
            <a href="https://hut.ac.ir/%D8%A7%D8%B1%D8%AA%D8%A8%D8%A7%D8%B7-%D8%A8%D8%A7-%D9%85%D8%A7">ارتباط با ما</a>
            <a href="https://hut.ac.ir/c/portal/login?p_l_id=13">ورود به پرتال</a>
          </nav>
        </div>
      </div>

      <header className={styles["hut-header"]}>
        <div className={cx(styles["hut-container"], styles["hut-nav"])}>
          <a className={styles["hut-brand"]} href="https://hut.ac.ir" aria-label="صفحه اصلی دانشگاه صنعتی همدان">
            <img
              className={styles["hut-brand__mark"]}
              src={brandingLogo}
              alt="نشان دانشگاه صنعتی همدان"
              width="54"
              height="54"
            />
            <span className={styles["hut-brand__text"]}>
              <strong>دانشگاه صنعتی همدان</strong>
              <span>HAMEDAN UNIVERSITY OF TECHNOLOGY</span>
            </span>
          </a>

          <nav ref={navigationRef} className={styles["hut-nav__links"]} aria-label="منوی اصلی">
            {navigationGroups.map((group, index) => {
              const isOpen = openMenu === index;
              return (
                <div className={styles["hut-nav__item"]} key={group.label}>
                  <button
                    className={styles["hut-nav__trigger"]}
                    type="button"
                    aria-expanded={isOpen}
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenMenu(isOpen ? null : index);
                    }}
                  >
                    {group.label}
                    <Icon name="chevron" className={styles["hut-nav__chevron"]} />
                  </button>
                  <div className={cx(styles["hut-dropdown"], isOpen && styles["is-open"])}>
                    {group.links.map(([label, href]) =>
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
                  </div>
                </div>
              );
            })}
            {directLinks.map(([label, href]) => (
              <a className={styles["hut-nav__direct"]} href={href} key={label}>
                {label}
              </a>
            ))}
          </nav>

          <div className={styles["hut-nav__actions"]}>
            <button
              className={styles["hut-icon-button"]}
              type="button"
              aria-expanded={searchOpen}
              aria-controls="hutSearchPanel"
              aria-label="باز کردن جستجو"
              onClick={() => setSearchOpen((current) => !current)}
            >
              <Icon name="search" />
            </button>
            <ThemeToggle />
            <a className={cx(styles["hut-icon-button"], styles["hut-lang-button"])} href="https://en.hut.ac.ir/en" lang="en" hrefLang="en">
              EN
            </a>
            <button
              className={cx(styles["hut-icon-button"], styles["hut-menu-button"])}
              type="button"
              aria-expanded={drawerOpen}
              aria-controls="hutDrawer"
              aria-label="باز کردن منو"
              onClick={() => setDrawerOpen(true)}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>

        <div className={styles["hut-search-panel"]} id="hutSearchPanel" hidden={!searchOpen}>
          <form className={cx(styles["hut-container"], styles["hut-search-form"])} action="https://hut.ac.ir/search" method="get" role="search">
            <label className={styles["hut-sr-only"]} htmlFor="hutSearchInput">
              عبارت مورد نظر برای جستجو
            </label>
            <input
              ref={searchInputRef}
              id="hutSearchInput"
              name="q"
              type="search"
              placeholder="جستجو در وب‌سایت دانشگاه…"
              autoComplete="off"
            />
            <button type="submit">جستجو</button>
          </form>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
