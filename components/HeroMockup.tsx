"use client";

// An interactive mock of the QuietLead app: pick a lead, edit the draft, approve it.
// All company and person names are fictional demo data. Nothing is actually sent.

import { useEffect, useRef, useState } from "react";

type Lead = {
  id: string;
  name: string;
  meta: string;
  score: number;
  signal: string;
  briefing: string[];
  to: string;
  draft: string;
};

const leads: Lead[] = [
  {
    id: "pixelwerk",
    name: "Pixelwerk Studio",
    meta: "Web agency · Cologne",
    score: 94,
    signal: "Pixelwerk is hiring 2 designers",
    briefing: ["Hiring 2 designers, growing fast", "No outbound process, all referrals", "Founder posts weekly on LinkedIn"],
    to: "Lena, Founder",
    draft:
      "Hi Lena, saw you're hiring two designers. Congrats on the growth. Most studios your size tell me new clients still come only through referrals. Would a steady second channel be useful right now?",
  },
  {
    id: "nordlicht",
    name: "Nordlicht Dental",
    meta: "Clinic group · Hamburg",
    score: 88,
    signal: "Nordlicht opened a 3rd clinic",
    briefing: ["Opened a third clinic last month", "Booking still runs by phone", "New practice manager since spring"],
    to: "Jonas, Practice Manager",
    draft:
      "Hi Jonas, congrats on the new clinic in Altona. Three sites with phone-only booking usually means a busy front desk. Happy to share how other groups took that load off, if it helps.",
  },
  {
    id: "berger",
    name: "Berger & Partner",
    meta: "Tax advisors · Munich",
    score: 81,
    signal: "Berger & Partner is going paperless",
    briefing: ["Announced a move to digital filing", "Team of 12, two new partners", "No client portal yet"],
    to: "Sabine, Partner",
    draft:
      "Hi Sabine, read that Berger & Partner is going fully digital this year. Big step. Firms in that phase often ask us how to win clients who expect a portal from day one. Worth a quick chat?",
  },
];

export function HeroMockup() {
  const [selected, setSelected] = useState(leads[0].id);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(leads.map((l) => [l.id, l.draft])),
  );
  const [sent, setSent] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [justSent, setJustSent] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const lead = leads.find((l) => l.id === selected)!;
  const isSent = sent.includes(lead.id);
  const allDone = sent.length === leads.length && !justSent;

  function pick(id: string) {
    if (justSent) return;
    setSelected(id);
    setEditing(false);
  }

  function startEdit() {
    setEditValue(drafts[lead.id]);
    setEditing(true);
  }

  function saveEdit() {
    const text = editValue.trim();
    if (text) setDrafts((d) => ({ ...d, [lead.id]: text }));
    setEditing(false);
  }

  function approve() {
    if (isSent || justSent) return;
    if (editing) saveEdit();
    const nextSent = [...sent, lead.id];
    setSent(nextSent);
    setJustSent(true);
    timer.current = setTimeout(() => {
      setJustSent(false);
      const next = leads.find((l) => !nextSent.includes(l.id));
      if (next) setSelected(next.id);
    }, 900);
  }

  function reset() {
    setSent([]);
    setDrafts(Object.fromEntries(leads.map((l) => [l.id, l.draft])));
    setSelected(leads[0].id);
    setEditing(false);
  }

  const remaining = leads.length - sent.length;

  return (
    <div className="relative mx-auto w-full max-w-[560px] text-left">
      {/* Floating signal chip, follows the selected lead */}
      <div className="glass-strong absolute -top-5 -left-3 z-10 hidden items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium text-ink sm:flex">
        <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-500 text-emerald-500" />
        {allDone ? "Inbox zero. Nice." : `New signal: ${lead.signal}`}
      </div>

      <div className="glass-strong overflow-hidden rounded-[28px] text-ink">
        {/* Window bar */}
        <div className="flex items-center justify-between border-b border-ink/5 px-5 py-3.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
          </div>
          <span className="text-xs font-medium text-ink-faint">
            Today · {remaining} of {leads.length} quiet leads left
          </span>
        </div>

        <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
          {/* Lead list */}
          <ul className="flex gap-2 overflow-x-auto border-b border-ink/5 p-3 sm:flex-col sm:overflow-visible sm:border-r sm:border-b-0">
            {leads.map((l) => {
              const active = l.id === selected && !allDone;
              const done = sent.includes(l.id);
              return (
                <li key={l.id} className="min-w-[150px] sm:min-w-0">
                  <button
                    type="button"
                    onClick={() => pick(l.id)}
                    aria-pressed={active}
                    className={`w-full rounded-2xl p-3 text-left transition-all duration-200 ${
                      active
                        ? "bg-brand text-white"
                        : "bg-white/70 text-ink hover:bg-white"
                    } ${done && !active ? "opacity-60" : ""}`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[13px] font-medium">{l.name}</span>
                      <span
                        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                          done
                            ? active
                              ? "bg-white/20"
                              : "bg-emerald-100 text-emerald-700"
                            : active
                              ? "bg-white/20"
                              : "bg-mist text-brand"
                        }`}
                      >
                        {done ? "Sent ✓" : l.score}
                      </span>
                    </span>
                    <span className={`mt-0.5 block truncate text-[11px] ${active ? "text-white/70" : "text-ink-faint"}`}>
                      {l.meta}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          {allDone ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-600">
                ✓
              </span>
              <p className="text-lg font-semibold text-ink">All caught up for today</p>
              <p className="max-w-[260px] text-[13px] text-ink-soft">
                Three personal messages, each one approved by you. That&apos;s the whole routine.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <a href="#waitlist" className="btn-primary h-9 px-4 text-[13px]">
                  Get early access
                </a>
                <button type="button" onClick={reset} className="btn-ghost h-9 px-4 text-[13px]">
                  Reset demo
                </button>
              </div>
            </div>
          ) : (
            <div key={lead.id} className="fade-up space-y-4 p-5">
              <div>
                <p className="text-[11px] font-medium tracking-wide text-ink-faint uppercase">Briefing</p>
                <ul className="mt-2 space-y-1.5 text-[13px] text-ink-soft">
                  {lead.briefing.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-brand">●</span> {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`rounded-2xl bg-white/80 p-4 ring-1 transition-colors ${
                  editing ? "ring-brand/40" : "ring-ink/5"
                }`}
              >
                <p className="text-[11px] font-medium tracking-wide text-ink-faint uppercase">Draft to {lead.to}</p>
                {editing ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                    rows={5}
                    aria-label={`Edit draft to ${lead.to}`}
                    className="mt-2 w-full resize-none bg-transparent text-[13px] leading-relaxed text-ink focus:outline-none focus-visible:outline-none"
                  />
                ) : (
                  <p className="mt-2 text-[13px] leading-relaxed text-ink">{drafts[lead.id]}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isSent ? (
                  <span className="inline-flex h-9 items-center gap-2 rounded-full bg-emerald-100 px-4 text-[13px] font-medium text-emerald-700">
                    ✓ Sent from your inbox
                  </span>
                ) : (
                  <>
                    <button type="button" onClick={approve} className="btn-primary h-9 px-4 text-[13px]">
                      Approve &amp; send
                    </button>
                    {editing ? (
                      <button type="button" onClick={saveEdit} className="btn-ghost h-9 px-4 text-[13px]">
                        Save
                      </button>
                    ) : (
                      <button type="button" onClick={startEdit} className="btn-ghost h-9 px-4 text-[13px]">
                        Edit
                      </button>
                    )}
                  </>
                )}
                <span className="ml-auto hidden text-[11px] text-ink-faint sm:inline">You stay in control</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-ink-faint">Interactive demo · fictional data · nothing is sent</p>
    </div>
  );
}
