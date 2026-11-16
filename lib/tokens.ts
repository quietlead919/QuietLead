import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/site";

// Signed links for unsubscribe and data deletion. A token is "<payload>.<signature>" where
// payload = base64url("email|expiresAtMs"); expiresAtMs = 0 means it never expires
// (used in email footers). scripts/send-launch.mjs builds the same tokens.

function secret() {
  return process.env.UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function makeToken(email: string, ttlMs = 0) {
  const exp = ttlMs ? Date.now() + ttlMs : 0;
  const payload = Buffer.from(`${email.toLowerCase()}|${exp}`).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readToken(token: unknown): string | null {
  if (typeof token !== "string" || !secret()) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  const [email, exp] = Buffer.from(payload, "base64url").toString().split("|");
  if (!email || (Number(exp) > 0 && Date.now() > Number(exp))) return null;
  return email;
}

export function unsubscribeUrl(email: string) {
  return `${SITE_URL}/unsubscribe?t=${makeToken(email)}`;
}
