-- QuietLead waitlist table.
-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) <= 254),
  source text not null default 'site',
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- The public (anon) key may only INSERT. Nobody can read the list with it.
drop policy if exists "anon can join waitlist" on public.waitlist;
create policy "anon can join waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);
