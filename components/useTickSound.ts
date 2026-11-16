"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const KEY = "ql-calc-sound";
const listeners = new Set<() => void>();

function read() {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Tiny synthesized "tick" for counting numbers (Web Audio, no audio files).
// Browsers only allow sound after a user gesture; slider drags count as one.
// The on/off choice is remembered in localStorage.
export function useTickSound() {
  const enabled = useSyncExternalStore(subscribe, read, () => true);
  const ctx = useRef<AudioContext | null>(null);
  const lastTick = useRef(0);

  const toggle = useCallback(() => {
    try {
      localStorage.setItem(KEY, read() ? "off" : "on");
    } catch {}
    listeners.forEach((l) => l());
  }, []);

  // direction: 1 counting up (brighter), -1 counting down (lower)
  const tick = useCallback(
    (direction: 1 | -1) => {
      if (!enabled) return;
      const now = performance.now();
      if (now - lastTick.current < 55) return; // ~18 ticks per second at most
      lastTick.current = now;

      try {
        ctx.current ??= new AudioContext();
        const ac = ctx.current;
        if (ac.state === "suspended") void ac.resume();

        const t = ac.currentTime;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = "triangle";
        const base = direction > 0 ? 1250 : 820;
        osc.frequency.setValueAtTime(base + Math.random() * 60, t);
        osc.frequency.exponentialRampToValueAtTime(base * 0.75, t + 0.04);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.05, t + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
        osc.connect(gain).connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.06);
      } catch {
        // no Web Audio support: stay silent
      }
    },
    [enabled],
  );

  useEffect(() => () => void ctx.current?.close(), []);

  return { enabled, toggle, tick };
}
