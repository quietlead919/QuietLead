-- QuietLead subscriptions, written by the Stripe webhook with the service role key.
-- Run once in Supabase: SQL Editor > New query > paste > Run.

create table if not exists public.subscriptions (
  id text primary key,                 -- Stripe subscription id (sub_...)
  customer_id text not null,           -- Stripe customer id (cus_...)
  plan text,                           -- quiet | steady | studio
  status text not null,                -- trialing, active, past_due, canceled, ...
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

-- No public policies: only the server (service role) can read or write.
alter table public.subscriptions enable row level security;
