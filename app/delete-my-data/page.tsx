import type { Metadata } from "next";
import Link from "next/link";
import { DeleteDataForm } from "@/components/DeleteDataForm";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Delete my data · QuietLead" };

export default function DeleteMyData() {
  return (
    <LegalPage title="Delete my data" updated={LEGAL.updated}>
      <p>
        You can ask us to delete everything we store about you at any time (Art. 17 GDPR). Enter the email address you
        used and confirm with the link we send you. Your waitlist entry is then deleted right away.
      </p>
      <DeleteDataForm />

      <h2>Paying customers</h2>
      <p>
        If you have or had a subscription, payment and invoice records are kept by Stripe and must be stored for up to
        10 years for tax reasons. Email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> and we&apos;ll delete
        everything else and tell you exactly what has to stay.
      </p>

      <h2>More about your data</h2>
      <p>
        See our <Link href="/privacy">privacy policy</Link> for what we collect and why.
      </p>
    </LegalPage>
  );
}
