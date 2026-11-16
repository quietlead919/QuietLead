import { deleteWaitlistEntry } from "@/lib/supabase-admin";
import { readToken } from "@/lib/tokens";

// RFC 8058 one-click unsubscribe: mail clients (Gmail, Apple Mail, ...) POST here
// when someone presses their built-in "Unsubscribe" button.
export async function POST(request: Request) {
  const email = readToken(new URL(request.url).searchParams.get("t"));
  if (!email) return new Response("Invalid link", { status: 400 });
  const ok = await deleteWaitlistEntry(email);
  return new Response(ok ? "Unsubscribed" : "Could not unsubscribe", { status: ok ? 200 : 500 });
}
