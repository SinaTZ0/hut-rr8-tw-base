import { useRef, useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";

import { Button } from "~/components/primitive/button/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/primitive/dialog/dialog";
import { Separator } from "~/components/primitive/separator/separator";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import type { UniversitySearchGroup } from "~/content/university-links";
import { useAppNavigate } from "~/navigation/use-app-navigate";
import { isLocalHref } from "~/navigation/view-transition";

/*===== Persian Search Matching =====*/

function normalizeQuery(value: string) {
  // Persian keyboards and copied Arabic text can spell the same word differently.
  return value
    .normalize("NFKC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\s]+/g, " ")
    .trim()
    .toLowerCase();
}

/*===== University Search =====*/

export function SiteSearch({ groups }: { groups: UniversitySearchGroup[] }) {
  const [open, setOpen] = useState(false);
  const destinationRef = useRef<string | null>(null);
  const navigate = useAppNavigate();

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) destinationRef.current = null;
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="جستجو در دانشگاه" />}>
        <Search className="size-[19px]" aria-hidden="true" />
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-xl"
        finalFocus={() => {
          const anchor = destinationRef.current;
          if (!anchor) return true;
          const target = document.getElementById(anchor);
          target?.scrollIntoView({ block: "center", behavior: "instant" });
          return target ?? true;
        }}
      >
        <DialogHeader>
          <div>
            <DialogTitle>جستجو در دانشگاه</DialogTitle>
            <DialogDescription className="mt-1">سامانه‌ها، بخش‌های دانشگاه و مطالب برگزیده</DialogDescription>
          </div>
          <DialogClose render={<Button variant="ghost" size="icon" aria-label="بستن جستجو" />}>
            <X aria-hidden="true" />
          </DialogClose>
        </DialogHeader>
        <Command
          label="جستجو در دانشگاه"
          variant="dialog"
          filter={(value, query) => (normalizeQuery(value).includes(normalizeQuery(query)) ? 1 : 0)}
        >
          <CommandInput size="lg" autoFocus placeholder="چه چیزی را جستجو می‌کنید؟" aria-label="عبارت جستجو" />
          <CommandList className="mt-3 max-h-[min(55vh,420px)]">
            <CommandEmpty>نتیجه‌ای پیدا نشد. عبارت دیگری را امتحان کنید.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.links.map((link) => (
                  <CommandItem
                    size="lg"
                    key={`${link.label}-${link.href}`}
                    value={`${link.label} ${link.href}`}
                    onSelect={() => {
                      if (link.href.startsWith("#")) {
                        destinationRef.current = link.href.slice(1);
                        window.history.replaceState(window.history.state, "", link.href);
                        setOpen(false);
                        return;
                      }

                      if (isLocalHref(link.href)) {
                        setOpen(false);
                        navigate(link.href);
                        return;
                      }

                      window.location.assign(link.href);
                    }}
                  >
                    <Search className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    <span>{link.label}</span>
                    <ArrowLeft className="ms-auto size-3.5 text-muted-foreground" aria-hidden="true" />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
        <div className="bg-muted/60">
          <Separator aria-hidden="true" />
          <p className="px-5 py-3 text-xs leading-6 text-muted-foreground">
            با کلیدهای جهت‌نما انتخاب کنید و با Enter وارد شوید.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
