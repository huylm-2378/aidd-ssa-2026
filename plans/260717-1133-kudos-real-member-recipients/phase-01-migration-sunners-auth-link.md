# Phase 01 — Migration: sunners ↔ auth.users link + first-login trigger + backfill

## Context Links

- Spec: `spec/F007_KudosData/technical-spec.md` → **FR-009, FR-010**, SC-006, SC-007, SC-010
- Research: `plans/reports/researcher-260717-kudos-recipients-google-members.md` (§Recommendations, SQL sketch)
- Precedent: `supabase/migrations/0004_kudos_likes.sql` (SECURITY DEFINER + `set search_path`)
- Prior RLS/schema: `0001_kudos_schema.sql` (sunners columns), `0002_kudos_sender_identity.sql`

## Overview

- **Priority:** P1 · **Status:** complete (code) — awaiting operator apply via Dashboard SQL Editor
- Deliver a single idempotent SQL migration that (1) adds `sunners.auth_user_id`, (2) creates a
  non-blocking first-login trigger on `auth.users`, (3) backfills members who logged in earlier.
  **No app code in this phase.** File is applied by the operator via Dashboard SQL Editor.

## Key Insights

- Trigger runs SECURITY DEFINER (as table owner) → bypasses `sunners` RLS, so **no anon INSERT
  policy is needed** on `sunners`. Public SELECT stays untouched (decision 2).
- `sunners.name`/`role_code` are `NOT NULL`; `tier`/`department` default `'New Hero'`/`'CEVC'`.
  Trigger supplies name via COALESCE(...→ email) so `name` is never NULL; role_code `'SUN'`.
- `auth_user_id UNIQUE` on a nullable column: Postgres permits many NULLs → the 62 seed rows are
  fine; `ON CONFLICT (auth_user_id)` targets the real UNIQUE index.
- Email is used **only** as a name fallback — it is **never stored as a column** (decision 2).
- Duplicate names accepted (decision 3): no name uniqueness, no merge logic.

## Requirements

- **FR-009:** `auth_user_id uuid UNIQUE NULL REFERENCES auth.users(id) ON DELETE SET NULL`; trigger
  `on_auth_user_created` AFTER INSERT ON `auth.users` → `public.handle_new_member()` (SECURITY
  DEFINER, `set search_path = public`, `EXCEPTION WHEN OTHERS THEN RETURN NEW`), inserts a sunner
  with name/avatar from `raw_user_meta_data` COALESCE chains, defaults `SUN`/`New Hero`/`CEVC`,
  `ON CONFLICT (auth_user_id) DO NOTHING`.
- **FR-010:** Backfill `INSERT…SELECT` over `auth.users` lacking a linked sunner; idempotent.

## Architecture

Data flow: Google login (F005) → row inserted into `auth.users` → AFTER INSERT trigger fires →
`handle_new_member()` inserts one `public.sunners` row carrying `auth_user_id = new.id`. On any
error the EXCEPTION guard returns `new` so the auth insert (signup) always commits. Existing readers
(`getSunnerOptions`, spotlight roster, `KUDO_SELECT` join) pick up the new rows with zero change.

## Related Code Files

- **Create:** `supabase/migrations/0005_sunners_auth_link.sql`
- **Read for context (no change):** `0001_kudos_schema.sql`, `0004_kudos_likes.sql`

## Implementation Steps

1. Header comment: purpose, "Run in Dashboard → SQL Editor after 0001–0004 + seed", "Idempotent".
2. `alter table public.sunners add column if not exists auth_user_id uuid unique references auth.users(id) on delete set null;`
3. `create or replace function public.handle_new_member()` — body per FR-009 (COALESCE full_name →
   name → email for name; COALESCE avatar_url → picture for avatar; defaults; `on conflict
   (auth_user_id) do nothing`; `exception when others then return new`).
4. `drop trigger if exists on_auth_user_created on auth.users;` then `create trigger … after insert
   on auth.users for each row execute function public.handle_new_member();`
5. Backfill statement (FR-010): `insert … select … from auth.users u where not exists (select 1
   from public.sunners s where s.auth_user_id = u.id);`
6. Append an **Operator Handoff** comment block with the verification queries below.

```sql
-- Verification (run after apply):
-- SC-006/SC-007: linked rows exist
select count(*) from public.sunners where auth_user_id is not null;
-- No seed row was mutated (still 62 NULL-linked)
select count(*) from public.sunners where auth_user_id is null;  -- expect 62
-- Trigger present
select tgname from pg_trigger where tgname = 'on_auth_user_created';
```

## Todo List

- [x] Write `0005_sunners_auth_link.sql` (column + function + trigger + backfill + handoff comment)
- [x] Confirm idempotency: every statement uses `if not exists` / `create or replace` /
      `drop … if exists` / `on conflict` / `where not exists`
- [ ] Hand file to operator with apply + verification instructions (Dashboard SQL Editor)

## Success Criteria

- SC-006: fresh Google login creates a matching `sunners` row (verified live in phase 04).
- SC-007: pre-existing members appear after the backfill statement.
- SC-010: EXCEPTION guard present — reviewed as code; a failing trigger can never block signup.
- File re-runs cleanly with no error (idempotent).

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Trigger error blocks ALL signups | Low | **High** | Keep function trivial; `EXCEPTION WHEN OTHERS THEN RETURN NEW`; verify trigger present post-apply |
| Trigger errors silently swallowed (guard hides bugs) | Med | Med | Function kept minimal; verification queries confirm rows actually appear (SC-006/007) |
| Backfill double-inserts on re-run | Low | Med | `where not exists` + `on conflict do nothing` → idempotent |
| Missing `search_path` → schema-resolution failure | Low | High | `set search_path = public` (matches 0004 precedent) |

## Security Considerations

- SECURITY DEFINER + pinned `set search_path = public` (no search-path hijack).
- No email column added; no service_role; DDL applied under Dashboard postgres role only.
- `sunners` public SELECT unchanged (decision 2) — real names/avatars readable by anon, accepted.

## Next Steps

- Operator applies the file (manual gate). Phase 04 runs live verification (SC-006..SC-009) after.
- Rollback: `drop trigger on_auth_user_created on auth.users; drop function
  public.handle_new_member(); alter table public.sunners drop column auth_user_id;` — seed rows and
  all other tables untouched.
