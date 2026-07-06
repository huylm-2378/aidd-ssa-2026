-- F007_KudosData — Sun* Kudos schema (Supabase / Postgres public schema)
-- Run this FIRST in Supabase Dashboard → SQL Editor, then run supabase/seed.sql.
-- Idempotent where practical so re-running is safe.

-- ============================================================================
-- Tables
-- ============================================================================

-- People who send/receive Kudos (also backs the recipient autocomplete).
create table if not exists public.sunners (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  role_code   text        not null,
  tier        text        not null default 'New Hero',
  department  text        not null default 'CEVC',
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- A recognition/thanks message. hashtags/image_urls kept as arrays (KISS —
-- no join tables at this scope). department is denormalized for cheap filtering.
create table if not exists public.kudos (
  id            uuid primary key default gen_random_uuid(),
  sender_id     uuid references public.sunners(id) on delete set null,
  receiver_id   uuid references public.sunners(id) on delete set null,
  title         text        not null,
  body          text        not null,
  hashtags      text[]      not null default '{}',
  image_urls    text[]      not null default '{}',
  department    text        not null default 'CEVC',
  like_count    integer     not null default 0,
  is_anonymous  boolean     not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists kudos_like_count_idx  on public.kudos (like_count desc);
create index if not exists kudos_created_at_idx   on public.kudos (created_at desc);
create index if not exists kudos_department_idx   on public.kudos (department);

-- "10 Sunner nhận quà mới nhất" sidebar list.
create table if not exists public.recent_gifts (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  note        text        not null,
  created_at  timestamptz not null default now()
);
create index if not exists recent_gifts_created_at_idx on public.recent_gifts (created_at desc);

-- Sidebar counters that are not derivable from kudos (Secret Box, personal
-- totals). Single-row table (id = 1) seeded with demo values.
create table if not exists public.kudos_stats (
  id                    integer primary key default 1,
  received              integer not null default 0,
  sent                  integer not null default 0,
  hearts                integer not null default 0,
  secret_box_opened     integer not null default 0,
  secret_box_unopened   integer not null default 0,
  constraint kudos_stats_singleton check (id = 1)
);

-- ============================================================================
-- Row-Level Security
-- ============================================================================
alter table public.sunners       enable row level security;
alter table public.kudos         enable row level security;
alter table public.recent_gifts  enable row level security;
alter table public.kudos_stats   enable row level security;

-- Public recognition wall: anyone (anon) may READ every board table.
drop policy if exists "public read sunners"      on public.sunners;
drop policy if exists "public read kudos"        on public.kudos;
drop policy if exists "public read recent_gifts" on public.recent_gifts;
drop policy if exists "public read kudos_stats"  on public.kudos_stats;

create policy "public read sunners"      on public.sunners      for select using (true);
create policy "public read kudos"        on public.kudos        for select using (true);
create policy "public read recent_gifts" on public.recent_gifts for select using (true);
create policy "public read kudos_stats"  on public.kudos_stats  for select using (true);

-- Composer submissions. DEMO-PERMISSIVE: anon INSERT allowed so "Gửi" works
-- without a login wall. PRODUCTION HARDENING: replace `with check (true)` with
-- `to authenticated with check (auth.role() = 'authenticated')` (F005 session
-- already exists) and gate the composer behind login.
drop policy if exists "demo insert kudos" on public.kudos;
create policy "demo insert kudos" on public.kudos for insert with check (true);
