"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once for every client component that animates on scroll.
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Runs as soon as this module loads (before hydration): a reload starts at the top
// instead of the browser restoring the old scroll position, so the scroll story plays fresh.
if (typeof window !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Animations only run for people who haven't asked their OS to reduce motion.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };
