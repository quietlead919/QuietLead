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
        This website uses no analytics, advertising pixels or any other tracking. The only cookies are strictly
        necessary ones set by our sign-up provider Clerk (see section 4) to keep the waitlist and sign-in secure and
        working, so no consent is needed for them (§ 25(2) TDDDG). When you close the cookie notice we save one
        local-storage flag (no personal data) so it doesn&apos;t show again. Details in our{" "}
        <Link href="/cookies">cookie policy</Link>. If we ever add optional cookies, we will ask for your consent
        first.
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
        The waitlist and sign-in run on Clerk (Clerk, Inc., USA), which acts as our processor. If you join the
        waitlist, Clerk stores your email address and the time of signup. To protect the form against bots and abuse,
        Clerk and its bot check Cloudflare Turnstile (Cloudflare, Inc., USA) also process technical data such as your
        IP address and browser details, and Clerk sets strictly necessary cookies. We use your address to let you
        know when your spot is ready and to send you an invitation when QuietLead launches. Legal basis: Art. 6(1)(b)
        and (a) GDPR (your request and consent) and, for the bot protection, Art. 6(1)(f) GDPR (legitimate interest in
        a secure sign-up). Data transfers to the USA are covered by the EU-US Data Privacy Framework and/or Standard
        Contractual Clauses. We never sell your address or share it for advertising. You can ask us to delete your
        entry at any time by writing to the email address in section 1. We keep the data until you ask us to delete
        it or until we stop the waitlist. See{" "}
        <a href="https://clerk.com/legal/privacy" rel="noopener noreferrer">
          clerk.com/legal/privacy
        </a>
        .
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
        To use any of these rights, including deleting your waitlist entry, write to the email address in section 1.
      </p>

      <h2>8. Changes</h2>
      <p>We update this policy when our product or the law changes. The date at the top shows the latest version.</p>
    </LegalPage>
  );
}
