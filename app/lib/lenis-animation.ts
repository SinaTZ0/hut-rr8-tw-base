import Lenis, { type LenisOptions } from "lenis";

/*===== Shared Animation Scheduler =====*/

const instances = new Set<Lenis>();
let frameId: number | undefined;
let advancing = false;

function scheduleFrame() {
  if (frameId !== undefined || advancing || document.hidden || instances.size === 0) return;
  frameId = requestAnimationFrame(advance);
}

function advance(time: number) {
  frameId = undefined;
  advancing = true;
  try {
    // Scroll callbacks can remove, restart, or destroy instances during this frame.
    for (const lenis of Array.from(instances)) {
      // Keep clocks current while idle so the first wheel event uses an ordinary frame delta.
      if (instances.has(lenis)) lenis.raf(time);
    }
  } finally {
    advancing = false;
    scheduleFrame();
  }
}

function handleVisibilityChange() {
  if (document.hidden) {
    if (frameId !== undefined) cancelAnimationFrame(frameId);
    frameId = undefined;
    return;
  }

  const time = performance.now();
  for (const lenis of instances) {
    // Hidden-tab time must not count toward the next animation step.
    lenis.time = time;
  }
  scheduleFrame();
}

/*===== Instance Lifecycle =====*/

export type LenisAnimation = {
  lenis: Lenis;
  requestFrame: () => void;
  destroy: () => void;
};

/**
 * Shares a continuous frame loop while the document is visible, including between scroll gestures.
 * Hidden documents pause the loop. requestFrame coalesces with pending work; destroy replaces lenis.destroy.
 * Browser APIs are accessed only during creation, so importing this module is safe during SSR.
 */
export function createLenisAnimation(options: Omit<LenisOptions, "autoRaf">): LenisAnimation {
  let destroyed = false;

  const requestFrame = () => {
    if (destroyed) return;
    scheduleFrame();
  };

  const lenis = new Lenis({
    ...options,
    autoRaf: false,
  });
  // Input can arrive before the instance's first scheduled frame.
  lenis.time = performance.now();

  instances.add(lenis);
  if (instances.size === 1) document.addEventListener("visibilitychange", handleVisibilityChange);
  scheduleFrame();

  return {
    lenis,
    requestFrame,
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      instances.delete(lenis);
      if (instances.size === 0) {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (frameId !== undefined) cancelAnimationFrame(frameId);
        frameId = undefined;
      }
      lenis.destroy();
    },
  };
}
