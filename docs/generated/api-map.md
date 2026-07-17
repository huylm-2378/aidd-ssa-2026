# API Map

**Project**: aidd-ssa-2026 (Sun* Annual Awards 2025 — Next.js 16 App Router)
**Generated**: 2026-07-17
**Sources**: `route-list.md` (route/action inventory), `behavior-logic.md` (BL### inventory — all 7 BL items are client-side UI hooks, none are request handlers)

> Note on BL### mapping: this app's Behavior Logic inventory contains zero backend handlers (see `behavior-logic.md` Cardinality Reconciliation Note — no cron/queue/pub-sub/webhook/middleware exists). No route or Server Action below has a matching BL### by design; each is mapped to its real handler file/function instead, per task instruction not to force-fit.

## API Map

### Auth

| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET | `/auth/callback` | `app/auth/callback/route.ts` `GET` (PKCE code exchange via `exchangeCodeForSession`) [UNMAPPED — no BL match; OAuth redirect target] | public (no session required to call; this route *creates* the session) |
| ALL | `/((?!_next/static\|_next/image\|favicon.ico\|.*\.(?:svg\|png\|jpg\|jpeg\|gif\|webp)$).*)` (proxy matcher) | `proxy.ts` `proxy()` → `updateSession()` (`app/_lib/supabase/middleware.ts`) [UNMAPPED — no BL match; refresh-only, does not gate/redirect] | public — refreshes Supabase auth cookie only, no access control |
| Server Action | `signOut()` | `app/auth/actions.ts` `signOut` [UNMAPPED — no BL match] | callable regardless of session state (no-op if already signed out) |

### Kudos

| Method | Path | Handler | Auth |
|--------|------|---------|------|
| Server Action | `createKudo(input)` | `app/sun-kudos/actions.ts` `createKudo` [UNMAPPED — no BL match; real write endpoint for kudo creation] | session required (server-side `supabase.auth.getUser()`); returns `{ ok: false, error: "auth_required" }` if absent |
| Server Action | `toggleHeart(kudoId)` | `app/sun-kudos/actions.ts` `toggleHeart` [UNMAPPED — no BL match; real write endpoint for like/unlike] | session required (server-side `supabase.auth.getUser()`); returns `auth_required` if absent |
| GET (page) | `/sun-kudos` | `app/sun-kudos/page.tsx` `SunKudosPage` [UNMAPPED — no BL match] | not gated at route level (page render); write actions above enforce session |

### Profile

| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET (page) | `/profile` | `app/profile/page.tsx` `ProfilePage` [UNMAPPED — no BL match] | not gated — renders for logged-out visitors too; `getCurrentUserIdentity()` fails safe to empty identity when `getUser()` returns no user (F009 fail-safe, FR-001) |

### Pages (static/content)

| Method | Path | Handler | Auth |
|--------|------|---------|------|
| GET (page) | `/` | `app/page.tsx` `HomePage` [UNMAPPED — no BL match] | public |
| GET (page) | `/login` | `app/login/page.tsx` `LoginPage` [UNMAPPED — no BL match] | public |
| GET (page) | `/prelaunch` | `app/prelaunch/page.tsx` `PrelaunchPage` [UNMAPPED — no BL match] | public |
| GET (page) | `/awards-information` | `app/awards-information/page.tsx` `AwardsInformationPage` [UNMAPPED — no BL match] | public |
| GET (page) | `/auth/auth-code-error` | `app/auth/auth-code-error/page.tsx` `AuthCodeErrorPage` [UNMAPPED — no BL match] | public — error-display target when `/auth/callback` fails |

## Background Jobs

**None** — no cron, queue-worker, scheduler, or backend background-job process exists in this codebase (confirmed by `behavior-logic.md` Cardinality Reconciliation Note: the only "scheduled-job"-typed BL item, BL002_CountdownRefreshTimer, is a client-side `setInterval` UI-refresh timer with no network/persistence side effect, explicitly not a true backend job).

Two DB-side automations exist instead (Postgres triggers, not application background jobs):

- **`kudo_likes_count_sync()`** — `SECURITY DEFINER` trigger function, fired by `kudo_likes_count_sync_ins`/`kudo_likes_count_sync_del` triggers (AFTER INSERT/DELETE on `public.kudo_likes`) — `supabase/migrations/0004_kudos_likes.sql`. Keeps the kudo's like count in sync on every like/unlike, server-side, transactional with the `toggleHeart` write.
- **`handle_new_member()`** — `SECURITY DEFINER` trigger function (pinned `search_path`, `EXCEPTION WHEN OTHERS THEN RETURN NEW` so signups are never blocked), fired by `on_auth_user_created` (AFTER INSERT on `auth.users`) — `supabase/migrations/0005_sunners_auth_link.sql`. Auto-creates a `sunners` row for each new Google-auth member with defaulted role/tier/department.

## Webhooks

**None** — no inbound webhook receiver route, outbound webhook dispatcher, or third-party callback endpoint exists anywhere in the codebase. The one realtime-adjacent mechanism, `use-kudos-realtime.ts` (Supabase Realtime `postgres_changes` subscription on `public.kudos`, channel `"kudos-live-board"`), is a client subscribing outward to Supabase's own realtime service — not a webhook the app receives or exposes (no retry/backoff either; degrades silently on `CHANNEL_ERROR`/`TIMED_OUT`).

## Summary

| Category | Count |
|----------|-------|
| Backend API Routes (route.ts) | 1 |
| Middleware/Proxy | 1 |
| Server Actions (real write endpoints) | 3 |
| Frontend Pages | 7 |
| Background Jobs (app-level) | 0 |
| DB-side triggers (automation, not jobs) | 2 |
| Webhooks | 0 |
| Routes/Actions with BL### match | 0 (by design — see note above) |

**Status:** DONE
**Summary:** Synthesized `api-map.md` from `route-list.md` (12 routes/actions/pages) + `behavior-logic.md` (7 BL items, all client-side UI hooks, none backend handlers). All 12 routes/actions mapped to real handler files/functions with `[UNMAPPED]` BL tags (accurate — no BL### fits, force-fitting was explicitly disallowed). Background Jobs section states none exist app-side, citing `kudo_likes_count_sync` (`supabase/migrations/0004_kudos_likes.sql`) and `handle_new_member` (`supabase/migrations/0005_sunners_auth_link.sql`) as DB-trigger automation instead. Webhooks section confirmed none, distinguishing the outbound Supabase Realtime subscription from an inbound webhook.
**Concerns/Blockers:** None. Preflight note: this is a code-archaeology synthesis task (join two existing artifacts), not a "weigh technology options" task — research/search-docs skills don't apply; stated per memory `rebuild-spec-data-model-synthesis.md`.
