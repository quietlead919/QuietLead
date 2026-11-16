"use client";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

// Cinematic hero on scroll: the copy drifts up and fades, the product card starts tilted
// in 3D and straightens up as it comes into view. Renders nothing itself.
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

      gsap.fromTo(
        "[data-hero-card]",
        { rotateX: 22, scale: 0.9, y: 40, transformOrigin: "50% 0%" },
        {
          rotateX: 0,
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-hero-card]", start: "top 95%", end: "top 30%", scrub: 0.6 },
        },
      );
    });
  });

  return null;
}
