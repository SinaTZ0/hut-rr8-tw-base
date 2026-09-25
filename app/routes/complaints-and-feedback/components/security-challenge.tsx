import type { AltchaWidgetElement } from "altcha";
import type {} from "altcha/types/react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/*===== Public Challenge Controls =====*/

export type SecurityChallengeHandle = {
  reset: () => void;
};

type SecurityChallengeProps = {
  describedBy?: string;
  invalid: boolean;
  onChange: (payload: string) => void;
};

/*===== ALTCHA Widget =====*/

export const SecurityChallenge = forwardRef<SecurityChallengeHandle, SecurityChallengeProps>(function SecurityChallenge(
  { describedBy, invalid, onChange },
  forwardedRef,
) {
  const widgetRef = useRef<AltchaWidgetElement>(null);

  useImperativeHandle(forwardedRef, () => ({
    reset() {
      widgetRef.current?.reset();
      onChange("");
    },
  }));

  useEffect(() => {
    let disposed = false;
    let widget: AltchaWidgetElement | null = null;

    function handleStateChange(event: Event) {
      const detail = (event as CustomEvent<{ payload?: string; state?: string }>).detail;

      if (detail.state === "verified" && detail.payload) {
        onChange(detail.payload);
        return;
      }

      if (["error", "expired", "unverified"].includes(detail.state ?? "")) onChange("");
    }

    async function loadWidget() {
      await import("altcha");
      await import("altcha/i18n/fa");
      if (disposed || !widgetRef.current) return;

      widget = widgetRef.current;
      widget.addEventListener("statechange", handleStateChange);
    }

    void loadWidget();

    return () => {
      disposed = true;
      widget?.removeEventListener("statechange", handleStateChange);
    };
  }, [onChange]);

  return (
    <altcha-widget
      ref={widgetRef}
      challenge="/altcha/challenge"
      language="fa"
      name="altcha"
      type="checkbox"
      theme="auto"
      aria-required="true"
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className="block min-h-[70px] max-w-full"
      suppressHydrationWarning
    />
  );
});
