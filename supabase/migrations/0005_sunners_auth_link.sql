-- 0005_sunners_auth_link.sql — F007 revision (FR-009/FR-010)
-- Members who log in via Google (F005) become Kudo recipients: link public.sunners
-- to auth.users, auto-create a sunner row on first login, backfill earlier logins.
--
-- Run in Supabase Dashboard -> SQL Editor AFTER 0001-0004 + seed.sql.
-- Idempotent: safe to re-run (IF NOT EXISTS / CREATE OR REPLACE / ON CONFLICT / WHERE NOT EXISTS).
-- Requires Dashboard privileges (postgres) — creates a trigger on auth.users.

-- 1) Link column. UNIQUE on a nullable column: seed rows keep NULL (many NULLs allowed);
--    the unique index also backs ON CONFLICT (auth_user_id) below.
alter table public.sunners
  add column if not exists auth_user_id uuid unique references auth.users(id) on delete set null;

-- 2) First-login trigger. SECURITY DEFINER (bypasses sunners RLS as table owner — no INSERT
--    policy needed) with a pinned search_path (precedent: kudo_likes_count_sync, 0004).
--    Body stays trivial and the EXCEPTION guard returns NEW on any error: a failing trigger
--    on auth.users would otherwise block ALL signups (SC-010).
--    Email is used ONLY as a last-resort display-name fallback — it is never stored as a column.
create or replace function public.handle_new_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.sunners (name, role_code, tier, department, avatar_url, auth_user_id)
  values (
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
    'SUN',
    'New Hero',
    'CEVC',
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    new.id
  )
  on conflict (auth_user_id) do nothing;
  return new;
exception
  when others then
    return new; -- never block a signup (SC-010)
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_member();

-- 3) Backfill members who logged in before this migration existed (FR-010). Idempotent.
insert into public.sunners (name, role_code, tier, department, avatar_url, auth_user_id)
select
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', u.email),
  'SUN',
  'New Hero',
  'CEVC',
  coalesce(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
  u.id
from auth.users u
where not exists (select 1 from public.sunners s where s.auth_user_id = u.id)
on conflict (auth_user_id) do nothing;

-- ---------------------------------------------------------------------------
-- Operator verification (run after apply):
--   -- SC-006/SC-007: linked member rows exist (one per auth user)
--   select count(*) from public.sunners where auth_user_id is not null;
--   -- Seed rows untouched (still exactly the seeded, NULL-linked set)
--   select count(*) from public.sunners where auth_user_id is null;  -- expect 62
--   -- Trigger present
--   select tgname from pg_trigger where tgname = 'on_auth_user_created';
--
-- Rollback:
--   drop trigger if exists on_auth_user_created on auth.users;
--   drop function if exists public.handle_new_member();
--   alter table public.sunners drop column if exists auth_user_id;
-- ---------------------------------------------------------------------------
