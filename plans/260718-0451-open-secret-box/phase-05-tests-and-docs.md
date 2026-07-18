# Phase 05 — E2E, Docs, Journal (Verify)

**Track:** Verify · **Depends on:** phase-04 (full feature wired).

## Context Links
- Spec verification: `spec/open-secret-box/technical-spec.md` (SC-001..005)
- Edge cases: `spec/open-secret-box/edge-cases.md`
- E2E precedent: `e2e/` (Playwright, `KUDOS_DB_SEEDED` guard pattern)
- Docs: `docs/project-changelog.md`, `docs/development-roadmap.md`

## Overview
- **Priority:** P2 · **Status:** pending
- Playwright e2e for the modal; docs + journal updates. Unit tests already landed in phase-03;
  badge probability distribution is verified at the DB level (phase-02 verification query), NOT e2e.

## Key Insights
- Structural assertions (modal open/close, layout regions R1–R5, instruction hidden at 0, X
  closes) run **unconditionally** — no seeded data needed.
- Data-dependent assertions (real counter value, badge appears after open, counter decrements)
  run **only behind `KUDOS_DB_SEEDED`** so CI without a seeded DB stays green.
- Do NOT re-test the probability distribution in e2e — it's a DB-level concern already covered.

## Requirements
- **Functional:** exercise US001 (view), US002 (open), US003 (0-gate), US004 (anon).
- **Non-functional:** no mocks/fakes that fabricate a green run; failing tests block, not skipped.

## Architecture
- **e2e flows:**
  - unconditional: open modal from each CTA → R1–R5 present; X closes; anon → inline sign-in.
  - `KUDOS_DB_SEEDED`: seeded sunner with known count → counter reads expected value; click box →
    one of 6 badges shown, counter −1; second click at 0 → no change (SC-003).
- **Docs flow:** changelog entry (feature, severity/impact), roadmap progress bump.

## Related Code Files
- **Create:** `e2e/secret-box-modal.spec.ts` (or repo naming convention).
- **Modify:** `docs/project-changelog.md`, `docs/development-roadmap.md`; journal entry.
- **Delete:** none.

## Implementation Steps
1. Write unconditional structural e2e (open/close/layout/anon).
2. Write `KUDOS_DB_SEEDED`-guarded e2e (real count, open → badge + decrement, 0-gate no-op).
3. Run the full e2e + unit suite; fix failures by recommendation, re-run (do not skip).
4. Update changelog + roadmap; write the delivery journal entry.

## Todo List
- [x] Unconditional structural e2e (modal open/close/layout, anon sign-in)
- [x] Seeded e2e behind `KUDOS_DB_SEEDED` (count, open→badge, decrement, 0-gate)
- [x] Full suite green (unit from phase-03 + e2e)
- [x] Changelog + roadmap updated
- [x] Journal entry written

## Success Criteria
- SC-001..005 exercised: view count, one badge per open + decrement, 0-gate no-op, anti-forgery
  (unit/DB), auth short-circuit.
- CI green with and without `KUDOS_DB_SEEDED`; no fabricated passes.

## Risk Assessment
- **Flaky seeded assertions (Med / Med):** count drifts as other tests write badges. Countermove:
  isolate seed per test / assert relative decrement, not absolute residuals.
- **e2e re-tests distribution and flakes (Low / Med):** explicitly out — distribution is DB-level.

## Security Considerations
- E2E must not use service_role or bypass RLS; anon-key client only, same as production.

## Next Steps
- Feature complete → hand to reviewer per primary workflow; resolve open questions #1/#3 pre-release.
