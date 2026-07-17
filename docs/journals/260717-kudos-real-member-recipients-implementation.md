# F007 Revision: Real Google Members as Kudo Recipients — Session Delivered

**Date**: 2026-07-17
**Severity**: Normal
**Component**: Kudos data layer (F007) / Write Kudo (F006) / docs layer
**Status**: Code delivered & sealed — awaiting operator SQL apply (Tier B)

---

## What Happened

Executed the blueprint `plans/260717-1133-kudos-real-member-recipients/` under takumi `code`
discipline. Promoted the F007 spec revision (FR-009..FR-013) into `docs/features/F007_KudosData/`
at implement-start (sentinel-guarded), then forged three parallel-safe phases: migration
`0005_sunners_auth_link.sql` (auth_user_id column + non-blocking `handle_new_member()` trigger +
backfill, fully idempotent), `createKudo` now resolves the caller's own sunner row and sets
`sender_id` (miss → NULL, submit never fails; 4 new unit tests), and the doc-drift fixes (F006
"mock list" wording, F007 "anon insert allowed" assumption, system docs). Temper Tier A all green:
227 vitest, tsc, eslint (changed files), next build; 6 e2e failures proven pre-existing on HEAD
(live-DB seed drift). Reviewer SEALED 9/10, 0 critical; evidence gate hard-SEALED.

**Operator gate open:** live activation (SC-006..SC-008) waits for the user to run
`supabase/migrations/0005_sunners_auth_link.sql` in the Supabase Dashboard SQL Editor — anon-key-only
environment, no CLI path exists. Verification queries ship inside the migration file.

## The Gen-Gate Bootstrap (the session's second half)

The Delivery gen gate found the code-derived doc layer absent (`last_rebuild_sha` empty); the user
chose **Core + Flow**. The full rebuild-spec core pass ran: graph-based scout (306 files), W1-W5
researcher chain with all gates (W1.5/W1.1/W2a.1/W4.5/W5.5/W5.6), W7a review, two fix cycles, and
W9 promote — **13 core artifacts** now live under `docs/system/` + `docs/generated/`, cursor at
`36dee9f`, navigation READMEs generated. The flows pass ran honestly to **zero emitted flows**: the
strict gate (≥2 transitions AND ≥2 trigger types) disqualified every entity — this schema has no
multi-trigger state machines. `promote --scope flows` exiting 3 on "promoted 0" is a false alarm in
this edge case (validators PASS, `.completed` = `no_flows_inferred`), annotated in the flag.

## The Brutal Truth

Three traps this session, all caught by gates working as designed:

1. **The renumber gate scrambled canonical F### codes.** rebuild-spec's full-run renumber is built
   for freshly-minted codes; this repo's F001-F015 pre-existed. 13/15 codes got reshuffled
   (`F015_KudosHearts` → "F002"), caught by W7a with hard evidence (a migration comment literally
   says `-- F015_KudosHearts`). Fixed with a deterministic two-phase remap keyed on the slug
   suffixes; the semantic feature assignments were all correct. Lesson: on a repo with promoted
   specs, the feature-list wave needs a "codes are external, skip renumber" mode.
2. **`cmd | tail -2; echo $?` reports tail's exit code, not the validator's.** A duplicate-REG
   critical hid behind that for four waves. The REG fix itself surfaced a second subtlety: the
   validator counts ANY REG token in a table row, including cross-references in prose.
3. **Promote overwrote curated system docs.** `docs/system/{architecture,permissions}.md` were
   curated files carrying today's phase-03 edits; the core-pass promote replaced them with
   generated versions. Content was re-verified and the auth-link/trigger sections surgically
   re-added — but the sealed FR-013c acceptance would have silently gone false otherwise. Backup
   before promote saved the diff.

## Verification Evidence

- `plans/260717-1133-kudos-real-member-recipients/evidence/` — SEALED (score 9, 0 critical)
- `plans/260717-1133-kudos-real-member-recipients/reports/tester-260717-tier-a.md` — Tier A runs
- `plans/260717-1233-rebuild-spec/artifacts/` — full core-pass audit trail (review-report PASS,
  wave9-complete.flag with sha256 manifest, flows-complete.flag)

## Follow-ups

1. **Operator**: apply `0005_sunners_auth_link.sql` in Dashboard → run its verification queries →
   Tier B live checks (fresh Google login → sunner row; composer shows member; kudo carries sender_id).
2. `docs/features/.stale` marker present — rebuild-spec suggests a `--feature-specs` refresh, but the
   15 feature specs are takumi-authored (not generated); running that pass would overwrite them.
   Decision deferred to the user; leave the marker until then.
3. Pre-existing e2e seed-drift failures (6) still open — separate fix session (re-seed DB or relax
   seeded assertions).
