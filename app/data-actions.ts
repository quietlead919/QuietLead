"use server";

import { redirect } from "next/navigation";
import { LEGAL } from "@/lib/legal";
import { canSendMail, deletionMail, sendMail } from "@/lib/mail";
import { SITE_URL } from "@/lib/site";
import { deleteWaitlistEntry, supabaseAdmin } from "@/lib/supabase-admin";
import { makeToken, readToken } from "@/lib/tokens";

export type DeleteState = { status: "idle" | "sent" | "error"; message?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DAY = 24 * 60 * 60 * 1000;

// Step 1 of a deletion request: email a signed 24h link to the address.
// The answer is the same whether or not the address is on the list, so nobody can probe it.
export async function requestDeletion(_prev: DeleteState, formData: FormData): Promise<DeleteState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const fallback = `Automatic deletion isn't available right now. Please email ${LEGAL.email} and we'll delete your data within 30 days.`;
  if (!supabaseAdmin() || !canSendMail()) return { status: "error", message: fallback };

  const link = `${SITE_URL}/unsubscribe?t=${makeToken(email, DAY)}`;
  const ok = await sendMail({ to: email, ...deletionMail(link) });
  if (!ok) return { status: "error", message: fallback };

  return {
    status: "sent",
    message: "If this address is in our records, you'll get an email with a confirmation link in a few minutes.",
  };
}

// Step 2 (and unsubscribe links in emails): delete the entry behind a valid signed token.
export async function confirmRemoval(formData: FormData) {
  const email = readToken(formData.get("t"));
  if (!email) redirect("/unsubscribe?error=invalid");
  const ok = await deleteWaitlistEntry(email);
  redirect(ok ? "/unsubscribe?done=1" : "/unsubscribe?error=failed");
}
