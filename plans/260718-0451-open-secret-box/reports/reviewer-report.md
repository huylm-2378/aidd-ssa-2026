# Code Review Summary — F016 Open Secret Box

## Scope
- Files: `supabase/migrations/0006_secret_box.sql`, `app/_lib/secret-box/{queries.ts,queries.test.ts}`,
  `app/sun-kudos/{secret-box-actions.ts,secret-box-actions.test.ts}`,
  `app/_components/sun-kudos/{secret-box-modal.tsx,secret-box-illustration.tsx,use-secret-box.ts,kudos-sidebar.tsx,kudos-sidebar.test.tsx,all-kudos-section.tsx}`,
  `app/_components/profile/{profile-stats.tsx,profile-stats.test.tsx}`,
  `app/sun-kudos/page.tsx`, `app/profile/page.tsx`,
  `app/_lib/i18n/messages/{vi-kudos.ts,en-kudos.ts}`, `e2e/sun-kudos-secret-box.spec.ts`, `public/secret-box/*`
- LOC: ~700 across implementation + tests
- Focus: full diff on `feat/open-secret-box` vs `main` (uncommitted working tree)

## Overall Assessment
Clean, spec-faithful implementation. The write path is genuinely trust-boundary-correct: `sunner_badges`
has no client write policy, the RPC takes zero arguments (so there is no parameter surface to forge), it
resolves identity itself via `auth.uid()`, and it re-derives entitlement from `kudos`/`sunner_badges`
inside the same transaction as the insert. Client/server code mirrors existing precedent
(`0004`/`0005` migrations, `actions.ts`, `rules-modal.tsx`, `write-kudo-modal.tsx`) closely enough that a
reviewer familiar with those files can follow this one without new mental model.

## Critical Issues
None found.

## High Priority
None found.

## Medium Priority
- `public/secret-box/box-qua-chua-mo.svg` is 1.7MB — unusually large for an SVG (almost certainly an
  embedded raster/path export from Figma rather than genuine vector paths). Not blocking: the repo
  already carries several PNGs in the 1.7–5MB range under `public/` (`homepage-saa/keyvisual-bg.png`
  5.0MB, `prelaunch/MM_MEDIA_BG Image.png` 3.5MB, `awards-information/hero-keyvisual.png` 1.8MB) as
  precedent for un-optimized design-handoff assets, so this is consistent with — not a regression from —
  the codebase's existing asset-weight posture. Worth a follow-up optimization pass across all of these
  together, not scoped to this PR.
- `openSecretBox()`'s fallback branch (`return { ok: false, error: message || "unknown" }` /
  `e instanceof Error ? e.message : "unknown"`) passes a raw Postgres/JS error string to the client for
  any error that isn't `auth_required`/`no_boxes`. This exactly mirrors the existing `createKudo`/
  `toggleHeart` pattern in `app/sun-kudos/actions.ts` (same raw-message passthrough, same justification
  in that file's own docstring), so it's established convention rather than a new hole introduced here —
  flagging only because BR-002/BR-004 explicitly call out anti-forgery and fallback-safety and a future
  hardening pass might want a `code:`-prefixed convention repo-wide (already flagged as a caveat in
  `write-kudo-error.ts`'s own docstring).

## Low Priority
- `pg_advisory_xact_lock(hashtext(v_sunner_id::text))` uses a 32-bit hash of the UUID, so two different
  sunners could (rarely) collide and serialize against each other unnecessarily. This only costs
  contention, never correctness — the lock is scoped to the transaction and always releases on
  commit/rollback, and BR-003's atomicity guarantee (recompute `v_opened` after acquiring the lock) holds
  regardless of collisions.
- `RULE_ICONS`/`BADGE_NAME_BY_CODE` ordering is explicitly flagged "assumed" in both the spec's own
  Unresolved Questions and the pre-existing `rules-content.ts` docstring; the new mapping in
  `secret-box-illustration.tsx` correctly inherits (not introduces) that same caveat, and `BR-004`'s
  fallback path (`UnknownBadgeFallback`) means a wrong assumption degrades to a generic icon rather than
  a broken image or crash.

## Edge Cases Found
- `auth.uid()` returning `NULL` for an anonymous caller never matches `sunners.auth_user_id = NULL`
  (Postgres NULL-comparison semantics), so an anon RPC call correctly falls through to `auth_required`
  rather than accidentally matching a seed row with a `NULL` link — verified by reading `0006`'s
  `select id into v_sunner_id ... where auth_user_id = auth.uid()` against `0005`'s nullable/unique
  `auth_user_id` column.
- Double-click / concurrent-open race: the advisory xact lock is acquired *before* `v_unopened` is
  computed, so a second concurrent call blocks until the first transaction commits (making its insert
  visible) or rolls back (making it not), and only then computes its own `v_opened` — there is no window
  where two concurrent calls can both observe the pre-insert count and over-grant (BR-003).
- Authed-but-unlinked sunner (auth row exists, no linked `sunners` row — e.g. `0005`'s trigger/backfill
  hasn't run) is treated as zero entitlement, not an error, in both `getSecretBoxState()` (returns
  `{authState: "authed", unopened: 0, opened: 0}`) and the RPC (`v_sunner_id is null` → `auth_required`,
  since the RPC has no separate "unlinked" state — matches the spec's stated FR-008 stance of treating
  it as the same auth-required condition).
- `unopened` display is clamped with `Math.max(0, unopened)` client-side in both `secret-box-modal.tsx`
  and `use-secret-box.ts`'s fallback (`result.remaining ?? Math.max(0, unopened - 1)`), so even if a
  network hiccup ever returned a stale/negative local value it can't render as negative — belt-and-
  suspenders on top of the server-side `GREATEST(0, ...)` in BR-001.

## Positive Observations
- `open_secret_box()` takes **zero parameters** — there is no argument surface for a tampered client to
  even attempt to pass a forged count or badge; this is a stronger anti-forgery posture than "validate
  the input", it eliminates the input.
- Entitlement (`BR-001`) and the insert (`BR-003`) are computed inside one `SECURITY DEFINER` function
  body wrapped by one advisory lock — no separate "check" then "write" round trip a client or a race
  could split.
- `search_path = public` is pinned on the new function, matching the `0004`/`0005` precedent — closes
  the classic `SECURITY DEFINER` search-path-hijack hole.
- Migration is idempotent (`create table if not exists`, `create or replace function`,
  `drop policy if exists`) and ships both an operator-verification block (including a throwaway-tx
  distribution sanity check for the 30/25/10/5/20/10 weights) and an explicit rollback block — matches
  the bar set by `0004`/`0005`.
- Fail-safe reads: `getSecretBoxState()` degrades to the anon-zero state on any thrown error (signed
  out, unlinked sunner, DB hiccup) rather than crashing the page — consistent with `getSidebarStats()`'s
  existing shape.
- BR-004's fallback path is a real rendered element (`UnknownBadgeFallback` SVG), not a silent no-op or
  a broken `<img>` — matches the spec's explicit "never crash, never broken image, never unescaped
  interpolation" requirement.
- Tests are behavior-focused and map directly to spec IDs in their `describe`/`it` titles (BR-001,
  DEC-001, SC-005, etc.), which will make future spec drift easy to spot.
- Confirmed via `git diff main --name-only` that none of the FAB, spotlight, or composer files
  implicated in the 4 pre-existing full-suite e2e failures are touched by this branch — the "don't count
  these against F016" claim in the task holds up under direct inspection, not just the tester's word.

## Recommended Actions
1. (Optional, non-blocking) Batch an asset-optimization pass across `public/secret-box/box-qua-chua-mo.svg`
   and the other oversized `public/` images once design finalizes; not this PR's scope.
2. (Optional, non-blocking) If/when the error-code union grows, consider the `code:`-prefixed convention
   `write-kudo-error.ts` already flags, applied repo-wide to `secret-box-actions.ts` and `actions.ts`
   together rather than one file at a time.

## Metrics
- Type Coverage: tsc --noEmit exit 0 (per temper-results.json)
- Test Coverage: 239/239 vitest, 4/4 F016 Playwright (production build)
- Linting Issues: 0 (eslint on all 11 F016 files)

## Unresolved Questions
None blocking. The spec's own "Unresolved Questions" #1 (RULE_ICONS ordering) and #2
(instruction-line copy variant) are pre-existing spec-level flags inherited, not new ambiguities
introduced by this implementation, and both degrade safely (BR-004 fallback / frame-image text default)
if wrong.

---

**Status:** DONE
**Summary:** F016 Open Secret Box implementation reviewed end-to-end (migration, queries, server action,
client hook/modal/illustration, CTA wiring, i18n, e2e). No critical or high-priority issues. BR-002's
anti-forgery design (zero-argument SECURITY DEFINER RPC, no client write policy, identity resolved only
via auth.uid()) is sound. Two medium-priority notes (SVG asset weight, raw-error passthrough) are both
consistent with pre-existing repo/codebase conventions, not regressions. Verdict: SEALED.
**Concerns/Blockers:** None blocking. Non-blocking notes above are for a future cleanup pass, not this
release.
**Score:** 9/10
**Critical Count:** 0
