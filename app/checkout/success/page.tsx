import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { getStripe } from "@/lib/stripe";

export const metadata = { title: "Welcome to QuietLead", robots: { index: false } };

// Render the whole page per request before sending it (no streaming):
// it is tiny and depends on a live Stripe session.
export const instant = false;

export default async function CheckoutSuccess({ searchParams }: PageProps<"/checkout/success">) {
  await connection();
  const { session_id } = await searchParams;
  const stripe = getStripe();

  let email: string | null = null;
  let plan: string | null = null;
  let trialEnd: string | null = null;

  if (stripe && typeof session_id === "string" && session_id.startsWith("cs_")) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ["subscription"] });
      email = session.customer_details?.email ?? null;
      plan = session.metadata?.plan ?? null;
      const sub = session.subscription;
      if (sub && typeof sub !== "string" && sub.trial_end) {
        trialEnd = new Date(sub.trial_end * 1000).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch (err) {
      console.error("[success] could not load session:", (err as Error).message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="glass-strong w-full max-w-lg rounded-[32px] p-10 text-center">
        <Image src="/brand/quietlead-icon.png" alt="QuietLead" width={64} height={64} className="mx-auto rounded-2xl" />
        <h1 className="mt-6 text-3xl font-medium tracking-tight">You&apos;re in. Welcome to QuietLead. 🤍</h1>
        <p className="mt-4 text-lg text-ink-soft">
          {plan ? (
            <>
              Your <span className="font-medium text-ink capitalize">{plan}</span> plan is set up
            </>
          ) : (
            "Your plan is set up"
          )}
          {trialEnd ? <> with a free trial until {trialEnd}.</> : "."}
        </p>
        {email && <p className="mt-2 text-ink-soft">We&apos;ll send everything to {email}.</p>}
        <Link href="/" className="btn-primary mt-8 h-12 px-6 text-[15px]">
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}
