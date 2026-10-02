import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Spinner } from "~/components/ui/spinner";
import type { ErrorData } from "~/orpc/errors";

import { ServerErrorDetails } from "./server-error-details";
import styles from "./submission-error.module.css";

/*===== Error Presentation =====*/

export type SubmissionErrorContent = {
  message: string;
  errors?: ErrorData["errors"];
};

/** Keeps the previous error in place beneath retry feedback until the response replaces it. */
export function SubmissionError({ error, pending }: { error: SubmissionErrorContent | null; pending: boolean }) {
  const [attention, setAttention] = useState({ error, revision: 0 });

  // Restart only the decorative border, preserving the card and expanded diagnostics.
  // Error identity also distinguishes repeated failures with the same message.
  if (attention.error !== error) {
    setAttention({ error, revision: attention.revision + 1 });
  }

  if (!error) return null;

  return (
    <div className={styles.presence} data-state={pending ? "pending" : "idle"}>
      <div className={styles.viewport}>
        <div className={styles.content} inert={pending} aria-hidden={pending || undefined}>
          <Alert variant="destructive">
            {!pending && <span key={attention.revision} className={styles.attention} aria-hidden="true" />}
            <CircleAlert aria-hidden="true" />
            <AlertTitle>ارسال ناموفق</AlertTitle>
            <AlertDescription className="min-w-0">
              <p>{error.message}</p>
              {error.errors && <ServerErrorDetails errors={error.errors} />}
            </AlertDescription>
          </Alert>
        </div>
        {pending && (
          <div className={styles.pending} role="status" aria-label="در حال ارسال مجدد…">
            <Spinner aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
