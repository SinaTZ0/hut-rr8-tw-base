import { useEffect } from "react";
import { createLenisAnimation, type LenisAnimation } from "~/lib/lenis-animation";

/*===== Popup Wheel Scrolling =====*/

/** Smooths an open options list independently of the document, preserving native touch and keyboard navigation. */
export function useSelectScrolling(list: HTMLDivElement | null) {
  useEffect(() => {
    const popup = list?.parentElement;
    const content = list?.firstElementChild;
    if (!list || !popup || !(content instanceof HTMLElement)) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: LenisAnimation | undefined;
    let nativeInteractionPending = false;

    /*------ Popup and Motion Lifecycle ------*/
    const syncScrolling = () => {
      // Base UI keeps closed popups mounted for measurement; only animate while the popup is open.
      if (!popup.hasAttribute("data-open") || reducedMotion.matches) {
        animation?.destroy();
        animation = undefined;
        return;
      }

      if (animation) return;
      nativeInteractionPending = false;
      animation = createLenisAnimation({
        wrapper: list,
        content,
        lerp: 0.12,
        smoothWheel: true,
        syncTouch: false,
        overscroll: false,
        virtualScroll: ({ event }) => {
          const lenis = animation?.lenis;
          if (event.type === "wheel" && nativeInteractionPending && lenis) {
            // Keyboard option reveal or scrollbar dragging can precede Lenis's native scroll listener.
            const scrollPosition = lenis.actualScroll;
            lenis.animatedScroll = scrollPosition;
            lenis.targetScroll = scrollPosition;
            nativeInteractionPending = false;
          }
          return true;
        },
      });
    };

    /*------ Native Interaction Handoff ------*/
    const cancelInertia = () => {
      // Let Base UI reveal keyboard-selected options and let users drag the scrollbar without a stale wheel target.
      nativeInteractionPending = true;
      const lenis = animation?.lenis;
      if (lenis?.isScrolling !== "smooth") return;
      lenis.stop();
      lenis.start();
    };

    const popupObserver = new MutationObserver(syncScrolling);
    popupObserver.observe(popup, { attributes: true, attributeFilter: ["data-open"] });
    reducedMotion.addEventListener("change", syncScrolling);
    popup.addEventListener("keydown", cancelInertia, { capture: true });
    popup.addEventListener("pointerdown", cancelInertia, { capture: true });
    syncScrolling();

    return () => {
      popupObserver.disconnect();
      reducedMotion.removeEventListener("change", syncScrolling);
      popup.removeEventListener("keydown", cancelInertia, { capture: true });
      popup.removeEventListener("pointerdown", cancelInertia, { capture: true });
      animation?.destroy();
    };
  }, [list]);
}
