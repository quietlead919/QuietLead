import type Stripe from "stripe";
import { FOUNDING_COUPON, PLANS, TRIAL_DAYS, getStripe, isPlanId } from "@/lib/stripe";

// Pricing buttons POST a plain form here; we answer with a redirect to Stripe Checkout.
export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const back = (reason: string) => Response.redirect(`${origin}/?checkout=${reason}#pricing`, 303);

  if (process.env.NEXT_PUBLIC_CHECKOUT_ENABLED !== "true") return back("disabled");

  const stripe = getStripe();
  if (!stripe) return back("unconfigured");

  const form = await request.formData();
  const plan = form.get("plan");
  if (!isPlanId(plan)) return back("invalid");

  const prices = await stripe.prices.list({ lookup_keys: [PLANS[plan].lookupKey], active: true, limit: 1 });
  const price = prices.data[0];
  if (!price) {
    console.error(`[checkout] no active price for ${PLANS[plan].lookupKey}. Run scripts/stripe-setup.mjs.`);
    return back("unconfigured");
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [{ price: price.id, quantity: 1 }],
    subscription_data: { trial_period_days: TRIAL_DAYS, metadata: { plan } },
    metadata: { plan },
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?checkout=canceled#pricing`,
  };

  let session: Stripe.Checkout.Session;
  try {
    // Founding members get 50% off for life while the coupon has redemptions left.
    session = await stripe.checkout.sessions.create({ ...params, discounts: [{ coupon: FOUNDING_COUPON }] });
  } catch (err) {
    console.warn("[checkout] founding coupon not applied:", (err as Error).message);
    session = await stripe.checkout.sessions.create(params);
  }

  if (!session.url) return back("error");
  return Response.redirect(session.url, 303);
}
