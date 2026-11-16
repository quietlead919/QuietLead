import Image from "next/image";
import Link from "next/link";

// Shared shell for the legal pages: simple header, readable column, small footer.
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-ink/5">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/brand/quietlead-icon.png" alt="" width={26} height={26} className="logo-mono rounded-[6px]" />
            <span className="font-medium text-ink">QuietLead</span>
          </Link>
          <Link href="/" className="text-sm text-ink-soft hover:text-ink">
            ← Back to home
          </Link>
        </div>
      </header>
      <main id="top" className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-medium tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-ink-faint">Last updated: {updated}</p>
        <div className="legal mt-10">{children}</div>
      </main>
      <footer className="border-t border-ink/5 px-4 py-8 text-center text-sm text-ink-faint">
        <Link href="/imprint" className="hover:text-ink">Imprint</Link> ·{" "}
        <Link href="/privacy" className="hover:text-ink">Privacy</Link> ·{" "}
        <Link href="/terms" className="hover:text-ink">Terms</Link> ·{" "}
        <Link href="/refunds" className="hover:text-ink">Refunds</Link> ·{" "}
        <Link href="/cookies" className="hover:text-ink">Cookies</Link> ·{" "}
        <Link href="/delete-my-data" className="hover:text-ink">Delete my data</Link>
      </footer>
    </div>
  );
}
