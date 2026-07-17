# Planning: Kudos Recipients = Real Google Members — Session Record

**Date**: 2026-07-17
**Severity**: Normal
**Component**: Sun* Kudos data layer (F007 revision) / Write Kudo (F006)
**Status**: Blueprint ready — awaiting `/tkm:takumi` execution

---

## What Happened

Ran research → decisions → blueprint for "send Kudos to members who logged in via Google."
Two Explore agents mapped the ground truth: the recipient list is already DB-driven from
`public.sunners` (not mock — F006 docs are stale), the sender is already the authenticated Google
user but only as denormalized text (`sender_name`/`sender_avatar`, `sender_id` NULL), and nothing
links `sunners` to `auth.users` except `kudo_likes.user_id`. Web research confirmed the standard
Supabase pattern (profiles + `handle_new_user` trigger) and its classic pitfall — a failing trigger
on `auth.users` blocks all signups.

Chose option B over the canonical profiles table: extend `sunners` with `auth_user_id` + a
non-blocking SECURITY DEFINER trigger + backfill. Rationale: the whole UI (KUDO_SELECT joins,
spotlight roster, TierBadge, department filter) is shaped around `sunners`; a parallel `profiles`
directory would force dual-FK receivers or a big migration for zero user-visible gain (YAGNI).

User locked four decisions: mixed directory (seed + real members, no filter), keep public SELECT
RLS on `sunners` (no email stored), keep duplicate-name rows, fix doc drift in the same delivery.
SDD mode re-persisted to `.claude/.tkm.json` (`on`) after the machine reinstall wiped it.

## Artifacts

- Research: `plans/reports/researcher-260717-kudos-recipients-google-members.md`
- Spec draft (F007 revision, FR-009..FR-013 / SC-006..SC-011):
  `plans/260717-1133-kudos-real-member-recipients/spec/F007_KudosData/technical-spec.md`
- Blueprint: `plans/260717-1133-kudos-real-member-recipients/plan.md` + 4 phase files
  (01 migration `0005_sunners_auth_link.sql`, 02 `createKudo` sender_id, 03 doc drift, 04 verification)

## Key Constraints Carried Into the Plan

- Anon-key-only env: migration applied manually via Dashboard SQL Editor (operator gate before
  phase-04 live verification).
- Trigger must never block signup: trivial body + `EXCEPTION WHEN OTHERS THEN RETURN NEW`.
- `mapKudoRow` sender precedence means setting `sender_id` changes no card rendering.

## Next Step

`/tkm:takumi /home/huylm/projecs/aidd-ssa-2026/plans/260717-1133-kudos-real-member-recipients/plan.md`
