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

// One soft, pre-rendered click: a short sine with a smooth (raised-cosine) attack and an
// exponential tail, so it never starts or ends abruptly (no pops, no distortion).
function renderClick(ac: AudioContext, freq: number) {
  const len = Math.floor(ac.sampleRate * 0.045);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  const attack = Math.floor(ac.sampleRate * 0.002);
  for (let i = 0; i < len; i++) {
    const t = i / ac.sampleRate;
    const env = i < attack ? 0.5 - 0.5 * Math.cos((Math.PI * i) / attack) : Math.exp(-(i - attack) / (ac.sampleRate * 0.009));
    const fade = i > len - 64 ? (len - i) / 64 : 1; // guarantee a clean zero at the end
    data[i] = Math.sin(2 * Math.PI * freq * t) * env * fade;
  }
  return buf;
}

type Clicks = { up: AudioBuffer; down: AudioBuffer; land: AudioBuffer };

// A few soft clicks for the calculator: a short double click when the numbers start
// moving and one quieter click when they land. Web Audio, no files. Browsers only allow
// sound after a user gesture, so warm() is called on the first pointer/key interaction.
export function useTickSound() {
  const enabled = useSyncExternalStore(subscribe, read, () => true);
  const ac = useRef<AudioContext | null>(null);
  const out = useRef<GainNode | null>(null);
  const clicks = useRef<Clicks | null>(null);

  const toggle = useCallback(() => {
    try {
      localStorage.setItem(KEY, read() ? "off" : "on");
    } catch {}
    listeners.forEach((l) => l());
  }, []);

  // Create and resume the audio graph ahead of time so the first click has no delay.
  const warm = useCallback(() => {
    if (!read()) return;
    try {
      if (!ac.current) {
        const ctx = new AudioContext({ latencyHint: "interactive" });
        const gain = ctx.createGain();
        gain.gain.value = 0.18;
        gain.connect(ctx.destination);
        ac.current = ctx;
        out.current = gain;
        clicks.current = { up: renderClick(ctx, 1500), down: renderClick(ctx, 1050), land: renderClick(ctx, 880) };
      }
      if (ac.current.state === "suspended") void ac.current.resume();
    } catch {
      // no Web Audio support: stay silent
    }
  }, []);

  const play = useCallback(
    (kind: "start-up" | "start-down" | "land") => {
      if (!enabled) return;
      warm();
      const ctx = ac.current;
      const set = clicks.current;
      if (!ctx || !set || !out.current || ctx.state !== "running") return;

      // Schedule slightly ahead on the audio clock: exact timing, no main-thread jitter.
      const t0 = ctx.currentTime + 0.01;
      const shots: [AudioBuffer, number, number][] =
        kind === "land"
          ? [[set.land, 0, 0.6]]
          : [
              [kind === "start-up" ? set.up : set.down, 0, 1],
              [kind === "start-up" ? set.up : set.down, 0.07, 0.75],
            ];
      for (const [buffer, delay, level] of shots) {
        const src = ctx.createBufferSource();
        const g = ctx.createGain();
        src.buffer = buffer;
        g.gain.value = level;
        src.connect(g).connect(out.current);
        src.start(t0 + delay);
      }
    },
    [enabled, warm],
  );

  useEffect(() => () => void ac.current?.close(), []);

  return { enabled, toggle, warm, play };
}
