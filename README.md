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

## Structure

- `app/page.tsx`: all landing page sections and copy
- `app/actions.ts`: waitlist server action
- `components/`: nav, hero mockup, waitlist form, scroll reveal
- `public/brand/`: logo files
