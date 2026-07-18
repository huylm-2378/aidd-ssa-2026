# 260718 — Open Secret Box: research + spec draft + blueprint

## What happened

Researched and blueprinted the "Open Secret Box" feature from MoMorph frame
"Open secret box- chưa mở" (screenId `J3-4YFIpMM`, fileKey `9ypp4enmFmdK3YAFJLIu6C`) via the
create-plan pipeline (SDD on → spec gate → author draft → planner blueprint).

## Inputs gathered

- MoMorph: frame meta + image, 4 design-item specs, 19 test cases. The frame is the PRE-open
  modal state (title "KHÁM PHÁ SECRET BOX CỦA BẠN"); spec item A's "MỞ SECRET BOX THÀNH CÔNG"
  title belongs to the success-state frames (out of scope).
- Codebase survey (Explore agent): both "Mở Secret Box" CTAs are visual-only; no secret-box/badge
  tables exist; hearts (kudo_likes + like_count trigger) are live; 6 badge PNGs exist in
  `public/rules-icons/` via `RULE_ICONS`; reusable modal (`rules-modal.tsx` + `useDialogA11y`),
  server-action, and SECURITY DEFINER precedents identified.

## Locked decisions (clarifications.md)

1. Scope: "chưa mở" modal + REAL open backend (badge shown in box frame, counter −1);
   animation/standby frames deferred.
2. Entitlement: unopened = `GREATEST(0, FLOOR(hearts received / 5) − opened)` — matches the
   published rule "5 ❤️ = 1 Secret Box".
3. Security: migration 0006 `sunner_badges` (public SELECT, no client writes) + SECURITY DEFINER
   RPC `open_secret_box()` — weighted random 30/25/10/5/20/10 over 6 badge codes, atomic insert;
   anon key cannot forge badges/counts.
4. Entry points: BOTH CTAs (kudos-sidebar + profile-stats) share one modal.
5. Spec layer: authored draft first (choice a) — F### allocated at takumi promote.

## Artifacts

- Spec draft: `plans/260718-0451-open-secret-box/spec/open-secret-box/` (technical-spec with
  FR-001..FR-008 / US001..US004 / BR / ALG-001 / DEC-001, business-context, screens, edge-cases,
  SCR-secret-box-modal screen spec). Step-2.5 lint: all OK. User approved at RP 1.5b.
- Blueprint: `plans/260718-0451-open-secret-box/plan.md` (53 lines) + 5 phases, two-track MoMorph
  shape — Track A (phase-01 UI, ≤30 lines) ∥ Track B (phase-02 migration/RPC → phase-03 server
  read/action), phase-04 integration gates on both, phase-05 tests/docs.
- Research: `research/researcher-01-design-and-codebase-context.md`; decisions in
  `clarifications.md`.

## Open questions carried into plan.md

1. `RULE_ICONS` name→PNG mapping is self-declared "assumed" — wrong order would silently show
   wrong badge art.
2. Instruction copy variant ("Click vào box để mở" per frame image — chosen — vs "…để tiếp tục
   mở" per spec item B).
3. Box illustration asset needs export from design → `public/secret-box/`.

## Notes

- `set-active-plan.cjs` no longer exists; wrote the session state blob
  (`/tmp/sk-session-<id>.json` → `activePlan`) directly per `tkm-config-utils.cjs` shape.
- Next: `/tkm:takumi /home/huylm/projecs/aidd-ssa-2026/plans/260718-0451-open-secret-box/plan.md`
  (promote will allocate the F### and write `docs/features/`; migration 0006 needs the operator
  to apply SQL in Supabase Dashboard, like 0005).
