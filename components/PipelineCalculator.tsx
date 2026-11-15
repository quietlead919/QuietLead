"use client";

import { useState } from "react";

const WORKING_DAYS = 21;

type Field = {
  key: "leads" | "reply" | "meeting" | "close" | "deal";
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

export function PipelineCalculator() {
  const [values, setValues] = useState({ leads: 15, reply: 8, meeting: 40, close: 20, deal: 2500 });

  const leadsMonth = values.leads * WORKING_DAYS;
  const replies = leadsMonth * (values.reply / 100);
  const meetings = replies * (values.meeting / 100);
  const clients = meetings * (values.close / 100);
  const revenue = clients * values.deal;

  const results = [
    { label: "Leads reached", value: Math.round(leadsMonth).toString() },
    { label: "Replies", value: Math.round(replies).toString() },
    { label: "Meetings", value: meetings.toFixed(1) },
    { label: "New clients", value: clients.toFixed(1) },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
      <div className="space-y-7">
        {fields.map((f) => {
          const v = values[f.key];
          const fill = ((v - f.min) / (f.max - f.min)) * 100;
          return (
            <label key={f.key} className="block">
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-medium text-ink">{f.label}</span>
                <span className="text-[15px] font-semibold text-brand tabular-nums">{f.format(v)}</span>
              </span>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={v}
                onChange={(e) => setValues((s) => ({ ...s, [f.key]: Number(e.target.value) }))}
                className="range mt-3"
                style={{ ["--fill" as string]: `${fill}%` }}
              />
            </label>
          );
        })}
      </div>

      <div className="flex flex-col justify-between rounded-[28px] bg-brand p-7 text-white sm:p-8">
        <div>
          <p className="text-sm font-medium text-white/70">Estimated new revenue per month</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">{euro(revenue)}</p>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-3">
          {results.map((r) => (
            <div key={r.label} className="rounded-2xl bg-white/10 p-4">
              <dt className="text-xs text-white/70">{r.label}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">{r.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-xs leading-relaxed text-white/60">
          An estimate based on {WORKING_DAYS} working days and the rates you set. Real results depend on your offer,
          market and follow-up.
        </p>
      </div>
    </div>
  );
}
