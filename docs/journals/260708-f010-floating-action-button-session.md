# F010: Floating Action Button — Discovery of the Stub, Icon Deviation, and Motion-Reduce Guards

**Date**: 2026-07-08 15:32
**Severity**: N/A (Shipped)
**Component**: Homepage FAB (MoMorph Sv7DFwBw1h — expanded state only)
**Status**: Resolved (specification sealed, review SEALED 8/10)

## What Happened

Shipped F010 — the homepage floating action button ("Viết KUDOS" + "Thể lệ" disclosure) — through the full Takumi cycle (study → spec → forge → temper → inspect → deliver). PR #15 (commit b91a838). 127 tests pass, production build clean, specification promoted to `docs/features/F010_FloatingActionButton/`.

**Key discovery in Study**: a homepage FAB stub already existed at `app/_components/homepage-saa/floating-widget-button.tsx` — a placeholder built for the same FR-006 requirement. The task was not building from scratch but completing the stub. This rewrote the scope: rather than "create," it was "build out an existing scaffolding." Lesson captured.

Product decisions confirmed:
- Homepage-only mounting (keep existing mount point in homepage layout; no global or root layout mount)
- Collapsed state: round red toggle button with + icon, rotates 45° to × on expand (single toggle — Figma only provided the expanded state)
- "Viết KUDOS" action: opens the existing WriteKudoModal (trigger ref passed, reuse all modal logic)
- "Thể lệ" action: navigates to `/awards-information` via next/link

Heavy reuse:
- WriteKudoModal (open state, onClose handler, triggerRef for focus return)
- next/link (standard Next.js routing)
- Outside-click + Escape keyboard handling (pattern copied from hashtag-field.tsx; no new UX logic)

New patterns added to the codebase:
- **Motion-reduce guards**: The FAB expands/collapses with framer-motion, but `prefers-reduced-motion` was unhandled anywhere in the codebase before this. Added conditional animation logic — respect user preference, skip motion if `media(prefers-reduced-motion: reduce)` matches. This sets a reusable pattern for future motion-heavy components.

## The Brutal Truth

The build was clean, but one design artifact was unavailable and demanded a workaround. Design delivered the expanded state only; no collapsed-state mockup. Built the toggle logic from the spec and visual inference. The stinger: the "Thể lệ" Sun\* spark icon wasn't fetchable from MoMorph (401/500 errors), and the only logo PNGs available are full wordmarks — illegible and disproportionate at 24px icon scale. Hand-built a SunSparkIcon component as an approximation. Flagged for visual sign-off.

Review caught one nit and applied it: aria-haspopup "menu" → "true" (since the popup isn't a real ARIA menu structure; "true" matches the hashtag-field disclosure precedent). 0 critical issues. SEALED.

Process friction: the test file was being concurrently edited (tester adding tests) during its read by the reviewer. The review snapshot was stale mid-inspection. Reminder that running tester + reviewer in parallel on the same files yields a stale review until one finishes.

## Technical Details

**Component Structure**:
- `app/_components/homepage-saa/floating-widget-button.tsx`: rewritten from stub to full FAB — collapse/expand state, motion guards, click-outside + Escape handlers.
- Mounts at homepage layout level (existing mount point preserved).
- Rendering: collapsed toggle (red button, +/× icon rotation) → expanded disclosure (Viết KUDOS + Thể lệ options).

**Motion-Reduce Pattern** (`prefers-reduced-motion` guard):
```ts
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

// Inside framer-motion config:
animate={isExpanded && !prefersReducedMotion ? "expanded" : "collapsed"}
transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
```

Respects user accessibility setting; no motion if user enabled reduced-motion. Applicable pattern for future Hero sections, modals, drawer animations.

**Icon Reuse & Deviation**:
- WriteKudoModal, next/link imported and passed; no new route logic.
- SunSparkIcon hand-built (MoMorph vector unavailable; design review flag set for visual sign-off).

## What We Tried

1. **Fetching SunSparkIcon from MoMorph**: Failed with 401/500 errors (permission or service degradation). Fallback: hand-built SVG approximation. Flag left for design team visual approval.
2. **Global layout mount**: Considered placing FAB in root layout for site-wide availability. Spec confirmed homepage-only; kept existing mount point. Simpler scope, matches spec.
3. **Multiple toggle buttons for each action**: Figma only showed expanded state. Built single + toggle that expands to show both actions inline. Spec-compliant; collapsed mockup wasn't needed.

## Root Cause Analysis

**Icon Unavailability**: MoMorph export failed (upstream issue — not a code problem). Design system doesn't have a spark icon in the icon library at scale. Solution: approximated with hand-built SVG; design needs to confirm visual match or provide the asset.

**Concurrent Editing During Review**: Tester and reviewer ran in parallel on the same test file. Reviewer read a mid-edit snapshot, saw incomplete test coverage, flagged it — but the tester was still writing. By merge time, tests were complete. Process issue, not code issue. Reminder: sequence tester → reviewer, or use file locks to prevent mid-edit reads.

**Motion Guard Absence**: No component in the codebase was checking `prefers-reduced-motion` before. This isn't a bug — it's an oversight in accessibility design. FAB forced the pattern; now it's available for reuse.

## Lessons Learned

1. **Study First — The Stub Was Already There**: Before building a new component, scan for half-done scaffolding. The placeholder stub saved scope definition; the lesson is that "new feature" often means "finish what's started, not start from zero."

2. **Motion Guards Are Essential for Accessibility**: `prefers-reduced-motion` is a legal requirement (WCAG 2.1 Level AAA). Every framer-motion animation should check this; don't assume users want motion. Sets a pattern: wrap all future Lottie/Framer animations in this guard.

3. **Design Assets Can Break Downstream Work**: Icon files, vectors, and exports aren't code — they're dependencies. When MoMorph returns 401/500, have a fallback: hand-built SVG, placeholder, or escalate. Don't block on the asset if you can approximate and flag for sign-off.

4. **Concurrent Editing on Shared Files Is a Trap**: If two agents (tester + reviewer) read/write the same file in parallel, one sees a stale snapshot. Safer to sequence: finish writing, then read; or use file-level coordination to prevent mid-edit reads.

## Next Steps

1. **Visual Sign-Off on SunSparkIcon** (Owner: Design) — Hand-built SVG approximate; confirm visual match or provide the real asset from MoMorph. Timeline: before next design handoff (non-blocking, can ship with approximation).

2. **Apply Motion-Reduce Pattern to All Animations** (Owner: Component Library Maintainer) — Audit all framer-motion and Lottie uses; add `prefers-reduced-motion` checks. Timeline: follow-up cleanup task, not urgent.

3. **Coordinate Tester + Reviewer Sequencing** (Owner: Process) — Document that tester finishes before reviewer reads, or use file locks. Prevents stale review snapshots. Timeline: process improvement, implement on next feature cycle.

---

127 tests pass, production build clean, feature ship-ready. One design asset (SunSparkIcon) is an approximation flagged for visual sign-off. Motion-reduce guards set a new accessibility pattern for the codebase. Code sealed and merged.

Commit b91a838 on `feature/floating-action-button` — PR #15 merged.
