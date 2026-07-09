---
feature: F012_LanguageDropdown
title: Language Dropdown (Dropdown ngôn ngữ)
lang: en
status: promoted
source_design:
  tool: MoMorph
  fileKey: 9ypp4enmFmdK3YAFJLIu6C
  screenId: hUyaaugye2
---

# F012 — Language Dropdown (Dropdown ngôn ngữ)

> **Superseded note (F014):** the "client-only local state, no i18n wiring in scope" decision below
> was superseded by [F014 — Internationalization](../F014_Internationalization/technical-spec.md),
> which rewires this switcher to a real `LanguageProvider` context. Kept here as a historical record
> of the F012-era decision.

## Summary

Build out the header's language switcher (currently an emoji + plain-text list
inline in `header.tsx`) into the Figma "Dropdown-ngôn ngữ": a rounded dark panel
listing 🇻🇳 VN and 🇬🇧 EN with flag icons, the active language highlighted, and
proper dismiss behaviour (outside-click + Escape). Extracted into its own
`language-switcher.tsx` component to match the design component boundary and keep
`header.tsx` lean.

## Decisions (confirmed with product owner)

- **Flag icons**: use the provided image assets
  `public/language-dropdown/VN - Vietnam.png` and
  `public/language-dropdown/GB-NIR - Northern Ireland.png` (rendered ~20×15 within
  a 24px box), not inline SVG or emoji.
- **Dismiss**: add outside-click (mousedown outside) + Escape close, with focus
  return to the trigger (mirroring the `hashtag-field.tsx` pattern) — an upgrade
  over the current toggle-only behaviour.
- **Extraction**: move the switcher (trigger + panel) out of `header.tsx` into
  `app/_components/homepage-saa/language-switcher.tsx`; `header.tsx` renders
  `<LanguageSwitcher />`. Behaviour of the rest of the header unchanged.
- **State**: selection stays client-only local state (VN default), as today — no
  i18n/routing wiring in scope.

## Functional requirements

| ID | Requirement | Surface | Testable |
|----|-------------|---------|----------|
| FR-001 | `LanguageSwitcher` extracted to its own file and rendered by `header.tsx` in the same header position; the rest of the header is unchanged | `header.tsx` + `LanguageSwitcher` | yes |
| FR-002 | Trigger button shows the active language's flag image + code (VN/EN) + a chevron that rotates when open; `aria-haspopup`, `aria-expanded` reflect state | `LanguageSwitcher` | yes |
| FR-003 | Open panel matches Figma: `border #998c5f`, `bg #00070c`, radius 8px, padding 6px, column of language rows | `LanguageSwitcher` | yes |
| FR-004 | Each row: flag image (24px box) + label (VN/EN, Montserrat 700, 16px, tracking 0.15), padding 16px, radius 4px, full-width, `justify-between`; the **active** language's row is highlighted `bg-[#ffea9e]/20` (rounded-sm) | `LanguageSwitcher` | yes |
| FR-005 | Selecting a row sets the active language, updates the trigger flag+code, and closes the panel | `LanguageSwitcher` | yes |
| FR-006 | Panel dismisses on outside mousedown and Escape; focus returns to the trigger; listeners attached only while open and cleaned up | `LanguageSwitcher` | yes |
| FR-007 | Works in both full and `minimal` header variants (login uses `<Header minimal />`, which still shows the language switcher) | `header.tsx` | yes |

## Reuse (no new copies)

- **Reused**: the outside-click+Escape `useEffect` pattern from
  `hashtag-field.tsx`; design tokens (`#998c5f`, `#00070c`, `#ffea9e`, white);
  `font-montserrat`; existing header layout/classes for the trigger.
- **New**: `app/_components/homepage-saa/language-switcher.tsx` (< 200 lines) +
  colocated test. `header.tsx` shrinks (removes the inline switcher, imports the
  component + drops now-unused lang state).
- **Assets**: the two provided flag PNGs under `public/language-dropdown/`.

## Key entities

- No data/model changes. Client-only `selectedLang: "VN" | "EN"` local state.

## Out of scope (YAGNI)

- Real i18n / translation / locale routing / persistence of the choice.
- More than two languages.

## Unresolved questions

1. The choice is not persisted (resets on reload) — acceptable for the mock?
2. Trigger currently defaults to VN; keep VN as the default active language?
