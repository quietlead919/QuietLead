import nodemailer from "nodemailer";
import { connection } from "next/server";

// TEMPORARY diagnostic: reports whether the Gmail env vars reach the server and whether
// Google accepts the login. Never returns any secret. Remove after debugging.
export async function GET() {
  await connection();
  const user = process.env.GMAIL_USER ?? "";
  const pass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
  const result: Record<string, unknown> = {
    gmailUserSet: Boolean(user),
    gmailUserDomain: user.split("@")[1] ?? null,
    appPasswordLength: pass.length,
  };
  if (user && pass) {
    try {
      await nodemailer.createTransport({ service: "gmail", auth: { user, pass } }).verify();
      result.login = "ok";
    } catch (err) {
      const e = err as { code?: string; responseCode?: number };
      result.login = `failed: ${e.code ?? ""} ${e.responseCode ?? ""}`.trim();
    }
  }
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
