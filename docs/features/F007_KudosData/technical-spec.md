---
status: implemented
authored_by: takumi
created: 2026-07-06
lang: en
fcode: F007
---

# F007_KudosData

**Priority**: P1
**Type**: data / backend

## Overview

Make the Sun* Kudos screen (F003) **data-driven from Supabase** instead of static TS mocks, and make
the "Viết Kudo" composer (F006) **persist** a new Kudo that then appears in the feed. Introduces a
Postgres schema (Supabase) with seed sample data, a server-side data-access layer, and a Server Action
for creating Kudos. Reuses the existing Supabase clients from F005 (`app/_lib/supabase/*`).

**Environment constraint (hard):** this workspace has only the Supabase **anon key** — no service-role
key, no CLI, no psql. Therefore **DDL + seed are delivered as SQL files the user runs in the Supabase
Dashboard → SQL Editor** (`supabase/migrations/*.sql` + `supabase/seed.sql`). All app code is written
and typechecked here; end-to-end verification runs against the live DB **after** the user applies the SQL.

> **Revision (2026-07-17, plan `260717-1133-kudos-real-member-recipients`):** members who log in via
> Google (F005) become first-class Kudo recipients, mixed into the same directory as the seeded
> sunners — `sunners.auth_user_id` links to `auth.users`, a non-blocking first-login trigger
> auto-creates a sunner row, and a backfill covers earlier logins (FR-009/FR-010). `createKudo` now
> also sets `sender_id` via that link (FR-011). Live activation requires the operator to apply
> `supabase/migrations/0005_sunners_auth_link.sql` in the Dashboard SQL Editor.

## Requirements

| Code | Description | Handler | Verifiable |
|------|-------------|---------|------------|
| FR-001 | Define schema: `sunners`, `kudos` (with `hashtags text[]`, `image_urls text[]`, `department`, `like_count`, `is_anonymous`, `created_at`, sender/receiver FKs), plus small `recent_gifts` + `secret_box_stats` (or a `kudos_stats` view) to back the sidebar | `supabase/migrations/0001_kudos_schema.sql` | yes |
| FR-002 | Enable RLS; public (anon) **SELECT** on all read tables (public board); **INSERT** on `kudos` restricted to `authenticated` (migration `0002`) — a Kudo must have a real sender | migration RLS policies | yes |
| FR-002a | Sender of a Kudo is the **logged-in user**: `createKudo` reads `auth.getUser()` (refuses without a session) and denormalizes `sender_name`/`sender_avatar` from the user metadata; the composer surfaces the "cần đăng nhập" error | `app/sun-kudos/actions.ts` + migration `0002` | yes |
| FR-003 | Seed sample data: ≥9 sunners (from `SUNNER_OPTIONS`), ≥8 kudos across departments/hashtags/like counts, 10 recent-gift rows, spotlight-supporting rows, stats | `supabase/seed.sql` | yes |
| FR-004 | Server data-access module: typed query fns — `getHighlightKudos` (top-5 by like_count), `getAllKudos` (recent), `getSpotlight` (count + names), `getSidebarStats`, `getRecentGifts`, `getSunnerOptions`, with optional `{hashtag, department}` filter | `app/_lib/kudos/queries.ts` (+ `types.ts`) | yes |
| FR-005 | `/sun-kudos` page fetches from Supabase (Server Component) and passes data into the existing section components; on DB error, render a safe empty/fallback state (no crash) | `app/sun-kudos/page.tsx` + sections | yes |
| FR-006 | Highlight filters (hashtag/phòng ban) drive the query (server round-trip via searchParams, or client fetch) so filtering reflects real data | `highlight-kudos-section.tsx` + query | yes |
| FR-007 | "Viết Kudo" Gửi calls a Server Action that inserts a Kudo (recipient, title, body, hashtags, images, anonymous) and it appears in All Kudos on refresh/revalidate | `app/sun-kudos/actions.ts` + `write-kudo-modal.tsx` | yes |
| FR-008 | Types stay single-sourced: the DB row types map cleanly to the existing `KudoCard` shape so section components need minimal change | `app/_lib/kudos/types.ts` | yes |
| FR-009 | `sunners.auth_user_id uuid UNIQUE NULL REFERENCES auth.users(id) ON DELETE SET NULL`; trigger `on_auth_user_created` AFTER INSERT ON `auth.users` runs `public.handle_new_member()` (SECURITY DEFINER, `set search_path = public`, `EXCEPTION WHEN OTHERS THEN RETURN NEW` — signups are never blocked) inserting a sunner with name = COALESCE(`raw_user_meta_data->>'full_name'`, `->>'name'`, email), avatar = COALESCE(`->>'avatar_url'`, `->>'picture'`), defaults `role_code='SUN'`, `tier='New Hero'`, `department='CEVC'`, `ON CONFLICT (auth_user_id) DO NOTHING` | `supabase/migrations/0005_sunners_auth_link.sql` | yes |
| FR-010 | Backfill: same INSERT…SELECT over existing `auth.users` rows lacking a linked sunner (idempotent) | same migration | yes |
| FR-011 | `createKudo` resolves the caller's sunner row (`sunners.id WHERE auth_user_id = user.id`) and sets `sender_id` on the insert; denormalized `sender_name`/`sender_avatar` stay as display fallback; lookup miss → `sender_id` NULL, submit never fails | `app/sun-kudos/actions.ts` | yes |
| FR-012 | Recipient options stay `getSunnerOptions()`/`useSunnerOptions` over `sunners` unfiltered — real members appear automatically (mixed directory, locked decision); no email rendered anywhere | `app/_lib/kudos/queries.ts` (no change) | yes |
| FR-013 | Doc drift fixes: (a) this spec's Assumptions correction (below); (b) F006 FR-005 "mock Sunner list" wording; (c) `docs/system/architecture.md` + `permissions.md` gain the auth link + trigger | docs | yes |

> **Note (2026-07-09):** FR-003's "(from `SUNNER_OPTIONS`)" points at a mock list that no longer exists
> in code — it was deleted from `write-kudo-content.ts` in a bugfix after its fake ids broke
> `createKudo`'s uuid `receiver_id` insert. `supabase/seed.sql`'s seeded rows are unaffected; only that
> parenthetical's source reference is stale. See `F006_WriteKudo/technical-spec.md`'s Key entities note.

## Key entities (DB)

- `sunners(id uuid pk, name, role_code, tier, department, avatar_url, created_at, auth_user_id uuid UNIQUE NULL → auth.users(id) ON DELETE SET NULL)` — `auth_user_id` NULL for the 62 seed rows; set for real Google members (trigger/backfill). Email is **never stored**.
- `kudos(id uuid pk, sender_id fk, receiver_id fk, title, body, hashtags text[], image_urls text[], department, like_count int, is_anonymous bool, created_at)`
- `recent_gifts(id, sunner_id fk|name, note, created_at)` — backs "10 Sunner nhận quà mới nhất"
- `secret_box_stats` (or seeded `kudos_stats`) — backs the sidebar counters not derivable from `kudos`
- Derived: spotlight count = `count(kudos)`; spotlight names = receiver names; sidebar received/sent/likes = aggregates where sensible.

## Success criteria

- SC-001: After the user runs the two SQL files, `/sun-kudos` renders all 6 features from live Supabase data (no static-mock reads remain for the board).
- SC-002: Selecting a hashtag/department filter changes the Highlight results based on DB rows.
- SC-003: Submitting the composer inserts a row; the new Kudo shows in All Kudos after revalidate/refresh.
- SC-004: With the DB unreachable or empty, the page renders a graceful fallback (no runtime crash).
- SC-005: `npx tsc`, lint, and unit tests for the query/mapping layer pass; existing e2e stay green (adapted to data-driven rendering).
- SC-006: after `0005` is applied, a fresh Google login creates a matching `sunners` row (name+avatar from metadata) and the member appears in the composer's recipient list.
- SC-007: members who logged in before `0005` appear after the backfill.
- SC-008: a Kudo submitted while logged in carries `sender_id` = the caller's sunner id; card rendering unchanged.
- SC-009: seeded flows unaffected — NULL-linked sunners behave exactly as before.
- SC-010: a failing trigger can never block signup (EXCEPTION guard — code-reviewed).
- SC-011: tsc/lint/vitest/build pass; seed-guarded e2e unaffected.

## Assumptions

- **SQL-run handoff**: user applies `supabase/migrations/*.sql` + `supabase/seed.sql` via the Dashboard;
  agent verifies afterward via the anon key.
- **RLS**: public SELECT for the board is intended (public recognition wall) — including real member
  names/avatars once `0005` lands (accepted, locked decision 2026-07-17). Kudos INSERT is
  **`authenticated`-only since migration `0002`** and `createKudo` refuses without a session
  (FR-002a). *(An earlier revision of this spec described the INSERT policy as "demo-permissive
  (anon allowed)" — that state was superseded by `0002` and the wording corrected 2026-07-17.)*
- Arrays (`hashtags`, `image_urls`) over join tables — KISS for this scope.
- Image upload stays client-side object-URLs at the UI; only URLs/paths are stored (no real file storage/bucket in this scope).
- Sidebar "personal" stats are demo/global aggregates + seeded values (no per-user identity mapping yet).
- Static mock TS modules (`kudos-cards.ts`, `all-kudos-data.ts`, parts of `sun-kudos-content.ts`) are
  superseded for the board; copy-only constants (eyebrow, headings, placeholders) stay in content modules.

## Out of scope

- Real image/file storage (Supabase Storage bucket), ~~like/unlike interactions writing to DB~~ (delivered by F015_KudosHearts — `kudo_likes` table + `toggleHeart` action), Secret Box open flow, per-user auth-scoped stats, pagination/infinite scroll, realtime subscriptions.
- Auth-gating the composer *UI* (a login wall before opening it) — submit itself has required a
  session since `0002`/FR-002a; only the open-the-modal gate remains out of scope.
- Re-syncing member name/avatar on later logins; profile self-editing; merging seed sunners with
  same-named real members (kept as separate rows — locked decision); storing email in `sunners`.
