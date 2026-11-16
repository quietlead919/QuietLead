import "server-only";
import { LEGAL } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";
import { unsubscribeUrl } from "@/lib/tokens";

// Minimal Resend client (https://resend.com/docs/api-reference/emails/send-email).
// Without RESEND_API_KEY every send is skipped, so the waitlist keeps working.

const DEFAULT_FROM = "QuietLead <onboarding@resend.dev>";

type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

export async function sendMail(mail: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || DEFAULT_FROM,
      to: [mail.to],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      reply_to: mail.replyTo || process.env.NOTIFY_EMAIL || undefined,
      headers: mail.headers,
    }),
  });

  if (!res.ok) {
    console.error("[mail] send failed:", res.status, await res.text());
    return false;
  }
  return true;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const sender = [LEGAL.name, LEGAL.street, LEGAL.city, LEGAL.country].filter(Boolean).join(", ");

function layout(body: string, footer: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f7ff;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0b1b33">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:20px;padding:32px">
<tr><td style="font-size:18px;font-weight:600;color:#004cad;padding-bottom:20px">QuietLead</td></tr>
<tr><td style="font-size:15px;line-height:1.6">${body}</td></tr>
<tr><td style="padding-top:28px;font-size:12px;line-height:1.5;color:#5d6f8c">${footer}<br>${escapeHtml(sender)}</td></tr>
</table></td></tr></table></body></html>`;
}

// Footer + RFC 8058 one-click unsubscribe headers for every mail sent to a waitlist member.
function listMail(email: string) {
  const url = unsubscribeUrl(email);
  const token = new URL(url).searchParams.get("t")!;
  return {
    url,
    htmlFooter: `You get this because you joined the QuietLead waitlist. <a href="${url}" style="color:#004cad">Unsubscribe and delete my email</a>.`,
    textFooter: `You get this because you joined the QuietLead waitlist.\nUnsubscribe and delete your email: ${url}`,
    headers: {
      "List-Unsubscribe": `<${SITE_URL}/api/unsubscribe?t=${token}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

export function welcomeMail(email: string) {
  const l = listMail(email);
  return {
    subject: "You're on the QuietLead waitlist",
    headers: l.headers,
    html: layout(
      `<p style="margin:0 0 14px">Hi there,</p>
<p style="margin:0 0 14px">thanks for joining the QuietLead waitlist. You're in.</p>
<p style="margin:0 0 14px">We'll send you <strong>one email when QuietLead is ready</strong>, with your early access. Nothing else in between.</p>
<p style="margin:0">Quietly yours,<br>The QuietLead team</p>`,
      l.htmlFooter,
    ),
    text: `Hi there,

thanks for joining the QuietLead waitlist. You're in.

We'll send you one email when QuietLead is ready, with your early access. Nothing else in between.

Quietly yours,
The QuietLead team

${l.textFooter}
${sender}`,
  };
}

export function deletionMail(link: string) {
  return {
    subject: "Confirm deleting your QuietLead data",
    html: layout(
      `<p style="margin:0 0 14px">Hi there,</p>
<p style="margin:0 0 14px">someone (hopefully you) asked us to delete all data we hold for this email address.</p>
<p style="margin:0 0 20px"><a href="${link}" style="display:inline-block;background:#004cad;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:12px">Delete my data</a></p>
<p style="margin:0">The link works for 24 hours. If you didn't ask for this, just ignore this email and nothing happens.</p>`,
      "You get this because a data deletion was requested for this address on QuietLead.",
    ),
    text: `Hi there,

someone (hopefully you) asked us to delete all data we hold for this email address.

Confirm here (valid for 24 hours): ${link}

If you didn't ask for this, just ignore this email and nothing happens.

${sender}`,
  };
}

export function signupNotice(email: string, source: string) {
  return {
    subject: `New waitlist signup: ${email}`,
    html: `<p style="font-family:sans-serif">New signup on the QuietLead waitlist:<br><strong>${escapeHtml(email)}</strong> (form: ${escapeHtml(source)})</p>`,
    text: `New signup on the QuietLead waitlist: ${email} (form: ${source})`,
  };
}
