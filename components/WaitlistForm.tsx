"use client";

import { useState, type PointerEvent } from "react";
import { useClerk } from "@clerk/nextjs";
import { PixelLoader } from "@/components/PixelLoader";

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
  const h = size === "lg" ? "h-[52px]" : "h-11";
  const [opening, setOpening] = useState(false);
  const busy = !clerk.loaded || opening;
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Ripple that grows from the exact spot you press.
  function ripple(e: PointerEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const id = e.timeStamp;
    setRipples((list) => [...list, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((list) => list.filter((p) => p.id !== id)), 650);
  }

  // Open the modal and keep the loader on until it is actually on screen (max 5s).
  function open() {
    setOpening(true);
    clerk.openWaitlist({});
    const t0 = performance.now();
    const check = () => {
      if (document.querySelector(".ql-modal") || performance.now() - t0 > 5000) setOpening(false);
      else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }

  return (
    <div className={`w-full max-w-md ${center ? "mx-auto text-center" : ""}`}>
      <button
        type="button"
        disabled={busy}
        aria-busy={busy}
        onPointerDown={ripple}
        onClick={open}
        className={`group/cta relative ${h} overflow-hidden px-8 text-[17px] disabled:cursor-progress ${
          onDark ? "btn-light" : "btn-primary"
        }`}
      >
        {ripples.map((p) => (
          <span
            key={p.id}
            aria-hidden="true"
            className={`ripple pointer-events-none absolute rounded-full ${onDark ? "bg-black/10" : "bg-white/25"}`}
            style={{ left: p.x, top: p.y }}
          />
        ))}
        <span className={`transition-opacity duration-300 ${busy ? "opacity-0" : "opacity-100"}`}>Get early access</span>
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center">
            <PixelLoader label={opening ? "Opening waitlist" : "Loading"} />
          </span>
        )}
      </button>
      <p className={`mt-4 text-[14px] ${onDark ? "text-[#a1a1a6]" : "text-ink-soft"}`}>
        One email when we launch. No spam, ever.
      </p>
      <p className={`mt-1.5 max-w-sm text-[12px] leading-relaxed text-ink-faint ${center ? "mx-auto" : ""}`}>
        By joining you agree to get emails about QuietLead and confirm you are 18 or older. Unsubscribe anytime.{" "}
        <a href="/privacy" className="underline underline-offset-2">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
