---
status: implemented
authored_by: create-plan
created: 2026-07-02
lang: en
fcode: F002
---

# F002_AwardsInformation

**Priority**: P1
**Type**: ui

## Overview

Public, unauthenticated Awards Information page at route `/awards-information`, implementing MoMorph
frame "Hệ thống giải" (`9ypp4enmFmdK3YAFJLIu6C` / `zFYDgyj_pD` / `313:8436`). It details the six SAA
2025 award categories and is the deep-link target for the homepage award cards (`#<slug>`), the
header "Award Information" nav, and the hero "ABOUT AWARDS" CTA. Static/client-rendered; no backend.
Reuses the homepage Header, Footer, and Kudos banner.

## Requirements

| Code | Description | Handler | Verifiable |
|------|-------------|---------|------------|
| FR-001 | Render reused sticky Header with "Award Information" in active/selected state | `Header` (existing) | yes |
| FR-002 | Render hero band: keyvisual banner + Root Further logo + "Sun* Annual Awards 2025" label + divider + "Hệ thống giải thưởng SAA 2025" title | `AwardsHero` | yes |
| FR-003 | Render sticky left sidebar anchor-nav with 6 category links (`#<slug>`), highlighting the section currently in view; hidden below `lg` | `AwardSidebarNav` | yes |
| FR-004 | Render 6 award detail sections, each: badge (frame + name logotype), title w/ Target icon, long description, quantity (+unit), prize value(s) (+note) | `AwardDetailSection` | yes |
| FR-005 | Section `id` equals the category slug so homepage `#<slug>` deep links resolve and scroll (header-offset via `scroll-mt`) | `page.tsx` | yes |
| FR-006 | Alternate section layout: even index badge-left, odd index badge-right; stack on mobile | `AwardDetailSection` | yes |
| FR-007 | Signature 2025 - Creator shows TWO prize rows ("cho giải cá nhân" / "cho giải tập thể") separated by "Hoặc" | `AwardDetailSection` | yes |
| FR-008 | Render reused Kudos banner and Footer | existing components | yes |

## Key entities

`AwardCategory` (extended): `slug, title, description, nameSrc, nameWidth, nameHeight,
longDescription, quantity, quantityUnit, prizes[{value, note}]`.

## Success criteria

- SC-001: Visiting `/awards-information` shows all 6 categories with exact design copy (quantities,
  prize values, descriptions) verified against the frame.
- SC-002: Each homepage award card deep-links to and scrolls to its matching section.
- SC-003: Header shows "Award Information" active (gold + underline + `aria-current="page"`).
- SC-004: Layout is pixel-faithful to `zFYDgyj_pD` at 1512px (Playwright measurement) and responsive
  (stacks below `lg`, sidebar hidden).

## Assumptions

- Sidebar hidden below `lg` (design is desktop 2-col); sections stack full-width on mobile.
- Meta icons (Target/Diamond/License) rendered as inline SVG when simple, else PNG assets.
- No backend; all content is static from `award-categories.ts`.

## Out of scope

- Award nominee/winner data, filtering, or any dynamic/auth-gated content.
