---
feature: F015_KudosHearts
title: Kudos Hearts (Thả tim — per-user like toggle)
lang: en
status: promoted
source_design:
  tool: MoMorph
  fileKey: 9ypp4enmFmdK3YAFJLIu6C
  note: Heart glyph already present on the kudo card (sun-kudos screen MaZUn5xHXZ); this feature makes it interactive. Filled/unfilled visual per state.
---

# F015 — Kudos Hearts (Thả tim)

## Summary

Make the heart on each kudo card real. Today `kudo-card.tsx` renders a heart
icon + `likeCount` as static display. F015 adds a **per-user like toggle**:
a signed-in Sunner taps the heart to like a kudo (once per kudo, enforced by
a `kudo_likes` join table), taps again to unlike. The count updates
**optimistically** with rollback on failure; other clients see fresh counts on
revalidation (no realtime extension). A signed-out user who taps the heart
gets an inline "sign in required" message — same `auth_required` error-code
pattern the composer uses (F014/`resolveComposerError` precedent).

## Confirmed decisions

- Toggle model (one heart per user per kudo, un-heart supported) — NOT a raw
  increment.
- Signed-out: button remains tappable; inline prompt to sign in; no redirect,
  no route gating (consistent with the app's zero-gated-routes posture).
- Propagation: optimistic local update + `revalidatePath` — realtime hearts
  explicitly out of scope.
- `kudos_stats.hearts` (sidebar/profile "Số tim bạn nhận được") stays the demo
  singleton — wiring it to real likes is a documented follow-up (needs
  per-user stats, out of scope).

## Functional Requirements

- **FR-001 — Schema**: New migration `supabase/migrations/0004_kudos_likes.sql`:
  `public.kudo_likes (kudo_id uuid references kudos(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(), primary key (kudo_id, user_id))`.
  RLS enabled: SELECT for all (anon+authenticated, consistent with board
  visibility), INSERT only where `auth.uid() = user_id`, DELETE only own row.
  No UPDATE policy on `kudo_likes` (rows are insert/delete only).
- **FR-002 — Count integrity**: `kudos.like_count` stays the denormalized
  read column the UI already uses. It is maintained **in the database** by
  `AFTER INSERT/DELETE` triggers on `kudo_likes` (security definer function),
  so no client/action can drift the count and no UPDATE policy on `kudos` is
  ever exposed to clients.
- **FR-003 — Server action `toggleHeart`**: In `app/sun-kudos/actions.ts`
  (or a sibling file if 200-line cap requires): input `kudoId`; flow mirrors
  `createKudo` — `auth.getUser()` → return `{ok:false, error:"auth_required"}`
  when signed out; otherwise INSERT the like, and on unique-violation DELETE it
  (toggle semantics); returns `{ok:true, liked:boolean, likeCount:number}`
  (fresh count read back) or a stable error code (`auth_required`/`unknown`).
  `revalidatePath("/sun-kudos")` and `revalidatePath("/profile")` on success.
- **FR-004 — likedByMe hydration**: Server queries that feed kudo lists
  (`getAllKudos`/highlight/profile getters in `app/_lib/kudos/queries.ts`)
  also fetch the current user's liked kudo ids (single `kudo_likes` SELECT by
  `user_id`, mapped into a `likedByMe: boolean` on each kudo row — extend
  `mapKudoRow`/types). Signed-out ⇒ `likedByMe: false` everywhere.
- **FR-005 — HeartButton component**: Extract the heart+count corner of
  `kudo-card.tsx` into `heart-button.tsx` (client): renders filled heart when
  `likedByMe`, outline otherwise; click → optimistic flip (±1 count) → call
  `toggleHeart` → reconcile with returned count; rollback + inline error on
  failure. Disabled-while-pending to prevent double-fire. Keyboard/AR11Y:
  real `<button>` with `aria-pressed` and translated label.
- **FR-006 — Signed-out prompt**: On `auth_required`, the optimistic flip
  rolls back and a small inline message (translated) appears near the button
  (auto-clears on next interaction). Reuses the F014 error-code mapping
  pattern (new `hearts.*` keys, NOT composer keys).
- **FR-007 — i18n**: New catalog keys in the kudos fragment (e.g.
  `hearts.like`, `hearts.unlike`, `hearts.signInRequired`, sr-only count
  label reuse `sunKudos.likeCountSr` if it exists). VI + EN.
- **FR-008 — No regression**: Cards without interaction changes (spotlight,
  carousels) keep rendering; existing kudo-card tests keep passing; signed-out
  browse experience unchanged except the new prompt on tap.

## Acceptance Criteria

- AC-1: Signed-in user taps heart → count +1 immediately, heart fills; row
  exists in `kudo_likes`; reload shows persisted state. Tap again → count −1,
  heart outlines, row deleted.
- AC-2: Double-tap/spam cannot create duplicate likes (PK constraint) nor
  negative counts (trigger-maintained).
- AC-3: Signed-out tap → no count change, inline sign-in prompt shown,
  auto-clears; no redirect.
- AC-4: `like_count` is maintained only by DB triggers — no client UPDATE
  path on `kudos` exists; concurrent likes from two users both count.
- AC-5: `likedByMe` hydrates correctly on sun-kudos (highlight + all) and
  profile lists for the signed-in user; false when signed out.
- AC-6: Optimistic rollback proven by test (action failure → count restored).
- AC-7: New strings translated VI/EN; `aria-pressed` reflects state.
- AC-8: Build + tsc + eslint clean; full suite green with new unit tests for
  toggle action mapping, HeartButton optimistic/rollback/signed-out, and
  likedByMe mapping.

## Non-functional / Constraints

- No new npm dependency; files <200 lines; kebab-case.
- Plain `useState`-based optimism (no `useOptimistic` — no codebase precedent;
  KISS) unless the planner argues otherwise with cause.
- Migration is authored in-repo; applying it to the live Supabase project is
  an ops step (psql/dashboard) recorded in the delivery notes — same flow as
  0001–0003.

## Out of scope

- Realtime heart updates across clients (revalidate-only).
- Wiring `kudos_stats.hearts` / per-user stats (documented follow-up).
- Hearting from the spotlight board/ticker; notification on receiving a heart.

## Delivery notes

- Rework fix (reviewer round 1): the shared `KudoCard`/`HeartButton` renders
  more than once for the same kudo at once (Highlight top-5, All Kudos,
  Profile Sent/Received can all show the same row). `HeartButton` now resyncs
  its local `liked`/`count` state from `initialLiked`/`initialCount` props
  whenever they change (derive-state-during-render, skipped mid-toggle) so a
  heart toggled in one instance doesn't go stale in another after
  `revalidatePath`'s soft refresh. Reviewer SEALED 9/10, 0 critical, after
  this one rework round.
- Ops step (unapplied): `supabase/migrations/0004_kudos_likes.sql` is authored
  in-repo but has **not** been applied to the live Supabase project yet — same
  manual Dashboard SQL Editor step as `0001`–`0003`. `kudo_likes`/the
  count-sync triggers don't exist in the live DB until an operator runs it.

## Unresolved Questions

- U1: MoMorph design's filled-heart state unverified (tool unavailable during
  study) — implementer falls back to filling the existing glyph with the
  established red `#d4271d`/current heart color; confirm visually later.
  **Resolved as shipped:** `heart-button.tsx` fills with `#d4271d` (both the
  filled and outline SVG paths use that color) — matches the fallback, not
  re-verified against MoMorph directly.
- U2: Whether `revalidatePath("/profile")` is needed depends on profile list
  reusing the same queries — planner confirms.
  **Resolved:** yes — `getAllKudos`/`getHighlightKudos` (shared by `/profile`)
  hydrate `likedByMe` too, so `toggleHeart` calls both
  `revalidatePath("/sun-kudos")` and `revalidatePath("/profile")`.
