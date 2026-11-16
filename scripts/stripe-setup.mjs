// Creates (or updates) the QuietLead products and monthly prices in the Stripe
// account behind STRIPE_SECRET_KEY. Safe to run more than once.
// Stripe prices can't be edited, so when an amount changes a new price is created,
// the lookup_key moves over to it and the old price is archived.
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
  { id: "quiet", name: "QuietLead Quiet", amount: 1899, description: "50 leads per month" },
  { id: "steady", name: "QuietLead Steady", amount: 4999, description: "300 leads per month" },
  {
    id: "studio",
    name: "QuietLead Studio",
    amount: 12999,
    description: "1,000 leads per month, buying-signal alerts and 3 seats",
  },
];

for (const plan of PLANS) {
  const lookupKey = `${plan.id}_monthly`;
  const existing = (await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1, expand: ["data.product"] }))
    .data[0];

  if (existing && existing.unit_amount === plan.amount) {
    console.log(`✓ ${lookupKey} up to date (${existing.id})`);
    continue;
  }

  let productId;
  if (existing) {
    productId = typeof existing.product === "string" ? existing.product : existing.product.id;
    await stripe.products.update(productId, { name: plan.name, description: plan.description });
  } else {
    productId = (
      await stripe.products.create({ name: plan.name, description: plan.description, metadata: { plan: plan.id } })
    ).id;
  }

  const price = await stripe.prices.create({
    product: productId,
    currency: "eur",
    unit_amount: plan.amount,
    recurring: { interval: "month" },
    lookup_key: lookupKey,
    transfer_lookup_key: true,
    tax_behavior: "exclusive",
    metadata: { plan: plan.id },
  });
  await stripe.products.update(productId, { default_price: price.id });
  if (existing) await stripe.prices.update(existing.id, { active: false });

  console.log(`${existing ? "~ updated" : "+ created"} ${lookupKey}: €${(plan.amount / 100).toFixed(2)} (${price.id})`);
}

console.log("Done.");
