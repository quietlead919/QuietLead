import type Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

// Stripe calls this URL whenever something happens to a subscription.
// It is the source of truth for who has access: never trust the success page alone.
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch (err) {
    return new Response(`Invalid signature: ${(err as Error).message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object;
      console.log(`[stripe] checkout completed · ${s.customer_details?.email} · plan ${s.metadata?.plan}`);
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      console.log(`[stripe] ${event.type} · ${sub.id} · ${sub.status}`);
      await saveSubscription(sub);
      break;
    }
    case "invoice.payment_failed": {
      const inv = event.data.object;
      console.warn(`[stripe] payment failed · ${inv.customer_email}`);
      break;
    }
  }

  return Response.json({ received: true });
}

// Mirrors the subscription into Supabase (table from supabase/subscriptions.sql)
// when SUPABASE_SERVICE_ROLE_KEY is set. Otherwise it only logs.
async function saveSubscription(sub: Stripe.Subscription) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("subscriptions").upsert({
    id: sub.id,
    customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
    plan: sub.metadata?.plan ?? null,
    status: sub.status,
    cancel_at_period_end: sub.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("[stripe] could not save subscription:", error.message);
}
