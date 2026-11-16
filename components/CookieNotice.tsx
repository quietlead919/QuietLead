"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "ql-cookie-notice";

// Informational notice: the site sets no cookies, so there is nothing to accept or reject.
// Closing it stores one local-storage flag (no personal data) so it doesn't come back.
export function CookieNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(KEY, "seen");
    } catch {}
  }

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-xl items-center gap-4 rounded-2xl bg-ink px-5 py-3.5 text-sm text-white sm:bottom-5"
    >
      <p className="flex-1">
        We use no cookies and no tracking.{" "}
        <Link href="/cookies" className="font-semibold underline underline-offset-2">
          Cookie policy
        </Link>
      </p>
      <button
        type="button"
        onClick={close}
        className="h-9 shrink-0 rounded-lg bg-white px-4 font-semibold text-ink hover:bg-mist"
      >
        Got it
      </button>
    </div>
  );
}
