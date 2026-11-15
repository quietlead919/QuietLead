-- Remembers who already got the launch email, so the launch script never mails anyone twice.
alter table public.waitlist add column if not exists launch_sent_at timestamptz;
