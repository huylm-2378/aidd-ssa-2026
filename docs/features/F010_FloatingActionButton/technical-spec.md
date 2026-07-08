---
feature: F010_FloatingActionButton
title: Floating Action Button (phím nổi chức năng)
lang: en
status: promoted
source_design:
  tool: MoMorph
  fileKey: 9ypp4enmFmdK3YAFJLIu6C
  screenId: Sv7DFwBw1h
  frameName: "Floating Action Button - phim nổi chức năng 2"
---

# F010 — Floating Action Button (phím nổi chức năng)

## Summary

A fixed bottom-right floating action button on the homepage. Collapsed, it is a
round red toggle. When opened it reveals two gold action pills stacked above it —
"Thể lệ" (rules) and "Viết KUDOS" (write a kudos) — and the toggle becomes the
red close (×). Builds out the existing homepage stub
`floating-widget-button.tsx` into the real two-action widget from the Figma
design, reusing the existing write-kudos composer modal and the awards page.

## Decisions (confirmed with product owner)

- **Scope**: homepage only — keep the current mount in `app/page.tsx` (no
  global/layout mount). The existing stub is replaced by the real widget.
- **Collapsed toggle**: a round red (`#d4271d`) button showing a `+` glyph that
  **rotates 45° into ×** when opened (single toggle, consistent with the design's
  red close button). Not a separate gold button.
- **Actions**:
  - "Viết KUDOS" → opens the existing `WriteKudoModal` (client modal, portal),
    driven by the FAB's own `composerOpen` state; the FAB toggle button is the
    modal's `triggerRef` for focus return.
  - "Thể lệ" → navigates to `/awards-information` (rules/awards page).
- **Reduced motion**: expand/rotate animations respect `prefers-reduced-motion`
  via Tailwind `motion-reduce:` variants (new pattern, added here).

## Functional requirements

| ID | Requirement | Surface | Testable |
|----|-------------|---------|----------|
| FR-001 | A fixed bottom-right container (`fixed bottom-… right-… z-40`) renders on the homepage; below the sticky header (`z-50`) so it never overlaps the nav | `FloatingActionButton` | yes |
| FR-002 | Collapsed state: a 56×56 round red (`#d4271d`) button with a `+` glyph; `aria-haspopup="menu"`, `aria-expanded=false`, accessible label (e.g. "Mở menu thao tác") | `FloatingActionButton` | yes |
| FR-003 | Clicking the toggle opens the menu: the two action pills appear stacked above (newest layout per Figma: "Thể lệ" top, "Viết KUDOS" below), and the toggle glyph rotates 45° into × with `aria-expanded=true` | `FloatingActionButton` | yes |
| FR-004 | "Thể lệ" pill: gold `#ffea9e`, radius 4px, padding 16px, Sun* logo icon (24px) + label "Thể lệ" (Montserrat 700, dark `#00101a`); navigates to `/awards-information` | `FloatingActionButton` | yes |
| FR-005 | "Viết KUDOS" pill: gold `#ffea9e`, radius 4px, padding 16px, pen icon (24px) + label "Viết KUDOS"; opens `WriteKudoModal` and closes the menu | `FloatingActionButton` + `WriteKudoModal` | yes |
| FR-006 | The menu closes on: the toggle (×), Escape, and outside click (mousedown outside the widget) — mirroring the existing hashtag-field pattern; focus returns to the toggle | `FloatingActionButton` | yes |
| FR-007 | Expand/collapse + glyph rotation are animated with Tailwind transitions, gated by `motion-reduce:` so reduced-motion users get an instant state change | `FloatingActionButton` | yes |
| FR-008 | The homepage renders the built-out FAB in place of the old stub with no regression to the rest of `app/page.tsx` | `app/page.tsx` | yes |

## Reuse (no new copies)

- **Replace/build out**: `app/_components/homepage-saa/floating-widget-button.tsx`
  (existing stub; keep its inline `PenIcon`; add a `+`/× toggle glyph and a
  Sun* logo mark). Renaming is optional — keep the file/import stable if simpler.
- **Directly reused**: `WriteKudoModal` (`open`/`onClose`/`triggerRef`,
  self-contained with mock `sunnerOptions` fallback); `next/link` for the rules
  route; the outside-click+Escape `useEffect` pattern from `hashtag-field.tsx`;
  design tokens (`#d4271d`, `#ffea9e`, `#00101a`); `CloseIcon` path from
  `write-kudo-modal.tsx` if a distinct × is needed.
- Each file stays < 200 lines.

## Key entities

- No data/model changes. Pure client UI. `WriteKudoModal` already owns its own
  form state + `createKudo` server action.

## Out of scope (YAGNI)

- Global/layout mount and per-route gating (homepage only for now).
- A separate collapsed screen ("chức năng 1") — the collapsed state is the red
  toggle defined here.
- New persistence, new routes, or changes to the composer/awards internals.

## Unresolved questions

1. Collapsed glyph is `+` (rotates to ×) per the confirmed decision — Figma only
   shows the expanded state; confirm `+` is acceptable vs a pen glyph.
2. z-index: FAB `z-40` under the `z-50` sticky header (WriteKudoModal portals
   above both). Confirm the FAB should stay below the header.
