import { useRef, useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";

import { Button } from "~/components/primitive/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/primitive/dialog";

import { searchGroups } from "../content";

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

/*===== Homepage Search =====*/
export function HomepageSearch() {
  const [open, setOpen] = useState(false);
  const destinationRef = useRef<string | null>(null);

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
          // Section targets let Base UI focus their first actionable child;
          // article targets are already links. Resolve without consuming the ref.
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
            <DialogDescription className="mt-1">سامانه‌ها، بخش‌های دانشگاه و مطالب این صفحه</DialogDescription>
          </div>
          <DialogClose render={<Button variant="ghost" size="icon" aria-label="بستن جستجو" />}>
            <X aria-hidden="true" />
          </DialogClose>
        </DialogHeader>
        <Command
          label="جستجو در دانشگاه"
          className="rounded-none! p-3 [&_[data-slot=input-group]]:h-12!"
          filter={(value, query) => (normalizeQuery(value).includes(normalizeQuery(query)) ? 1 : 0)}
        >
          <CommandInput
            autoFocus
            placeholder="چه چیزی را جستجو می‌کنید؟"
            aria-label="عبارت جستجو"
            className="min-h-11 px-2"
          />
          <CommandList className="mt-3 max-h-[min(55vh,420px)]">
            <CommandEmpty>نتیجه‌ای پیدا نشد. عبارت دیگری را امتحان کنید.</CommandEmpty>
            {searchGroups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.links.map((link) => (
                  <CommandItem
                    key={`${link.label}-${link.href}`}
                    value={`${link.label} ${link.href}`}
                    className="min-h-11 gap-3 px-3 leading-6"
                    onSelect={() => {
                      if (link.href.startsWith("#")) {
                        destinationRef.current = link.href.slice(1);
                        window.history.replaceState(window.history.state, "", link.href);
                        setOpen(false);
                      } else {
                        window.location.assign(link.href);
                      }
                    }}
                  >
                    <Search className="text-muted-foreground size-3.5" aria-hidden="true" />
                    <span>{link.label}</span>
                    <ArrowLeft className="text-muted-foreground ms-auto size-3.5" aria-hidden="true" />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
        <p className="bg-muted/60 text-muted-foreground border-t px-5 py-3 text-xs leading-6">
          با کلیدهای جهت‌نما انتخاب کنید و با Enter وارد شوید.
        </p>
      </DialogContent>
    </Dialog>
  );
}
