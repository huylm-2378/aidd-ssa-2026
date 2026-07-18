# Phase 02 — DB Migration + open_secret_box() RPC (Track B)

**Track:** B · **Depends on:** none · **Parallel with:** Track A (no cross-track blockedBy)

## Context Links
- Spec: `spec/open-secret-box/technical-spec.md` (FR-004, FR-005, BR-001, BR-002, BR-003, ALG-001, DEC-001)
- Clarifications: `clarifications.md` (locked decisions 2, 3, 6)
- Research §3–4: `research/researcher-01-design-and-codebase-context.md`
- Patterns: `supabase/migrations/0005_sunners_auth_link.sql` (SECURITY DEFINER + pinned search_path),
  `supabase/migrations/0004_kudos_likes.sql` (RLS public SELECT, trigger-owned writes)

## Overview
- **Priority:** P1 · **Status:** pending
- New migration `supabase/migrations/0006_secret_box.sql`: `sunner_badges` table + RLS +
  `open_secret_box()` RPC. Applied manually by the operator (anon key only, no CLI).

## Key Insights
- Write path is the ONLY place a `sunner_badges` row is born → SECURITY DEFINER RPC owns it; no
  client INSERT/UPDATE/DELETE policy (BR-002).
- Entitlement re-derived server-side inside the RPC, in the same call as the insert → atomic, no
  check-then-write race (BR-001, BR-003).
- Idempotent, re-runnable (IF NOT EXISTS / CREATE OR REPLACE), matching 0004/0005 conventions.

## Requirements
- **Functional:** FR-004 (entitlement source), FR-005 (open path + weighted badge).
- **Rules:** BR-001 (floor-at-zero), BR-002 (anti-forgery/RLS), BR-003 (exactly one per open),
  ALG-001 (weighted 30/25/10/5/20/10), DEC-001 (gate at `unopened <= 0`).
- **Non-functional:** O(1) selection; idempotent apply; no service_role.

## Architecture
- **Data in:** `auth.uid()` (implicit, from RPC caller session). No client-supplied fields.
- **Transform:** resolve caller sunner via `sunners.auth_user_id`; compute `unopened` per BR-001;
  guard; weighted-random pick; INSERT.
- **Data out:** `{ badge_code text, remaining int }`.
- **Read source:** `SUM(kudos.like_count WHERE receiver_id = sunner)`, `COUNT(sunner_badges)`.

### SQL sketch
```sql
-- 0006_secret_box.sql — Open Secret Box: sunner_badges + open_secret_box() RPC.
-- Run in Supabase Dashboard -> SQL Editor AFTER 0001-0005 + seed. Idempotent.

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
-- No INSERT/UPDATE/DELETE policy: only open_secret_box() (security definer) ever writes (BR-002).

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

  select coalesce(sum(like_count), 0) into v_received
    from public.kudos where receiver_id = v_sunner_id;
  select count(*) into v_opened
    from public.sunner_badges where sunner_id = v_sunner_id;
  v_unopened := greatest(0, floor(v_received / 5.0)::int - v_opened);  -- BR-001

  if v_unopened <= 0 then
    raise exception 'no_boxes';                    -- DEC-001 / BR-003
  end if;

  r := random() * 100;                             -- ALG-001
  v_badge := case
    when r < 30 then 'STAY_GOLD'
    when r < 55 then 'FLOW_TO_HORIZON'
    when r < 65 then 'BEYOND_THE_BOUNDARY'
    when r < 70 then 'ROOT_FURTHER'
    when r < 90 then 'TOUCH_OF_LIGHT'
    else             'REVIVAL' end;

  insert into public.sunner_badges (sunner_id, badge_code)
    values (v_sunner_id, v_badge);

  return query select v_badge, v_unopened - 1;     -- BR-003: exactly one, remaining
end;
$$;
```

## Related Code Files
- **Create:** `supabase/migrations/0006_secret_box.sql`
- **Read for pattern:** `supabase/migrations/0004_kudos_likes.sql`, `supabase/migrations/0005_sunners_auth_link.sql`
- **Modify/Delete:** none.

## Implementation Steps
1. Author `0006_secret_box.sql` with the table, RLS, and RPC above (idempotent).
2. Add operator verification + rollback comment block (mirror 0005's trailer).
3. **Operator handoff:** ask the operator to paste `0006_secret_box.sql` into Dashboard → SQL
   Editor and run it (anon key can't apply DDL). Confirm success before phase-03 integration-tests.
4. Operator runs the verification queries below and reports counts back.

## Todo List
- [x] Table `sunner_badges` + CHECK on 6 codes + index
- [x] RLS: public SELECT only, no write policy
- [x] `open_secret_box()` SECURITY DEFINER, pinned search_path, weighted pick, atomic insert
- [x] Verification + rollback comment trailer
- [ ] Operator applies migration in Dashboard SQL Editor
- [ ] Distribution spot-check (verification query) reported back

## Success Criteria
- SC-002: one call while entitled → exactly one new row, `remaining` = prior − 1.
- SC-004: no client INSERT/UPDATE/DELETE path exists; RLS rejects direct writes.
- BR-001: `unopened` never negative.
- Distribution verified at DB level (not e2e) via a bulk-call query, roughly 30/25/10/5/20/10.

### Verification queries (operator runs after apply)
```sql
-- table + policy present
select tablename from pg_tables where tablename = 'sunner_badges';
select polname from pg_policies where tablename = 'sunner_badges';   -- expect only the SELECT policy
-- direct client write is denied (run as anon/authenticated): should error / 0 rows
-- distribution sanity (run in a throwaway tx, then rollback):
--   begin;
--   -- seed one sunner with plenty of hearts, then loop open_secret_box() N times;
--   -- select badge_code, count(*) from sunner_badges group by 1;  -- ~30/25/10/5/20/10
--   rollback;
```

## Risk Assessment
- **Wrong weight bands (Med likelihood / High impact):** off-by-one cumulative band silently skews
  odds. Countermove: bands transcribed verbatim from ALG-001; DB distribution spot-check before sign-off.
- **RLS leaves a write hole (Low / High):** an accidental INSERT policy. Countermove: policy list
  asserted in verification query — SELECT only.
- **`floor(v_received / 5.0)` integer cast (Low / Med):** ensure `5.0` (numeric) then `::int` floor.

## Security Considerations
- Anon key only; no service_role. RPC is the sole writer (BR-002). `search_path` pinned to public
  to block search-path hijack. `auth.uid()` is the only identity source — client sends nothing.

## Rollback
```sql
drop function if exists public.open_secret_box();
drop table if exists public.sunner_badges;   -- CASCADE not needed; only this feature reads it
```

## Next Steps
- Unblocks phase-03 (server read helper + action call this RPC).
