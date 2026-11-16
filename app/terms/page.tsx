import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL, missing } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms of Service · QuietLead" };

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated={LEGAL.updated}>
      <p>
        These terms apply to the use of QuietLead, provided by {LEGAL.name || missing} ({LEGAL.city || missing},{" "}
        {LEGAL.country}), &quot;we&quot;. QuietLead is offered to businesses only (B2B), not to consumers.
      </p>

      <h2>1. The service</h2>
      <p>
        QuietLead helps you find potential business customers and prepares briefings and draft messages. QuietLead
        never sends a message without your approval. QuietLead is currently in private beta, so features may change
        and the service may be interrupted.
      </p>

      <h2>2. Plans, trial and payment</h2>
      <p>
        Plans and prices are shown on the <Link href="/#pricing">pricing section</Link>, plus VAT where applicable.
        Every plan starts with a 7-day free trial. After the trial the subscription renews monthly and is charged in
        advance through Stripe. You can cancel at any time with effect from the end of the current billing period.
      </p>

      <h2>3. Your responsibilities</h2>
      <ul>
        <li>You are responsible for the messages you approve and send, and for following the law that applies to them, including GDPR and the German UWG.</li>
        <li>You do not use QuietLead for spam, harassment or any unlawful purpose.</li>
        <li>You keep your account access safe and do not share it outside your plan&apos;s seats.</li>
      </ul>

      <h2>4. Data</h2>
      <p>
        How we handle personal data is described in our <Link href="/privacy">privacy policy</Link>. Where we process
        personal data on your behalf, a data processing agreement (Art. 28 GDPR) is available on request.
      </p>

      <h2>5. Liability</h2>
      <p>
        We are liable without limitation for intent, gross negligence and injury to life, body or health. For slight
        negligence we are only liable for breaches of essential contractual obligations, limited to the damage
        typically foreseeable at the time of contract. We do not guarantee specific results such as replies or
        sales.
      </p>

      <h2>6. Changes and termination</h2>
      <p>
        We may update these terms with at least 30 days&apos; notice by email. If you do not agree, you can cancel
        before the change takes effect. We may suspend accounts that break these terms.
      </p>

      <h2>7. Final provisions</h2>
      <p>
        German law applies. Place of jurisdiction is Frankfurt am Main, as far as legally permitted. Questions:{" "}
        {LEGAL.email ? <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> : missing}.
      </p>
    </LegalPage>
  );
}
