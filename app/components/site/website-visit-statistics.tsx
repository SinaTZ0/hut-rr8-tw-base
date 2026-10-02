import { useAtomValue } from "jotai";

import { Separator } from "~/components/primitive/separator/separator";

import { websiteVisitsStateAtom } from "./website-visits-state";

/*===== Public Website Statistics =====*/

const numberFormatter = new Intl.NumberFormat("fa-IR");
const metrics = [
  { key: "today", label: "بازدید امروز" },
  { key: "yesterday", label: "بازدید دیروز" },
  { key: "total", label: "کل بازدیدها" },
  { key: "online", label: "بازدیدکنندگان آنلاین" },
] as const;

export function WebsiteVisitStatistics() {
  const { statistics, failed } = useAtomValue(websiteVisitsStateAtom);

  return (
    <section aria-labelledby="website-visit-statistics-title" aria-busy={!statistics && !failed}>
      <Separator variant="inverse" aria-hidden="true" />
      <div className="py-6 sm:py-8">
        <h2 id="website-visit-statistics-title" className="text-sm font-semibold">
          آمار بازدید وب‌سایت
        </h2>
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
          {metrics.map(({ key, label }) => (
            <div key={key} className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs leading-7 text-white/80">{label}</dt>
              <dd className="text-2xl leading-9 font-semibold text-highlight tabular-nums">
                {statistics ? (
                  numberFormatter.format(
                    typeof statistics[key] === "string" ? BigInt(statistics[key]) : statistics[key],
                  )
                ) : (
                  <span aria-label={failed ? "آمار در دسترس نیست" : "در حال دریافت آمار"}>—</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-7 text-white/70">
          {failed
            ? statistics
              ? "موقتاً امکان به‌روزرسانی آمار نیست؛ آخرین آمار دریافت‌شده نمایش داده می‌شود."
              : "آمار بازدید موقتاً در دسترس نیست."
            : "آمار بازدید وب‌سایت به وقت تهران؛ بازدیدکنندگان آنلاین در ۵ دقیقه اخیر فعال بوده‌اند."}
        </p>
      </div>
    </section>
  );
}
