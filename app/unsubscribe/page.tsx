import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { confirmRemoval } from "@/app/data-actions";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";
import { readToken } from "@/lib/tokens";

export const metadata: Metadata = { title: "Unsubscribe · QuietLead", robots: { index: false } };

// Depends on the token in the URL, so render per request.
export const instant = false;

// Opening the link never deletes anything by itself (mail scanners open links too);
// the person confirms with a button.
export default async function Unsubscribe({ searchParams }: PageProps<"/unsubscribe">) {
  await connection();
  const { t, done, error } = await searchParams;
  const email = readToken(t);

  return (
    <LegalPage title="Unsubscribe and delete" updated={LEGAL.updated}>
      {done ? (
        <p role="status">
          Done. Your email address has been removed from the QuietLead waitlist and you won&apos;t hear from us again.
        </p>
      ) : error === "failed" ? (
        <p role="alert">
          Something went wrong on our side. Please email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> and we&apos;ll
          remove you by hand.
        </p>
      ) : email ? (
        <>
          <p>
            Remove <strong className="text-ink">{email}</strong> from the QuietLead waitlist and delete everything we
            stored about it?
          </p>
          <form action={confirmRemoval} className="mt-6">
            <input type="hidden" name="t" value={String(t)} />
            <button type="submit" className="btn-primary h-12 rounded-xl px-6 text-[15px]">
              Yes, unsubscribe and delete
            </button>
          </form>
        </>
      ) : (
        <p role="alert">
          This link is invalid or has expired. You can <Link href="/delete-my-data">request a new one</Link> or email{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
        </p>
      )}
    </LegalPage>
  );
}
