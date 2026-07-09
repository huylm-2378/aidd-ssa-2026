---
feature: F011_CountdownPrelaunch
title: Countdown / Prelaunch Page
lang: en
status: promoted
source_design:
  tool: MoMorph
  fileKey: 9ypp4enmFmdK3YAFJLIu6C
  screenId: 8PJQswPZmU
  frameName: "Countdown - Prelaunch page"
---

# F011 — Countdown / Prelaunch Page

## Summary

A standalone full-screen prelaunch page at `/prelaunch`: the Root-further
keyvisual on a dark background, centered "Sự kiện sẽ bắt đầu sau" heading, and a
live DAYS / HOURS / MINUTES countdown rendered in the existing digital-tile
style. No site header/footer. Almost entirely an assembly of existing,
already-tested pieces (`useCountdown`, `CountdownTile`, the login full-bleed bg
pattern) — a trimmed, centered variant of the homepage hero countdown.

## Decisions (confirmed with product owner)

- **Route**: `/prelaunch` (`app/prelaunch/page.tsx`), no `Header`/`Footer` chrome.
- **Countdown target**: reuse the existing `NEXT_PUBLIC_SAA_EVENT_START` env var
  (same source as the homepage hero) — DRY, no new config.
- **Digits**: reuse `CountdownTile` (Geist Mono via `font-digital`, `tabular-nums`,
  gold-bordered glass tiles) — no new 7-segment font.
- **Background**: reuse `/homepage-saa/keyvisual-bg.png` (Root-further keyvisual)
  with the login page's full-bleed pattern (`Image fill object-cover object-right`
  + left/dark gradient scrim over `bg-[#00101a]`).
- **Hydration**: gate the live digits behind a shared `useMounted` flag (extract
  the currently-private `useMounted` from `write-kudo-modal.tsx` into a shared
  `app/_lib/use-mounted.ts`, DRY) to avoid an SSR/client time mismatch.

## Functional requirements

| ID | Requirement | Surface | Testable |
|----|-------------|---------|----------|
| FR-001 | Route `/prelaunch` renders a full-screen page (`relative isolate flex min-h-screen flex-col bg-[#00101a]`) with NO `Header`/`Footer`; exports `metadata` | `app/prelaunch/page.tsx` | yes |
| FR-002 | Full-bleed Root-further keyvisual background (`/homepage-saa/keyvisual-bg.png`, `Image fill object-cover object-right`, `-z-10`, `pointer-events-none`, `aria-hidden`) under a dark left→right gradient scrim faithful to the design | `app/prelaunch/page.tsx` | yes |
| FR-003 | Centered content: an `<h1>` "Sự kiện sẽ bắt đầu sau" (Montserrat 700, white, ~36px, vietnamese subset), above the countdown row, vertically+horizontally centered in the viewport | `app/prelaunch/page.tsx` | yes |
| FR-004 | A live countdown driven by `useCountdown(process.env.NEXT_PUBLIC_SAA_EVENT_START)` rendering three `CountdownTile`s labelled DAYS / HOURS / MINUTES (two digits each), auto-refreshing (hook's 60s interval), clamped to 00 when elapsed | `app/prelaunch/page.tsx` + `CountdownTile` + `useCountdown` | yes |
| FR-005 | Live digits are gated behind a shared `useMounted` so server and first client render agree (no hydration warning); pre-mount renders a stable placeholder (zeros) | `app/prelaunch/page.tsx` + `useMounted` | yes |
| FR-006 | When the target is elapsed/absent (`isPending:false`), the page still renders gracefully (zeros), never crashes | `app/prelaunch/page.tsx` | yes |
| FR-007 | Layout is responsive (desktop 1512px design; digits/labels scale down and stay centered with no horizontal body scroll on narrow viewports) | `app/prelaunch/page.tsx` | yes |

> **F014 (round 5) update:** FR-003's heading now renders via a new
> `prelaunch-heading.tsx` client leaf reading `prelaunch.heading` from the i18n
> catalog (same VN text), not inline in `page.tsx`; `page.tsx` composes it —
> see `docs/features/F014_Internationalization/technical-spec.md` FR-014.

## Reuse (no new copies)

- **Directly reused**: `useCountdown` (`app/_lib/use-countdown.ts`), `CountdownTile`
  (`app/_components/homepage-saa/countdown-tile.tsx`), the login full-bleed bg
  pattern (`app/login/page.tsx`), design tokens (`#00101a`, `#ffea9e`), fonts
  (`font-montserrat`, `font-digital`), `keyvisual-bg.png`.
- **New (small)**: `app/prelaunch/page.tsx`; `app/_lib/use-mounted.ts` (extracted
  shared hook — update `write-kudo-modal.tsx` to import it, keeping its behaviour
  identical). Reference the homepage `hero.tsx` wiring as the template.
- Each file < 200 lines.

## Key entities

- No data/model changes. `NEXT_PUBLIC_SAA_EVENT_START` (ISO string) is the only input.

## Out of scope (YAGNI)

- Seconds in the countdown (design shows DAYS/HOURS/MINUTES only; hook provides
  exactly these).
- A true 7-segment webfont (Geist Mono `font-digital` matches the existing tiles).
- Auth-gating the rest of the site behind the prelaunch page / redirect logic.
- A separate event-date config (reuses the existing env var).

## Unresolved questions

1. Should `/prelaunch` be linked from anywhere (nav/redirect) or remain a
   directly-visited standalone route? (Assumed standalone for now.)
2. Extracting `useMounted` to `app/_lib/` touches `write-kudo-modal.tsx` (import
   swap only, no behaviour change) — confirm acceptable vs. a countdown-local copy.
