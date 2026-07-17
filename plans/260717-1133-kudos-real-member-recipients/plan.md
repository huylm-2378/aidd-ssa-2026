---
title: "Kudos recipients = seed sunners + real Google members"
description: "Link sunners to auth.users so Google-logged-in members become Kudo recipients + close the sender_id gap."
status: in_review
priority: P1
effort: 4.5h
branch: main
work_type: feature
spec: docs/features/F007_KudosData/
blockedBy: []
tags: [kudos, supabase, auth, migration, f007, f006]
created: 2026-07-17
evidence_dir: plans/260717-1133-kudos-real-member-recipients/evidence/
evidence_status: SEALED (score 9 — inspection verdict complete)
---

# Kudos real-member recipients + sender FK (F007 revision)

Extend the Kudos data layer so members who logged in via Google (F005) become first-class
recipients, mixed into the same directory as the 62 seeded sunners. Link `public.sunners` to
`auth.users` via a nullable `auth_user_id` column + a non-blocking first-login trigger + a
backfill. Simultaneously close the sender gap: `createKudo` sets `sender_id`. Chosen option **B**
(extend `sunners`) — smallest blast radius; `receiver_id` FK, `KUDO_SELECT` join, spotlight, and
card rendering all stay unchanged. Fix doc drift in the same delivery.

Spec draft (authoritative for FR/SC ids): `spec/F007_KudosData/technical-spec.md`.

## Key Insights (locked user decisions, 2026-07-17)

1. Recipient list = seed sunners + real members **mixed** — NO `auth_user_id` filter;
   `getSunnerOptions`/`useSunnerOptions` unchanged (FR-012).
2. `sunners` RLS SELECT stays **public** (`using(true)`); **email is NEVER stored** in `sunners`
   (used only as last-resort name fallback).
3. A seed sunner sharing a real member's name → **keep both rows** (no merge/dedupe).
4. Doc drift fixed in the **same delivery** (F006 FR-005 "mock" wording; F007 "anon insert allowed"
   assumption; `architecture.md` + `permissions.md`).

## Phases

| # | Phase | Files (owner) | Status | Depends on |
|---|-------|---------------|--------|-----------|
| 01 | [Migration + operator handoff](phase-01-migration-sunners-auth-link.md) — FR-009/FR-010, SC-006/SC-007 | `supabase/migrations/0005_sunners_auth_link.sql` | complete (code) — awaiting operator apply via Dashboard SQL Editor | — |
| 02 | [createKudo sender_id + unit tests](phase-02-create-kudo-sender-id.md) — FR-011, SC-008 | `app/sun-kudos/actions.ts`, `actions.test.ts` | completed | — (parallel w/ 01, 03) |
| 03 | [Doc drift fixes](phase-03-doc-drift-fixes.md) — FR-013 | `docs/features/F00{6,7}_*`, `docs/system/{architecture,permissions}.md` | completed | — (parallel w/ 01, 02) |
| 04 | [Verification](phase-04-verification.md) — SC-006..SC-011 | (no code; reports) | Tier A complete; Tier B blocked on operator gate | 01 (applied), 02, 03 |

Phases 01/02/03 touch disjoint files → parallel-safe. Phase 04 is the integration gate.

## Implementation Summary (2026-07-17)

**rebuild-spec gen-gate bootstrap** ran post-inspection: core docs layer created; flows pass 0 qualifying entities. Evidence sealed (inspection-verdict score 9, decision SEALED, no critical findings).

## Key dependencies

- **Operator gate (manual):** env has **anon key only** — no service_role, no CLI/psql. Migration
  `0005` must be applied by the operator via **Supabase Dashboard → SQL Editor** (runs as postgres,
  so the `auth.users` trigger is creatable). Live verification in phase 04 cannot run until this
  gate clears. Code (phase 02) + docs (phase 03) do not depend on the gate.
- Precedent: `handle_new_member()` follows the SECURITY DEFINER + `set search_path = public`
  pattern already shipped in `0004_kudos_likes.sql` (`kudo_likes_count_sync`).
- `spec_draft` is promoted to `docs/features/F007_KudosData/` by takumi's promote step; phase 03
  references the promote flow rather than hand-copying the draft.

## Rollback posture

Each phase reverts independently: phase 01 → `drop trigger` + `drop function` + `drop column`
(seed rows untouched); phase 02/03 → git revert of the owned files. See per-phase Risk sections.
