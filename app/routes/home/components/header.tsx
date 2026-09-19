import { useState } from "react";
import { ArrowUpLeft, Menu, Monitor, Moon, Sun, X } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/primitive/accordion";
import { Button } from "~/components/primitive/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/primitive/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/primitive/sheet";
import { getNextTheme, type ThemePreference } from "~/theme/theme";
import { useTheme } from "~/theme/theme-provider";

import { destinations, navigationGroups } from "../content";
import { Brand } from "./brand";
import { HomepageSearch } from "./homepage-search";
import { PageContainer } from "./layout";

/*===== Theme Control =====*/

const themeLabels: Record<ThemePreference, string> = {
  system: "سیستم",
  light: "روشن",
  dark: "تاریک",
};

function ThemeIcon({ theme, className }: { theme: ThemePreference; className?: string }) {
  if (theme === "system") return <Monitor className={className} aria-hidden="true" />;
  if (theme === "light") return <Sun className={className} aria-hidden="true" />;
  return <Moon className={className} aria-hidden="true" />;
}

function getThemeControlLabel(theme: ThemePreference) {
  const nextTheme = getNextTheme(theme);
  return `پوسته فعلی: ${themeLabels[theme]}؛ تغییر به ${themeLabels[nextTheme]}`;
}

/*===== Mobile Navigation =====*/
function MobileNavigation({
  theme,
  cycleTheme,
  isPending,
}: {
  theme: ThemePreference;
  cycleTheme: () => void;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const themeLabel = getThemeControlLabel(theme);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="icon" className="xl:hidden" aria-label="باز کردن منو" />}>
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent className="w-3/4 sm:max-w-sm">
        <SheetHeader>
          <div className="flex items-center justify-between gap-3">
            <SheetTitle>منوی دانشگاه</SheetTitle>
            <SheetClose render={<Button variant="ghost" size="icon" aria-label="بستن منو" />}>
              <X aria-hidden="true" />
            </SheetClose>
          </div>
          <SheetDescription>دسترسی به بخش‌ها و خدمات دانشگاه صنعتی همدان</SheetDescription>
        </SheetHeader>
        <nav className="px-6 pb-6" aria-label="منوی اصلی موبایل">
          <Accordion>
            {navigationGroups.map((group) => (
              <AccordionItem key={group.label}>
                <AccordionTrigger>{group.label}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-1 pb-3">
                    {group.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-11 items-center rounded-lg px-3 text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="grid gap-2 pt-4">
            <Button
              nativeButton={false}
              role="link"
              variant="outline"
              className="justify-between"
              render={<a href={destinations.administration} />}
            >
              اداری و مالی <ArrowUpLeft aria-hidden="true" />
            </Button>
            <Button
              nativeButton={false}
              role="link"
              className="justify-between"
              render={<a href={destinations.systems} />}
            >
              سامانه‌های دانشگاه <ArrowUpLeft aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              className="justify-between"
              aria-label={themeLabel}
              aria-busy={isPending}
              disabled={isPending}
              onClick={cycleTheme}
            >
              پوسته: {themeLabels[theme]}
              <ThemeIcon theme={theme} />
            </Button>
            <a
              href={destinations.english}
              lang="en"
              hrefLang="en"
              dir="ltr"
              className="flex min-h-11 items-center justify-center text-sm text-muted-foreground"
            >
              English website
            </a>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

/*===== University Header =====*/
export function Header() {
  const { theme, cycleTheme, isPending } = useTheme();
  const themeLabel = getThemeControlLabel(theme);

  return (
    <>
      {/*===== Official Site Utility Bar =====*/}
      <div className="bg-university-deep text-white/80">
        <PageContainer className="flex min-h-9 items-center justify-between gap-4 text-[11px]">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-highlight" aria-hidden="true" />
            پایگاه رسمی دانشگاه صنعتی همدان
          </span>
          <nav aria-label="پیوندهای بالای صفحه" className="flex items-center gap-5">
            <a className="hidden min-h-9 items-center hover:text-white sm:flex" href={destinations.contact}>
              ارتباط با ما
            </a>
            <a className="flex min-h-9 items-center hover:text-white" href={destinations.login}>
              ورود به پرتال <ArrowUpLeft className="ms-1 size-3" aria-hidden="true" />
            </a>
          </nav>
        </PageContainer>
      </div>

      {/*===== Primary Navigation =====*/}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-xl">
        <PageContainer className="flex min-h-20 items-center justify-between gap-2 px-4 sm:px-8 lg:gap-4 lg:px-10">
          <Brand />
          <NavigationMenu className="hidden flex-none xl:flex" aria-label="منوی اصلی">
            <NavigationMenuList>
              {navigationGroups.map((group) => (
                <NavigationMenuItem key={group.label}>
                  <NavigationMenuTrigger>{group.label}</NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[310px]">
                    <p className="mb-3 border-b px-2 pb-3 text-xs leading-6 text-muted-foreground">
                      {group.description}
                    </p>
                    {group.links.map((link) => (
                      <NavigationMenuLink key={link.label} href={link.href}>
                        {link.label}
                        <ArrowUpLeft className="size-3.5 text-muted-foreground" aria-hidden="true" />
                      </NavigationMenuLink>
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuLink href={destinations.administration}>اداری و مالی</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <HomepageSearch />
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              aria-label={themeLabel}
              aria-busy={isPending}
              disabled={isPending}
              onClick={cycleTheme}
            >
              <ThemeIcon theme={theme} className="size-[19px]" />
            </Button>
            <a
              href={destinations.english}
              lang="en"
              hrefLang="en"
              dir="ltr"
              className="hidden size-11 items-center justify-center rounded-full text-xs font-semibold transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring sm:flex"
              aria-label="English website"
            >
              EN
            </a>
            <span className="mx-1 hidden h-5 w-px bg-border xl:block" aria-hidden="true" />
            <MobileNavigation theme={theme} cycleTheme={cycleTheme} isPending={isPending} />
          </div>
        </PageContainer>
      </header>
    </>
  );
}
