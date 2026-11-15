"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions";

const initial: WaitlistState = { status: "idle" };

export function WaitlistForm({
  source,
  size = "lg",
  onDark = false,
  center = false,
}: {
  source: string;
  size?: "md" | "lg";
  onDark?: boolean;
  center?: boolean;
}) {
  const [state, action, pending] = useActionState(joinWaitlist, initial);
  const h = size === "lg" ? "h-14" : "h-12";

  if (state.status === "success") {
    return (
      <p
        role="status"
        className={`flex ${h} w-full max-w-md items-center gap-3 rounded-2xl px-5 text-[15px] font-medium text-brand ${
          onDark ? "bg-white shadow-xl shadow-black/15" : "glass"
        } ${center ? "mx-auto" : ""}`}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs text-white">
          ✓
        </span>
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className={`w-full max-w-md ${center ? "mx-auto text-center" : ""}`}>
      <div
        className={`flex ${h} items-center gap-2 rounded-2xl p-1.5 pl-5 ${
          onDark ? "bg-white shadow-xl shadow-black/15" : "glass"
        }`}
      >
        <label htmlFor={`email-${source}`} className="sr-only">
          Work email
        </label>
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus-visible:outline-none"
        />
        <input type="hidden" name="source" value={source} />
        <input
          type="text"
          name="company_site"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn-primary h-full rounded-xl px-5 text-[15px]"
        >
          {pending ? "Joining…" : "Get early access →"}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-3 text-sm ${center ? "" : "pl-5"} ${
          state.status === "error"
            ? onDark
              ? "font-medium text-white"
              : "text-red-600"
            : onDark
              ? "text-white/70"
              : "text-ink-soft"
        }`}
      >
        {state.status === "error"
          ? state.message
          : "Founding members get 50% off, for life. No spam, ever."}
      </p>
    </form>
  );
}
