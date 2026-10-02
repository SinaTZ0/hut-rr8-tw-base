import { Copy } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/primitive/accordion/accordion";
import { Button } from "~/components/primitive/button/button";
import type { ErrorData } from "~/orpc/errors";

/*===== Copyable Server Diagnostics =====*/

export function ServerErrorDetails({ errors }: { errors: ErrorData["errors"] }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(errors, null, 2));
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  return (
    <Accordion>
      <AccordionItem value="server-error-details">
        <AccordionTrigger>جزئیات فنی خطا</AccordionTrigger>
        <AccordionContent>
          <div className="flex min-w-0 flex-col gap-4">
            <dl dir="ltr" className="space-y-3 text-start wrap-anywhere">
              {Object.entries(errors).map(([title, message]) => (
                <div key={title}>
                  <dt className="font-semibold">{title}</dt>
                  <dd className="whitespace-pre-wrap text-muted-foreground">{message}</dd>
                </div>
              ))}
            </dl>
            <Button type="button" variant="outline" className="self-start" onClick={() => void copyDetails()}>
              <Copy aria-hidden="true" />
              کپی جزئیات خطا
            </Button>
            <p role="status" aria-live="polite">
              {copyStatus === "copied" && "جزئیات خطا کپی شد."}
              {copyStatus === "failed" && "کپی انجام نشد. لطفاً جزئیات خطا را انتخاب و کپی کنید."}
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
