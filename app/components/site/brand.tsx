import { cn } from "cn";

import logo from "~/assets/branding-navbar-logo.png";
import { AppLink } from "~/navigation/app-link";

/*===== University Identity =====*/

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <AppLink
      to="/"
      aria-label="صفحه اصلی دانشگاه صنعتی همدان"
      className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight focus-visible:outline-solid"
    >
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-xl bg-university sm:size-12",
          inverse && "border border-white/15 bg-white/5",
        )}
      >
        <img src={logo} alt="" width={96} height={86} className="h-8 w-9 object-contain" />
      </span>
      <span>
        <span className={cn("block text-sm leading-7 font-bold text-foreground sm:text-base", inverse && "text-white")}>
          دانشگاه صنعتی همدان
        </span>
        <span
          lang="en"
          dir="ltr"
          className={cn(
            "hidden text-[8px] leading-4 tracking-[0.07em] text-muted-foreground sm:block sm:text-[9px]",
            inverse && "text-white/70",
          )}
        >
          HAMEDAN UNIVERSITY OF TECHNOLOGY
        </span>
      </span>
    </AppLink>
  );
}
