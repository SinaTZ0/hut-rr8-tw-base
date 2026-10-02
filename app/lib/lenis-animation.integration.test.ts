import type { LenisOptions } from "lenis";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createLenisAnimation, type LenisAnimation } from "./lenis-animation";

/*===== Lenis Event Boundary =====*/

const { FakeLenis, createdInstances } = vi.hoisted(() => {
  const createdInstances: FakeLenis[] = [];

  class FakeLenis {
    time = 0;
    isScrolling: false | "smooth" | "native" = false;
    finishOnNextFrame = false;
    afterAdvance?: () => void;
    deltas: number[] = [];
    listeners = new Map<string, Set<(value: unknown) => void>>();

    constructor(public options: LenisOptions) {
      createdInstances.push(this);
    }

    raf = vi.fn((time: number) => {
      this.deltas.push(time - this.time);
      this.time = time;
      if (this.finishOnNextFrame) this.isScrolling = false;
      this.emit({ event: "scroll", value: this });
      this.afterAdvance?.();
    });

    destroy = vi.fn();

    on(event: string, callback: (value: unknown) => void) {
      const listeners = this.listeners.get(event) ?? new Set();
      listeners.add(callback);
      this.listeners.set(event, listeners);
      return () => listeners.delete(callback);
    }

    emit({ event, value }: { event: string; value: unknown }) {
      for (const callback of this.listeners.get(event) ?? []) callback(value);
    }

    wheel() {
      // The real Lenis emitter runs before it starts the wheel animation.
      this.emit({ event: "virtual-scroll", value: { event: { type: "wheel" }, deltaY: 100 } });
      this.isScrolling = "smooth";
    }
  }

  return { FakeLenis, createdInstances };
});

vi.mock("lenis", () => ({ default: FakeLenis }));

/*===== Browser Clock and Cleanup =====*/

let now: number;
let documentEvents: EventTarget & { hidden: boolean };
let frames: Map<number, FrameRequestCallback>;
const controllers: LenisAnimation[] = [];

beforeEach(() => {
  now = 100;
  let nextFrameId = 0;
  frames = new Map();
  createdInstances.length = 0;
  documentEvents = Object.assign(new EventTarget(), { hidden: false });
  vi.stubGlobal("document", documentEvents);
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      const id = nextFrameId++;
      frames.set(id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((id: number) => frames.delete(id)),
  );
  vi.spyOn(performance, "now").mockImplementation(() => now);
});

afterEach(() => {
  for (const controller of controllers) controller.destroy();
  controllers.length = 0;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function createScroller(options: Omit<LenisOptions, "autoRaf"> = {}) {
  const controller = createLenisAnimation(options);
  controllers.push(controller);
  return { controller, instance: createdInstances.at(-1)! };
}

function advanceFrame() {
  now += 16;
  const callbacks = Array.from(frames.values());
  frames.clear();
  for (const callback of callbacks) callback(now);
}

/*===== Foreground Scheduling =====*/

describe("Lenis animation scheduling", () => {
  it("keeps the foreground loop running before input and after inertia settles", () => {
    const { instance } = createScroller();
    expect(instance.options.autoRaf).toBe(false);
    expect(frames.size).toBe(1);
    advanceFrame();
    expect(instance.raf).toHaveBeenCalledTimes(1);
    expect(instance.isScrolling).toBe(false);

    instance.wheel();
    expect(instance.raf).toHaveBeenCalledTimes(1);
    expect(frames.size).toBe(1);
    advanceFrame();
    expect(instance.raf).toHaveBeenCalledTimes(2);
    expect(frames.size).toBe(1);

    instance.finishOnNextFrame = true;
    advanceFrame();
    expect(frames.size).toBe(1);
    advanceFrame();
    expect(instance.raf).toHaveBeenCalledTimes(4);
  });

  it("shares one frame between instances even when either becomes idle", () => {
    const first = createScroller().instance;
    const second = createScroller().instance;
    first.wheel();
    second.wheel();
    expect(frames.size).toBe(1);

    first.finishOnNextFrame = true;
    advanceFrame();
    expect(first.raf).toHaveBeenCalledTimes(1);
    expect(second.raf).toHaveBeenCalledTimes(1);
    expect(frames.size).toBe(1);
    advanceFrame();
    expect(first.raf).toHaveBeenCalledTimes(2);
    expect(second.raf).toHaveBeenCalledTimes(2);
  });

  it("keeps the clock current for wheel input that Lenis leaves native", () => {
    const { instance } = createScroller();
    instance.emit({ event: "virtual-scroll", value: { event: { type: "wheel" }, deltaY: 100 } });
    advanceFrame();
    expect(instance.isScrolling).toBe(false);
    expect(instance.deltas).toEqual([16]);
    expect(frames.size).toBe(1);
  });

  it.each([
    { type: "touchmove", ctrlKey: false, deltaY: 100 },
    { type: "wheel", ctrlKey: true, deltaY: 100 },
    { type: "wheel", ctrlKey: false, deltaY: 0 },
  ])("native input adds no extra frame requests: %j", ({ deltaY, ...event }) => {
    const { instance } = createScroller();
    instance.emit({ event: "virtual-scroll", value: { event, deltaY } });
    expect(frames.size).toBe(1);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(instance.time).toBe(now);
  });

  it("keeps idle clocks current so the next wheel uses a normal frame delta", () => {
    const { instance } = createScroller();
    for (let frame = 0; frame < 125; frame++) advanceFrame();
    expect(instance.time).toBe(now);
    instance.wheel();
    advanceFrame();
    expect(instance.deltas).toHaveLength(126);
    expect(instance.deltas.every((delta) => delta === 16)).toBe(true);
  });

  it("pauses hidden-tab work and rebases active and idle instances on return", () => {
    const first = createScroller().instance;
    const second = createScroller().instance;
    first.wheel();
    advanceFrame();

    documentEvents.hidden = true;
    documentEvents.dispatchEvent(new Event("visibilitychange"));
    expect(frames.size).toBe(0);
    now += 10_000;
    first.wheel();
    expect(frames.size).toBe(0);

    documentEvents.hidden = false;
    documentEvents.dispatchEvent(new Event("visibilitychange"));
    expect(frames.size).toBe(1);
    advanceFrame();
    expect(first.deltas).toEqual([16, 16]);
    expect(second.deltas).toEqual([16, 16]);
  });

  it("defers instances created in a hidden document until it becomes visible", () => {
    documentEvents.hidden = true;
    const { controller, instance } = createScroller();
    controller.requestFrame();
    expect(frames.size).toBe(0);

    now += 10_000;
    documentEvents.hidden = false;
    documentEvents.dispatchEvent(new Event("visibilitychange"));
    advanceFrame();
    expect(instance.deltas).toEqual([16]);
    expect(frames.size).toBe(1);
  });

  it("animates anchors without replacing caller callbacks or options", () => {
    const onStart = vi.fn();
    const options = { offset: 20, onStart };
    const { controller, instance } = createScroller({ anchors: options });
    const anchors = instance.options.anchors;
    if (typeof anchors !== "object") throw new Error("Expected anchor options");
    expect(anchors).toBe(options);

    instance.isScrolling = "smooth";
    anchors.onStart?.(controller.lenis);
    expect(anchors.offset).toBe(20);
    expect(onStart).toHaveBeenCalledWith(controller.lenis);
    expect(frames.size).toBe(1);
    advanceFrame();
    expect(instance.raf).toHaveBeenCalledTimes(1);
  });

  it("coalesces explicit requests with the continuously scheduled frame", () => {
    const { controller, instance } = createScroller();
    instance.isScrolling = "smooth";
    controller.requestFrame();
    controller.requestFrame();
    expect(frames.size).toBe(1);
    advanceFrame();
    expect(instance.deltas).toEqual([16]);
  });

  /*------ Cancellation and Reentrant Callbacks ------*/

  it("keeps the loop ready after native input cancels inertia", () => {
    const { instance } = createScroller();
    instance.wheel();
    instance.isScrolling = false;
    instance.emit({ event: "scroll", value: instance });
    expect(frames.size).toBe(1);
    expect(instance.raf).not.toHaveBeenCalled();
    advanceFrame();
    expect(instance.isScrolling).toBe(false);
    expect(instance.deltas).toEqual([16]);
  });

  it("cleans up idempotently without cancelling another active instance", () => {
    const addListener = vi.spyOn(documentEvents, "addEventListener");
    const removeListener = vi.spyOn(documentEvents, "removeEventListener");
    const first = createScroller();
    const second = createScroller();
    first.instance.wheel();
    second.instance.wheel();
    expect(addListener).toHaveBeenCalledTimes(1);

    first.controller.destroy();
    first.controller.destroy();
    first.controller.requestFrame();
    first.instance.wheel();
    expect(first.instance.destroy).toHaveBeenCalledTimes(1);
    expect(frames.size).toBe(1);
    expect(removeListener).not.toHaveBeenCalled();
    advanceFrame();
    expect(first.instance.raf).not.toHaveBeenCalled();
    expect(second.instance.raf).toHaveBeenCalledTimes(1);

    second.controller.destroy();
    expect(frames.size).toBe(0);
    expect(removeListener).toHaveBeenCalledTimes(1);
  });

  it("handles destruction and new animations inside scroll callbacks", () => {
    const first = createScroller();
    const second = createScroller();
    let third: ReturnType<typeof createScroller> | undefined;
    first.instance.wheel();
    second.instance.wheel();
    first.instance.afterAdvance = () => {
      second.controller.destroy();
      third = createScroller();
      third.instance.wheel();
      first.instance.afterAdvance = undefined;
    };

    advanceFrame();
    expect(second.instance.raf).not.toHaveBeenCalled();
    expect(third?.instance.raf).not.toHaveBeenCalled();
    expect(frames.size).toBe(1);
    advanceFrame();
    expect(third?.instance.raf).toHaveBeenCalledTimes(1);
  });
});
