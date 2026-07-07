# F008: Live Spotlight Board — Real-Time Constellation and the Spec-to-Reality Gap

**Date**: 2026-07-07 16:30
**Severity**: N/A (Shipped)
**Component**: Sun* Kudos / Spotlight Board (MoMorph screen MaZUn5xHXZ)
**Status**: Resolved (operator steps pending)

## What Happened

Shipped F008 — the Sun* Kudos "Live Spotlight Board" — as a full real-time, interactive feature. Static display → Supabase Realtime listener + interactive pan/zoom canvas + diacritic-insensitive search. PR #11 (commits 38492cc feat + 2056ee1 chore seed).

Feature set:
- **Real-time**: Supabase Realtime on `kudos` INSERT; count and activity ticker update without page refresh. Client island + browser-client singleton; cleanup via `supabase.removeChannel`.
- **Canvas**: Interactive pan/zoom constellation of 62 distinct Sunner names. Keyboard + pointer + wheel controls (CSS transform, no deps). Gold-highlight search matches; dim the rest. Diacritic-insensitive (NFD + explicit đ→d).
- **Background**: Figma-faithful; Root Further keyvisual darkened + particle/star field overlay, screen-blend.
- **Data**: New idempotent migration `0003_kudos_realtime.sql`; seed expanded to 62 sunners + ~100 kudos; new `getSpotlight` query returns `{count, nodes, roster}`.
- **Code**: 5 new TSX/TS files (spotlight-board, spotlight-board-live, spotlight-canvas, use-kudos-realtime, use-pan-zoom), plus spotlight-fns.ts with unit tests, migration, seed, e2e spec, and full F008 docs.

## The Brutal Truth

The spec said "word cloud/diagram of kudo receivers, counts, recent activity." It did NOT say: *What is a node?* Is it a sunner? A received kudo? A distinct receiver? The first build visualized the 12-row sunners table (seemed reasonable from the spec), which left the canvas sparse even with 200 kudos. User saw the live board and said "there's no data." Three pivots later (sunners → receivers → deduped distinct names), and suddenly it made sense.

Also stung: found a wheel-zoom bug halfway through. React synthetic `onWheel` handlers in this Next 16 build are passive listeners by default. When the canvas called `e.preventDefault()` to suppress scroll during zoom, it failed silently. Spent an hour tracing event capture logic before realizing the browser just ignored the prevent. Native non-passive listener fixed it — but didn't expect that breaking change.

The realtime constraints add friction too. Anon clients can't INSERT due to RLS (security is right; no fix needed), so bulk seed data must go through the Supabase SQL Editor with service role. Migration has to be applied. Realtime has to be toggled in the dashboard. These are operator steps, not dev-time only, and they're easy to miss.

## Technical Details

**Event listener fix:**
React synthetic handlers are passive here. Attached native listener via `ref.current.addEventListener('wheel', handleWheel, { passive: false })`. Synthetic handler still fires (for telemetry), but native one captures and prevents.

**Data contract:**
Realtime INSERT events have `receiver_id` but no `receiver_name`. Storing names client-side would duplicate the table. Instead, `getSpotlight` returns a `roster: {[id]: name}` map. Realtime updates the count; the roster is immutable. Clean and avoids stale-name bugs.

**Search:** NFD handles most diacritics. Added explicit đ→d mapping for Vietnamese. Gold highlighting appears only on exact search matches — not by weight. Cleaner canvas.

**Data model journey:**
- v1: 12 sunners → sparse canvas
- v2: Kudo receivers → denser, but duplicates
- v3: Deduped distinct names + 62 sunners + ~100 kudos → proper constellation
- v4 (user feedback): No per-node dot markers, enlarge canvas, gold only on search match

## What We Tried

1. **Sunners-only canvas**: Reasonable from spec; turned out sparse.
2. **Names in Realtime payload**: Violated data contract (Realtime comes from Postgres).
3. **Weight-based gold**: User feedback: "too noisy; gold only on search."
4. **Per-node activity dots**: User feedback: "removes whitespace; text is cleaner."
5. **Client-side dedupe in render**: Worked but hacky; deduped in query instead.

## Root Cause Analysis

Specs use prose ("word cloud/diagram, counts, activity"). The prose doesn't define the atomic record — a node, in this case. The first model (sunners) was a reasonable read; user feedback revealed it was wrong. That's not a mistake; it's the normal end of the spec-to-reality bridge. The pivots made the feature right.

The wheel bug came from not expecting React to change listener passivity in a way that breaks scroll-preventDefault. Silent failure made it harder to trace.

Realtime seeding constraints are security, not bugs — just operator overhead.

## Lessons Learned

1. **Specs are prose; features are concrete.** "Word cloud of receivers" doesn't say what a *node* is. Clarify the data model early, or loop the user into the build as you go.
2. **Realtime has operator overhead.** Publishing tables, enabling in the dashboard, seeding through SQL Editor — these are part of "done."
3. **React event passivity is a breaking change.** Wheel/touch synthetic handlers are passive here. Need preventDefault? Attach native listener with `{ passive: false }`.
4. **Dedupe early, render late.** Resolve duplicates in the query, not the render loop.
5. **Reserve visual emphasis for intent.** Gold on every weight threshold adds noise. Gold on search matches reads cleaner.

## Next Steps

**Operator steps (to activate):**
1. Apply migration `0003_kudos_realtime.sql`.
2. Toggle Realtime ON in Supabase dashboard.
3. Run seed (SQL Editor or service-role script).

**Non-blocking notes:**
- Activity ticker renders shape only; no line-width animation (spec-correct, low priority).
- One-count race between initial fetch and Realtime subscribe (not observable in practice; add code comment).

**Optional follow-ups (out of scope):**
- Animate activity ticker (line-width pulse).
- Pinch zoom on mobile.
- Realtime connection-state logging.
