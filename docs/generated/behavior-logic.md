<!-- layout-exempt: rebuild-spec owns all docs/system|features|generated|flows paths — all references here are output targets or internal definitions -->
# Behavior Logic

**Project**: aidd-ssa-2026 (Sun* Annual Awards 2025)
**Generated**: 2026-07-17
**Analysis Scope**: `scout-report.md § Background Logic Source Inventory` (JS/TS subsection)

**Code Format**: All codes follow `BL###_NameSlug`.

---

## Cardinality Reconciliation Note (read before the Index)

The scout inventory's `### JS/TS` subsection (`scout-report.md:378-1512`) contains **1,129** bullet lines. Of those:

- **1,108 lines (98.1%) are `.next/**` build-artifact paths** — `.next/build/`, `.next/dev/`, `.next/server/` compiled chunks matching generic markers (`Queue(`, `addEventListener`, `EventListener`, `setInterval`) inside bundled framework/vendor code (Next.js runtime, Supabase SDK, Turbopack runtime). `.next/` is git-ignored build output (`.gitignore:20`), never authored source. These are treated as a vendor/build-artifact leak analogous to the `node_modules/`/`vendor/` exclusions in `verification-checklist-core-artifacts.md § Rule 6` — **excluded entirely**, 0 BL items emitted for them.
- **21 lines are real source**, spanning **7 distinct files** under `app/`. Per Rule C1 (Mode A — no per-file decorator convention applies here; multiple grep hits within one file are the same symbol/hook, not distinct logic units), these collapse to **7 inventory entries → 7 BL items** (BL001–BL002 below), a 1:1 file-to-BL mapping.

**On BL type accuracy for these 7 (per task NOTE — "classify accurately with the right BL type" rather than omit):** all 7 files are **client-side React UI-interaction hooks** (outside-click/Escape dismiss, focus-trap, pan/zoom drag, countdown tick) — verified by reading each file in full. None are genuine backend/system background logic (no cron, queue, backend pub-sub, DB observer, mail, notification service, request middleware, CLI, external-API integration, or webhook exists anywhere in this codebase — consistent with `route-list.md` showing only 1 GET route, 1 refresh-only proxy, and 3 Server Actions total for the whole app). `bl-source-patterns.md`'s per-stack table has **no row for plain Next.js/React** (only a NestJS-decorator row exists for "TS", which does not apply — this app has zero NestJS decorators); per `composite-screen-detection.md § Signal Inference Fallback` (mirrored by `bl-source-patterns.md § Signal Inference Fallback`), all 7 are tagged **`[SIGNAL_INFERRED]`** with the mandatory 3-part justification, mapped to the closest-fitting canonical type by literal marker-name correspondence (`addEventListener`/`EventListener` → `event-listener`; `setInterval` → `scheduled-job`), with an explicit caveat in each Description that the fit is imperfect (DOM-level, not backend pub-sub/cron). This preserves the Cardinality Contract (Rule C1: every inventory entry gets a BL) while being honest about classification confidence.

**Cardinality Cross-Check inputs for the reviewer** (per `verification-checklist-core-artifacts.md § BehaviorLogic`):
- Inventory total (post build-artifact exclusion): **21 raw hits / 7 files**
- Artifact BL count: **7**
- Gap (file-basis): 0% — PASS
- `[SIGNAL_INFERRED]` count: 7 of 7 (100% of this stack's entries) — **exceeds** the `bl-source-patterns.md § Rule 5` inferred-ratio thresholds (>50% → critical) **if** JS/TS/Next.js were a table-covered stack; it is not, so per Rule 5's exemption clause ("stacks outside the table... are exempt — 100% inferred is expected and Rule 5 does not fire") this should PASS, not critical. Flagging explicitly for reviewer confirmation since the exemption's applicability (table has *a* JS/TS-labeled row, just not one matching this project's framework) is itself a judgment call.
- Category drop: all 7 entries fall under 2 of the 10 canonical types (`event-listener`, `scheduled-job`); the other 8 canonical types have 0 entries in inventory and 0 BL — not a drop (no inventory entries of those types exist to require coverage).

---

## Inclusion/Exclusion Matrix (scout-side filter) — applied retroactively above

| Include | Exclude |
|---------|---------|
| All 7 real-source files in scout `## Background Logic Source Inventory` | 1,108 `.next/**` build-artifact lines (vendor/build leak, excluded above) |
| `[SIGNAL_INFERRED]`-tagged entries (all 7, justified above and per-item below) | Abstract base classes, traits, interfaces — none present |
| | Test files (`*.test.ts(x)`) — none of the 7 are test files (their `.test.tsx` siblings exist but were not in the scout hit list) |

---

## Behavior Logic Index

| Code | Name | Type | Trigger |
|------|------|------|---------|
| BL001_FloatingWidgetDismissListener | FloatingWidgetDismissListener | event-listener | FAB menu opens (`isOpen === true`) |
| BL003_LanguageSwitcherDismissListener | LanguageSwitcherDismissListener | event-listener | Language dropdown opens (`open === true`) |
| BL004_HashtagFieldDismissListener | HashtagFieldDismissListener | event-listener | Hashtag dropdown opens (`open === true`) |
| BL005_RecipientSelectDismissListener | RecipientSelectDismissListener | event-listener | Recipient autocomplete list opens (`open === true`) |
| BL006_DialogA11yKeyListener | DialogA11yKeyListener | event-listener | Any dialog using `useDialogA11y` opens (`open === true`) |
| BL007_PanZoomWheelListener | PanZoomWheelListener | event-listener | Spotlight canvas container mounts |
| BL002_CountdownRefreshTimer | CountdownRefreshTimer | scheduled-job | `useCountdown` mounts with a valid `eventStartIso` |

---

## BL001_FloatingWidgetDismissListener

**Type**: event-listener
**Trigger**: FAB menu opened (`isOpen` becomes `true`) — mounts a document-level `mousedown`/`keydown` listener; unmounted on close.
**Payload**: N/A — not a notification/event/webhook type.
**File Schema**: N/A — not a file-exchange type.
**Source File**: `app/_components/homepage-saa/floating-widget-button.tsx`
**Source Symbol**: `FloatingWidgetButton`

### Description

`[SIGNAL_INFERRED]` — **Intent matched:** `event-listener` ("Event-driven handlers") by literal marker correspondence (`document.addEventListener("mousedown"|"keydown", ...)`). **No-row reason:** `bl-source-patterns.md` has no row for plain Next.js/React; the table's only TS row (NestJS `@OnEvent()`) does not apply — no NestJS decorators exist in this repo. **Observed pattern:** registers `mousedown`/`keydown` (Escape) document listeners while the homepage FAB menu is open, to close the menu on outside-click or Escape and return focus to the toggle button; both listeners are removed in the effect's cleanup (`floating-widget-button.tsx:38-52`). **Caveat:** this is client-side DOM event handling for a UI dismiss pattern, not backend event-driven/pub-sub logic — the canonical type is a best-fit label, not a literal match to the type's typical backend intent.

### Related Modules

- `WriteKudoModal`, `RulesModal` (opened by this component's menu)

### Related Routes

- _(none — pure client UI state)_

### Related Data Models

- _(none)_

---

## BL003_LanguageSwitcherDismissListener

**Type**: event-listener
**Trigger**: Language dropdown opened (`open` becomes `true`).
**Payload**: N/A
**File Schema**: N/A
**Source File**: `app/_components/homepage-saa/language-switcher.tsx`
**Source Symbol**: `LanguageSwitcher`

### Description

`[SIGNAL_INFERRED]` — **Intent matched:** `event-listener` by literal marker correspondence. **No-row reason:** same as BL001 — no per-stack row for this framework's plain-hook pattern. **Observed pattern:** registers `mousedown`/`keydown` document listeners while the header language panel is open, closing it on outside-click or Escape and restoring focus to the trigger (`language-switcher.tsx:38-52`); mirrors BL001's pattern exactly (same author comment: "mirrors hashtag-field.tsx"). **Caveat:** client-side DOM dismiss pattern, not backend event-driven logic.

### Related Modules

- `LanguageProvider` (`app/_components/i18n/language-provider.tsx`) — receives the selected locale

### Related Routes

- _(none)_

### Related Data Models

- _(none)_

---

## BL004_HashtagFieldDismissListener

**Type**: event-listener
**Trigger**: Hashtag multi-select dropdown opened (`open` becomes `true`), inside the Write-Kudo composer.
**Payload**: N/A
**File Schema**: N/A
**Source File**: `app/_components/sun-kudos/hashtag-field.tsx`
**Source Symbol**: `HashtagField`

### Description

`[SIGNAL_INFERRED]` — **Intent matched:** `event-listener`. **No-row reason:** same as BL001. **Observed pattern:** registers `mousedown`/`keydown` document listeners while the hashtag dropdown is open, closing it on outside-click or Escape (`hashtag-field.tsx:31-45`); the canonical original of the "mirrors hashtag-field.tsx" pattern reused by BL001/BL003. **Caveat:** client-side DOM dismiss pattern, not backend event-driven logic.

### Related Modules

- `WriteKudoModal` (parent composer)

### Related Routes

- _(none)_

### Related Data Models

- _(none)_

---

## BL005_RecipientSelectDismissListener

**Type**: event-listener
**Trigger**: Recipient autocomplete list opened (`open` becomes `true`), inside the Write-Kudo composer.
**Payload**: N/A
**File Schema**: N/A
**Source File**: `app/_components/sun-kudos/recipient-select.tsx`
**Source Symbol**: `RecipientSelect`

### Description

`[SIGNAL_INFERRED]` — **Intent matched:** `event-listener`. **No-row reason:** same as BL001. **Observed pattern:** registers a single `mousedown` document listener while the autocomplete results list is open, closing it on a genuine outside click — deliberately *not* on blur, to avoid racing the parent dialog's focus-trap auto-focus (`recipient-select.tsx:38-47`, documented in the file's own comment as a fix for a real observed bug). **Caveat:** client-side DOM dismiss pattern, not backend event-driven logic.

### Related Modules

- `WriteKudoModal` (parent composer)

### Related Routes

- _(none — recipient data itself is fetched via `useSunnerOptions`/`getSunnerOptions()`, outside this listener's scope)_

### Related Data Models

- _(none)_

---

## BL006_DialogA11yKeyListener

**Type**: event-listener
**Trigger**: Any dialog consuming `useDialogA11y` opens (`open` becomes `true`) — currently `WriteKudoModal` and `RulesModal`.
**Payload**: N/A
**File Schema**: N/A
**Source File**: `app/_components/sun-kudos/use-dialog-a11y.ts`
**Source Symbol**: `useDialogA11y`

### Description

`[SIGNAL_INFERRED]` — **Intent matched:** `event-listener`. **No-row reason:** same as BL001. **Observed pattern:** shared a11y hook registering document-level `keydown` listeners for (a) Escape-to-close and (b) Tab/Shift+Tab focus-trap cycling, plus a body-scroll-lock side effect and focus restoration to the trigger on close (`use-dialog-a11y.ts:21-77`). Reused verbatim by both modal dialogs in the app, so this single file's behavior fans out to every dialog instance. **Caveat:** client-side DOM dismiss/focus-management pattern, not backend event-driven logic.

### Related Modules

- `WriteKudoModal`, `RulesModal` (both consumers)

### Related Routes

- _(none)_

### Related Data Models

- _(none)_

---

## BL007_PanZoomWheelListener

**Type**: event-listener
**Trigger**: Spotlight constellation canvas container mounts (`app/_components/sun-kudos/spotlight-canvas.tsx` via `usePanZoom`).
**Payload**: N/A
**File Schema**: N/A
**Source File**: `app/_components/sun-kudos/use-pan-zoom.ts`
**Source Symbol**: `usePanZoom`

### Description

`[SIGNAL_INFERRED]` — **Intent matched:** `event-listener` by literal marker correspondence (`el.addEventListener("wheel", handler, { passive: false })`). **No-row reason:** same as BL001; additionally this project uses plain DOM Pointer Events + a native non-passive wheel listener rather than any tabulated gesture/animation library. **Observed pattern:** attaches a non-passive `wheel` listener on the Spotlight Board's canvas container to zoom (clamped `[MIN_SCALE, MAX_SCALE]`) while calling `preventDefault()` to stop page scroll — necessary because React's synthetic `onWheel` binds a passive listener where `preventDefault()` is a no-op (`use-pan-zoom.ts:41-50`, documented in the file's own comment). Drag-pan and arrow-key-pan/zoom are handled via React synthetic Pointer/Keyboard event props, not raw `addEventListener` (only the wheel listener is a raw DOM registration). **Caveat:** client-side canvas-interaction pattern, not backend event-driven logic.

### Related Modules

- `SpotlightCanvas`, `SpotlightBoardLive`

### Related Routes

- _(none)_

### Related Data Models

- _(none)_

---

## BL002_CountdownRefreshTimer

**Type**: scheduled-job
**Trigger**: `useCountdown(eventStartIso)` mounts with a non-null, parseable `eventStartIso`; re-arms on every 60,000ms tick until unmount.
**Payload**: N/A
**File Schema**: N/A
**Source File**: `app/_lib/use-countdown.ts`
**Source Symbol**: `useCountdown`

### Description

`[SIGNAL_INFERRED]` — **Intent matched:** `scheduled-job` ("cron-like scheduled tasks") is the closest of the 10 canonical types for a recurring, interval-driven execution; chosen over `queue-worker` (no queue/consumer semantics) and over treating it as a no-type omission. **No-row reason:** `bl-source-patterns.md` has no row for a client-side `setInterval` UI-refresh pattern in any stack (its scheduled-job rows are all server-side cron/beat integrations). **Observed pattern:** recomputes days/hours/minutes-remaining from a fixed `eventStart` Date every 60 seconds via `setInterval`, clearing the interval on unmount (`use-countdown.ts:71-80`); falls back to a frozen "00" elapsed state if the date is missing/malformed (never throws) and never goes negative. **Caveat — important:** this is **not** a true cron/backend scheduled job; it is a client-side recurring UI-refresh timer with no network or persistence side effect. It is cross-referenced under `## Client-Side Logic § Polling` below as the more semantically accurate home for this pattern; the BL### entry exists to satisfy the Cardinality Contract's 1:1 inventory mapping, not because this is genuine background/system logic.

### Related Modules

- `CountdownTile` (homepage `Hero`, `app/prelaunch/countdown-row.tsx`) — both consumers

### Related Routes

- _(none)_

### Related Data Models

- _(none — `eventStartIso` is a static/config value, not fetched from a modeled entity)_

---

## Summary

- **Total Behavior Logic Items**: 7
- **By Type**: custom-command: 0, event-listener: 6, integration: 0, mail: 0, middleware: 0, notification: 0, observer: 0, queue-worker: 0, scheduled-job: 1, webhook: 0

---

## Cross-Reference Validation

- [x] All BL### codes are unique
- [ ] All BL### codes are referenced in UserStories.md (type=system) — **N/A this wave**: `user-stories.md` does not exist yet in this pipeline run (Wave 1 artifacts only)
- [ ] All BL### codes are referenced in FeatureList.md — **N/A this wave**: `feature-list.md` does not exist yet
- [x] All related route references are valid — none of the 7 items reference a ROUTE###
- [x] All related data model references are valid — none of the 7 items reference a MODEL###
- [x] No orphaned behavior logic references
- [x] All BL items have Source File + Source Symbol fields (Rule C2) — single-valued, no delimiter violations
- [x] All Source File paths match scout Background Logic Source Inventory entries (Rule C2/C3) — all 7 map 1:1 to the 7 non-`.next/` files in the inventory

---

## Client-Side Logic

### Debounce / Throttle

`N/A — no debounce or throttle patterns detected.` Repo-wide grep for `debounce|throttle` returned no matches. `RecipientSelect` and `HighlightKudosSection` filter synchronously on every keystroke/change with no timer wrapper.

### Optimistic UI

```
BL-C01 — HeartButton optimistic like/unlike
pattern: optimistic-ui
source: app/_components/sun-kudos/heart-button.tsx:49-73
trigger: user clicks the heart/like control on any KudoCard
optimistic-action: flip `liked` and adjust `count` by ±1 immediately (plain useState, no useOptimistic — no codebase precedent per the file's own comment)
rollback: on `toggleHeart` server-action failure, revert to the captured pre-click `liked`/`count` and show an inline translated error (`resolveHeartError`)
reconcile: on success, adopt the server's authoritative `liked`/`likeCount` rather than trusting the local increment
```

### Polling

```
BL-C02 — useCountdown recurring refresh (cross-ref BL007_CountdownRefreshTimer)
pattern: polling (client-side timer, no network call — see caveat below)
source: app/_lib/use-countdown.ts:71-80
trigger: component mounts with a valid eventStartIso
interval: 60,000ms
stops-when: component unmounts (clearInterval in effect cleanup); logically "completes" once diffMs <= 0 but the interval keeps re-arming (harmless — computeCountdown clamps to the frozen ELAPSED_STATE)
caveat: recomputes a local Date diff only — no API/network call, so this is a looser fit for "Polling" than the section's canonical signature (recurring *API* call); documented here as the closest available Client-Side Logic slot rather than omitted.
```

### Upload Progress

`N/A — no upload progress patterns detected.` `ImageUploadField` (`app/_components/sun-kudos/image-upload-field.tsx:24-31`) only creates local `URL.createObjectURL` previews, capped at `MAX_IMAGES`, with no XHR/fetch upload and no progress tracking of any kind.

### Realtime (WebSocket / SSE / EventSource)

```
BL-C03 — Spotlight Board Supabase Realtime subscription
pattern: realtime
source: app/_components/sun-kudos/use-kudos-realtime.ts:26-53
trigger: SpotlightBoardLive mounts (SCR004_SunKudosPage/REG004)
channel: Supabase Realtime channel "kudos-live-board", `postgres_changes` INSERT filter on `public.kudos` (schema: public, table: kudos)
reconnect: none observed — on `CHANNEL_ERROR`/`TIMED_OUT` the handler only `console.error`s; no retry/backoff logic
teardown: `supabase.removeChannel(channel)` on effect cleanup (component unmount)
degrade: silently keeps the last-known server-rendered snapshot on channel failure — no user-facing error (FR-008/SC-005 per the file's own comment)
```

<!-- Researcher must also draft docs/system/business-rules.md (plain-language) from this artifact — deferred: no BR-### numbered rules originate from these 7 BL items; the source code's own inline BR-00N comments (use-countdown.ts, heart-button.tsx) belong to feature specs (F006/F010/F015), not this artifact, per code-formats.md § Per-Spec Scope. -->
