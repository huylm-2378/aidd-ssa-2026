# Static Verification Tier (Tier A, Phase-04) — Raw Results
**Date:** 2026-07-17 11:50 UTC  
**Session:** kudos-real-member-recipients change  
**Tester:** Claude Code

---

## Verification Runs

| Command | Exit Code | Summary |
|---------|-----------|---------|
| `mise exec -- npx tsc --noEmit` | 0 | TypeScript: no type errors |
| `mise exec -- npx eslint app/sun-kudos/actions.ts app/sun-kudos/actions.test.ts` | 0 | ESLint: no violations on changed files |
| `mise exec -- npm test` | 0 | Vitest: 227/227 tests passed (35 files) |
| `mise exec -- npm run build` | 0 | Next.js build: compiled + static + dynamic routes verified |
| `mise exec -- npx playwright test e2e/sun-kudos.spec.ts e2e/write-kudo.spec.ts` | 1 | e2e: **19 passed, 6 failed** (see below) |

---

## e2e Test Results Breakdown

**Total:** 25 tests  
**Passed:** 19  
**Failed:** 6

### Pre-Existing Failures (Expected, NOT caused by this diff)
These 3 failures match the known drift from live DB (like counts changed by F015 hearts):

1. **sun-kudos.spec.ts:82** — "a Kudo card shows sender+receiver, title, hashtags, like count, and actions"
   - Reason: `Lê Quốc Bảo` text not found in highlight section
   - Root: DB state mismatch (seed vs. live)

2. **sun-kudos.spec.ts:170** — "selecting a Phòng ban filter narrows the highlight feed and resets the carousel to page 1"
   - Reason: Expected "1/1" after filter, got "1/5"
   - Root: DB state mismatch (fewer matching kudos than expected)

3. **sun-kudos.spec.ts:187** — "a filter combination with no matches shows the empty state"
   - Reason: Empty state element not found (still showing cards)
   - Root: DB state mismatch (filter returned matches when none expected)

### NEW Failures (Introduced by this change)
3 new failures, all in write-kudo.spec.ts, all timing out waiting for "+ Hashtag" button:

4. **write-kudo.spec.ts:67** — "Gửi is disabled until recipient, danh hiệu, content, and >=1 hashtag are filled"
   - Error: Timeout (30s) waiting for `getByRole('dialog').getByRole('button', { name: '+ Hashtag' })`
   - Line: 89 in test

5. **write-kudo.spec.ts:96** — "submitting without a session shows the login-required error"
   - Error: Timeout (30s) waiting for `getByRole('dialog').getByRole('button', { name: '+ Hashtag' })`
   - Line: 112 in test

6. **write-kudo.spec.ts:145** — "adding 5 hashtags hides the '+ Hashtag' button"
   - Error: Timeout (30s) waiting for `getByRole('dialog').getByRole('button', { name: '+ Hashtag' })`
   - Line: 150 in test

**Pattern:** All 3 new failures occur when tests try to interact with the hashtag button in the composer dialog. This suggests a potential rendering or interaction issue introduced by the changes to `actions.ts`.

---

## SC-010 Security Review: Migration 0005

**File:** `supabase/migrations/0005_sunners_auth_link.sql`

### Checklist

- ✓ **(a) `security definer` present**
  - Line 22: `security definer` declared in `handle_new_member()` function
  - Purpose: Allow trigger to bypass sunners RLS, execute as table owner

- ✓ **(b) `set search_path = public` pinned**
  - Line 23: `set search_path = public` in function body
  - Purpose: Prevent SQL injection via search path manipulation (precedent: kudo_likes_count_sync in 0004)

- ✓ **(c) `exception when others then return new` guard**
  - Lines 37–39: Exception handler returns `NEW` without re-throwing
  - Purpose: Prevent trigger failure from blocking signups (SC-010: "never block a signup")

- ✓ **(d) All statements idempotent**
  - Line 11–12: `add column if not exists auth_user_id` — safe re-run
  - Line 19: `create or replace function` — replaces old version
  - Line 43: `drop trigger if exists` — safe re-run before re-create
  - Line 44–46: `create trigger` — idempotent (drop precedes)
  - Line 49–59: `insert ... on conflict (auth_user_id) do nothing` — safe re-run
  - Line 58: `where not exists (select ...)` — guards backfill from duplicate insertion

**Result:** All SC-010 security patterns verified. Migration is safe to re-apply.

---

## Summary

**Build Tier Status:** ✓ Passed (tsc, eslint, vitest, build all green)

**e2e Status:** ⚠ **Concerns**
- 3 known pre-existing failures (DB drift): expected, not this change's fault
- **3 NEW failures: all related to hashtag button interaction in composer**
  - All timeout waiting for button element
  - All occur in write-kudo.spec.ts tests
  - Pattern suggests compositor DOM/interaction issue

**SC-010 Status:** ✓ Passed — migration follows all security patterns

---

**Status:** DONE_WITH_CONCERNS  
**Summary:** Static tier (tsc, eslint, vitest, build) passes cleanly. SC-010 migration is secure. However, e2e reveals 3 new failures—all timeouts waiting for the hashtag button in the write-kudo composer. Likely DOM rendering or interaction regression introduced by `actions.ts` changes.  
**Concerns/Blockers:** The 3 new e2e failures block integration. Root cause: hashtag button not appearing or not interactable in write-kudo composer modal. Needs investigation before proceeding to phase-05 (integration/docs).

---

## Orchestrator addendum (baseline verification)

The 3 write-kudo.spec.ts failures flagged above as "new" were re-run on HEAD with
`app/sun-kudos/actions.ts` + `actions.test.ts` stashed: **identical 3 failures, 9 passed**.
They are PRE-EXISTING (same live-DB/seed-drift family as the 3 sun-kudos.spec.ts failures),
NOT caused by this change. Logged as a known issue for a separate fix session.

## Tier B live results (2026-07-17, post-apply)
- SC-007 PASS: 3 linked member rows (backfill) — names+avatars from Google metadata; seed count 62 intact
- SC-006/SC-008 pending user interaction: fresh composer check + one logged-in kudo submit (sender_id assert)


## Tier B final (2026-07-17 17:02+)
- SC-006 PASS: user selected real linked member 'Do Anh Tuan B' as receiver from composer
- SC-008 PASS: newest kudo sender_id -> linked sunner 'Le Minh Huy' (FK join resolves); sender_name matches
- SC-009 PASS: 62 seed rows intact; card rendering unchanged
ALL SC-006..SC-011 VERIFIED — plan closed.

