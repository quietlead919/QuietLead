# QuietLead

**Finding leads without the noise.** Landing page and waitlist for QuietLead, an AI tool for B2B lead generation.

Built with Next.js (App Router), Tailwind CSS v4, Inter and Supabase.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Waitlist (Supabase)

1. Create a Supabase project.
2. In the Supabase dashboard open **SQL Editor**, paste [`supabase/waitlist.sql`](supabase/waitlist.sql) and run it. This creates the `waitlist` table with an insert-only policy for the public key.
3. Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Project Settings > API).
4. Restart the dev server.

Signups appear in **Table Editor > waitlist**. Without the env vars the form shows "The waitlist isn't connected yet."

## Subscriptions (Stripe, test mode)

1. Put `STRIPE_SECRET_KEY` (sk_test_...) in `.env.local`.
2. Create products, monthly prices and the `FOUNDING50` coupon (50% off forever, max 50):
   `node --env-file=.env.local scripts/stripe-setup.mjs`
3. Set `NEXT_PUBLIC_CHECKOUT_ENABLED=true` to turn the pricing buttons into "Start 7-day free trial".
4. Test with card `4242 4242 4242 4242`, any future date, any CVC.

Flow: pricing button posts to `/api/checkout`, which redirects to Stripe Checkout (7-day trial, founding coupon). After paying, Stripe sends the customer to `/checkout/success` and calls `/api/stripe/webhook`. The webhook needs `STRIPE_WEBHOOK_SECRET`; with `SUPABASE_SERVICE_ROLE_KEY` set it mirrors subscriptions into the table from `supabase/subscriptions.sql`.

Keep `NEXT_PUBLIC_CHECKOUT_ENABLED=false` in production until the product is live.

## Structure

- `app/page.tsx`: all landing page sections and copy
- `app/actions.ts`: waitlist server action
- `components/`: nav, hero mockup, waitlist form, scroll reveal
- `public/brand/`: logo files
