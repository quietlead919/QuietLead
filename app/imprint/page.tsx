import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL, missing } from "@/lib/legal";

export const metadata: Metadata = { title: "Imprint · QuietLead" };

export default function Imprint() {
  return (
    <LegalPage title="Imprint" updated={LEGAL.updated}>
      <h2>Information according to § 5 DDG</h2>
      <p>
        {LEGAL.name || missing}
        <br />
        {LEGAL.street || missing}
        <br />
        {LEGAL.city || missing}
        <br />
        {LEGAL.country}
      </p>

      <h2>Contact</h2>
      <p>Email: {LEGAL.email ? <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> : missing}</p>

      {LEGAL.vatId && (
        <>
          <h2>VAT ID</h2>
          <p>VAT identification number according to § 27a UStG: {LEGAL.vatId}</p>
        </>
      )}

      <h2>Responsible for content</h2>
      <p>{LEGAL.name || missing}, address as above.</p>

      <h2>Fonts and images</h2>
      <p>
        Typeface: Open Sauce One by The Open Sauce One Authors, licensed under the SIL Open Font License 1.1 and served from our
        own domain. The QuietLead logo and the interface illustrations are our own work. The product preview uses fictional
        companies and people.
      </p>

      <h2>EU dispute resolution</h2>
      <p>
        We are not willing or obliged to take part in dispute resolution proceedings before a consumer arbitration
        board.
      </p>
    </LegalPage>
  );
}
