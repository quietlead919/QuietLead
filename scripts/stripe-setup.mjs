// Creates (or reuses) the QuietLead products, monthly prices and the
// founding-member coupon in the Stripe account behind STRIPE_SECRET_KEY.
// Safe to run more than once: everything is looked up by lookup_key / id first.
//
// Run: node --env-file=.env.local scripts/stripe-setup.mjs

import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY is missing. Add it to .env.local.");
  process.exit(1);
}
if (!key.startsWith("sk_test_")) {
  console.error("Refusing to run with a live key. Use a sk_test_ key for setup.");
  process.exit(1);
}

const stripe = new Stripe(key);

const PLANS = [
  { id: "quiet", name: "QuietLead Quiet", amount: 4900, description: "150 leads per month" },
  { id: "steady", name: "QuietLead Steady", amount: 14900, description: "500 leads per month" },
  { id: "studio", name: "QuietLead Studio", amount: 34900, description: "1,500 leads per month and 3 seats" },
];

const COUPON_ID = "FOUNDING50";

for (const plan of PLANS) {
  const lookupKey = `${plan.id}_monthly`;
  const existing = await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1 });
  if (existing.data.length) {
    console.log(`✓ ${lookupKey} exists (${existing.data[0].id})`);
    continue;
  }

  const product = await stripe.products.create({
    name: plan.name,
    description: plan.description,
    metadata: { plan: plan.id },
  });
  const price = await stripe.prices.create({
    product: product.id,
    currency: "eur",
    unit_amount: plan.amount,
    recurring: { interval: "month" },
    lookup_key: lookupKey,
    tax_behavior: "exclusive",
    metadata: { plan: plan.id },
  });
  console.log(`+ created ${lookupKey} (${price.id})`);
}

try {
  await stripe.coupons.retrieve(COUPON_ID);
  console.log(`✓ coupon ${COUPON_ID} exists`);
} catch {
  await stripe.coupons.create({
    id: COUPON_ID,
    name: "Founding member · 50% off for life",
    percent_off: 50,
    duration: "forever",
    max_redemptions: 50,
  });
  console.log(`+ created coupon ${COUPON_ID}`);
}

console.log("Done.");
