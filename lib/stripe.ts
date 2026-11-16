import "server-only";
import Stripe from "stripe";

export const PLANS = {
  quiet: { name: "Quiet", lookupKey: "quiet_monthly" },
  steady: { name: "Steady", lookupKey: "steady_monthly" },
  studio: { name: "Studio", lookupKey: "studio_monthly" },
} as const;

export type PlanId = keyof typeof PLANS;

export const TRIAL_DAYS = 7;

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && value in PLANS;
}

let client: Stripe | null = null;

/** Returns a Stripe client, or null when STRIPE_SECRET_KEY is not set. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}
