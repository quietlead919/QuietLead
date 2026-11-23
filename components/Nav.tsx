"use client";

import { ChromeLogo } from "@/components/ChromeLogo";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQs" },
];

// Slim dark glass bar: liquid chrome mark, quiet links, a clear glass call to action.
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(10,12,18,0.6)] backdrop-blur-xl backdrop-saturate-[1.8]">
      <nav className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2" aria-label="QuietLead home">
          <ChromeLogo size={24} />
          <span className="text-[14px] font-medium tracking-tight text-white">QuietLead</span>
        </a>
        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[12px] tracking-normal text-white/75 transition-colors duration-300 hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href="#waitlist" className="btn-light inline-flex h-7 items-center px-3.5 text-[12px] tracking-normal">
            Join waitlist
          </a>
        </div>
      </nav>
    </header>
  );
}
