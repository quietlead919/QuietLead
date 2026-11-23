"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { play } from "@/lib/sfx";

const WORKING_DAYS = 21;

type Key = "leads" | "reply" | "meeting" | "close" | "deal";
type Values = Record<Key, number>;

type Field = {
  key: Key;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
};

const fields: Field[] = [
  { key: "leads", label: "Leads per day", min: 5, max: 50, step: 1, format: (v) => `${v}` },
  { key: "reply", label: "Reply rate", min: 2, max: 25, step: 1, format: (v) => `${v}%` },
  { key: "meeting", label: "Replies that book a meeting", min: 10, max: 80, step: 5, format: (v) => `${v}%` },
  { key: "close", label: "Meetings that become clients", min: 5, max: 60, step: 5, format: (v) => `${v}%` },
  { key: "deal", label: "Average client value", min: 500, max: 20000, step: 500, format: (v) => euro(v) },
];

function euro(v: number) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
}

function compute(v: Values) {
  const leads = v.leads * WORKING_DAYS;
  const replies = leads * (v.reply / 100);
  const meetings = replies * (v.meeting / 100);
  const clients = meetings * (v.close / 100);
  return { leads, replies, meetings, clients, revenue: clients * v.deal };
}

// Eases every number in `target` toward its new value (exponential smoothing, `tau` ms).
// Gives a smooth count up/down for the results and a soft, slightly lagging slider thumb.
// With prefers-reduced-motion it returns the target as is.
function useSmoothed<T extends Record<string, number>>(target: T, tau: number): T {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);

  useEffect(() => {
    // With reduced motion the first frame jumps straight to the target.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = performance.now();

    // Each new target restarts the loop from wherever the numbers are right now,
    // so fast slider moves blend into one continuous motion.
    const tick = (now: number) => {
      const k = reduce ? 1 : 1 - Math.exp(-Math.max(0, now - last) / tau);
      last = now;
      const next = { ...shownRef.current };
      let moving = false;
      for (const key in target) {
        const diff = target[key] - next[key];
        const settled = Math.abs(diff) < Math.max(Math.abs(target[key]) * 1e-4, 1e-3);
        next[key] = (settled ? target[key] : next[key] + diff * k) as T[typeof key];
        if (!settled) moving = true;
      }
      shownRef.current = next;
      setShown(next);
      if (moving) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, tau]);

  return shown;
}

export function PipelineCalculator() {
  const [values, setValues] = useState<Values>({ leads: 15, reply: 8, meeting: 40, close: 20, deal: 2500 });

  const sliders = useSmoothed(values, 110);
  const computed = useMemo(() => compute(values), [values]);
  // Results follow almost instantly (short count on jumps, no lag while dragging);
  // only the slider thumbs get the soft, trailing motion.
  const results = useSmoothed(computed, 60);

  const tiles = [
    { label: "Leads reached", value: Math.round(results.leads).toString() },
    { label: "Replies", value: Math.round(results.replies).toString() },
    { label: "Meetings", value: results.meetings.toFixed(1) },
    { label: "New clients", value: results.clients.toFixed(1) },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
      <div className="space-y-7">
        {fields.map((f) => {
          const p = Math.min(1, Math.max(0, (sliders[f.key] - f.min) / (f.max - f.min)));
          const pos = `calc(11px + (100% - 22px) * ${p})`;
          return (
            <label key={f.key} className="block">
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-medium text-ink">{f.label}</span>
                <span className="text-[15px] font-medium text-brand tabular-nums">{f.format(values[f.key])}</span>
              </span>
              {/* The real range input sits invisibly on top (keyboard, screen readers, pointer);
                  the visible track and thumb follow it with a little easing. */}
              <span className="relative mt-3 block h-6">
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={values[f.key]}
                  onChange={(e) => {
                    setValues((s) => ({ ...s, [f.key]: Number(e.target.value) }));
                    play("slider");
                  }}
                  className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-haze" />
                <span
                  className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-brand"
                  style={{ width: pos }}
                />
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand transition-[scale] duration-200 peer-hover:scale-110 peer-active:scale-125 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-sky"
                  style={{ left: pos }}
                />
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex flex-col justify-between glass-accent rounded-[28px] p-7 text-white sm:p-10">
        <div>
          <p className="text-sm font-medium text-white/85">Estimated new revenue per month</p>
          <p className="mt-2 text-5xl font-medium tracking-tight tabular-nums sm:text-6xl" aria-live="polite">
            {euro(results.revenue)}
          </p>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-3">
          {tiles.map((r) => (
            <div key={r.label} className="rounded-2xl bg-white/10 p-4">
              <dt className="text-xs text-white/85">{r.label}</dt>
              <dd className="mt-1 text-2xl font-medium tabular-nums">{r.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-xs leading-relaxed text-white/80">
          An estimate based on {WORKING_DAYS} working days and the rates you set. Real results depend on your offer,
          market and follow-up.
        </p>
      </div>
    </div>
  );
}
