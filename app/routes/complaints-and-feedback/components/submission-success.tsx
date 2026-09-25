import { useState } from "react";
import { CheckCircle2, Copy, Home, RotateCcw } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/primitive/button/button";
import { Card, CardContent } from "~/components/primitive/card/card";

/*===== Submission Confirmation =====*/

export function SubmissionSuccess({
  trackingCode,
  onNewSubmission,
}: {
  trackingCode: string;
  onNewSubmission: () => void;
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyTrackingCode() {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  return (
    <Card render={<section aria-labelledby="submission-success-title" />} radius="lg">
      <CardContent size="lg" className="flex min-h-[34rem] flex-col items-center justify-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-semibold text-primary">ثبت موفق</p>
        <h2 id="submission-success-title" className="mt-2 text-2xl leading-10 font-bold text-foreground">
          پیام شما با موفقیت ثبت شد
        </h2>
        <p className="mt-3 max-w-md text-sm leading-8 text-muted-foreground">
          کد پیگیری زیر را برای مراجعات بعدی ذخیره کنید.
        </p>

        <div className="mt-7 w-full max-w-md rounded-2xl border border-primary/30 bg-secondary/55 p-5">
          <p className="text-xs text-muted-foreground">کد پیگیری</p>
          <p
            dir="ltr"
            className="mt-2 font-mono text-xl font-bold tracking-wider break-all text-foreground sm:text-2xl"
          >
            {trackingCode}
          </p>
          <Button type="button" variant="outline" className="mt-5 w-full" onClick={copyTrackingCode}>
            <Copy aria-hidden="true" />
            کپی کد پیگیری
          </Button>
          <p className="mt-3 min-h-6 text-xs leading-6 text-muted-foreground" aria-live="polite">
            {copyStatus === "copied" && "کد پیگیری کپی شد."}
            {copyStatus === "failed" && "کپی خودکار انجام نشد؛ لطفاً کد را دستی کپی کنید."}
          </p>
        </div>

        <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <Button type="button" className="flex-1" onClick={onNewSubmission}>
            <RotateCcw aria-hidden="true" />
            ثبت پیام جدید
          </Button>
          <Button nativeButton={false} role="link" variant="outline" className="flex-1" render={<Link to="/" />}>
            <Home aria-hidden="true" />
            بازگشت به صفحه اصلی
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
