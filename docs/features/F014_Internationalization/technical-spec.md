---
feature: F014_Internationalization
title: Internationalization (i18n / Multi-language VN·EN)
lang: en
status: promoted
source_design:
  tool: none
  note: Infrastructure feature — no MoMorph screen. Builds on F012 Language Dropdown.
---

# F014 — Internationalization (i18n / Multi-language)

## Summary

Make the header language switcher actually change the app's language. Today
`LanguageSwitcher` (F012) only flips a flag icon via local `useState` — no copy
changes. This feature introduces a real, dependency-free i18n layer: a client
`LanguageProvider` (React Context) holding the active locale, typed message
catalogs (`vi.ts` / `en.ts`), a `useTranslation()` hook exposing `t(key)` and
`{ lang, setLang }`, and localStorage persistence. The switcher rewires from
local state to this context, and the **always-visible chrome (header, footer),
the homepage, the Profile screen, the Awards-information page, and the
centralized `_lib/*-content.ts` copy files in scope** are migrated to read
their strings through `t()`.

**Scope extension (same cycle):** after the initial chrome + homepage
migration landed, scope was extended to the Profile screen and the
Awards-information page (see Scope below). This introduced a new pipeline:
server-side mappers can now hand the client a catalog *key* instead of fixed
copy — `mapStats()` (`app/_lib/kudos/map.ts`) returns `SunnerStat.label` as a
`MessageKey` (e.g. `"stats.received"`), translated at render time in both
`profile-stats.tsx` and `sun-kudos/kudos-sidebar.tsx`.

**Round 3 (same cycle):** the FAB's two pills + menu aria labels, the whole
"Thể lệ" rules drawer, and the `/sun-kudos` screen itself (hero, search bar,
sidebar recent-gifts heading + Secret Box CTA, highlight-empty state,
kudo-card view-details action, carousel controls + page interpolation,
spotlight aria/zoom/reset/search, and the live activity ticker) are migrated.
The catalog crossed 200 lines per language and was split into per-area
fragments under `app/_lib/i18n/messages/` (`{vi,en}-core.ts` for rounds 1–2,
`{vi,en}-kudos.ts` for round 3); `vi.ts`/`en.ts` now just compose the
fragments, keeping the compile-checked `Messages`/`MessageKey` shape from
FR-002 unchanged.

**Round 4 (same cycle):** the Write Kudo composer modal (`write-kudo-modal.tsx`,
`kudo-editor.tsx`'s rich-text toolbar, `recipient-select.tsx`,
`image-upload-field.tsx`, `hashtag-field.tsx`) is migrated, adding a fourth
fragment pair `{vi,en}-composer.ts` (36 `composer.*` keys, 155 total). Two
existing key-not-string patterns extend into the composer:
`write-kudo-content.ts`'s `WRITE_KUDO_COPY` now holds `MessageKey`s (not raw
copy), and `write-kudo-form.ts`'s `missingRequired()` returns `MessageKey[]`
that the modal translates and joins into `composer.missingHint`'s `{fields}`
interpolation. This round also introduces a **second server-boundary
pattern**: the `createKudo` server action (`app/sun-kudos/actions.ts`, F007)
can't call `t()` (no React context there), so on known failure it now returns
a stable `CreateKudoErrorCode` (`"missing_fields" | "auth_required" |
"unknown"`) instead of a VN string; the new pure helper
`app/_lib/write-kudo-error.ts`'s `resolveComposerError(t, error)` maps each
code to a `composer.error.*` key, passing anything else (a dynamic
Supabase/`Error.message` string) through untranslated as-is.

**Round 5 (same cycle, final):** the three remaining Vietnamese-only routes —
`/login`, `/prelaunch`, and `/auth/auth-code-error` — are migrated. All three
are Server Components exporting `metadata`, so each gets a small new
`"use client"` leaf (`login-welcome.tsx`, `prelaunch-heading.tsx`,
`auth-error-content.tsx`) that calls `useTranslation()` and renders the
translated copy; the page itself is untouched otherwise (same chrome,
markup, `metadata`). `google-login-button.tsx`'s label and
`countdown-row.tsx`'s DAYS/HOURS/MINUTES labels are also switched to `t()`.
`app/_lib/login-content.ts` (F004's static-copy module) is deleted — its
strings are absorbed into the catalog as `login.subtitle1`/`login.subtitle2`/
`login.googleButton`. This adds a fifth fragment area (`prelaunch.*`,
`authError.*`, plus the two `login.*` keys) to `messages/{vi,en}-core.ts`,
bringing the catalog to 162 keys. With this round, **the entire app is
translated** — the only strings left untouched are page `metadata`
(title/description), mock/seed data, and the design-English strings noted in
U5.

Vietnamese is the default/source language; English is machine-translated by the
author (catalog `en.ts`), open to later human review. Mock/seed data (real
Sunner names, user-authored kudos bodies) is explicitly **not** translated.

## Scope (this cycle)

**In scope — build infra + migrate:**
- i18n infrastructure: provider, hook, catalog files, types, persistence.
- Rewire `LanguageSwitcher` from local state → context (VN/EN).
- Migrate copy in: **header** (`header.tsx`, `account-menu.tsx`), **footer**
  (`footer.tsx`), **homepage** (`app/page.tsx` and its `homepage-saa`
  components: `hero.tsx`, `kudos-banner.tsx`, `awards-section.tsx`,
  `award-card.tsx`, `root-further-content.tsx`, `countdown-tile.tsx` labels),
  and the in-scope centralized content files
  (`app/_lib/event-info-content.ts`, `award-categories.ts` — feeding the above).
- **Profile screen** (scope extension, same cycle): `profile-identity.tsx`,
  `profile-stats.tsx`, `profile-kudos-section.tsx`. The stats panel's five row
  labels are no longer hardcoded copy — `mapStats()` now returns them as
  `MessageKey`s, translated via `t()` in `profile-stats.tsx` (and reused as-is
  by `sun-kudos/kudos-sidebar.tsx`, which shares the same `SunnerStat` shape).
- **Awards-information page** (scope extension, same cycle): `awards-hero.tsx`
  + `award-detail-section.tsx`. The six awards' long descriptions are
  slug-keyed catalog entries (`awards.long.<slug>`); quantity units and prize
  notes are translated via small lookup records
  (`QUANTITY_UNIT_KEY` / `PRIZE_NOTE_KEY` in `award-detail-section.tsx`)
  mapping the untouched VI-only `award-categories.ts` data to catalog keys.
  Monetary prize values themselves stay untranslated (numbers, not copy).
- **Shared**: `filter-dropdown.tsx`'s "Tất cả" reset entry → `t("filter.clearAll")`.
- **FAB + rules drawer** (round 3): `floating-widget-button.tsx`'s two pills
  ("Thể lệ" / "Viết KUDOS") and open/close menu aria-labels; the whole rules
  drawer (`rules-modal.tsx`, backed by `rules-content.ts`'s `RULES_COPY` +
  `RULE_TIERS` count/desc keys) — title, both hero-badge intros, the icons
  note, the "Kudos Quốc Dân" copy, and the close/write footer labels. Tier
  `name`s (New/Rising/Super/Legend Hero) and the six collectible icon `name`s
  stay literal English — design tier/icon names, not translated copy.
- **`/sun-kudos` screen** (round 3): hero eyebrow (`kudos-hero.tsx`), both
  search-pill placeholders (`kudos-search-bar.tsx`), the sidebar's
  recent-gifts heading and Secret Box CTA (reuses `profile.openSecretBox`),
  the Highlight carousel's empty state + prev/next controls + `{current}`/
  `{total}` page interpolation, `kudo-card.tsx`'s "Xem chi tiết" action +
  its sr-only likes label, and the Spotlight board's aria labels, zoom/reset
  controls, search placeholder, and live activity ticker (see FR-012).
- **Write Kudo composer** (round 4): `write-kudo-modal.tsx`, `kudo-editor.tsx`'s
  toolbar, `recipient-select.tsx`, `image-upload-field.tsx` (alt text + `{n}`
  aria interpolation), `hashtag-field.tsx`, backed by `write-kudo-content.ts`'s
  `WRITE_KUDO_COPY` and `write-kudo-form.ts`'s `missingRequired()` (both now
  `MessageKey`-typed), plus the `createKudo` server action's stable
  `CreateKudoErrorCode` contract resolved by `write-kudo-error.ts`'s
  `resolveComposerError()` (see FR-013).
- **`/login`, `/prelaunch`, `/auth/auth-code-error`** (round 5): `login-welcome.tsx`
  (login page's two-line subtitle), `google-login-button.tsx`'s label,
  `prelaunch-heading.tsx` ("Sự kiện sẽ bắt đầu sau"), `countdown-row.tsx`'s
  DAYS/HOURS/MINUTES labels, and `auth-error-content.tsx` (heading, body,
  back-to-login link) all read through `t()` (see FR-014).
  `app/_lib/login-content.ts` is deleted; its two strings move into the
  catalog.

**Out of scope (documented follow-up):**
- Page `metadata` (`title`/`description`) for `/login`, `/prelaunch`, and
  `/auth/auth-code-error` stays Vietnamese-only — Server Component `metadata`
  exports can't read Context; a structural boundary, not a content gap, since
  round 5 migrated every visible string on those pages (see FR-014, U1).
- Translating mock/seed data (`all-kudos-data.ts`, `kudos-spotlight-names.ts`,
  `kudos-cards.ts` bodies/names) — not meaningful to translate.
- Locale-prefixed routing (`/vi`, `/en`) — Next 16 App Router has no built-in
  i18n routing; not needed for an internal app.
- The handful of design-English strings noted in U5 (section headings,
  landmark aria-labels, "Hashtag" filter, "Copy Link"/"Spam", tier/icon
  names) — intentional, not a gap.

## Functional Requirements

- **FR-001 — LanguageProvider**: A `"use client"` context provider holds
  `lang: "vi" | "en"` (default `"vi"`), mounted in `app/layout.tsx` wrapping
  `{children}`. Exposes `lang` and `setLang`. Server renders with default `vi`;
  after mount it reads the persisted value and updates (accepting a one-frame
  flash — documented KISS tradeoff).
- **FR-002 — Message catalogs**: Typed catalogs `app/_lib/i18n/vi.ts` and
  `en.ts` with the SAME key shape (a shared `Messages` type derived from `vi`
  so `en` is compile-checked for completeness). Keys namespaced by area
  (e.g. `header.*`, `footer.*`, `hero.*`, `awards.*`). Each file stays under
  200 lines; split by area into `app/_lib/i18n/messages/` if it would exceed.
- **FR-003 — useTranslation hook**: `useTranslation()` returns
  `{ t, lang, setLang }` where `t(key)` resolves a dot-path key against the
  active catalog, falling back to the `vi` value (never renders a raw key) and
  supporting simple `{name}`-style interpolation for the few dynamic strings.
- **FR-004 — Persistence**: `setLang` writes to `localStorage` (key
  `saa-lang`); provider reads it once after mount to restore choice. Guard for
  SSR / unavailable storage (try/catch).
- **FR-005 — Switcher rewire**: `LanguageSwitcher` reads `lang` and calls
  `setLang` instead of local `useState`. `LangCode "VN"|"EN"` maps to
  locale `"vi"|"en"`. Existing visual behavior (flag, chevron, active
  highlight, outside-click/Escape, focus return) is preserved unchanged.
- **FR-006 — Chrome migration**: All user-visible hardcoded VN strings in
  `header.tsx`, `account-menu.tsx`, `footer.tsx` are replaced by `t()` calls;
  both catalogs carry the VI original and EN translation.
- **FR-007 — Homepage migration**: All user-visible hardcoded VN strings in the
  homepage tree (`app/page.tsx`, `hero.tsx`, `kudos-banner.tsx`,
  `awards-section.tsx`, `award-card.tsx`, `root-further-content.tsx`, countdown
  labels) and their feeding content files in scope read through `t()`.
- **FR-008 — No regression**: Switching to EN re-renders migrated areas in
  English; switching back to VN restores Vietnamese, live, without reload.
  Non-migrated areas keep their current (Vietnamese) copy and must not break.
- **FR-009 — Profile migration** (scope extension): All user-visible hardcoded
  VN strings in `profile-identity.tsx`, `profile-stats.tsx`,
  `profile-kudos-section.tsx` read through `t()`. `mapStats()` returns
  `SunnerStat.label` as a `MessageKey` rather than a fixed string; both
  `profile-stats.tsx` and `sun-kudos/kudos-sidebar.tsx` call `t(stat.label)`.
- **FR-010 — Awards-information migration** (scope extension): All
  user-visible hardcoded VN strings in `awards-hero.tsx` and
  `award-detail-section.tsx` read through `t()`. The six awards'
  `longDescription`s use a slug-keyed catalog entry (`awards.long.<slug>`);
  `quantityUnit` and prize `note` (finite VI strings sourced from the
  untouched `award-categories.ts`) are mapped to catalog keys via
  `QUANTITY_UNIT_KEY` / `PRIZE_NOTE_KEY` lookup records, falling back to the
  raw VI string for any value not in the map. Prize monetary values are
  untranslated numbers, out of scope for `t()`.
- **FR-011 — FAB + rules drawer migration** (round 3): All user-visible
  hardcoded VN strings in `floating-widget-button.tsx` (the two pills, the
  toggle's open/close aria-labels) and the rules drawer read through `t()`.
  `rules-content.ts`'s `RULES_COPY` (a flat lookup) and `RULE_TIERS`
  (`countKey`/`descKey` per tier) hold `MessageKey`s — enforced via `satisfies
  Record<string, MessageKey>` — rather than raw strings, so the module stays
  plain data and `rules-modal.tsx` resolves the active-locale text via `t()`
  at render time. `RULE_TIERS[].name` and `RULE_ICONS[].name` are excluded by
  design (literal English tier/icon names).
- **FR-012 — `/sun-kudos` screen migration** (round 3): All user-visible
  hardcoded VN strings in `kudos-hero.tsx`, `kudos-search-bar.tsx`,
  `kudos-sidebar.tsx` (recent-gifts heading + Secret Box CTA),
  `highlight-carousel.tsx` (empty state, prev/next, `{current}`/`{total}`
  page interpolation), `kudo-card.tsx` ("Xem chi tiết" + sr-only likes label),
  and `spotlight-canvas.tsx` (aria labels, zoom/reset controls, search
  placeholder) read through `t()`. The live activity ticker keeps
  `spotlight-fns.ts`'s `buildActivityEntry()` hook-free: it now takes a third
  `receivedLabel: string` parameter instead of a hardcoded VN suffix, and
  `spotlight-board-live.tsx` supplies the already-resolved
  `t("spotlight.receivedKudos")` at the call site.
- **FR-013 — Write Kudo composer migration** (round 4): All user-visible
  hardcoded VN strings in `write-kudo-modal.tsx`, `kudo-editor.tsx`'s toolbar,
  `recipient-select.tsx`, `image-upload-field.tsx`, and `hashtag-field.tsx`
  read through `t()`, backed by a new `messages/{vi,en}-composer.ts` fragment.
  `write-kudo-content.ts`'s `WRITE_KUDO_COPY` and `write-kudo-form.ts`'s
  `missingRequired()` return `MessageKey`/`MessageKey[]` (not raw copy); the
  modal translates each missing-field key and joins them into
  `composer.missingHint`'s `{fields}` interpolation. The `createKudo` server
  action (`app/sun-kudos/actions.ts`) returns a stable
  `CreateKudoErrorCode` (`"missing_fields" | "auth_required" | "unknown"`) on
  known failure instead of a VN string, since a server action has no React
  context to call `t()` from; the new pure helper
  `app/_lib/write-kudo-error.ts`'s `resolveComposerError(t, error)` maps each
  code to a `composer.error.*` key. Any other error value (a dynamic
  Supabase/`Error.message` string) passes through untranslated — documented
  caveat: a dynamic message that happens to literally equal a known code
  string would be mistranslated, unreachable with current data.
- **FR-014 — RSC-page client-leaf migration** (round 5): `/login`,
  `/prelaunch`, and `/auth/auth-code-error` are Server Components exporting
  `metadata` and so cannot call `useTranslation()` in the page file itself.
  Each page instead renders a small new `"use client"` leaf that owns the
  translated copy: `login-welcome.tsx` (the two-line welcome subtitle),
  `prelaunch-heading.tsx` (the countdown heading), and
  `auth-error-content.tsx` (heading, body, and the back-to-login link).
  `google-login-button.tsx` and `countdown-row.tsx` (both already
  `"use client"`) are switched from hardcoded strings to `t()` in the same
  round. `app/_lib/login-content.ts` (F004) is deleted; its `subtitle` and
  `loginLabel` strings move into the catalog as `login.subtitle1`/
  `login.subtitle2`/`login.googleButton`. Page `metadata` (`title`/
  `description`) is explicitly out of scope — it stays Vietnamese-only (see
  Out of scope, U1).

## Acceptance Criteria

- AC-1: `LanguageProvider` mounted in root layout; app renders VI by default on
  first load with no persisted value.
- AC-2: `vi.ts` and `en.ts` share a compile-checked key shape; a missing EN key
  is a TypeScript error.
- AC-3: `useTranslation().t("header.<key>")` returns the VI string under `vi`
  and the EN string under `en`; unknown key falls back to VI value, never a raw
  key; `{name}` interpolation works.
- AC-4: Selecting EN in the header switcher changes header, footer, homepage,
  Profile screen, and Awards-information page copy to English live (no
  reload); selecting VN restores Vietnamese.
- AC-5: Choice persists across reload via localStorage (`saa-lang`).
- AC-6: `LanguageSwitcher` keeps all F012 behavior (flag/chevron/highlight,
  outside-click + Escape, focus return) — existing switcher tests still pass.
- AC-7: Components consuming the context without a wrapping provider fall back to
  default VI (context default value), so existing un-wrapped tests keep passing.
- AC-8: Build clean, tsc clean, eslint clean; new unit tests for provider/hook +
  at least one migrated component (render under provider, switch lang, assert
  text changes) pass; full suite green.
- AC-9 (round 3): Selecting EN translates the FAB pills/aria-labels and every
  rules-drawer string (title, both intros, icons note, "Kudos Quốc Dân" copy,
  close/write labels); tier names and icon names stay English in both locales.
- AC-10 (round 3): Selecting EN translates the `/sun-kudos` screen per FR-012,
  including the live ticker (new kudos rows render with the EN suffix without
  a page reload); selecting VN restores Vietnamese across all of the above.
- AC-11 (round 4): Selecting EN translates the Write Kudo composer per FR-013
  — modal chrome, toolbar, recipient/hashtag/image fields, the missing-field
  hint, and the server-action error copy; selecting VN restores Vietnamese.
  Submitting with required fields missing shows the joined, translated
  `composer.missingHint` list in the active locale; a failed submit (auth,
  unknown, or a raw error string) resolves through `resolveComposerError()`
  to locale-correct copy.
- AC-12 (round 5): Selecting EN translates `/login` (welcome subtitle +
  Google button label), `/prelaunch` (heading + DAYS/HOURS/MINUTES), and
  `/auth/auth-code-error` (heading, body, back-to-login link); selecting VN
  restores Vietnamese on all three. Each page's `<title>`/meta description
  stays Vietnamese in both locales (out of scope, not a regression).

## Non-Functional / Constraints

- No new npm dependency.
- Every new/edited file < 200 lines; kebab-case names.
- `t()` must be cheap (plain object lookup) — no per-render catalog rebuild.
- Follow existing Tailwind v4 + component patterns; no visual redesign.

## Testability

- Provider/hook: render a probe component under `LanguageProvider`, assert
  `t()` output for VI, call `setLang("en")`, assert EN output and localStorage
  write.
- Migrated component: a `renderWithLang(ui, lang)` test util wraps in provider;
  assert VI text at default, EN text after switch.
- Context default (no provider) returns VI so legacy tests are unaffected.
- Server-boundary error mapping: `resolveComposerError()` is pure (no DOM, no
  network) — unit-tested directly against each `CreateKudoErrorCode` plus a
  passthrough raw-string case, same pattern as `write-kudo-form.ts`.
- As of round 5 (final): 162 catalog keys total (composed from
  `messages/{vi,en}-core.ts` + `messages/{vi,en}-kudos.ts` +
  `messages/{vi,en}-composer.ts`); 202/202 tests passing across 32 files;
  tsc/eslint/build clean.

## Unresolved Questions

- U1 (updated round 5): `login/page.tsx`, `prelaunch/page.tsx`, and
  `auth-code-error/page.tsx` all export `metadata` (Server Components) — none
  can read Context. Round 5 worked around this for body copy via a
  client-leaf per page (see FR-014); `<title>`/meta description remain
  Vietnamese-only in both locales — a structural boundary (would need
  cookie-based locale to fix), not a scope gap. Left as-is; no further
  follow-up planned.
- U2: ~~A pre-existing hardcoded-label inconsistency in `profile-stats.tsx`
  (out of scope) — note for the profile follow-up.~~ **Resolved** by the
  Profile-screen scope extension: `mapStats()` now returns catalog keys
  (`MessageKey`) instead of fixed strings, and `profile-stats.tsx` translates
  them via `t()`; `sun-kudos/kudos-sidebar.tsx` picked up the same fix for
  free since it consumes the same `SunnerStat[]` shape.
- U3: EN translations are machine-authored; human review deferred (user opted
  in to "Claude translates, review later").
- U4: One-frame flash of VI before localStorage sync on EN-persisted reload —
  accepted tradeoff of localStorage over cookie.
- U5 (round 3, design decisions, not gaps): several sun-kudos/highlight/
  all-kudos strings stay literal English **by design**, matching the existing
  nav-labels precedent (FR-006/FR-007 already leave some chrome labels
  English) — not tracked as follow-up: the "ALL KUDOS" / "HIGHLIGHT KUDOS" /
  "SPOTLIGHT BOARD" section headings and their landmark `aria-label`s,
  `highlight-kudos-section.tsx`'s "Hashtag" filter label (its sibling
  department filter *is* translated), and `kudo-card.tsx`'s "Copy Link" /
  "Spam" strings. `SPOTLIGHT_ACTIVITY`'s static seed lines are mock/seed data
  (never translated per FR-007's data policy, not new to this round). One
  more round-3 footnote: right after switching to EN, the live ticker can
  show a brief mix of English (new realtime rows, via `receivedLabel`) and
  Vietnamese (older static seed rows still on screen) until those seed rows
  scroll off — an accepted, temporary artifact of seed data being
  untranslated, not a bug.
