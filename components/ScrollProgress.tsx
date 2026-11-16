"use client";

import { useEffect, useRef } from "react";

// Thin bar at the very top that fills as you scroll down the page.
// A passive scroll listener writing one transform: no layout work, no library needed.
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-12 z-[60] h-px">
      <div
        ref={bar}
        data-progress
        className="h-full origin-left bg-ink-faint"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
