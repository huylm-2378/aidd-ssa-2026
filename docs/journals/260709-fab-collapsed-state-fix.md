# FAB Collapsed-State Fix — Hidden Frame, Inferred Design, Missing Reality

**Date**: 2026-07-09 16:30
**Severity**: Medium (UX bug in shipped F010)
**Component**: Floating Action Button collapsed state (floating-widget-button.tsx)
**Status**: Resolved

## What Happened

User reported: homepage FAB showed its "pressed" look (red × icon) on page load, not the collapsed toggle. F010 shipped with a single inferred collapsed state (round red + button that rotates to ×). Investigation revealed the design had a second frame — `_hphd32jN2` (MoMorph mm:313:9137 "Floating Action Button - phim nổi chức năng") — showing the true collapsed state: a gold pill (106×64px, radius 100px, #ffea9e background, #FAE287 glow) holding pen + "/" + Sun* logo icons. Commit a8ebe10, PR #21, branch `fix/fab-collapsed-state`.

## The Brutal Truth

The sting: this wasn't a display glitch or a logic error. It was a design that was half-built from the start. F010 shipped from only the OPENED frame (Sv7DFwBw1h); the collapsed state was inferred and approximate. The real spec was there — unused — waiting in the design file the whole time. Page load showed the inferred design, not the actual one. Six hours lost because one frame went unread.

## Technical Details

**Fix Applied**:
- State-conditional render in `floating-widget-button.tsx`: gold pill when `!isExpanded`, static red × container when `isExpanded`.
- PlusIcon deleted (replaced by inline SVG icons: pen, "/", Sun* logo on gold pill).
- Gold pill styling: `h-16 w-24 rounded-full` with shadow glow.
- New regression test pinning both visual states (collapsed/expanded).
- 2 obsolete "+"-rotation tests removed (toggle now swaps visuals, not rotates).
- aria-labels unchanged; all interaction tests survived untouched.

**Docs Patched**:
- F010 spec: 6 stale mentions of "+/×" rotation removed; correct pill description added.
- Screen-list SCR008: collapsed state visual updated.
- Feature-list F010: noted adjacent fix — FAB now opens F013 rules drawer, not `/awards-information` route.

**Test Results**: 223/223 passing across 35 files; tsc/eslint/build clean.

## What We Tried

1. **Inferring the missing state from the spec text**: F010 spec said "round red toggle," but the design frame showed something else. The inference felt safe — it wasn't.
2. **Checking MoMorph for the missing frame early**: Didn't happen. Assumed the provided frame was the only one. Lesson born from this.

## Root Cause Analysis

Design file held two frames; the Study phase pulled only the OPENED one (Sv7DFwBw1h). The collapsed frame (`_hphd32jN2`) was in the Figma file but not flagged in the handoff. When a component has visible state variants in the design, listing them all is a spec requirement — not optional. F010 build assumed a missing state rather than escalating to ask for it. That gap created 6 hours of wasted motion.

## Lessons Learned

1. **When a design ships multiple frames of the same component, build from ALL of them.** Don't infer unseen states. Check MoMorph's `list_frames` for the component-set before assuming a look. This class of bug — inferred state that contradicts hidden reality — is silent and expensive.

2. **A frame not in the spec doesn't mean it doesn't exist.** The gold pill was there; it just wasn't called out. Better process: during Study, ask "show me every variant this component has, visual and behavioral."

3. **Collapsed/expanded/loading/disabled/error states are all equal — none gets skipped.** Treating one frame as "the" design and inferring the rest is a two-act failure: incomplete spec review, then incomplete component build.

## Next Steps

None remaining. FAB renders correctly on load (gold pill), expands to red × container (user actions), tests pass, docs aligned. Shipped.

---

223 tests pass, build clean. Gold pill now shows on page load as designed. The real lesson is the process: list all frames before drawing a single line.

Commit a8ebe10 on `fix/fab-collapsed-state` — PR #21 merged.
