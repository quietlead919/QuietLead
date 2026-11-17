"use client";

import { useEffect } from "react";
import { play, unlockSound, type Sfx } from "@/lib/sfx";

// Page-wide UI sounds by delegation, opt-in: only elements with data-sfx="click" (or
// "whoosh", "select", ...) make a sound, and only when clicked (never on hover).
// Everything else stays silent. Components can also call play() directly. Renders nothing.
const INTERACTIVE = "[data-sfx]";

export function SoundLayer() {
  useEffect(() => {
    const onGesture = () => unlockSound();

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest(INTERACTIVE) as HTMLElement | null;
      if (!el || (el as HTMLButtonElement).disabled) return;
      const name = el.dataset.sfx;
      if (!name || name === "none") return;
      play(name as Sfx);
    };

    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
