"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQs" },
];

// Transparent with white text over the blue hero, white bar once you scroll.
export function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-ink/5 bg-white/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="QuietLead home">
          <Image src="/brand/quietlead-icon.png" alt="" width={32} height={32} className="rounded-[9px]" priority />
          <span className={`text-[17px] font-semibold tracking-tight ${solid ? "text-ink" : "text-white"}`}>
            QuietLead
          </span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  solid ? "text-ink-soft hover:text-ink" : "text-white hover:text-white/80"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#waitlist"
          className="relative inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-px"
        >
          Join waitlist
        </a>
      </nav>
    </header>
  );
}
