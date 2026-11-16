import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only client with the service role key, used to delete waitlist entries.
// Returns null when the key isn't configured.
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function deleteWaitlistEntry(email: string): Promise<boolean> {
  const db = supabaseAdmin();
  if (!db) return false;
  const { error } = await db.from("waitlist").delete().eq("email", email.toLowerCase());
  if (error) {
    console.error("[delete] waitlist delete failed:", error.message);
    return false;
  }
  return true;
}
