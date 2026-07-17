# Phase 03 — Doc drift fixes (FR-013)

## Context Links

- Spec: `spec/F007_KudosData/technical-spec.md` → **FR-013**, SC-011
- Drift targets: `docs/features/F007_KudosData/technical-spec.md`,
  `docs/features/F006_WriteKudo/technical-spec.md`, `docs/system/architecture.md`,
  `docs/system/permissions.md`
- Reality sources: `supabase/migrations/0002_kudos_sender_identity.sql` (authenticated-only INSERT),
  `app/sun-kudos/actions.ts` (session required), `write-kudo-content.ts` (mock list deleted 2026-07-09)

## Overview

- **Priority:** P1 · **Status:** completed
- Correct four stale statements and document the new `auth_user_id` link + trigger. Docs-only phase.
- The **promoted** F007 spec (`docs/features/F007_KudosData/`) receives the FR-009..FR-013 delta via
  takumi's **promote step** (spec_draft → promoted), NOT a hand-copy of the whole draft here. This
  phase fixes the *drift* items and the system docs; it flags the promote hand-off.

## Key Insights

- F007's implemented Assumptions still say Kudos INSERT is "demo-permissive (anon allowed)" — that
  was superseded by `0002` (authenticated-only) + FR-002a. The draft already carries the corrected
  wording; the promote step lands it.
- F006 FR-005 still reads "mock Sunner list" though recipients have been DB-driven since 2026-07-09
  (a note under Key entities already flags it; FR-005's line body itself is the stale part).
- `architecture.md` mentions `sunners` but not the `auth.users` link; `permissions.md` documents the
  anon-key/no-service_role constraint and should gain the trigger's SECURITY DEFINER note.

## Requirements

- **FR-013(a):** Promoted F007 Assumptions — replace "demo-permissive (anon allowed)" with the
  actual `0002` authenticated-only policy + FR-002a behavior. (Lands via promote; draft is correct.)
- **FR-013(b):** F006 FR-005 — replace "mock Sunner list" wording with DB-driven recipients.
- **FR-013(c):** `architecture.md` + `permissions.md` gain the `auth_user_id` link + first-login
  trigger description.

## Architecture

No system change — documentation reflects phases 01–02. Edits are prose only; no FR/SC ids renamed.

## Related Code Files

- **Modify:** `docs/features/F006_WriteKudo/technical-spec.md` (FR-005 line + Assumptions bullet)
- **Modify:** `docs/system/architecture.md` (sunners entity → add auth_user_id link + trigger)
- **Modify:** `docs/system/permissions.md` (add trigger SECURITY DEFINER note; reaffirm no
  service_role; sunners public SELECT includes real members)
- **Promote (via takumi step, not hand-copy):** `docs/features/F007_KudosData/technical-spec.md`
  gains FR-009..FR-013 + Assumptions correction from the spec draft.

## Implementation Steps

1. **F006 FR-005:** rewrite the "typing filters a mock Sunner list" clause → "typing filters the DB
   `sunners` directory (autocomplete)"; the Key-entities note already records the bugfix — keep it.
2. **architecture.md:** in the `sunners` description, add: "`auth_user_id uuid UNIQUE NULL →
   auth.users(id) ON DELETE SET NULL`; a first-login trigger (`on_auth_user_created`) auto-creates a
   sunner per Google member (option B — members share the recipient directory with seed rows)."
3. **permissions.md:** add a line documenting `handle_new_member()` as SECURITY DEFINER with
   `set search_path = public`, non-blocking EXCEPTION guard; reaffirm no service_role is introduced;
   note `sunners` public SELECT now also exposes real member names/avatars (accepted, decision 2).
4. **F007 promote:** do NOT copy the draft body here. Note in the completion report that takumi's
   promote step must land `spec/F007_KudosData/technical-spec.md`'s delta into
   `docs/features/F007_KudosData/technical-spec.md` (status draft → implemented) after phase 04.
5. Verify no broken cross-references / FR-id collisions after edits.

## Todo List

- [x] F006 FR-005 wording fixed (no "mock")
- [x] `architecture.md` sunners entry gains auth_user_id link + trigger
- [x] `permissions.md` gains trigger note + no-service_role reaffirmation + public-read note
- [x] Completion report flags the F007 promote hand-off (FR-013a) — promote step ran at implement-start
- [x] Cross-references intact (re-verified after rebuild-spec core pass)

## Success Criteria

- SC-011 (docs portion): no stale "mock"/"anon insert allowed" statements remain in F006/F007;
  system docs describe the link + trigger accurately.
- No doc references a non-existent symbol or a renamed FR id.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Hand-copying draft into promoted F007 (bypasses promote flow) | Med | Med | This phase edits drift + system docs ONLY; F007 delta lands via takumi promote |
| Over-editing implemented specs beyond the drift scope | Low | Low | Touch only the specified lines/bullets |

## Security Considerations

- Documents (does not weaken) the public-SELECT decision and the SECURITY DEFINER trigger; makes the
  no-service_role constraint explicit for future contributors.

## Next Steps

- Independent of phase 01/02 (disjoint files) → parallel-safe.
- F007 promote occurs after phase 04 verification passes (spec status flips draft → implemented).
- Rollback: `git revert` the edited docs.
