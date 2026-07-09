# F015: Per-User Heart Toggle (Thả Tim) — Concurrent Phases, useState Desync, and Toggle Semantics

**Date**: 2026-07-09 15:45
**Severity**: N/A (Shipped)
**Component**: Sun* Kudos / Like System
**Status**: Resolved (PR #20 sealed, 222/222 tests passing, 9 ACs met)

## What Happened

Shipped F015 — per-user heart toggle (thả tim) for kudo cards. Branch `feature/kudos-hearts`, commit 87755b4, PR #20 (https://github.com/huylm-2378/aidd-ssa-2026/pull/20). 28 files, +912/−47 LOC.

Full Takumi cycle with three concurrent parallel phases on file-disjoint sets:
- **P01**: Migration 0004 + toggleHeart server action (INSERT-first unique-violation catch).
- **P02**: getKudoLikes + like_count denormalization (SECURITY DEFINER trigger, RLS enforcement).
- **P03**: HeartButton UI component + i18n strings for sign-in prompt.

**Feature set:**
- **Database**: `kudo_likes` table with PK(kudo_id, user_id) — one like per user by construction. RLS: public SELECT, own INSERT, own DELETE, no UPDATE anywhere. like_count maintained ONLY by SECURITY DEFINER AFTER INSERT/DELETE triggers (search_path pinned, greatest(0) floor).
- **Server action**: toggleHeart inserts first (optimistic), catches unique-violation 23505 (means unlike), then deletes. No TOCTOU window. Returns {liked, likeCount}. Stable error codes (auth_required, unknown) following F014's composer pattern. Revalidates /sun-kudos + /profile.
- **Client**: HeartButton with useState optimistic ±1 and captured-prev rollback on error. Pending double-fire lock. aria-pressed + live count folded into aria-label. Inline translated sign-in prompt (copy from F014 messages catalog).
- **Inspection R1**: REWORK 7/10 — one High: useState(initialProp) desync across duplicate instances of the same kudo. Fixed with derive-state-during-render pattern (skip while pending). Re-inspected: SEALED 9/10, 0 critical.
- **Mid-delivery hotfix**: User reported composer FAB from homepage failed with Postgres `invalid input syntax for type uuid: "sunner-3"`. Root cause: recipient-select component defaulted to mock SUNNER_OPTIONS (fake ids) when FAB passed no server options. Fix: eradicated the mock class entirely. New useSunnerOptions hook client-fetches real sunners rows once on modal open (public-read RLS). Server-provided options short-circuit, homepage stays statically prerendered.
- **Final**: 222/222 tests (35 files), tsc/eslint/build clean, evidence gate SEALED.

## The Brutal Truth

This one was methodical and steady — no production fires, no late-night reversions. But it hit two hard edges worth naming.

First: the **useState desync hit exactly where it should have hurt most.** Highlight top-5 + All Kudos + Profile all render the same getAllKudos-hydrated object on one page. RevalidatePath's soft refresh updates props on mounted instances, but useState never resyncs — it trusts the initial prop forever. Caught in inspection, fixed mid-flight, re-inspected clean. The lesson stings because it's so obvious in hindsight: "same entity rendered in multiple places" is *the* red flag for useState(initialProp) bugs.

Second: **mock data as a latent bug class.** The composer had mock SUNNER_OPTIONS baked in as a fallback. Fine during development on localhost. User hits homepage FAB, passes no server options, and the component silently defaults to mock data (fake IDs). Query passes validation, hits the DB, Postgres rejects "sunner-3" as a UUID. The maddening part? The fix was obvious once found — eradicate the mock, not patch the call site — but it only surfaced because the user tested the real path.

## Technical Details

**toggleHeart semantics (INSERT-first + catch):**
```
try {
  INSERT INTO kudo_likes(kudo_id, user_id) VALUES (...)
  return {liked: true, likeCount: newCount}
} catch (err) {
  if (err.code === '23505') {  // unique violation → already liked
    DELETE FROM kudo_likes WHERE kudo_id = ... AND user_id = ...
    return {liked: false, likeCount: newCount}
  }
  throw err
}
```
No check-then-act race window. Unique constraint enforces single like per user in the database. The catch block distinguishes "already liked, now unlike" from other failures.

**like_count maintenance:**
Denormalized count lives in `kudos.like_count`. SECURITY DEFINER AFTER INSERT/DELETE triggers increment/decrement. Schema:
- Search path pinned to public schema (prevents injection).
- greatest(0, like_count ± 1) floors at zero (defensive against concurrent deletes).
- No UPDATE policy anywhere — client can never author a count. UI reconciles via server action return.

**useState desync fix:**
```javascript
const [liked, setLiked] = useState(initialLiked);
const [prevInitialLiked, setPrevInitialLiked] = useState(initialLiked);

if (prevInitialLiked !== initialLiked && !isPending) {
  setLiked(initialLiked);
  setPrevInitialLiked(initialLiked);
}
```
Derive state during render when props change (and we're not mid-optimistic-update). Skip while pending to preserve the optimistic ±1 until the server responds. Regression test confirms soft-refresh (revalidatePath) resyncs mounted instances.

**Composer mock-data eradication:**
Old path: RecipientSelect defaulted to `SUNNER_OPTIONS` (hardcoded array of {id: "sunner-1", ...}).
New path: useSunnerOptions hook runs once on modal open, client-fetches `SELECT id, name FROM sunners` (public RLS), populates real options. Server-side options (if provided) short-circuit the fetch. Homepage stays static (no server data fetch needed).

**Mid-delivery composer hotfix:**
- User reported: FAB → open composer → select recipient → submit → error "invalid input syntax for type uuid: \"sunner-3\"".
- Trace: recipient-select had no options passed from parent (FAB provides none). Component defaulted to SUNNER_OPTIONS. Query INSERT kudo(..., recipient_id: "sunner-3") → Postgres rejects.
- Fix: Remove SUNNER_OPTIONS constant entirely. New useSunnerOptions hook hydrates real sunners on modal open. Deployed, user re-tested, clean.

## What We Tried

1. **Check-then-act (SELECT before INSERT)**: Avoided. Race window between check and insert; unique constraint is cleaner.
2. **pessimistic lock (FOR UPDATE)**: Premature complexity; single INSERT-catch handles toggle semantics without locking.
3. **Client-side liked state from revalidatePath**: v.s. derive-during-render. First attempt: rely on props alone. Broke when soft-refresh updated props mid-optimistic-update. Switching to derived-state pattern fixed it.
4. **Mock-data with conditional fallback**: "If options not provided, use mock." User path exercise exposed the flaw. Eradicated.
5. **Server-side sunners fetch in FAB**: Would flip homepage from static to dynamic. Client fetch is cheaper (fewer builds, homepage stays prerendered).

## Root Cause Analysis

**useState desync** stems from a design quirk in React: useState(initialProp) is only called once on mount. If props change, useState doesn't re-initialize — it assumes the component owns the state. The bug surfaces when the same entity renders in multiple places (Highlight + All Kudos + Profile) and one instance's optimistic update doesn't propagate to siblings. The fix is explicit: check if initialProp changed during render (while not pending) and re-derive state. Not a React bug; an architectural pattern to teach.

**Mock-data bug** is a class, not an incident. Any component with a fallback default that feeds a DB write is a landmine. The recipe: 1) default to mock for "offline development," 2) ship with the default, 3) user exercises the real path, 4) invalid data hits the DB. Fix: kill the default, require real data (fetched or provided). Lesson is sharper: mock data at the boundary is hiding a missing dependency; resolve it upstream, don't patch it downstream.

**Composer integration** failed because the FAB didn't pass sunners to the composer modal. The modal patched itself with mock data instead of signaling a missing dependency. Proper fix: FAB either provides real options or uses the useSunnerOptions hook (requires modal to be a client component). We chose client fetch; FAB stays simple.

## Lessons Learned

1. **useState(initialProp) footgun surfaces precisely when the same entity renders in multiple lists on one page.** Check for this any time a denormalized count or liked-state renders in 2+ places. Fix: derive state during render when props change (and not mid-pending-update).

2. **INSERT-first + unique-violation catch beats check-then-act for toggle semantics.** No race window. Unique constraint is the single source of truth. Catch block tells you "already liked → unlike now."

3. **Mock-data defaults on components that feed DB writes are a latent bug class.** Eradicate the mock, don't patch the call site. Make the missing dependency explicit (hook, prop, or server fetch). User testing exposes these; don't wait.

4. **Count integrity belongs in the DB, not the client.** Triggers maintain like_count on INSERT/DELETE. The UI never authors counts; it only reconciles via server action return. Client optimism is allowed; authoritative reconciliation must come from the server.

5. **Client-side fetch on modal open (via hook) keeps the page static.** useSunnerOptions hook hydrates in useEffect. Server-provided options short-circuit. FAB can stay static (no server data dependency), homepage stays prerendered.

6. **Stable error codes from server actions matter.** toggleHeart returns auth_required / unknown (same pattern as F014 composer). Client translates error code to message. Unifies error handling across the feature.

## Next Steps

1. **Apply migration 0004** (Owner: Ops, Timeline: before feature flag rollout) — Database schema for kudo_likes table + triggers must be deployed to live Supabase. Called out in PR #20 body.

2. **Seed test data** (Owner: Ops, Timeline: concurrent with migration) — Insert test likes into kudo_likes to exercise triggers and verify like_count increments correctly in production.

3. **Feature flag rollout** (Owner: TBD, Timeline: after migration confirmed) — HeartButton is wired; ready to ship. No client-side kills needed. Monitor like_count accuracy in first 24h.

4. **Optional follow-ups (out of scope):**
   - Analytics: track like/unlike patterns by receiver (already instrumented via revalidate paths).
   - Batch updates: if like_count starts showing race conditions under heavy load, add advisory lock. Not observed yet; monitor.

---

**Metrics:** 222/222 tests passing, 28 files, +912/−47 LOC, 9 ACs met, 0 critical defects. Build clean. Commit 87755b4 on `feature/kudos-hearts` — PR #20 merged.
