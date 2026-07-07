---
feature: F008
slug: F008_KudosLiveBoard
title: Sun* Kudos — Live Spotlight Board
lang: en
priority: P1
type: ui
status: draft
related:
  screens: ["MaZUn5xHXZ (Sun* Kudos - Live board)", "Frame 552 / node 2940:14170 (Spotlight Board)"]
  routes: ["/sun-kudos"]
  models: ["kudos", "sunners"]
  supersedes_section: "F003 Spotlight Board (static word-cloud)"
---

# F008 — Sun* Kudos — Live Spotlight Board

## Overview

Upgrade the `/sun-kudos` **Spotlight Board** section (currently a static, server-rendered
word-cloud) into a **real-time, interactive "Live board"** faithful to MoMorph screen
"Sun* Kudos - Live board" (Frame 552 → `B.7_Spotlight`). The board shows a live total kudo
count, a scattered **constellation** of Sunner names on a **pan/zoom** canvas, a **functional**
Sunner search that filters/highlights names, and a **live activity ticker** — all updating in
real time as new Kudos are inserted, with no page refresh.

The initial data (count, names, activity) is still fetched server-side (SC: fail-safe fallback
preserved); a client Supabase **Realtime** subscription on `public.kudos` INSERT then keeps the
view live.

## Requirements

| Code | Description | Handler | Verifiable |
|------|-------------|---------|------------|
| FR-001 | Section header unchanged — eyebrow "Sun* Annual Awards 2025" + "SPOTLIGHT BOARD" title over the dark board panel | `SpotlightBoard` | yes |
| FR-002 | Total count "`<N>` KUDOS" (B.7.1) rendered from the server-fetched count, gold number + white "KUDOS" | `SpotlightBoard` | yes |
| FR-003 | **Constellation of names** — one node per **distinct** kudo receiver (deduped by id; no repeated names), each a text label at a deterministic pseudo-random position, varied small→large size by weight (word-cloud style, no dot marker); default names are white shades (no gold), gold is reserved for search matches (FR-005); roster kept only for the ticker's `receiver_id → name` lookup | `SpotlightCanvas` / `getSpotlight` | yes |
| FR-004 | **Pan/zoom** (B.7.2): drag to pan, wheel/pinch to zoom (clamped), a visible pan/zoom control; keyboard pan (arrows) + zoom (`+`/`-`) for a11y; honors `prefers-reduced-motion` | `SpotlightCanvas` | yes |
| FR-005 | **Functional Sunner search** (B.7.3): typing filters/highlights matching names in the cloud (case/diacritic-insensitive contains); non-matches dim; empty query restores all | `SpotlightBoard` | yes |
| FR-006 | **Live count**: on a `kudos` INSERT realtime event, the count increments immediately (no refresh) | `SpotlightBoard` (client) | yes |
| FR-007 | **Live activity ticker**: each incoming INSERT prepends an entry "`<HH:MMPM>` `<receiver name>` đã nhận được một Kudos mới"; receiver name resolved via an id→name map (payload carries only `receiver_id`); capped to N most-recent | `SpotlightBoard` (client) | yes |
| FR-008 | **Fail-safe**: initial server fetch errors → empty board renders gracefully (no crash); realtime subscription failure degrades to the static server snapshot (no error surfaced to user) | `queries.getSpotlight` + client | yes |
| FR-009 | Realtime enabled on `public.kudos` via an idempotent migration adding the table to the `supabase_realtime` publication; existing "public read kudos" RLS SELECT already gates anon realtime reads | `supabase/migrations/0003_*.sql` | yes |
| FR-010 | Board background faithful to Figma (B.7_Spotlight `image 24/25` + `Root further mo rong 1`): the Root Further keyvisual dimmed under a ~80% dark scrim + a screen-blended particle/star field with a motion-safe twinkle; rounded panel with a gold-toned border; purely decorative (aria-hidden), never reduces name-cloud readability | `SpotlightBoardBg` | yes |
| FR-011 | **Live recipient badge**: on a `kudos` INSERT realtime event, a top-left "LIVE" badge (pulsing indicator + recipient name + "vừa nhận Kudos") appears fixed to the canvas viewport, and that recipient's node pulses (radar ping); the badge is absent until the first live event | `SpotlightCanvas` (client) | yes |

## Key entities

- **Spotlight view shape** (server): `{ count: number; sunners: { id: string; name: string }[]; activity: string[] }`.
  `getSpotlight()` changes its sunners query from `select("name")` to `select("id,name")` so the
  client can resolve realtime `receiver_id` → name for the ticker.
- **Realtime payload**: `postgres_changes` INSERT on `public.kudos` → `payload.new` is the raw kudos
  row (`id, receiver_id, created_at, …`) — **no embedded receiver name** (that only exists on
  PostgREST joined reads). Ticker resolves the name from the id→name map; unknown id → skip or
  generic label.

## Constraints

- **No new npm dependencies** — pan/zoom via Pointer/Wheel events + CSS `transform: translate() scale()`.
- Reuse the existing browser client singleton `app/_lib/supabase/client.ts` (no new client, no new env vars).
- Realtime subscription lives in a **Client Component**; the section shell + initial data stay
  server-rendered. Subscribe in `useEffect`, clean up with `supabase.removeChannel(channel)`.
- Files < 200 lines — split the board into shell + canvas (+ hooks) as needed.
- Read `node_modules/next/dist/docs/` for the client-component / env caveats before coding (AGENTS.md).

## Acceptance criteria

- SC-001: `/sun-kudos` Spotlight Board renders the constellation + count + activity from Supabase,
  faithful to Frame 552 (dark panel, gold count, scattered names, search top-left, activity feed).
- SC-002: Inserting a Kudo (e.g. via the composer / a DB insert) makes the count increment and a new
  activity line appear **without a page refresh** (realtime).
- SC-003: Typing in the search filters/highlights matching names; clearing restores the full cloud.
- SC-004: Pan (drag + arrows) and zoom (wheel + `+`/`-`) work and are clamped; reduced-motion honored.
- SC-005: With Supabase unreachable, the board still renders (empty/last-snapshot) with no crash and
  no user-facing error.

## Operator handoff (manual, once)

Apply `supabase/migrations/0003_kudos_realtime.sql` in the Supabase dashboard → SQL Editor (adds
`public.kudos` to the `supabase_realtime` publication). Realtime must be enabled for the project.

## Unresolved questions

- Should the activity ticker also seed from the newest existing kudos on first load, or start empty
  and fill only from live events? (Default: seed from server `activity`, then prepend live events.)
