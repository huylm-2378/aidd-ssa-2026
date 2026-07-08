---
feature: F013_RulesModal
title: Rules Drawer (Thể lệ)
lang: en
status: promoted
source_design:
  tool: MoMorph
  fileKey: 9ypp4enmFmdK3YAFJLIu6C
  screenId: b1Filzi9i6
  figmaNode: "3204:6051"
  frameName: "Thể lệ UPDATE"
---

# F013 — Rules Drawer (Thể lệ)

## Summary

A right-side "Thể lệ" (rules) drawer opened from the FAB's "Thể lệ" action. A dark
553px panel with scrollable rules content — Hero badge tiers (New/Rising/Super/
Legend), a 6-icon collectible set, and "Kudos Quốc Dân" — and a footer with
"Đóng" (close) + "Viết KUDOS" buttons. Reuses the existing modal infrastructure
(portal + `useDialogA11y` + `useMounted`) exactly like `WriteKudoModal`.

## Decisions (confirmed with product owner)

- **Trigger**: the FAB "Thể lệ" pill opens this drawer (change it from the
  `<Link href="/awards-information">` to a button that opens `RulesModal`), mirroring
  how the "Viết KUDOS" pill opens `WriteKudoModal`.
- **"Viết KUDOS" button** inside the drawer opens the existing `WriteKudoModal`
  (closes the rules drawer first). Wired via an `onWriteKudos` callback from the FAB.
- **Hero badges**: use the provided images
  `public/rules-icons/MM_MEDIA_{New,Rising,Super,Legend} Hero.png` (not TierBadge).
- **6 collectible icons**: use the provided images `public/rules-icons/Huy hiệu.png`
  + `Huy hiệu (1..5).png`, mapped **in file order** to the design labels REVIVAL,
  TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER.
  (Assumption — see Unresolved #1; user to correct any mismatch.)
- **Content**: static rules copy lives in a new `app/_lib/rules-content.ts`
  (content-constants pattern), not hardcoded in the component.

## Functional requirements

| ID | Requirement | Surface | Testable |
|----|-------------|---------|----------|
| FR-001 | `RulesModal` is a portal dialog (`createPortal` to `document.body`), SSR-guarded by `useMounted`, `role="dialog"` `aria-modal`, backdrop `bg-black/60`, right-anchored panel; reuses `useDialogA11y` (Escape, scroll-lock, focus-trap, focus-return via `triggerRef`) | `RulesModal` | yes |
| FR-002 | Panel matches Figma: dark `#00070c`, width ~553px (responsive `w-full max-w-[553px]`), padding 24/40/40, content column ~473px, gap 24; content area scrolls when taller than the viewport | `RulesModal` | yes |
| FR-003 | Title "Thể lệ" (45px Montserrat 700 gold `#ffea9e`) | `RulesModal` | yes |
| FR-004 | "Người nhận" section: heading + intro + four tier rows, each = the tier badge image + count label (e.g. "Có 1-4 người gửi Kudos cho bạn") + description, for New/Rising/Super/Legend Hero | `RulesModal` + `rules-content` | yes |
| FR-005 | "Người gửi" section: heading + intro + a 6-icon grid (2×3) each = icon image + name label, + the "phần quà bí ẩn" note | `RulesModal` + `rules-content` | yes |
| FR-006 | "KUDOS QUỐC DÂN" section: gold heading + copy | `RulesModal` + `rules-content` | yes |
| FR-007 | Footer: "Đóng" (bordered `#998c5f`, bg `#ffea9e/10`, close icon) closes the drawer; "Viết KUDOS" (gold `#ffea9e`, flex-1, pen icon) triggers the composer | `RulesModal` | yes |
| FR-008 | FAB "Thể lệ" pill opens `RulesModal`; "Viết KUDOS" inside it opens the existing `WriteKudoModal`; both dismiss cleanly with focus returning to the FAB toggle | `FloatingWidgetButton` | yes |

## Reuse (no new copies)

- **Reused**: `WriteKudoModal` structure as the template (portal/backdrop/panel),
  `useDialogA11y` (`app/_components/sun-kudos/use-dialog-a11y.ts`), `useMounted`
  (`app/_lib/use-mounted.ts`), the two-button footer pattern + `CloseIcon`/pen icon,
  design tokens (`#00070c`, `#ffea9e`, `#998c5f`), `font-montserrat`.
- **New**: `app/_components/sun-kudos/rules-modal.tsx` (< 200 lines) + colocated test;
  `app/_lib/rules-content.ts` (title, tiers[], icons[], national-kudos copy, button
  labels). FAB updated to open it.
- **Assets**: `public/rules-icons/*` (4 hero badges + 6 collectible icons, provided).

## Key entities

- No data/model changes. Static content only. `RulesModal` props:
  `{ open, onClose, onWriteKudos?, triggerRef? }`.

## Out of scope (YAGNI)

- Real Secret Box / icon-collection state; real per-user badge computation.
- Wiring rules copy to a CMS/DB (static constants).
- Keeping the `/awards-information` route (unchanged; only the FAB pill target moves).

## Unresolved questions

1. The 6 collectible icons are provided as generically-named files
   (`Huy hiệu.png`, `(1..5)`) — mapped in file order to the design labels. Confirm
   the order, or tell me which file is which icon.
2. Drawer slide-in animation: add a right-to-left transition (motion-safe) or keep
   it a plain overlay like `WriteKudoModal`? (Assumed plain overlay for parity.)
