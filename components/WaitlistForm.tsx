"use client";

import { useState, type PointerEvent } from "react";
import { useClerk } from "@clerk/nextjs";

// Opens Clerk's waitlist in a modal. Clerk stores the entries; you approve and invite
// people from the Clerk dashboard (Waitlist).
export function WaitlistForm({
  size = "lg",
  onDark = false,
  center = false,
}: {
  source?: string;
  size?: "md" | "lg";
  onDark?: boolean;
  center?: boolean;
}) {
  const clerk = useClerk();
  const h = size === "lg" ? "h-14" : "h-12";
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Ripple that grows from the exact spot you press.
  function ripple(e: PointerEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const id = e.timeStamp;
    setRipples((list) => [...list, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((list) => list.filter((p) => p.id !== id)), 650);
  }

  return (
    <div className={`w-full max-w-md ${center ? "mx-auto text-center" : ""}`}>
      <button
        type="button"
        disabled={!clerk.loaded}
        onPointerDown={ripple}
        onClick={() => clerk.openWaitlist({})}
        className={`pop-btn group/cta relative inline-flex ${h} items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 text-[15px] font-semibold transition-opacity disabled:opacity-70 ${
          onDark ? "bg-white text-brand shadow-lg" : "btn-primary"
        }`}
      >
        {ripples.map((p) => (
          <span
            key={p.id}
            aria-hidden="true"
            className={`ripple pointer-events-none absolute rounded-full ${onDark ? "bg-brand/20" : "bg-white/40"}`}
            style={{ left: p.x, top: p.y }}
          />
        ))}
        Get early access
        <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1">
          →
        </span>
      </button>
      <p className={`mt-3 text-sm ${onDark ? "text-white/90" : "text-ink-soft"}`}>
        One email when we launch. No spam, ever.
      </p>
      <p className={`mt-1.5 text-xs ${onDark ? "text-white/85" : "text-ink-faint"}`}>
        By joining you agree to get emails about QuietLead and confirm you are 18 or older. Unsubscribe anytime.{" "}
        <a href="/privacy" className="underline underline-offset-2">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
