"use client";

import { useEffect } from "react";
import { play, unlockSound, type Sfx } from "@/lib/sfx";

// Page-wide UI sounds by delegation, opt-in: only elements with data-sfx="click" (or
// "whoosh", "select", ...) make a sound on click and a soft tick on hover. Everything else
// stays silent. Components can also call play() directly. Renders nothing.
const INTERACTIVE = "[data-sfx]";

export function SoundLayer() {
  useEffect(() => {
    let hovered: Element | null = null;

    const onGesture = () => unlockSound();

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest(INTERACTIVE) as HTMLElement | null;
      if (!el || (el as HTMLButtonElement).disabled) return;
      const name = el.dataset.sfx;
      if (!name || name === "none") return;
      play(name as Sfx);
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest(INTERACTIVE) ?? null;
      if (el === hovered) return;
      hovered = el;
      if (!el || (el as HTMLButtonElement).disabled || (el as HTMLElement).dataset.sfx === "none") return;
      play("hover");
    };

    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture);
    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onOver);
    };
  }, []);

  return null;
}
