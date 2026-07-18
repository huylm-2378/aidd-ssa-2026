---
title: "Open Secret Box"
description: "Logged-in Sunners open earned Secret Boxes from a shared modal; server-side RPC assigns one weighted-random badge atomically."
status: completed
priority: P1
effort: 9h
work_type: feature
spec: docs/features/F016_OpenSecretBox/
branch: feat/open-secret-box
tags: [kudos, supabase, rpc, modal, badges]
created: 2026-07-18
---

# Open Secret Box — Implementation Plan

Shared modal (both existing CTAs) shows a Sunner's earned Secret Box count and opens one at a
time. Entitlement = `GREATEST(0, FLOOR(sum received-kudos hearts / 5) − opened)`. Each open is
resolved by a `SECURITY DEFINER` RPC that re-derives entitlement, picks one weighted-random badge
(30/25/10/5/20/10), inserts atomically, and returns badge + remaining. Anon key only — DDL applied
by the operator in Dashboard SQL Editor. Full requirements in `spec_draft` (do not re-derive).

## MoMorph ref
- Open secret box- chưa mở: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/J3-4YFIpMM
- Clarifications: plans/260718-0451-open-secret-box/clarifications.md

## Two-track shape
Track A (UI) and Track B (backend) are parallel-runnable — no cross-track `blockedBy`. The
integration phase gates on BOTH. Track B is internally chained (03 needs 02's schema).

## Phases

| Phase | Track | Status | Depends on | Covers |
|-------|-------|--------|------------|--------|
| [phase-01-secret-box-ui-modal](phase-01-secret-box-ui-modal.md) | A (UI) | completed | — | FR-002, FR-003, FR-007 (UI) |
| [phase-02-db-migration-and-rpc](phase-02-db-migration-and-rpc.md) | B | completed¹ | — | FR-004, FR-005, BR-001..003, ALG-001, DEC-001 |
| [phase-03-server-read-and-action](phase-03-server-read-and-action.md) | B | completed | phase-02 | FR-004, FR-005, FR-008 |
| [phase-04-integration-and-wiring](phase-04-integration-and-wiring.md) | Integration | completed | phase-01 + phase-03 | FR-001, FR-006, FR-007, BR-004, DEC-001, US004 |
| [phase-05-tests-and-docs](phase-05-tests-and-docs.md) | Verify | completed | phase-04 | SC-001..005, docs/journal |

¹ Migration written; operator handoff pending: migration 0006 awaits manual apply in Supabase Dashboard SQL Editor.

## Key dependencies
- Track A ∥ Track B (no blocking). Phase-03 needs phase-02's `open_secret_box()` + `sunner_badges`.
- Phase-04 needs Track A's modal component AND phase-03's read helper + action.
- Phase-02 requires an operator handoff (manual SQL apply) before phase-03 can integration-test.

## Out of scope (this round)
- "Action bấm mở" / standby / success-state animation frames (frame J3-4YFIpMM only).
- Syncing the `kudos_stats` demo singleton; per-user sidebar stats rewiring.
- Confirming `RULE_ICONS` PNG ordering / box-illustration final asset path (design handoff).

## Open questions (from spec §Unresolved)
1. `RULE_ICONS` name→PNG ordering marked "assumed" — confirm before badge art trusted.
2. Instruction copy: frame image "Click vào box để mở" vs spec "…để tiếp tục mở" — use frame text.
3. Box illustration final filename under `public/secret-box/` — needs design export.
