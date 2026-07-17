# Permissions Matrix

**Project**: aidd-ssa-2026 (Sun* Annual Awards 2025)
**Generated**: 2026-07-17
**Analysis Scope**: `supabase/migrations/0001-0005` (RLS policies), `app/sun-kudos/actions.ts`, `app/auth/actions.ts`, `app/_lib/supabase/middleware.ts`, `app/profile/page.tsx`, `app/_components/homepage-saa/account-menu.tsx`. Corroborated (not sourced) against `docs/system/permissions.md`.

> **Raw PERM### matrix.** Machine-generated inventory of every permission item with full
> per-permission detail. The plain-language curated view lives at
> [permissions.md](permissions.md). This file is written FIRST; the curated view is derived from it.

**Code Format**: All codes follow `PERM###_NameSlug`.

## System shape (read before the index)

Two roles only, flat — **no RBAC**: `anonymous` (no Supabase session) and `authenticated` (any signed-in
Google-OAuth user via `auth.users`). There is no roles/tiers table, no admin, no ownership-beyond-like
model. Confirmed by `docs/system/permissions.md:26-29` ("No roles / permissions / tiers... No route
protection") and independently by code: `app/_lib/supabase/middleware.ts:4` ("Refresh-ONLY session
middleware... NOT route protection — there is no `if (!user) redirect(...)`") and `route-list.md:28`
("It does **not** gate/redirect any route; no page is protected by this proxy."). All 7 frontend pages
(`screen-list.md` SCR001-SCR007) render for both roles with zero server-side page-level auth guard —
verified by reading `app/profile/page.tsx:57-79` (renders with empty identity on no session, no redirect)
and the absence of any `redirect()`/`notFound()` call gated on `getUser()` across all `page.tsx` files in
scope.

Enforcement is exclusively at two other layers: (1) **Postgres RLS policies** on the four board tables +
`kudo_likes` (server-enforced, authoritative), and (2) **redundant app-level `getUser()` guards** inside
the two mutating Server Actions (defense-in-depth, not the actual authorization boundary — RLS is).

## Permissions Index

| Code | Name | Type | Enforced At |
|------|------|------|-------------|
| PERM001_CreateKudo | Create a Kudo (insert into `kudos`) | action-permission | RLS (`kudos` INSERT policy) + Server Action guard (`createKudo`) |
| PERM002_ToggleLike | Like / unlike a Kudo (insert/delete `kudo_likes`) | action-permission | RLS (`kudo_likes` INSERT/DELETE policies, `auth.uid() = user_id`) + Server Action guard (`toggleHeart`) |
| PERM003_SignOut | Sign out | action-permission | Server Action (`signOut`), no auth requirement — callable in any session state |
| PERM004_ViewOwnProfile | View `/profile` (own identity + own kudos context) | screen-permission | None (page renders unauthenticated; identity block fails-safe to empty) |
| PERM005_ReadBoardTables | Public SELECT on `sunners`/`kudos`/`recent_gifts`/`kudos_stats` | data-permission | RLS (`for select using (true)`, all four tables) |
| PERM006_ReadKudoLikes | Public SELECT on `kudo_likes` | data-permission | RLS (`for select using (true)`) |
| PERM007_AccountMenuAuthState | Header account-menu item set (Profile+Sign out vs Sign in) | screen-permission | Client-side only (`AccountMenu`), presentation, not enforced |

---

## PERM001_CreateKudo: Create a Kudo (insert into `kudos`)

**Type**: action-permission
**Enforced At**: RLS (`kudos` INSERT policy, `supabase/migrations/0002_kudos_sender_identity.sql:12-14`) + Server Action guard (`app/sun-kudos/actions.ts:56-60`)

### Description

Inserting a row into `public.kudos` (the Write-Kudo composer's submit action, `createKudo`). RLS is the
authoritative boundary: `0001_kudos_schema.sql:70-72` originally created a demo-permissive `with check
(true)` anon INSERT policy ("demo insert kudos"), then `0002_kudos_sender_identity.sql:12-14` explicitly
**drops** that policy and replaces it with `create policy "authenticated insert kudos" on public.kudos
for insert to authenticated with check (true)` — restricting INSERT to the `authenticated` Postgres role
only (comment at `0002_kudos_sender_identity.sql:8-10`: "Production hardening: only authenticated users
may create Kudos"). The app additionally re-checks in `createKudo()`: `supabase.auth.getUser()` must
resolve a user or the action short-circuits with `{ ok: false, error: "auth_required" }`
(`app/sun-kudos/actions.ts:56-60`) before ever attempting the insert — this app-level check is redundant
with RLS (both must independently reject an unauthenticated caller), not a separate authorization layer.
No ownership check beyond "any authenticated user may create for any receiver" — sender is always the
caller (`sender_id` resolved from the caller's own `sunners` row via `auth_user_id`,
`app/sun-kudos/actions.ts:70-76`), never client-supplied.

### Related Routes

- (Server Action) `createKudo` — ROUTE004 (`route-list.md:44`)

### Related Screens

- SCR004_SunKudosPage/REG002 — Hero + Search/Composer Entry (opens `WriteKudoModal`)
- SCR001_HomePage/REG001 — FloatingWidgetButton (also opens `WriteKudoModal`)

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| anonymous | ✗ | RLS rejects the INSERT (not `authenticated` role); app also short-circuits on `getUser()` returning no user |
| authenticated | ✓ | No further condition — any signed-in user may create a Kudo for any receiver; `receiverId`/`title`/`body`/≥1 hashtag required (validation, not authz) |

### Related Modules

- `WriteKudoModal` (`app/_components/sun-kudos/write-kudo-modal.tsx`)

---

## PERM002_ToggleLike: Like / unlike a Kudo (insert/delete `kudo_likes`)

**Type**: action-permission
**Enforced At**: RLS (`kudo_likes` INSERT/DELETE policies, `supabase/migrations/0004_kudos_likes.sql:16-21`) + Server Action guard (`app/sun-kudos/actions.ts:138-141`)

### Description

Ownership-scoped write: a user may only insert/delete their **own** `kudo_likes` row. RLS: `create policy
"own insert kudo_likes" on public.kudo_likes for insert to authenticated with check (auth.uid() =
user_id)` and the mirror `own delete kudo_likes ... using (auth.uid() = user_id)`
(`0004_kudos_likes.sql:16-21`) — this is `resource-ownership` behavior layered onto an `action-permission`
gate (the row's `user_id` must equal the caller's own `auth.uid()`; a caller cannot toggle on another
user's behalf even if they supplied a different `user_id`, because RLS re-derives `user_id` from
`auth.uid()` in the `check`/`using` clause, not from client input). The composite PK `(kudo_id, user_id)`
(`0004_kudos_likes.sql:8`) enforces "one like per user per kudo" as a side effect (see
`business-rules.md`), not a permission rule. App-level guard mirrors PERM001's pattern:
`supabase.auth.getUser()` must resolve or `toggleHeart()` returns `{ ok: false, error: "auth_required"
}` (`app/sun-kudos/actions.ts:138-141`) before any insert/delete attempt.

### Related Routes

- (Server Action) `toggleHeart` — ROUTE005 (`route-list.md:45`)

### Related Screens

- SCR004_SunKudosPage/REG005 — All Kudos Feed + Sidebar (`HeartButton` on every `KudoCard`)
- SCR003_ProfilePage — shares the same `KudoCard`/`HeartButton` component (per `screen-list.md:170`)

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| anonymous | ✗ | RLS rejects (not `authenticated` role); app short-circuits on no `getUser()` result |
| authenticated | ✓ | Only for rows where `user_id = auth.uid()` — cannot like/unlike on behalf of another user |

### Related Modules

- `HeartButton` (`app/_components/sun-kudos/heart-button.tsx`)

---

## PERM003_SignOut: Sign out

**Type**: action-permission
**Enforced At**: Server Action (`app/auth/actions.ts:9-14`), no auth requirement

### Description

`signOut()` calls `supabase.auth.signOut()` unconditionally — no `getUser()` guard, no error path for
"already signed out." Callable in either role's session state; a no-op if the caller had no session.
Comment confirms: "Callable regardless of session state (no-op if already signed out)"
(`route-list.md:38`).

### Related Routes

- (Server Action) `signOut` — ROUTE003 (`route-list.md:38`)

### Related Screens

- SCR001_HomePage — `AccountMenu` "Sign out" menu item (rendered only when `user` state is truthy, `app/_components/homepage-saa/account-menu.tsx:68-94`)

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| anonymous | ✓ | No-op (nothing to clear) — action itself has no guard, though the UI never exposes the trigger to this role |
| authenticated | ✓ | Clears session cookies, revalidates layout, redirects to `/` |

### Related Modules

- `AccountMenu` (`app/_components/homepage-saa/account-menu.tsx`)

---

## PERM004_ViewOwnProfile: View `/profile`

**Type**: screen-permission
**Enforced At**: None — no server-side page guard exists

### Description

`app/profile/page.tsx` has zero auth gate. `getCurrentUserIdentity()` calls `getUser()` and fails safe to
`{ name: "" }` on any error **or on a logged-out visitor** (`app/profile/page.tsx:32-45`, comment: "any
auth/network error — or a logged-out visitor — falls back to an empty identity rather than crashing the
page"). The page's other reads (`getAllKudos()`, `getSidebarStats()`) are RLS-backed public data (see
PERM005), identical for both roles. There is no concept of "not your profile" because there is no
per-user profile record beyond the live auth session read — an anonymous visitor sees the same page shell
with an empty identity block and stats/kudos identical to what an authenticated user would see (minus
their own name/avatar).

### Related Routes

- `/profile` (frontend page, no backend route entry — `route-list.md:61-67`)

### Related Screens

- SCR003_ProfilePage (`screen-list.md:102-133`)

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| anonymous | ✓ | Renders with empty identity block (no name/avatar); stats/kudos identical to authenticated view |
| authenticated | ✓ | Identity block populated from own `auth.getUser()` metadata; no other row-level distinction |

### Related Modules

- `ProfileIdentity`, `ProfileStats`, `ProfileKudosSection` (`app/_components/profile/`)

---

## PERM005_ReadBoardTables: Public SELECT on board tables

**Type**: data-permission
**Enforced At**: RLS (`supabase/migrations/0001_kudos_schema.sql:60-68`)

### Description

Four tables — `sunners`, `kudos`, `recent_gifts`, `kudos_stats` — each carry an identical `for select
using (true)` policy applied to every role (no `to authenticated`/`to anon` restriction on the SELECT
policies), making all board data world-readable without a session. This is the deliberate "public
recognition wall" design (`0001_kudos_schema.sql:62`: "Public recognition wall: anyone (anon) may READ
every board table.").

### Related Routes

- N/A (data-layer policy, consumed by multiple Server Component reads: `getAllKudos`, `getSpotlight`, `getSidebarStats`, `getRecentGifts`, `getSunnerOptions` — `route-list.md`/`screen-list.md` data-entity refs)

### Related Screens

- SCR001_HomePage, SCR003_ProfilePage, SCR004_SunKudosPage (all consume board-table reads)

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| anonymous | ✓ | Full SELECT, no restriction |
| authenticated | ✓ | Full SELECT, no restriction (identical to anonymous) |

### Related Modules

- `app/_lib/kudos/queries.ts` (query layer, not directly cited above — inferred consumer of these tables per screen-list Data Displayed entries)

---

## PERM006_ReadKudoLikes: Public SELECT on `kudo_likes`

**Type**: data-permission
**Enforced At**: RLS (`supabase/migrations/0004_kudos_likes.sql:13-15`)

### Description

`create policy "public read kudo_likes" on public.kudo_likes for select using (true)` — same
public-read pattern as PERM005, applied to the join table itself (not just the derived `like_count` on
`kudos`).

### Related Screens

- SCR004_SunKudosPage/REG005 (heart state per kudo per viewer, if ever read directly — the app currently
  reads `like_count` off `kudos`, not this table, per `app/sun-kudos/actions.ts:163-167`)

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| anonymous | ✓ | Full SELECT |
| authenticated | ✓ | Full SELECT |

### Related Modules

- N/A

---

## PERM007_AccountMenuAuthState: Header account-menu item set

**Type**: screen-permission
**Enforced At**: Client-side only — `app/_components/homepage-saa/account-menu.tsx:63-105`, not server-enforced

### Description

Purely presentational branch, not an authorization gate: `AccountMenu` reads the client-side Supabase
session (`supabase.auth.getUser()` + `onAuthStateChange`, lines 20-33) and renders either
{name/email row, Profile link, Sign-out form} when `user` is truthy, or a single Sign-in link when it is
not (lines 68-105). `docs/system/permissions.md:53-55` explicitly states this is presentation-only: "there
is no security trade-off: nothing is *authorized* on this identity. It only chooses which menu items to
show." Included here as a `screen-permission` item strictly because it is the one UI branch in the whole
app conditioned on auth state — it does not gate any route or protect any data; the underlying actions it
links to (`/profile`, `/login`, `signOut()`) are all independently reachable/callable regardless of what
the menu renders (PERM004's `/profile` has no gate; `/login` has none by nature; PERM003's `signOut` has
none).

### Permission Rules

| Role | Allow | Conditions |
|------|-------|------------|
| anonymous | ✓ (sees Sign-in link) | Menu content only, not enforcement |
| authenticated | ✓ (sees name/email, Profile, Sign out) | Menu content only, not enforcement |

### Related Modules

- `AccountMenu` (`app/_components/homepage-saa/account-menu.tsx`)

---

## Summary

- **Total Permission Items**: 7
- **By Type**: route-guard: 0, screen-permission: 2, action-permission: 3, data-permission: 2, role-based: 0, resource-ownership: 0 (folded into PERM002's action-permission description — no standalone ownership-only item exists), field-permission: 0, api-scope: 0, feature-flag: 0, experiment: 0, env-gate: 0, locale-gate: 0

### On the four client-side gate types (feature-flag / experiment / env-gate / locale-gate)

None found. Repo-wide check: no `useFlag`/`useFeature`/`isEnabled`/`featureFlag(`/`checkFlag` calls; no
`useExperiment`/`getVariant`/`abTest(` calls; the only `process.env.` reads outside the Supabase
URL/anon-key pair are `NEXT_PUBLIC_SAA_EVENT_START` (`app/_components/homepage-saa/hero.tsx:13`,
`app/prelaunch/countdown-row.tsx:19`) — a **countdown timestamp value**, not a boolean/environment
comparison gating a code branch, so it does not qualify as `env-gate` (no `if (process.env.X ===
...)` pattern exists for it). No `locale ===`/`currentLocale`/`i18n.locale` comparisons found anywhere in
`app/` (the i18n system swaps translation strings via a context provider, never branches component
selection on locale).

---

## Cross-Reference Validation

- [x] All PERM### codes are unique
- [ ] All PERM### codes are referenced in FeatureList.md (verified in Step 8) — **N/A this wave**: `feature-list.md` does not exist yet in this pipeline run
- [x] All related route references are valid (ROUTE003/004/005 exist in `route-list.md`)
- [x] All related screen references are valid (SCR001/SCR003/SCR004 and their REG### children exist in `screen-list.md`)
- [x] All related module references are valid
- [x] No orphaned permission references
