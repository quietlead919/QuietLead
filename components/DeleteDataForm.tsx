"use client";

import { useActionState } from "react";
import { requestDeletion, type DeleteState } from "@/app/data-actions";

const initial: DeleteState = { status: "idle" };

export function DeleteDataForm() {
  const [state, action, pending] = useActionState(requestDeletion, initial);

  if (state.status === "sent") {
    return (
      <p role="status" className="mt-6 rounded-2xl bg-mist px-5 py-4 text-ink">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="mt-6 max-w-md">
      <label htmlFor="delete-email" className="block text-sm font-medium text-ink">
        Your email address
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="delete-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="h-12 min-w-0 flex-1 rounded-xl border border-ink/15 px-4 text-[15px] text-ink placeholder:text-ink-faint"
        />
        <button type="submit" disabled={pending} className="btn-primary h-12 rounded-xl px-5 text-[15px]">
          {pending ? "Sending…" : "Send link"}
        </button>
      </div>
      <p aria-live="polite" className={`mt-3 text-sm ${state.status === "error" ? "text-red-700" : "text-ink-soft"}`}>
        {state.status === "error" ? state.message : "We'll email you a confirmation link that works for 24 hours."}
      </p>
    </form>
  );
}
