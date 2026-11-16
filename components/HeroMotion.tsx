"use client";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

// Hero on scroll: the copy drifts up and fades as you scroll past it. Renders nothing itself.
export function HeroMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (!hero) return;

      gsap.to("[data-hero-copy]", {
        yPercent: -18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "60% top", scrub: 0.5 },
      });
    });
  });

  return null;
}
