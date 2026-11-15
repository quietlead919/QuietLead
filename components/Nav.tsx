import Image from "next/image";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="glass mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full py-2 pr-2 pl-3">
        <a href="#top" className="flex items-center gap-2.5" aria-label="QuietLead home">
          <Image
            src="/brand/quietlead-icon.png"
            alt=""
            width={34}
            height={34}
            className="rounded-[10px]"
            priority
          />
          <span className="text-[17px] font-medium tracking-tight">QuietLead</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-white/70 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#waitlist" className="btn-primary h-10 px-4 text-sm">
          Join waitlist
        </a>
      </nav>
    </header>
  );
}
