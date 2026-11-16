import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Cookie Policy · QuietLead" };

export default function Cookies() {
  return (
    <LegalPage title="Cookie Policy" updated={LEGAL.updated}>
      <h2>Short version</h2>
      <p>This website sets no cookies and uses no tracking, analytics or advertising tools. That&apos;s why we don&apos;t ask for cookie consent.</p>

      <h2>What we store on your device</h2>
      <ul>
        <li>
          <strong className="text-ink">Cookies:</strong> none.
        </li>
        <li>
          <strong className="text-ink">Local storage:</strong> one entry, <code>ql-cookie-notice</code>, saved only when you
          close the cookie notice, so it doesn&apos;t appear again. It contains no personal data and never leaves your
          browser. This is strictly necessary for a function you asked for (§ 25(2) TDDDG).
        </li>
      </ul>

      <h2>Third parties</h2>
      <p>
        We load no third-party scripts, fonts or images; everything comes from our own domain. When you start a
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
