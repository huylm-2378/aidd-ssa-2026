---
feature: F009_UserProfile
title: User Profile (Profile bản thân)
lang: en
status: promoted
source_design:
  tool: MoMorph
  fileKey: 9ypp4enmFmdK3YAFJLIu6C
  screenId: 3FoIx6ALVb
  frameName: "Profile bản thân"
---

# F009 — User Profile (Profile bản thân)

## Summary

The logged-in Sunner's own profile page at route `/profile`. A colourful keyvisual
banner tops a centred identity block (avatar, name, department + tier badge, an
icon-collection strip), followed by a stats panel (Kudos received/sent, hearts
received, Secret Boxes opened/unopened) with a visual-only "Mở Secret Box"
button, then a KUDOS section listing the user's kudos with a Sent/Received
toggle. Header and footer are the shared site chrome. The page reuses the
existing sun-kudos component and data layer wholesale (no DB schema/migration).

## Decisions (confirmed with product owner)

- **Identity source**: logged-in Google account via Supabase `auth.getUser()`
  metadata (`full_name`/`name`, `avatar_url`/`picture`, `email`). Department and
  tier are **not** present in auth metadata → rendered with design-faithful
  placeholders (`CEVC3` / `Legend Hero`); not fabricated as "real" data.
- **Stats source**: the existing `kudos_stats` global singleton (id=1) via
  `getSidebarStats()` — its five counters map 1:1 to the five stat rows. No new
  per-user aggregation/migration.
- **Kudos feed + toggle**: fetch all kudos once (server); the "Đã gửi / Đã nhận"
  dropdown is a **real client-side filter** keyed on the current user's display
  name (sent = user is sender, received = user is receiver). Dropdown label shows
  the live count of the active subset; default tab = "Đã gửi" (sent). Empty
  subset → empty-state.
- **Secret Box button & Spam tag**: **visual-only** (no behaviour, no schema
  change). Spam is a presentational `isSpam?` flag on `KudoCard`.

## Functional requirements

| ID | Requirement | Surface | Testable |
|----|-------------|---------|----------|
| FR-001 | Route `/profile` renders as a server component following the `app/sun-kudos/page.tsx` shell (`Header` → `main` → `Footer`), exports `metadata`, fetches data server-side, fail-safe (fetch errors render an empty/placeholder board, never crash) | `app/profile/page.tsx` | yes |
| FR-002 | Keyvisual banner at top reuses `KudosKeyvisualBg` inside a `relative isolate overflow-hidden` wrapper, faithful to the design cover | `app/profile/page.tsx` | yes |
| FR-003 | Identity block: 200px circular avatar (4px white ring) from auth `avatar_url` (initials fallback via `KudoAvatar`), name in 36px gold (`#ffea9e`, Montserrat 700), department code + tier pill on one row | `ProfileIdentity` | yes |
| FR-004 | Icon-collection strip: label "Bộ sưu tập icon của tôi" with a row of 7 badge slots (80×64, gap 16px), rendered as decorative placeholders | `ProfileIdentity` | yes |
| FR-005 | Stats panel (680px, border `#998c5f`, bg `#00070c`, radius 17px, padding 40px): five label/value rows — "Số Kudos bạn nhận được", "Số Kudos bạn đã gửi", "Số tim bạn nhận được", "Số Secret Box bạn đã mở", "Số Secret Box chưa mở" — with a divider before the two Secret-Box rows; values from the `kudos_stats` singleton | `ProfileStats` | yes |
| FR-006 | "Mở Secret Box" button (gold `#ffea9e`, radius 8px) below the rows — **visual-only** (no click behaviour) | `ProfileStats` | yes |
| FR-007 | KUDOS section header: "Sun* Annual Awards 2025" (24px), divider, "KUDOS" wordmark (57px gold), and a Sent/Received dropdown on the right (`FilterDropdown`), sized to the 680px content column | `ProfileKudosSection` | yes |
| FR-008 | Sent/Received toggle: "Đã gửi" shows kudos authored by the current user, "Đã nhận" shows kudos where the current user is the receiver; the dropdown button shows the active subset count; switching re-filters without a reload | `ProfileKudosSection` (client) | yes |
| FR-009 | Kudos list renders each item with the existing `KudoCard`; a **visual-only** "Spam" pill appears top-right when `isSpam` is set; empty subset shows a graceful empty-state | `KudoCard` (+`isSpam?`) | yes |
| FR-010 | Layout faithful to the design at desktop (1440px, 680px content column) and degrades responsively (no horizontal body scroll on narrow viewports) | `app/profile/page.tsx` | yes |
| FR-011 | A "Profile" entry linking to `/profile` is reachable from the shared header account menu | `AccountMenu` | yes |

## Reuse (no new copies)

- **Directly reused**: `Header`, `Footer`, `KudosKeyvisualBg`, `KudoCard`,
  `KudoAvatar`, `FilterDropdown`; `mapKudoRow`, `formatTimeRange`, `getAllKudos`,
  `getSidebarStats`, supabase server client; design tokens (hardcoded hex).
- **New (small, each < 200 lines)**: `app/profile/page.tsx`; `ProfileIdentity`,
  `ProfileStats`, `ProfileKudosSection` under `app/_components/profile/`;
  `splitKudosByUser` (pure) under `app/_lib/profile/`; extracted `TierBadge`
  from `kudo-card.tsx`; `isSpam?` prop on `KudoCard`; `display?` prop on
  `FilterDropdown` (trigger-text override, backward-compatible).

## Key entities

- `kudos_stats` (singleton): `received`, `sent`, `hearts`, `secret_box_opened`,
  `secret_box_unopened`.
- `KudoCard` data shape (existing, `app/_lib/kudos-shared.ts` / `app/_lib/kudos/types.ts`).
- Auth user metadata: `full_name`/`name`, `avatar_url`/`picture`, `email`.

## Out of scope (YAGNI)

- Per-user stats aggregation / new migrations.
- Functional Secret Box opening flow.
- Real spam moderation / a spam data field.
- `/profile/[id]` for other Sunners (own profile only).
- Auth-gated redirect to `/login` (page renders fail-safe for logged-out visitors;
  reads are RLS-backed public data only).

## Accepted risks

- Department & tier use design-faithful placeholders (no auth-metadata source).
- Exact display-name matching: if the logged-in name matches no seeded kudos,
  both toggle subsets are empty (empty-state); duplicate display names would
  double-count. Accepted for the demo.
