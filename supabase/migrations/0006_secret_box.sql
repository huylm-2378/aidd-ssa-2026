-- 0006_secret_box.sql — F016 Open Secret Box (FR-004/FR-005, BR-001..003, ALG-001, DEC-001)
-- Earned Secret Boxes: 5 hearts received = 1 box. Opening a box grants exactly one
-- weighted-random badge, decided and persisted server-side only.
--
-- Run in Supabase Dashboard -> SQL Editor AFTER 0001-0005 + seed.sql.
-- Idempotent: safe to re-run (IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS).

-- 1) Badge grants. One row per opened box. Public read (board/profile display);
--    NO client write policy — only open_secret_box() (SECURITY DEFINER) inserts (BR-002).
create table if not exists public.sunner_badges (
  id         uuid        primary key default gen_random_uuid(),
  sunner_id  uuid        not null references public.sunners(id) on delete cascade,
  badge_code text        not null check (badge_code in (
                 'STAY_GOLD','FLOW_TO_HORIZON','BEYOND_THE_BOUNDARY',
                 'ROOT_FURTHER','TOUCH_OF_LIGHT','REVIVAL')),
  created_at timestamptz not null default now()
);
create index if not exists sunner_badges_sunner_id_idx on public.sunner_badges (sunner_id);

alter table public.sunner_badges enable row level security;
drop policy if exists "public read sunner_badges" on public.sunner_badges;
create policy "public read sunner_badges" on public.sunner_badges
  for select using (true);

-- 2) Open one box. SECURITY DEFINER with pinned search_path (precedent: 0004/0005).
--    Entitlement is re-derived HERE, in the same transaction as the insert:
--      unopened = GREATEST(0, FLOOR(sum(like_count of received kudos) / 5) - opened)  (BR-001)
--    An advisory xact lock serializes concurrent calls per sunner so a double-click
--    can never grant two badges for one earned box (BR-003).
--    Errors are raised with stable codes the app maps to translated copy:
--      'auth_required' — no session, or no sunners row linked to auth.uid()
--      'no_boxes'      — entitlement is zero (DEC-001)
create or replace function public.open_secret_box()
returns table (badge_code text, remaining int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sunner_id uuid;
  v_received  int;
  v_opened    int;
  v_unopened  int;
  v_badge     text;
  r           double precision;
begin
  select id into v_sunner_id from public.sunners
    where auth_user_id = auth.uid();
  if v_sunner_id is null then
    raise exception 'auth_required';               -- FR-008 / US004
  end if;

  -- Serialize per-sunner: two in-flight opens must not both pass the gate below.
  perform pg_advisory_xact_lock(hashtext(v_sunner_id::text));

  select coalesce(sum(like_count), 0) into v_received
    from public.kudos where receiver_id = v_sunner_id;
  select count(*) into v_opened
    from public.sunner_badges sb where sb.sunner_id = v_sunner_id;
  v_unopened := greatest(0, floor(v_received / 5.0)::int - v_opened);  -- BR-001

  if v_unopened <= 0 then
    raise exception 'no_boxes';                    -- DEC-001
  end if;

  r := random() * 100;                             -- ALG-001: 30/25/10/5/20/10
  v_badge := case
    when r < 30 then 'STAY_GOLD'
    when r < 55 then 'FLOW_TO_HORIZON'
    when r < 65 then 'BEYOND_THE_BOUNDARY'
    when r < 70 then 'ROOT_FURTHER'
    when r < 90 then 'TOUCH_OF_LIGHT'
    else             'REVIVAL' end;

  insert into public.sunner_badges (sunner_id, badge_code)
    values (v_sunner_id, v_badge);

  return query select v_badge, v_unopened - 1;     -- BR-003: exactly one per call
end;
$$;

-- ---------------------------------------------------------------------------
-- Operator verification (run after apply):
--   -- Table + the single SELECT policy exist
--   select tablename from pg_tables where tablename = 'sunner_badges';
--   select polname, cmd from pg_policies where tablename = 'sunner_badges';  -- expect 1 row, cmd = SELECT
--   -- Function present
--   select proname from pg_proc where proname = 'open_secret_box';
--   -- Direct client write is denied (RLS, no insert policy) — as anon/authenticated this errors:
--   --   insert into public.sunner_badges (sunner_id, badge_code)
--   --     values ((select id from public.sunners limit 1), 'STAY_GOLD');
--   -- Distribution sanity (throwaway tx — needs a sunner with many hearts):
--   --   begin;
--   --   do $x$ begin for i in 1..200 loop begin perform public.open_secret_box(); exception when others then null; end; end loop; end $x$;
--   --   select badge_code, count(*) from public.sunner_badges group by 1 order by 2 desc;  -- ~30/25/20/10/10/5
--   --   rollback;
--
-- Rollback:
--   drop function if exists public.open_secret_box();
--   drop table if exists public.sunner_badges;
-- ---------------------------------------------------------------------------
