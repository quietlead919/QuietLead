import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Refund Policy · QuietLead" };

export default function Refunds() {
  return (
    <LegalPage title="Refund Policy" updated={LEGAL.updated}>
      <h2>1. Try it free first</h2>
      <p>
        Every plan starts with a 7-day free trial. If you cancel before the trial ends, you are not charged anything.
        Instead of refunds after the fact, the trial is how you decide whether QuietLead is right for you.
      </p>

      <h2>2. Cancel anytime</h2>
      <p>
        You can cancel your subscription at any time. It stays active until the end of the month you already paid for
        and then stops. There are no cancellation fees and no minimum term.
      </p>

      <h2>3. No refunds for partial months</h2>
      <p>
        Monthly fees that have already been charged are not refunded for the remaining days of the month, unless the law
        requires otherwise.
      </p>

      <h2>4. When we always refund</h2>
      <ul>
        <li>You were charged twice or charged the wrong amount.</li>
        <li>You were charged after cancelling in time.</li>
        <li>QuietLead was unavailable for a large part of your billing period because of a problem on our side.</li>
      </ul>
      <p>
        Write to <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> within 30 days of the charge. Approved refunds go back to
        your original payment method within 5 to 10 business days.
      </p>

      <h2>5. Prices and fees</h2>
      <p>
        Prices on our <Link href="/#pricing">pricing section</Link> are per month, excluding VAT. VAT is shown in
        checkout before you pay. There are no setup fees or other hidden charges.
      </p>

      <p>
        QuietLead is sold to businesses only. See our <Link href="/terms">terms of service</Link> for the full contract
        terms.
      </p>
    </LegalPage>
  );
}
