"use client";

// Small UI sound engine (Web Audio). Sounds load on the first click or key press, because
// browsers only allow audio after a user gesture anyway. Viewers can switch sound off; the
// choice is kept in local storage ("ql-sound").

export type Sfx = "click" | "select" | "whoosh" | "send" | "success" | "toggle" | "slider";

const NAMES: Sfx[] = ["click", "select", "whoosh", "send", "success", "toggle", "slider"];
const VOLUME: Record<Sfx, number> = {
  slider: 0.9,
  click: 0.4,
  select: 0.45,
  whoosh: 0.4,
  send: 0.45,
  success: 0.4,
  toggle: 0.35,
};
const KEY = "ql-sound";

let ctx: AudioContext | null = null;
let loading: Promise<void> | null = null;
const buffers = new Map<Sfx, AudioBuffer>();
const listeners = new Set<() => void>();

// Shown inside another page (e.g. the FrameWerk portfolio window): stay silent.
function embedded() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function soundOn() {
  if (typeof window !== "undefined" && embedded()) return false;
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSound(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  listeners.forEach((l) => l());
}

export function subscribeSound(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// Call from a user gesture: creates/resumes the audio context and loads the sounds once.
export function unlockSound() {
  if (typeof window === "undefined" || embedded()) return;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  if (!loading) {
    const ac = ctx;
    loading = Promise.all(
      NAMES.map(async (n) => {
        try {
          const res = await fetch(`/sfx/${n}.mp3`);
          buffers.set(n, await ac.decodeAudioData(await res.arrayBuffer()));
        } catch {}
      }),
    ).then(() => {});
  }
}

let lastSlider = 0;

export function play(name: Sfx) {
  if (!ctx || !soundOn()) return;
  // Slider ticks: at most one every 45ms, so fast drags feel smooth instead of rattling.
  if (name === "slider") {
    const now = performance.now();
    if (now - lastSlider < 45) return;
    lastSlider = now;
  }
  const buffer = buffers.get(name);
  if (!buffer) return;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = VOLUME[name];
  src.connect(gain).connect(ctx.destination);
  src.start();
}
