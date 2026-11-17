"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQs" },
];

// Apple-style global nav: slim translucent bar. Dark over the black hero, light afterwards.
export function Nav() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const limit = hero ? hero.offsetTop + hero.offsetHeight - 48 : 40;
      setLight(window.scrollY > limit);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-xl backdrop-saturate-[1.8] transition-colors duration-500 ${
        light ? "border-b border-black/10 bg-[rgba(251,251,253,0.8)]" : "border-b border-white/10 bg-[rgba(22,22,23,0.8)]"
      }`}
    >
      <nav className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2" aria-label="QuietLead home">
          <Image
            src="/brand/quietlead-icon.png"
            alt=""
            width={22}
            height={22}
            className={`rounded-[6px] ${light ? "logo-mono" : "logo-invert"}`}
            priority
          />
          <span
            className={`text-[14px] font-medium tracking-tight transition-colors duration-500 ${light ? "text-ink" : "text-white"}`}
          >
            QuietLead
          </span>
        </a>
        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-[12px] tracking-normal transition-colors duration-300 ${
                  light ? "text-ink/80 hover:text-ink" : "text-white/80 hover:text-white"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a
            href="#waitlist"
            data-sfx="click"
            className={`inline-flex h-7 items-center rounded-full px-3.5 text-[12px] tracking-normal transition-colors duration-300 ${
              light ? "bg-ink text-white hover:bg-black" : "bg-white text-ink hover:bg-haze"
            }`}
          >
            Join waitlist
          </a>
        </div>
      </nav>
    </header>
  );
}
