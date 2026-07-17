# Phase 04 — Verification (SC-006..SC-011)

## Context Links

- Spec: `spec/F007_KudosData/technical-spec.md` → **SC-006..SC-011**
- Depends on: phase 01 (migration **applied** by operator), phase 02 (code), phase 03 (docs)
- Reports: `plans/reports/`

## Overview

- **Priority:** P1 · **Status:** Tier A complete; Tier B blocked on operator gate
- The integration gate. Runs the static toolchain (any time) and the live checklist (only after the
  operator applies `0005`). Produces a verification report; on green, F007 promote proceeds.
- **No code files owned** — this phase only runs commands and records results.

## Key Insights

- Two-tier verification: (A) static checks are code-only and run before the operator gate;
  (B) live checks require the DB to have `0005` applied — they are the operator-gated tier.
- SC-010 is a **code review** assertion (EXCEPTION guard present), not a live signup-blocking test.
- e2e regression: existing tests are seed-guarded and assert on seeded rows only; adding real-member
  rows must not change any seeded expectation (SC-009/SC-011).

## Requirements / Success Criteria mapping

| SC | Check | Tier |
|----|-------|------|
| SC-006 | Fresh Google login → `sunners WHERE auth_user_id IS NOT NULL` gains a row; member appears in composer recipient list | Live |
| SC-007 | Backfill: pre-`0005` members present after the backfill statement | Live |
| SC-008 | Logged-in submit → kudo row carries `sender_id` = caller's sunner id; card still renders sender name/avatar | Live |
| SC-009 | Seeded recipients still selectable; spotlight/all-kudos/hearts unchanged; NULL-linked rows behave as today | Live + e2e |
| SC-010 | EXCEPTION guard present in `handle_new_member()` | Static (code review) |
| SC-011 | tsc, lint, vitest, build all pass; e2e green | Static |

## Implementation Steps

### Tier A — static (run first, no DB dependency)

1. `npx tsc --noEmit`
2. lint (repo lint command)
3. `vitest run` (must include the new `createKudo` tests from phase 02)
4. `next build` (per AGENTS.md — this is not stock Next.js; verify build passes)
5. Code-review SC-010: confirm `EXCEPTION WHEN OTHERS THEN RETURN NEW` + `set search_path = public`
   in `0005`.
6. e2e sweep (existing suite) — confirm seed-guarded tests unaffected.

### Tier B — live (only after operator applies `0005` via Dashboard SQL Editor)

7. Run phase 01 verification queries: linked-row count > 0, NULL-linked count == 62, trigger present.
8. **Fresh Google login** → re-run `select … where auth_user_id is not null`; confirm the new
   member row (name + avatar from metadata). Open the composer → member appears in recipient list.
9. **Submit a kudo while logged in** → `select sender_id from kudos order by created_at desc limit 1`
   → equals the caller's sunner id; open All Kudos → card renders sender name/avatar (SC-008).
10. Spot-check SC-009: pick a seeded recipient, verify spotlight/all-kudos/hearts render unchanged.

## Todo List

- [x] Tier A: tsc / lint / vitest / build all green
- [x] Tier A: SC-010 code review recorded (in tester-260717-tier-a.md)
- [x] Tier A: e2e regression green (19/25 passed; 6 failures pre-existing on HEAD, documented)
- [ ] Operator gate cleared (`0005` applied)
- [ ] Tier B: SC-006 fresh-login row + composer visibility
- [ ] Tier B: SC-007 backfill rows present
- [ ] Tier B: SC-008 sender_id populated + card unchanged
- [ ] Tier B: SC-009 seeded flows unaffected
- [x] Verification report written to `plans/reports/` (tester-260717-tier-a.md)
- [ ] Trigger F007 promote (draft → implemented) once operator gate clears and Tier B green

## Success Criteria

- All SC-006..SC-011 checks pass and are recorded in the report.
- Definition of done: static tier green AND live tier green AND doc drift resolved (phase 03).

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Live tier blocked because operator hasn't applied `0005` | Med | Med | Deliver Tier A independently; clearly flag the operator gate; do not mark phase done until Tier B clears |
| e2e flake masks a real regression | Low | Med | Re-run failing e2e; diff against pre-change baseline |
| Google metadata shape differs from expectation (name/avatar null) | Low | Med | Verify actual row content in step 8; COALESCE chain already guards |

## Security Considerations

- Confirm the verification queries never select or log email from `sunners` (email not stored).
- Confirm no service_role key was needed or introduced at any step.

## Next Steps

- On green: takumi promote lands F007 spec delta (status → implemented); update roadmap/changelog per
  `documentation-management.md`.
- On red: route failures back to the owning phase (01/02/03) per the primary workflow, re-run.
