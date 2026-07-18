# Fix: Spotlight Board Design Fidelity (frame B.7) — Session Delivered

**Date**: 2026-07-18
**Severity**: Normal
**Component**: Sun* Kudos / Spotlight Board (F008 visuals, F003 section)
**Status**: Resolved — sealed

---

## What Happened

Ran the fix-bug pipeline on the Spotlight Board: the F008 implementation was functionally complete
but visually diverged from MoMorph frame `B.7_Spotlight` (node `2940:14174`) on six counts. Queried
the design node tree for exact specs (count text node `3007:17482`: 36px all-white; search pill
instance `2940:14833`: `rgba(255,234,158,.10)` fill + `#998C5F` border + full radius; activity
nodes `3004:15995-99`: six 14px/700 lines, opacity graded 0.1→1 downward; single pan-zoom
affordance bottom-right). Rebuilt the panel as a fixed-height (548px desktop / 420px mobile)
overlay stage: background photo, full-bleed pan/zoom canvas, centered white count, gold-tint search
pill top-left, fading vertical activity stack bottom-left, controls bottom-right. Node field inset
so names never collide with the top band or the activity stack; live-recipient highlight switched
to the design's red `#F17676`.

## The Brutal Truth

Two measurement lessons. First, Tailwind v4 resolves opacity-modified colors into `lab()` — a
`toHaveCSS("background-color", "rgba(...)")` assertion can never pass; even canvas `fillStyle`
serialization keeps `lab()` intact. The robust pattern: paint 1px and compare `getImageData` RGBA
with ±1 tolerance. Second, the pre-repair baseline screenshot made the diagnosis mechanical — every
divergence was enumerable against the node data instead of eyeballed.

## Delivered

- `app/_components/sun-kudos/spotlight-board-live.tsx` — overlay-stage layout, white count,
  gold-tint pill, fading vertical activity stack (visible cap 6, newest bottom)
- `app/_components/sun-kudos/spotlight-canvas.tsx` — inner frame removed, node-field inset, zoom
  cluster bottom-right, live tone `#F17676`, toasts repositioned under the pill
- `e2e/sun-kudos-live-board.spec.ts` — unconditional design-fidelity regression test (count color,
  pill border + pixel-compared fill, flex-column ticker with `firstOpacity < lastOpacity === 1`),
  proven red without the fix

## Verification

227/227 vitest · tsc/eslint/build clean · 4/4 live-board e2e (keyboard pan/zoom + seeded search
filter intact) · red/green proof via stash · reviewer SEALED 9/10, 0 critical · evidence gate
hard-SEALED (`plans/reports/fix-spotlight-board-design/evidence/`).
