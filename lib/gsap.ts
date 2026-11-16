"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once for every client component that animates on scroll.
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Animations only run for people who haven't asked their OS to reduce motion.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };
