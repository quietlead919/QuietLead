"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const KEY = "ql-cookie-notice";
const listeners = new Set<() => void>();

function seen() {
  try {
    return localStorage.getItem(KEY) === "seen";
  } catch {
    return false;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Informational notice: the only cookies are Clerk's strictly necessary ones, so there is
// nothing to accept or reject.
// Closing it stores one local-storage flag (no personal data) so it doesn't come back.
export function CookieNotice() {
  // Server render and first paint: hidden, then shown on the client if not seen yet.
  const hidden = useSyncExternalStore(subscribe, seen, () => true);
  if (hidden) return null;

  function close() {
    try {
      localStorage.setItem(KEY, "seen");
    } catch {}
    listeners.forEach((l) => l());
  }

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-xl items-center gap-4 rounded-[18px] border border-white/10 bg-[rgba(22,22,23,0.9)] px-5 py-3.5 text-[14px] text-white backdrop-blur-xl sm:bottom-5"
    >
      <p className="flex-1">
        No tracking. Only cookies needed for the waitlist to work.{" "}
        <Link href="/cookies" className="font-medium underline underline-offset-2">
          Cookie policy
        </Link>
      </p>
      <button
        type="button"
        onClick={close}
        className="h-8 shrink-0 rounded-full bg-white px-4 text-[13px] text-black hover:bg-[#e8e8ed]"
      >
        Got it
      </button>
    </div>
  );
}
