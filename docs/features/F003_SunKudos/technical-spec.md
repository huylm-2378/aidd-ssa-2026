---
status: implemented
authored_by: create-plan
created: 2026-07-03
lang: en
fcode: F003
---

# F003_SunKudos

**Priority**: P1
**Type**: ui

## Overview

Public Sun* Kudos page at route `/sun-kudos`, implementing MoMorph frame "Sun* Kudos - Live board"
(`9ypp4enmFmdK3YAFJLIu6C` / `MaZUn5xHXZ` / `2940:13431`). It is the destination for the "Sun* Kudos"
header/footer nav (active state) and the homepage Kudos banner CTA — replacing the current
placeholder route. A recognition-and-thanks wall: hero + Sunner search, a Highlight Kudos carousel
with Hashtag/Phòng ban filters, a Spotlight Board name word-cloud, and an All Kudos feed alongside a
personal-stats + Secret Box sidebar. Static/client-rendered, mock data only, no backend. Reuses the
homepage Header and Footer.

> **Note (2026-07-07):** the Spotlight Board (FR-007) described below as a static word-cloud was
> superseded by a real-time, interactive pan/zoom constellation — see
> [F008 — Sun* Kudos Live Spotlight Board](../F008_KudosLiveBoard/technical-spec.md).

## Requirements

| Code | Description | Handler | Verifiable |
|------|-------------|---------|------------|
| FR-001 | Render reused sticky Header with "Sun* Kudos" in active/selected state (gold + underline + `aria-current="page"`) | `Header` (existing) | yes |
| FR-002 | Render keyvisual background banner behind the hero (reusing the homepage keyvisual asset/approach) | `KudosHero` | yes |
| FR-003 | Render hero: "Hệ thống ghi nhận và cảm ơn" label + "KUDOS" logotype/title | `KudosHero` | yes |
| FR-004 | Render search bar: prompt input ("Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?") + "Tìm kiếm profile Sunner" search field with icons | `KudosSearchBar` | yes |
| FR-005 | Render Highlight Kudos section: "Sun* Annual Awards 2025" eyebrow + "HIGHLIGHT KUDOS" title + functional Hashtag & Phòng ban filter dropdowns (AND-combined, reset carousel to page 1 on change, empty state "Không có Kudo phù hợp" when nothing matches) + multi-card peek carousel (center card + partially-visible neighbors as fixed 528×525 slides at `lg`+ with long content ellipsized — single-line time/title/hashtags, line-clamped body, one-row photo strip; edge peeks fade into the background via directional gradient overlays instead of uniform opacity; single-card clamped-intrinsic fallback below `lg`) with prev/next arrows + page indicator, showing the top-5 most-liked kudos sorted by `likeCount` descending (`getHighlightKudos`) | `HighlightKudosSection` | yes |
| FR-006 | Render Kudo card: sender & receiver avatars + names + role code + hero-tier badge, timestamp range, title, body text, hashtags, like count (`♥ 1.000`), "Copy Link", "Xem chi tiết" | `KudoCard` | yes |
| FR-007 | Render Spotlight Board: "Sun* Annual Awards 2025" eyebrow + "SPOTLIGHT BOARD" title + dark board panel headed "388 KUDOS" showing a name word-cloud (representative mock sample of names, varied sizes) + a scrolling activity-log strip | `SpotlightBoard` | yes |
| FR-008 | Render All Kudos section: "Sun* Annual Awards 2025" eyebrow + "ALL KUDOS" title + a vertical feed of Kudo cards (left column) | `AllKudosSection` | yes |
| FR-009 | Render All Kudos sidebar (right column): stats panel (Số Kudos bạn nhận được / đã gửi / tim bạn nhận được / Secret Box đã mở / Secret Box chưa mở, each with a count) + "Mở Secret Box" button + "10 Sunner nhận quà mới nhất" avatar list | `KudosSidebar` | yes |
| FR-010 | Render reused Footer with "Sun* Kudos" active | `Footer` (existing) | yes |
| FR-011 | Route `/sun-kudos` renders this page, replacing the placeholder stub | `app/sun-kudos/page.tsx` | yes |

> FR-006 update (F015): the heart + like count is now a real per-user like toggle (`HeartButton`),
> not static display — see `F015_KudosHearts`.

## Key entities

- `KudoCard`: `id, senderName, senderRole, senderTier, senderAvatar, receiverName, receiverRole,
  receiverTier, receiverAvatar, timeRange, title, body, hashtags[], likeCount, photos[], department`.
- `SunnerStat`: `label, value`.
- `SpotlightName`: `name, weight` (weight drives font size in the cloud).
- `RecentGiftSunner`: `name, note, avatar`.

Mock data lives in a dedicated `app/_lib/*` module (following `award-categories.ts` / `event-info-content.ts`).

## Success criteria

- SC-001: Visiting `/sun-kudos` shows all sections (hero, search, highlight carousel, spotlight
  board, all-kudos feed + sidebar) with copy faithful to the frame.
- SC-002: Header AND footer show "Sun* Kudos" active (gold + underline + `aria-current="page"`); the
  homepage Kudos banner CTA and nav links resolve to real content (no dead-end placeholder).
- SC-003: Layout is pixel-faithful to `MaZUn5xHXZ` at 1512px (Playwright measurement) and responsive
  (feed + sidebar stack below `lg`, carousel/board scroll on narrow screens).
- SC-004: Highlight carousel advances via prev/next arrows; page indicator reflects position.

## Assumptions

- Faithful static clone with mock data (matches F001/F002 pattern) — no backend, no persistence.
- Spotlight Board renders a representative sample of names (not all 118 design nodes); the "388
  KUDOS" and activity-log figures are static mock content.
- Interactivity is light/client-only: carousel paging plus real client-side Hashtag/Phòng ban
  filter narrowing (AND-combined) over mock data; "Mở Secret Box" and profile search remain
  visual-only (no real action).
- Avatars/photos use available Figma-exported assets or neutral placeholders where unavailable.

## Out of scope

- Real Kudos submission ("Gửi lời chúc Kudos" backend persistence — the composer UI itself now ships
  as F006_WriteKudo), Kudo detail view, Secret Box open flow, profile pages, notifications,
  authentication, and any backend/persistence.
- The separate `D1_Sunkudos`, `View Kudo`, `Thể lệ` frames (future features; `Viết Kudo` shipped as
  F006_WriteKudo).
