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

## Emails (Resend)

After a signup the person gets a short welcome email and `NOTIFY_EMAIL` gets a "new signup" notice. Both are skipped if `RESEND_API_KEY` is not set.

1. Create a Resend account and an API key, put it in `RESEND_API_KEY`. Set `NOTIFY_EMAIL` to your address.
2. Until a domain is verified in Resend, the test sender `onboarding@resend.dev` can only deliver to the email of your Resend account. After verifying your domain set `MAIL_FROM`, e.g. `QuietLead <hello@yourdomain.com>`.
3. Add the same three variables in Vercel (Production) and redeploy.

### Launch email

Edit the text at the top of [`scripts/send-launch.mjs`](scripts/send-launch.mjs), run [`supabase/launch.sql`](supabase/launch.sql) once and set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Then:

```bash
node --env-file=.env.local scripts/send-launch.mjs                    # dry run, lists recipients
node --env-file=.env.local scripts/send-launch.mjs --test you@x.com   # one test copy to you
node --env-file=.env.local scripts/send-launch.mjs --send             # send to everyone not mailed yet
```

Each address is marked with `launch_sent_at`, so running it again never mails anyone twice.

## Subscriptions (Stripe, test mode)

1. Put `STRIPE_SECRET_KEY` (sk_test_...) in `.env.local`.
2. Create or update the products and monthly prices (Quiet €18.99, Steady €49.99, Studio €129.99):
   `node --env-file=.env.local scripts/stripe-setup.mjs`
3. Set `NEXT_PUBLIC_CHECKOUT_ENABLED=true` to turn the pricing buttons into "Start 7-day free trial".
4. Test with card `4242 4242 4242 4242`, any future date, any CVC.

Flow: pricing button posts to `/api/checkout`, which redirects to Stripe Checkout (7-day trial). After paying, Stripe sends the customer to `/checkout/success` and calls `/api/stripe/webhook`. The webhook needs `STRIPE_WEBHOOK_SECRET`; with `SUPABASE_SERVICE_ROLE_KEY` set it mirrors subscriptions into the table from `supabase/subscriptions.sql`.

Keep `NEXT_PUBLIC_CHECKOUT_ENABLED=false` in production until the product is live.

## Structure

- `app/page.tsx`: all landing page sections and copy
- `app/actions.ts`: waitlist server action
- `components/`: nav, hero mockup, waitlist form, scroll reveal
- `public/brand/`: logo files
