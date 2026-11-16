"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

// Headline whose words light up one by one as it scrolls through the viewport.
// "\n" starts a new line, *word* is rendered in italics.
export function ScrollWords({
  text,
  as: Tag = "h2",
  className = "",
  tone = "dark",
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  tone?: "dark" | "light";
}) {
  const root = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          root.current!.querySelectorAll("[data-word]"),
          { opacity: 0.16, y: 6 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: root.current, start: "top 88%", end: "top 45%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: root },
  );

  const lines = text.split("\n");
  return (
    <Tag ref={root} className={`${className} ${tone === "light" ? "text-white" : ""}`} aria-label={text.replace(/[*\n]/g, " ").replace(/\s+/g, " ").trim()}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true">
          {li > 0 && <br />}
          {line.split(" ").map((word, wi) => {
            const italic = /^\*.*\*[.,!?]?$/.test(word);
            const clean = word.replace(/\*/g, "");
            return (
              <span key={wi}>
                <span data-word className="inline-block will-change-[opacity,transform]">
                  {italic ? <em>{clean}</em> : clean}
                </span>{" "}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
