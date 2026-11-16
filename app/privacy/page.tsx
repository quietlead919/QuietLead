import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL, missing } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy Policy · QuietLead" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated={LEGAL.updated}>
      <p>
        This policy explains what personal data QuietLead collects on this website, why, and what rights you have under
        the EU General Data Protection Regulation (GDPR).
      </p>

      <h2>1. Who is responsible</h2>
      <p>
        {LEGAL.name || missing}, {LEGAL.street || missing}, {LEGAL.city || missing}, {LEGAL.country}. Email:{" "}
        {LEGAL.email ? <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> : missing}. See also our{" "}
        <Link href="/imprint">imprint</Link>.
      </p>

      <h2>2. Cookies and tracking</h2>
      <p>
        This website does not use cookies, analytics, advertising pixels or any other tracking, and it loads no
        third-party scripts. When you close the cookie notice we save one local-storage flag (no personal data) so it
        doesn&apos;t show again. Details in our <Link href="/cookies">cookie policy</Link>. If this ever changes, we
        will ask for your consent first.
      </p>

      <h2>3. Visiting the website</h2>
      <p>
        When you open the site, our hosting provider Vercel Inc. (USA) processes technical data such as your IP
        address, browser type and the time of the request to deliver the page and keep it secure. These server logs
        are kept for a short time only. Legal basis: Art. 6(1)(f) GDPR (legitimate interest in a secure, working
        website). Data transfers to the USA are covered by the EU-US Data Privacy Framework and/or Standard
        Contractual Clauses.
      </p>

      <h2>4. Waitlist</h2>
      <p>
        If you join the waitlist we store only your email address, which form you used and the time of signup. We do
        not store your name, IP address or anything else. We use it to send you a confirmation and one email when
        QuietLead launches, and the operator gets a short notice about the new signup. Legal basis: Art. 6(1)(b) and (a) GDPR (your
        request and consent). The data is stored with Supabase in Frankfurt, Germany. Emails are sent through Google
        Gmail (Google Ireland Ltd., with possible transfers to Google LLC in the USA under the EU-US Data Privacy
        Framework) or, as a fallback, through Resend (USA, Standard Contractual Clauses). We never sell your address or
        share it for advertising. Every email has an unsubscribe link: one click removes and deletes your
        address. You can also use <Link href="/delete-my-data">Delete my data</Link> at any time. We keep the data
        until you unsubscribe or until we stop the waitlist.
      </p>

      <h2>5. Payments</h2>
      <p>
        When you start a subscription you are redirected to Stripe, which processes your payment and billing details
        as an independent controller. We receive your name, email, billing country, plan and payment status, but never
        your full card details. Legal basis: Art. 6(1)(b) GDPR (contract) and Art. 6(1)(c) GDPR (tax and accounting
        duties, retention up to 10 years). See{" "}
        <a href="https://stripe.com/privacy" rel="noopener noreferrer">
          stripe.com/privacy
        </a>
        .
      </p>

      <h2>6. Children</h2>
      <p>
        QuietLead is a business tool for people aged 18 and over. We do not knowingly collect data from children. If
        you believe a child has signed up, contact us and we will delete the data right away.
      </p>

      <h2>7. Your rights</h2>
      <ul>
        <li>Access to the data we hold about you (Art. 15)</li>
        <li>Correction (Art. 16) and deletion (Art. 17)</li>
        <li>Restriction of processing (Art. 18) and data portability (Art. 20)</li>
        <li>Objection to processing based on legitimate interest (Art. 21)</li>
        <li>Withdrawal of consent at any time, with effect for the future (Art. 7(3))</li>
        <li>
          Complaint to a supervisory authority, for example the Hessian Commissioner for Data Protection and Freedom of
          Information (HBDI)
        </li>
      </ul>
      <p>
        To use any of these rights, write to the email address in section 1. You can delete your waitlist data yourself
        on <Link href="/delete-my-data">Delete my data</Link>.
      </p>

      <h2>8. Changes</h2>
      <p>We update this policy when our product or the law changes. The date at the top shows the latest version.</p>
    </LegalPage>
  );
}
