"use client";

import { useActionState, useState, type FormEvent, type PointerEvent } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions";

const initial: WaitlistState = { status: "idle" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [hint, setHint] = useState<string | null>(null);

  // Our own validation instead of the browser's grey popup: a short hint under the
  // field. The server validates again anyway.
  function validate(e: FormEvent<HTMLFormElement>) {
    const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    const value = input.value.trim();
    const problem = !value
      ? "Enter your work email to join."
      : !EMAIL_RE.test(value)
        ? "That doesn't look like an email address yet."
        : null;
    if (problem) {
      e.preventDefault();
      setHint(problem);
      input.focus();
    }
  }

  // Ripple that grows from the exact spot you press.
  function ripple(e: PointerEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const id = e.timeStamp;
    setRipples((list) => [...list, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((list) => list.filter((p) => p.id !== id)), 650);
  }

  if (state.status === "success") {
    return (
      <p
        role="status"
        className={`pop-in flex ${h} w-full max-w-md items-center gap-3 rounded-2xl px-5 text-[15px] font-medium text-brand ${
          onDark ? "bg-white" : "glass"
        } ${center ? "mx-auto" : ""}`}
      >
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs text-white">
          ✓
          {/* little burst around the check */}
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="burst-dot absolute h-1.5 w-1.5 rounded-full bg-brand"
              style={{ ["--a" as string]: `${i * 45}deg` }}
            />
          ))}
        </span>
        {state.message}
      </p>
    );
  }

  return (
    <form
      action={action}
      onSubmit={validate}
      noValidate
      className={`w-full max-w-md ${center ? "mx-auto text-center" : ""}`}
    >
      <div
        className={`pop-box flex ${h} items-center gap-2 rounded-2xl p-1.5 pl-5 ${
          onDark ? "bg-white" : "glass"
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
          aria-invalid={hint ? true : undefined}
          aria-describedby={`email-${source}-msg`}
          onChange={() => hint && setHint(null)}
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
          onPointerDown={ripple}
          className="btn-primary pop-btn group/cta relative h-full overflow-hidden rounded-xl px-5 text-[15px]"
        >
          {ripples.map((p) => (
            <span
              key={p.id}
              aria-hidden="true"
              className="ripple pointer-events-none absolute rounded-full bg-white/40"
              style={{ left: p.x, top: p.y }}
            />
          ))}
          {pending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Joining…
            </>
          ) : (
            <>
              Get early access
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1">
                →
              </span>
            </>
          )}
        </button>
      </div>
      {(() => {
        const message = hint ?? (state.status === "error" ? state.message : null);
        return (
          <p
            id={`email-${source}-msg`}
            aria-live="polite"
            className={`mt-3 text-sm ${center ? "" : "pl-5"} ${onDark ? "text-white/90" : "text-ink-soft"}`}
          >
            {message ? (
              <span
                key={message}
                className={`pop-in inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium ${
                  onDark ? "bg-white text-[#b42318]" : "bg-[#fef3f2] text-[#b42318]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f04438] text-[10px] font-bold text-white"
                >
                  !
                </span>
                {message}
              </span>
            ) : (
              "One email when we launch. No spam, ever."
            )}
          </p>
        );
      })()}
      <p className={`mt-1.5 text-xs ${center ? "" : "pl-5"} ${onDark ? "text-white/85" : "text-ink-faint"}`}>
        By joining you agree to get emails about QuietLead and confirm you are 18 or older. Unsubscribe anytime.{" "}
        <a href="/privacy" className="underline underline-offset-2">
          Privacy Policy
        </a>
      </p>
    </form>
  );
}
