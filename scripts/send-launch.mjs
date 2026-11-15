// Sends the "QuietLead is live" email to everyone on the waitlist who hasn't had it yet.
//
//   node --env-file=.env.local scripts/send-launch.mjs                 dry run: shows who would get it
//   node --env-file=.env.local scripts/send-launch.mjs --test you@x.de  sends one copy to you only
//   node --env-file=.env.local scripts/send-launch.mjs --send          sends to the whole list
//
// Needs SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY (and MAIL_FROM once your domain is verified).
// Run supabase/launch.sql once before the first real send.

// ---- Edit the launch email here ----------------------------------------------------------
const LAUNCH_URL = "https://quiet-lead.vercel.app";
const SUBJECT = "QuietLead is live. Your founding spot is ready";
const BODY_TEXT = `Hi there,

you joined the QuietLead waitlist, and today it's ready.

QuietLead finds companies that need what you sell right now and drafts a personal first message for each one. You approve every message before it goes out.

As a founding member you get 50% off, for life:
${LAUNCH_URL}

Thanks for waiting quietly.
The QuietLead team`;
// ------------------------------------------------------------------------------------------

const args = process.argv.slice(2);
const SEND = args.includes("--send");
const testIdx = args.indexOf("--test");
const TEST_TO = testIdx >= 0 ? args[testIdx + 1] : null;

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY } = process.env;
const FROM = process.env.MAIL_FROM || "QuietLead <onboarding@resend.dev>";
const REPLY_TO = process.env.NOTIFY_EMAIL || undefined;

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

const footer = `You get this because you joined the QuietLead waitlist. Reply with "unsubscribe" and we'll remove you.`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const html = `<!doctype html><html><body style="margin:0;background:#f4f7ff;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0b1b33">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:20px;padding:32px">
<tr><td style="font-size:18px;font-weight:600;color:#004cad;padding-bottom:20px">QuietLead</td></tr>
<tr><td style="font-size:15px;line-height:1.6">${BODY_TEXT.split("\n\n")
  .map((p) => `<p style="margin:0 0 14px">${esc(p).replace(/\n/g, "<br>").replace(esc(LAUNCH_URL), `<a href="${LAUNCH_URL}" style="color:#004cad;font-weight:600">${esc(LAUNCH_URL)}</a>`)}</p>`)
  .join("")}</td></tr>
<tr><td style="padding-top:28px;font-size:12px;line-height:1.5;color:#8193b0">${footer}</td></tr>
</table></td></tr></table></body></html>`;
const text = `${BODY_TEXT}\n\n${footer}`;

const mail = (to) => ({ from: FROM, to: [to], subject: SUBJECT, html, text, reply_to: REPLY_TO });

async function resend(path, body) {
  if (!RESEND_API_KEY) fail("RESEND_API_KEY is missing in .env.local");
  const res = await fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) fail(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

async function db(path, init = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) fail("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!res.ok) fail(`Supabase ${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

if (TEST_TO) {
  await resend("/emails", mail(TEST_TO));
  console.log(`✓ Test copy sent to ${TEST_TO}. Nothing was marked as sent.`);
  process.exit(0);
}

const rows = await db("waitlist?select=email&launch_sent_at=is.null&order=created_at.asc");
const emails = rows.map((r) => r.email);
console.log(`\n${emails.length} people have not received the launch email yet.`);

if (!SEND) {
  emails.slice(0, 20).forEach((e) => console.log("  ·", e));
  if (emails.length > 20) console.log(`  … and ${emails.length - 20} more`);
  console.log(`\nDry run. Nothing was sent. Add --send to send for real, or --test you@example.com for one copy.\n`);
  process.exit(0);
}

let sent = 0;
for (let i = 0; i < emails.length; i += 100) {
  const chunk = emails.slice(i, i + 100);
  await resend("/emails/batch", chunk.map(mail));
  const list = chunk.map((e) => `"${e.replace(/"/g, '\\"')}"`).join(",");
  await db(`waitlist?email=in.(${encodeURIComponent(list)})`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ launch_sent_at: new Date().toISOString() }),
  });
  sent += chunk.length;
  console.log(`  sent ${sent}/${emails.length}`);
}
console.log(`\n✓ Launch email sent to ${sent} people.\n`);
