// A coded mock of the QuietLead app: today's leads, one briefing, one draft.
// All company and person names are fictional demo data.

const leads = [
  { name: "Pixelwerk Studio", meta: "Web agency · Cologne", score: 94, active: true },
  { name: "Nordlicht Dental", meta: "Clinic group · Hamburg", score: 88 },
  { name: "Berger & Partner", meta: "Tax advisors · Munich", score: 81 },
];

export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* Floating signal chip */}
      <div className="glass-strong absolute -top-5 -left-3 z-10 hidden items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium sm:flex">
        <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-500 text-emerald-500" />
        New signal: Pixelwerk is hiring 2 designers
      </div>

      <div className="glass-strong overflow-hidden rounded-[28px]">
        {/* Window bar */}
        <div className="flex items-center justify-between border-b border-ink/5 px-5 py-3.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
          </div>
          <span className="text-xs font-medium text-ink-faint">Today · 10 quiet leads</span>
        </div>

        <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
          {/* Lead list */}
          <ul className="flex gap-2 overflow-hidden border-b border-ink/5 p-3 sm:flex-col sm:border-r sm:border-b-0">
            {leads.map((l) => (
              <li
                key={l.name}
                className={`min-w-[150px] rounded-2xl p-3 sm:min-w-0 ${
                  l.active ? "bg-brand text-white shadow-lg shadow-brand/25" : "bg-white/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-medium">{l.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                      l.active ? "bg-white/20" : "bg-mist text-brand"
                    }`}
                  >
                    {l.score}
                  </span>
                </div>
                <p className={`mt-0.5 truncate text-[11px] ${l.active ? "text-white/70" : "text-ink-faint"}`}>
                  {l.meta}
                </p>
              </li>
            ))}
          </ul>

          {/* Briefing + draft */}
          <div className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-medium tracking-wide text-ink-faint uppercase">Briefing</p>
              <ul className="mt-2 space-y-1.5 text-[13px] text-ink-soft">
                <li className="flex gap-2">
                  <span className="text-brand">●</span> Hiring 2 designers, growing fast
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">●</span> No outbound process, all referrals
                </li>
                <li className="flex gap-2">
                  <span className="text-brand">●</span> Founder posts weekly on LinkedIn
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-ink/5">
              <p className="text-[11px] font-medium tracking-wide text-ink-faint uppercase">Draft to Lena, Founder</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink">
                Hi Lena, saw you&apos;re hiring two designers. Congrats on the growth. Most studios your size
                tell me new clients still come only through referrals…
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="btn-primary h-9 px-4 text-[13px]">Approve &amp; send</span>
              <span className="btn-ghost h-9 px-4 text-[13px]">Edit</span>
              <span className="ml-auto text-[11px] text-ink-faint">You stay in control</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
