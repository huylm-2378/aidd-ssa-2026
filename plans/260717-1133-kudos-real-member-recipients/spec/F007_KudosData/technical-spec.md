---
status: draft
authored_by: create-plan
created: 2026-07-17
revises: F007 (docs/features/F007_KudosData/technical-spec.md, status implemented)
lang: en
fcode: F007
---

# F007_KudosData — Revision: real Google-member recipients + sender FK

**Priority**: P1
**Type**: data / backend

## Overview (delta over implemented F007)

Extend the Kudos data layer so **members who have logged in via Google (F005) become first-class
Kudo recipients**, mixed into the same directory as the seeded sunners. Mechanism: link
`public.sunners` to `auth.users` via a new nullable `auth_user_id` column, auto-create a sunner row
on first Google login (DB trigger on `auth.users`, non-blocking), and backfill members who logged in
before the trigger existed. Simultaneously close the known sender gap: `createKudo` starts setting
`sender_id` (FK) by looking up the caller's own sunner row, instead of only denormalized
`sender_name`/`sender_avatar`. Also corrects two stale spec statements (doc drift): F007's "anon
insert allowed" assumption (superseded by migration `0002` + `actions.ts`) and F006 FR-005's "mock
Sunner list" wording (recipients are DB-driven since the 2026-07-09 bugfix).

Decisions locked with the user (2026-07-17):
1. Recipient list = seed sunners + real members **mixed** — no `auth_user_id` filter.
2. `sunners` RLS SELECT stays public (`using(true)`); accepted that real names/avatars are readable
   with the anon key. **Email is never stored** in `sunners` (used only as a last-resort name fallback).
3. A seed sunner sharing a real member's name: keep both rows.
4. Doc drift fixed in the same delivery.

**Environment constraint (unchanged, hard):** anon key only — DDL ships as
`supabase/migrations/0005_sunners_auth_link.sql` applied by the user via Dashboard → SQL Editor.

## Requirements (delta — FR-001..FR-008 unchanged from implemented spec)

| Code | Description | Handler | Verifiable |
|------|-------------|---------|------------|
| FR-009 | `sunners.auth_user_id uuid UNIQUE NULL REFERENCES auth.users(id) ON DELETE SET NULL`; trigger `on_auth_user_created` AFTER INSERT ON `auth.users` runs `public.handle_new_member()` (SECURITY DEFINER, `set search_path = public`, `EXCEPTION WHEN OTHERS THEN RETURN NEW` so signups are never blocked) inserting a sunner with name = COALESCE(`raw_user_meta_data->>'full_name'`, `->>'name'`, email), avatar = COALESCE(`->>'avatar_url'`, `->>'picture'`), defaults `role_code='SUN'`, `tier='New Hero'`, `department='CEVC'`, `ON CONFLICT (auth_user_id) DO NOTHING` | `supabase/migrations/0005_sunners_auth_link.sql` | yes |
| FR-010 | Backfill: same INSERT…SELECT over existing `auth.users` rows lacking a linked sunner (idempotent) | same migration (statement 3) | yes |
| FR-011 | `createKudo` resolves the caller's sunner row (`sunners.id WHERE auth_user_id = user.id`) and sets `sender_id` on the insert; denormalized `sender_name`/`sender_avatar` stay as the display fallback (precedence already handled by `mapKudoRow`). Lookup miss (member logged in but trigger/backfill not yet applied) → keep current behavior (`sender_id` NULL), never fail the submit | `app/sun-kudos/actions.ts` | yes |
| FR-012 | Recipient options remain `getSunnerOptions()` / `useSunnerOptions` over `sunners` unfiltered — real members appear automatically once their row exists; **no query change** (decision 1). Guard: recipient select must not render email anywhere | `app/_lib/kudos/queries.ts` (no change), `recipient-select.tsx` (no change) | yes |
| FR-013 | Doc drift fixes: (a) promoted F007 Assumptions — replace "INSERT … demo-permissive (anon allowed)" with the actual `0002` authenticated-only policy + FR-002a behavior; (b) F006 FR-005 — replace "mock Sunner list" with DB-driven recipients wording; (c) `docs/system/architecture.md` + `docs/system/permissions.md` gain the auth_user_id link + trigger | docs | yes |

## Key entities (delta)

- `sunners` += `auth_user_id uuid UNIQUE NULL → auth.users(id) ON DELETE SET NULL` (partial unique
  index implied by UNIQUE on nullable column — multiple NULLs fine for the 62 seed rows).
- `public.handle_new_member()` — the second SECURITY DEFINER function in the schema (pattern
  precedent: `kudo_likes_count_sync`, migration `0004`).
- `kudos.sender_id` — now populated for new user-submitted kudos (was always NULL for them).

## Success criteria

- SC-006: After the user applies `0005` in the Dashboard, a **fresh Google login** creates a
  matching `sunners` row (name + avatar from Google metadata) — verifiable by querying `sunners
  WHERE auth_user_id IS NOT NULL` and by the member appearing in the composer's recipient list.
- SC-007: Members who logged in **before** `0005` appear after the backfill statement (same query).
- SC-008: A Kudo submitted while logged in carries `sender_id` = the caller's sunner id (verify via
  select), and the card still renders sender name/avatar as before.
- SC-009: Existing flows unaffected: seeded recipients still selectable, spotlight/all-kudos/hearts
  render unchanged, `sunners` rows with NULL `auth_user_id` behave exactly as today.
- SC-010: A failing trigger can never block signup (EXCEPTION guard) — reviewed as code, not tested live.
- SC-011: tsc, lint, vitest pass; e2e stays green (seed-guarded tests unaffected — no seeded
  expectations change).

## Assumptions (delta / corrections)

- **[Corrects implemented spec]** Kudos INSERT has been `authenticated`-only since migration `0002`;
  `createKudo` refuses without a session (FR-002a). The old "demo-permissive (anon allowed)" note
  described a superseded state.
- Trigger + backfill run under Dashboard SQL Editor privileges (postgres) — sufficient for DDL on
  `auth.users` triggers.
- Google metadata provides no `role_code`/`tier`/`department` → static defaults; editing a member's
  department/tier later is out of scope (manual SQL if needed).
- Name/avatar are captured at first login and NOT re-synced on later logins (YAGNI; a future
  `AFTER UPDATE OF raw_user_meta_data` trigger or callback-route upsert can add sync).

## Out of scope

- Re-syncing name/avatar on subsequent logins; profile self-editing.
- Tightening `sunners` SELECT RLS (decision 2 keeps public read).
- Merging/deduping seed sunners vs real members (decision 3 keeps both).
- Storing email in `sunners`; any per-user personal-stats mapping; notification on receiving a Kudo.
