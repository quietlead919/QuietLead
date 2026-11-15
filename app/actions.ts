"use server";

import { createClient } from "@supabase/supabase-js";

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  // Honeypot: real people never fill this hidden field.
  if (String(formData.get("company_site") ?? "").length > 0) {
    return { status: "success", message: "You're on the list." };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const source = String(formData.get("source") ?? "site").slice(0, 32);

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("[waitlist] SUPABASE_URL or SUPABASE_ANON_KEY is missing.");
    return {
      status: "error",
      message: "The waitlist isn't connected yet. Please try again soon.",
    };
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from("waitlist").insert({ email, source });

  if (error) {
    // 23505 = unique violation: the email is already on the list.
    if (error.code === "23505") {
      return { status: "success", message: "You're already on the list. 🤍" };
    }
    console.error("[waitlist] insert failed:", error.message);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return {
    status: "success",
    message: "You're on the list. We'll be in touch, quietly. 🤍",
  };
}
