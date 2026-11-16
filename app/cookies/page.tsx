import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Cookie Policy · QuietLead" };

export default function Cookies() {
  return (
    <LegalPage title="Cookie Policy" updated={LEGAL.updated}>
      <h2>Short version</h2>
      <p>
        This website uses no tracking, analytics or advertising tools. The only cookies are strictly necessary ones from
        our sign-up provider Clerk, which keep the waitlist and sign-in secure. That&apos;s why we don&apos;t ask for
        cookie consent.
      </p>

      <h2>What we store on your device</h2>
      <ul>
        <li>
          <strong className="text-ink">Cookies:</strong> Clerk sets cookies such as <code>__client_uat</code>,{" "}
          <code>__session</code> and <code>__client</code> to recognise your browser, protect the waitlist form against
          bots and keep you signed in once you have access. They contain no advertising or tracking IDs and are strictly
          necessary for a service you asked for (§ 25(2) TDDDG). See{" "}
          <a href="https://clerk.com/legal/cookies" rel="noopener noreferrer">
            Clerk&apos;s cookie policy
          </a>
          .
        </li>
        <li>
          <strong className="text-ink">Local storage:</strong> one entry, <code>ql-cookie-notice</code>, saved only when you
          close the cookie notice, so it doesn&apos;t appear again. It contains no personal data and never leaves your
          browser. This is strictly necessary for a function you asked for (§ 25(2) TDDDG).
        </li>
      </ul>

      <h2>Third parties</h2>
      <p>
        Apart from Clerk&apos;s sign-up scripts and its bot check (Cloudflare Turnstile), we load no third-party
        scripts, fonts or images. When you start a
        subscription you are taken to Stripe&apos;s checkout page, where Stripe may set its own cookies for payment and
        fraud prevention. See{" "}
        <a href="https://stripe.com/cookies-policy/legal" rel="noopener noreferrer">
          Stripe&apos;s cookie policy
        </a>
        .
      </p>

      <h2>Changes</h2>
      <p>
        If we ever add analytics or other optional cookies, we will ask for your consent first with an equal choice to
        accept or reject, and update this page. More in our <Link href="/privacy">privacy policy</Link>.
      </p>
    </LegalPage>
  );
}
