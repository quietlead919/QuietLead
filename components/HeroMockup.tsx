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

type Phase = "idle" | "sending" | "flying" | "sent";

function PlaneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </svg>
  );
}

function PencilIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

const btnBase =
  "inline-flex h-10 items-center gap-2 rounded-full px-5 text-[14px] font-medium transition-[transform,background-color,color] duration-150 active:scale-95 disabled:pointer-events-none";

export function HeroMockup() {
  const [selected, setSelected] = useState(leads[0].id);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(leads.map((l) => [l.id, l.draft])),
  );
  const [sent, setSent] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const busy = phase !== "idle";
  const lead = leads.find((l) => l.id === selected)!;
  const isSent = sent.includes(lead.id) && !busy;
  const allDone = sent.length === leads.length && !busy;

  function pick(id: string) {
    if (busy) return;
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

  // sending (spinner) -> flying (draft folds away, paper plane takes off) -> sent (green) -> next lead
  function approve() {
    if (busy || sent.includes(lead.id)) return;
    if (editing) saveEdit();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nextSent = [...sent, lead.id];
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, reduce ? 0 : ms));

    setPhase("sending");
    at(450, () => setPhase("flying"));
    at(1100, () => {
      setSent(nextSent);
      setPhase("sent");
    });
    at(1900, () => {
      setPhase("idle");
      const next = leads.find((l) => !nextSent.includes(l.id));
      if (next) setSelected(next.id);
    });
  }

  function reset() {
    setSent([]);
    setDrafts(Object.fromEntries(leads.map((l) => [l.id, l.draft])));
    setSelected(leads[0].id);
    setEditing(false);
  }

  const remaining = leads.length - sent.length;
  const leaving = phase === "flying" || phase === "sent";

  return (
    <div className="relative mx-auto w-full max-w-[760px] text-left">
      {/* Floating signal chip, follows the selected lead */}
      <div className="glass-strong absolute -top-5 -left-3 z-10 hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-ink sm:flex">
        <span className="pulse-dot h-2 w-2 rounded-full bg-ink text-ink" />
        {allDone ? "Inbox zero. Nice." : `New signal: ${lead.signal}`}
      </div>

      <div className="glass-strong group/app overflow-hidden rounded-[32px] text-ink">
        {/* Window bar: the dots light up on hover */}
        <div className="flex items-center justify-between border-b border-ink/5 px-6 py-4">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-ink/10" />
            <span className="h-3 w-3 rounded-full bg-ink/10" />
            <span className="h-3 w-3 rounded-full bg-ink/10" />
          </div>
          <span className="text-xs font-medium text-ink-faint tabular-nums">
            Today · {remaining} of {leads.length} quiet leads left
          </span>
        </div>

        <div className="grid gap-0 sm:grid-cols-[250px_1fr]">
          {/* Lead list */}
          <ul className="flex gap-2.5 overflow-x-auto border-b border-ink/5 p-4 sm:flex-col sm:overflow-visible sm:border-r sm:border-b-0 sm:p-5">
            {leads.map((l) => {
              const active = l.id === selected && !allDone;
              const done = sent.includes(l.id);
              return (
                <li key={l.id} className="min-w-[170px] sm:min-w-0">
                  <button
                    type="button"
                    onClick={() => pick(l.id)}
                    aria-pressed={active}
                    disabled={busy && !active}
                    className={`w-full rounded-2xl border px-4 py-3.5 text-left transition-[transform,background-color,border-color,opacity] duration-200 active:scale-[0.97] focus-visible:outline-offset-2 ${
                      active
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-white text-ink hover:translate-x-1 hover:border-ink hover:bg-mist"
                    } ${done && !active ? "opacity-60 hover:opacity-100" : ""}`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[14px] font-medium">{l.name}</span>
                      <span
                        key={done ? "done" : "score"}
                        className={`pop-in shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          done
                            ? active
                              ? "bg-white/20"
                              : "bg-mist text-ink"
                            : active
                              ? "bg-white/20"
                              : "bg-mist text-brand"
                        }`}
                      >
                        {done ? "Sent" : l.score}
                      </span>
                    </span>
                    <span className={`mt-1 block truncate text-[12px] ${active ? "text-white/80" : "text-ink-faint"}`}>
                      {l.meta}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          {allDone ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 p-8 text-center">
              <span className="pop-in flex h-14 w-14 items-center justify-center rounded-full bg-mist text-ink">
                <CheckIcon className="h-6 w-6" />
              </span>
              <p className="text-xl font-medium text-ink">All caught up for today</p>
              <p className="max-w-[300px] text-[14px] text-ink-soft">
                Three personal messages, each one approved by you. That&apos;s the whole routine.
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <a href="#waitlist" className={`${btnBase} bg-brand text-white hover:-translate-y-0.5 hover:bg-brand-deep`}>
                  Get early access
                </a>
                <button type="button" onClick={reset} className={`${btnBase} border border-line bg-white text-ink hover:border-ink`}>
                  Reset demo
                </button>
              </div>
            </div>
          ) : (
            <div key={lead.id} className="fade-up space-y-6 p-6 sm:p-7">
              <div>
                <p className="text-[11px] font-medium tracking-[0.08em] text-ink-faint uppercase">Briefing</p>
                <ul className="mt-3 space-y-2 text-[14px] text-ink-soft">
                  {lead.briefing.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-ink" aria-hidden="true" /> {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Draft card: folds away when sent while a paper plane takes off */}
              <div className="relative">
                <div
                  className={`rounded-2xl border bg-white p-5 transition-[border-color,box-shadow] duration-200 ${
                    editing ? "border-ink ring-1 ring-ink" : "border-line hover:border-ink"
                  } ${leaving ? "fly-away" : ""}`}
                >
                  <p className="text-[11px] font-medium tracking-[0.08em] text-ink-faint uppercase">
                    Draft to {lead.to}
                  </p>
                  {editing ? (
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      rows={4}
                      aria-label={`Edit draft to ${lead.to}`}
                      className="mt-2.5 w-full resize-none bg-transparent text-[14px] leading-relaxed text-ink focus:outline-none focus-visible:outline-none"
                    />
                  ) : (
                    <p className="mt-2.5 text-[14px] leading-relaxed text-ink">{drafts[lead.id]}</p>
                  )}
                </div>
                {phase === "flying" && (
                  <span className="plane-fly pointer-events-none absolute top-1/2 left-1/2 text-brand" aria-hidden="true">
                    <PlaneIcon className="h-9 w-9" />
                  </span>
                )}
                {phase === "sent" && (
                  <p
                    role="status"
                    className="pop-in absolute inset-0 flex items-center justify-center gap-2 text-[15px] font-medium text-ink"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mist">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                    Sent to {lead.to.split(",")[0]}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {isSent ? (
                  <span className="inline-flex h-10 items-center gap-2 rounded-full bg-mist px-5 text-[14px] font-medium text-ink">
                    <CheckIcon className="h-4 w-4" />
                    Sent from your inbox
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={approve}
                      disabled={busy}
                      className={`${btnBase} group/send ${
                        phase === "sent"
                          ? "pop-in bg-ink text-white"
                          : "bg-brand text-white hover:-translate-y-0.5 hover:bg-brand-deep"
                      }`}
                    >
                      {phase === "sending" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Sending…
                        </>
                      ) : phase === "flying" ? (
                        <>
                          <PlaneIcon className="h-4 w-4" />
                          On its way
                        </>
                      ) : phase === "sent" ? (
                        <>
                          <CheckIcon className="h-4 w-4" />
                          Sent
                        </>
                      ) : (
                        <>
                          <PlaneIcon className="h-4 w-4 transition-transform duration-200 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5" />
                          Approve &amp; send
                        </>
                      )}
                    </button>
                    {!busy &&
                      (editing ? (
                        <button type="button" onClick={saveEdit} className={`${btnBase} border border-line bg-white text-ink hover:border-ink`}>
                          Save
                        </button>
                      ) : (
                        <button type="button" onClick={startEdit} className={`${btnBase} group/edit border border-line bg-white text-ink hover:border-ink`}>
                          <PencilIcon className="h-4 w-4 transition-transform duration-200 group-hover/edit:-rotate-12" />
                          Edit
                        </button>
                      ))}
                  </>
                )}
                <span className="ml-auto hidden text-[12px] text-ink-faint sm:inline">You stay in control</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-center text-[12px] text-ink-faint">Interactive demo · fictional data · nothing is sent</p>
    </div>
  );
}
