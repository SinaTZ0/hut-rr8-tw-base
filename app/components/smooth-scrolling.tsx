import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { createLenisAnimation, type LenisAnimation } from "~/lib/lenis-animation";

/*===== Document Scrolling =====*/

/** Adds wheel inertia while leaving keyboard, touch, reduced motion, and modal scrolling native. */
export function SmoothScrolling() {
  const { key: locationKey } = useLocation();
  const previousLocationKey = useRef(locationKey);
  const animation = useRef<LenisAnimation | null>(null);
  const nativeInteractionPending = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /*------ Motion Preference and Modal Locks ------*/
    const syncScrolling = () => {
      if (reducedMotion.matches) {
        animation.current?.destroy();
        animation.current = null;
        return;
      }

      // Base UI can lock either element depending on the browser's scrollbar support.
      const scrollLocked = [document.documentElement, document.body].some((element) =>
        ["hidden", "clip"].includes(window.getComputedStyle(element).overflowY),
      );

      if (scrollLocked) {
        animation.current?.destroy();
        animation.current = null;
        return;
      }

      if (animation.current) return;
      nativeInteractionPending.current = false;
      animation.current = createLenisAnimation({
        lerp: 0.12,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        virtualScroll: ({ event }) => {
          const lenis = animation.current?.lenis;
          if (event.type === "wheel" && nativeInteractionPending.current && lenis) {
            // Sync only position: measuring page dimensions here adds work to the first wheel frame.
            // Native focus or scrollbar updates may arrive before Lenis receives their scroll event.
            const scrollPosition = lenis.actualScroll;
            lenis.animatedScroll = scrollPosition;
            lenis.targetScroll = scrollPosition;
            nativeInteractionPending.current = false;
          }
          return true;
        },
      });
    };

    const readOverflow = () =>
      [document.documentElement, document.body]
        .flatMap((element) => [element.style.overflowX, element.style.overflowY])
        .join(";");
    let observedOverflow = readOverflow();
    const scrollLockObserver = new MutationObserver(() => {
      const overflow = readOverflow();
      // Scrollbar compensation and unrelated inline styles do not require computed-style reads.
      if (overflow === observedOverflow) return;
      observedOverflow = overflow;
      syncScrolling();
    });
    const observerOptions = { attributes: true, attributeFilter: ["style"] };
    scrollLockObserver.observe(document.documentElement, observerOptions);
    scrollLockObserver.observe(document.body, observerOptions);
    reducedMotion.addEventListener("change", syncScrolling);
    syncScrolling();

    /*------ Native Interaction Handoff ------*/
    const cancelInertia = () => {
      // Cancel the wheel target before keyboard scrolling, focus changes, or scrollbar dragging can move the page.
      nativeInteractionPending.current = true;
      const lenis = animation.current?.lenis;
      if (lenis?.isScrolling !== "smooth") return;
      // Immediate scrollTo can return early at an unchanged target; stop/start reliably cancels without scrolling.
      lenis.stop();
      lenis.start();
    };

    window.addEventListener("keydown", cancelInertia, { capture: true });
    window.addEventListener("pointerdown", cancelInertia, { capture: true });

    /*------ Lifecycle Cleanup ------*/
    return () => {
      scrollLockObserver.disconnect();
      reducedMotion.removeEventListener("change", syncScrolling);
      window.removeEventListener("keydown", cancelInertia, { capture: true });
      window.removeEventListener("pointerdown", cancelInertia, { capture: true });
      animation.current?.destroy();
      animation.current = null;
    };
  }, []);

  /*------ Router Scroll Restoration ------*/
  useEffect(() => {
    if (previousLocationKey.current === locationKey) return;
    previousLocationKey.current = locationKey;
    const lenis = animation.current?.lenis;
    if (!lenis) return;

    // Router restoration runs in a layout effect. Keep the instance, but discard the previous route's inertia
    // and measure the new content before the next wheel event, including navigation to a taller page.
    lenis.stop();
    lenis.resize();
    lenis.start();
    nativeInteractionPending.current = false;
  }, [locationKey]);

  return null;
}
