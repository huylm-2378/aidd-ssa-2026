# Sun* Kudos Live Board — Feature F003 Delivered

**Date**: 2026-07-03 09:38  
**Severity**: Normal  
**Component**: Sun* Kudos / Feature F003 (Live Board Page)  
**Status**: Resolved & Committed  

---

## What Happened

Completed the full takumi pipeline on the Sun* Kudos feature: built `/sun-kudos` as a static, pixel-perfect clone of the MoMorph frame (screenId MaZUn5xHXZ), executing `plans/260703-0614-sun-kudos/plan.md` under five-phase Takumi discipline. Delivered 13 new files (3 data modules, 8 components, 1 page rewrite, 1 e2e suite) plus one reused-file edit (footer active-nav). Replaced a placeholder route. All files under 200 lines; all tests pass (16 vitest, 41 playwright); next build clean; eslint clean; evidence gate sealed; commit `3a70725` on `feature/sun-kudos`.

---

## The Brutal Truth

The hard moment: the blueprint assumed Kudo cards had dark backgrounds (#101417). MoMorph frame inspection against the live design showed they're cream (#fff8e1) with a 4px gold border (#ffea9e), translucent-gold body box, red (#d4271d) hashtags. Building to the *frame*, not the plan, mattered for fidelity. A reminder that design specifics must be verified against the source, not trusted to a blueprint's educated guess.

The flex overflow discovery stung because it's silent — a responsive test at 375px caught the page breaking wider than the viewport. Hours of hunting (Playwright element-bounding probes, step-by-step flexbox audit) before the grain showed itself: flex children default to `min-width: auto` and can push a page wider without raising an error. The fix was surgical (min-w-0 on flex-1 columns, flex-wrap on footer rows) but the fact that this pattern wasn't caught in the foundational component library is worth recording.

---

## Technical Details

**Design Source**: MoMorph/Figma fileKey `9ypp4enmFmdK3YAFJLIu6C`, screenId `MaZUn5xHXZ`

**Delivered Artifacts**:
- `app/_lib/kudo-data.ts`, `kudos-list.ts`, `card-mock-data.ts` (data layer)
- `app/_components/sun-kudos/kudos-hero.tsx`, `kudos-search-bar.tsx`, `kudos-avatar.tsx`, `kudo-card.tsx`, `highlight-kudos-section.tsx`, `spotlight-board.tsx`, `kudos-sidebar.tsx`, `all-kudos-section.tsx` (component layer)
- `app/sun-kudos/page.tsx` (page rewrite from placeholder)
- `e2e/sun-kudos.spec.ts` (9 new e2e tests + regression suite)
- `app/_components/footer.tsx` (usePathname active-nav state for `/sun-kudos`)

**Critical Design Fix**: Kudo cards are cream body with gold border, not dark. Verified against live frame; built faithfully.

**Responsive Fix**: 375px horizontal overflow root-caused to flex min-width defaults on KudoCard footer actions row and sender/receiver columns. Applied `min-w-0` on flex-1 children and `flex-wrap` on footer + role/badge rows. Pattern applies to all flex layouts in the design system going forward.

**Reviewer Fixes** (2 minor):
1. CEVC10 role-code typo in sidebar data
2. Converted decorative search div in spotlight-board to a labelled `<input>` for accessibility parity

**Gen Gate Decision**: User chose to SKIP bootstrapping the Core/Flow doc layer (never bootstrapped in this repo). Deferred to `/tkm:rebuild-spec` in a future phase.

---

## What We Tried

**Card Styling (Dark vs. Cream)**: Initially built against the blueprint's assumption (dark #101417). MoMorph verification showed the live frame has cream. Rebuilt card styles to match; no rework of layout or structure.

**Overflow Debugging Path**: Started with Tailwind config review (thought CSS utilities weren't loading). Shifted to viewport-height constraints (thought body overflow was hidden). Landed on flex min-width — used Playwright bounding-box checks to identify which elements exceeded the viewport edge.

**i18n/Translation Scope**: Checked if Kudos labels needed i18n plumbing. User confirmed: single-language display for MVP, no i18n scaffolding needed.

---

## Root Cause Analysis

**Why the Design Mismatch Happened**: The blueprint was authored before MoMorph frame inspection. The plan assumed "dark Kudo cards" as a reasonable guess from prior design work. The source of truth is always the live frame, not the written plan.

**Why Flex Overflow Slipped Through**: The component-level test (vitest) passed because flex overflow doesn't fail tests — it silently renders wider than the viewport. The responsive e2e test (375px width) caught it. This is a gap in the foundational flex patterns: they need explicit `min-w-0` guards on children to avoid silent overflow.

**Why Accessibility Fix Was Needed**: The spotlight-board decorative search div had the visual structure of an input but no semantic `<input>` tag. Reviewer flagged for consistency with other searchable surfaces in the design system.

---

## Lessons Learned

1. **Verify Design Against the Source, Not the Plan**: Even a well-reasoned blueprint can diverge from the live design. Always cross-check critical styling details (colors, borders, spacing) against the MoMorph frame or live Figma before committing. Make it a gate in the workflow.

2. **Flex Overflow Is Silent**: `min-width: auto` on flex children is a footgun. The layout doesn't error; it just breaks responsiveness. The pattern should be documented in the design-system foundations: `flex-1` children must have `min-w-0` (or explicit min-width) to prevent overflow. Enforce this in component scaffolding templates.

3. **Responsive Tests Catch What Unit Tests Miss**: The 375px viewport test did the heavy lifting. Unit tests confirmed the components render; responsive tests confirmed they render *correctly at edge widths*. Both are required for real fidelity.

4. **Accessibility Parity Across Similar UI Surfaces**: If a surface looks like an input (search), it should be an `<input>` or `<button>`, not a div with visual styling. The reviewer's flagging of this is a lesson: audit all interactive-looking elements for semantic HTML consistency.

---

## Next Steps

1. **Document Flex Overflow Pattern in Design System** (Owner: Design System Lead) — Add a rule: `flex-1` children must include `min-w-0` or explicit `min-width`. Update component scaffolding templates. Timeline: before next flex-heavy feature.

2. **Gate: Design Verification Against Live Frame** (Owner: Takumi Discipline) — Add an inspection gate in the blueprint phase: "Critical styling details verified against MoMorph live frame (colors, borders, spacing, shadows)." Timeline: active now.

3. **Expand Responsive Test Coverage** (Owner: QA/Next Feature) — The 375px catch shows the value of edge-width tests. Expand e2e responsive suite to include 320px (phone minimum), 768px (tablet), and common desktop widths. Timeline: ongoing.

4. **Audit Accessibility Across Interactive UI** (Owner: Next Review Cycle) — Similar to the spotlight-board fix, audit all interactive-looking elements (search bars, filter buttons, toggles) for semantic HTML. Timeline: next review phase.

---

## Summary

Thirteen files delivered, five-phase pipeline clean, all gates green. The work is faithful to the design. The flex overflow lesson will prevent the same silent breakage in future features. The design-verification gate will catch misalignment earlier. The code is ready to ship; the team can trust it and learn from the patterns baked into it.

Commit `3a70725` on `feature/sun-kudos` — not yet pushed.
