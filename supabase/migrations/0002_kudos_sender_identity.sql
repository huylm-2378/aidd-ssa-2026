-- F007 fix — attribute Kudo sender to the logged-in user.
-- Run in Supabase Dashboard → SQL Editor (after 0001 + seed). Idempotent.

-- Denormalized sender identity for user-created Kudos. Seeded rows leave these
-- NULL and keep using the sunners FK (sender_id); user submissions fill these
-- from the authenticated Supabase user (auth.users metadata).
alter table public.kudos add column if not exists sender_name   text;
alter table public.kudos add column if not exists sender_avatar text;

-- Production hardening: only authenticated users may create Kudos (a Kudo must
-- have a real sender). Replaces the demo-permissive anon INSERT policy. The
-- Server Action also carries the user's session, so authenticated inserts pass.
drop policy if exists "demo insert kudos"          on public.kudos;
drop policy if exists "authenticated insert kudos" on public.kudos;
create policy "authenticated insert kudos" on public.kudos
  for insert to authenticated with check (true);
