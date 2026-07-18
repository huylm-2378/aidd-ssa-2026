# Screen List

**Project**: aidd-ssa-2026 (Sun* Annual Awards 2025)
**Generated**: 2026-07-17
**Analysis Scope**: `app/` — Next.js 16 App Router frontend pages (7), cross-referenced against `route-list.md` (Wave 1)

**Code Format**: All codes follow `SCR###_NameSlug` | `SCR###/REG###` for region-scoped references.

**Method**: Route-first enumeration from `route-list.md` (7 frontend pages, 1:1 file-to-URL, no wildcards — Composite Hard Guard N/A). H1–H6 applied per screen in execution order H6→H4→H5→H2→H3→H1→2-of-3 gate. Detected stack: Next.js 16 App Router + React 19 + TS — no `features/*`/`modules/*`/`domains/*` folder convention exists in this repo (flat `app/_components/*`, `app/_lib/*`), so **H2 never fires** for any screen (no per-stack row match; not upgraded via Signal Inference per composite-screen-detection.md § Limits — "distinct import module" intent doesn't map to this repo's flat convention). Composite classification therefore rests on H1∧H3 only where it occurs.

---

## Screen Index

| Code | Name | Type | Components | Data Displayed |
|------|------|------|------------|----------------|
| SCR001_HomePage | HomePage | composite | 7 (Hero, RootFurtherContent, AwardsSection, KudosBanner, FloatingWidgetButton, Header, Footer) | Award categories, countdown, kudos banner CTA |
| SCR002_LoginPage | LoginPage | atomic | 3 (LoginWelcome, GoogleLoginButton, Header/Footer minimal) | — (static welcome copy) |
| SCR003_ProfilePage | ProfilePage | atomic | 4 (ProfileIdentity, ProfileStats, ProfileKudosSection, Header/Footer) | User identity, stats, own kudos (sent/received) |
| SCR004_SunKudosPage | SunKudosPage | composite | 6 (KudosHero, KudosSearchBar, HighlightKudosSection, SpotlightBoard, AllKudosSection, Header/Footer) | Kudos feed, spotlight roster, highlight top-5, sidebar stats/recent gifts |
| SCR005_PrelaunchPage | PrelaunchPage | atomic | 2 (PrelaunchHeading, CountdownRow) | Event countdown |
| SCR006_AwardsInformationPage | AwardsInformationPage | atomic | 4 (AwardsHero, AwardSidebarNav, AwardDetailSection×6, KudosBanner) | Award category details |
| SCR007_AuthCodeErrorPage | AuthCodeErrorPage | atomic | 1 (AuthErrorContent) | OAuth failure message |

---

## SCR001_HomePage: HomePage

**Type**: composite

### Description

Landing page (`app/page.tsx`) — keyvisual hero, event countdown, "Root Further" theme content, award-category cards linking to `/awards-information#slug`, a Kudos CTA banner, and a fixed floating-action-button (FAB) overlay. H4/H5/H6 do not fire (no tabs, wizard, or router outlet). H2 does not fire (no domain-module-folder convention in this repo). H3 passes: 4 distinct named `<section>` wrappers (`Hero` `app/_components/homepage-saa/hero.tsx:17`, `RootFurtherContent` `app/_components/homepage-saa/root-further-content.tsx:12`, `AwardsSection` `app/_components/homepage-saa/awards-section.tsx:11`, `KudosBanner` `app/_components/homepage-saa/kudos-banner.tsx:11`). H1 passes: ≥3 distinct feature refs across the render tree (F005 `account-menu.tsx:10`, F010 `floating-widget-button.tsx:15`, F012 `language-switcher.tsx:18`). Gate: H1∧H3 → **composite**.

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| Header | layout | Shared nav/account/language chrome (`app/_components/homepage-saa/header.tsx:33`) |
| Hero | section | Keyvisual + live event countdown (`hero.tsx:17`) |
| RootFurtherContent | section | Static theme/about copy (`root-further-content.tsx:12`) |
| AwardsSection | section | Award category cards, deep-links to `/awards-information#slug` (`awards-section.tsx:11`) |
| KudosBanner | section | CTA banner linking to `/sun-kudos` (`kudos-banner.tsx:11`) |
| FloatingWidgetButton | overlay | Fixed FAB opening WriteKudo composer / Rules drawer (`floating-widget-button.tsx:24`) |
| Footer | layout | Shared footer chrome |

### Data Displayed

- Data Entity 1: Award categories (static, `AWARD_CATEGORIES` — `app/_lib/award-categories.ts`)
- Data Entity 2: Event countdown state (computed client-side, `use-countdown.ts`)

### Routes/URLs

- `/`

### Related Screens

- SCR006_AwardsInformationPage: AwardsInformationPage (navigation via award-card deep link)
- SCR004_SunKudosPage: SunKudosPage (navigation via KudosBanner CTA)
- SCR002_LoginPage: LoginPage (navigation via AccountMenu "sign in")

### Regions

| Code | Label | Owner | Independence Signals |
|------|-------|-------|---------------------|
| REG001 | FloatingWidgetButton | TBD (source cites F010) | Distinct mutation surface — opens WriteKudo composer (`createKudo`, ROUTE004) and Rules drawer independently of page scroll; fixed-position overlay layer with its own open/close state machine, decoupled from the static content sections. `app/_components/homepage-saa/floating-widget-button.tsx:24-52` |

**Notes**: RootFurtherContent, AwardsSection, and KudosBanner are static/passive content bands with no independent API, mutation, or loading signal (per Trap 1/Trap 4, visual sectioning alone does not qualify) — not elevated to REG.

---

## SCR002_LoginPage: LoginPage

**Type**: atomic

### Description

`app/login/page.tsx` — full-bleed keyvisual, welcome copy, and a single Google OAuth login button. H4/H5/H6/H2 do not fire. H3 fails (no named `<section>` wrapper — plain `<div>` layout only, `login/page.tsx:18-60`). H1: 3 feature-code comments present (F004 `login-welcome.tsx:6`, F005 `google-login-button.tsx:7`, F014 `login-welcome.tsx:6`) but 2-of-3 gate requires H1∧H2 or H1∧H3 or H2∧H3 — with H2 and H3 both failing, gate is not met → **atomic**.

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| LoginWelcome | text | Two-line welcome copy (`app/_components/login/login-welcome.tsx`) |
| GoogleLoginButton | button | Triggers `supabase.auth.signInWithOAuth` PKCE flow (`google-login-button.tsx:10-23`) |

### Data Displayed

- _(none — static welcome copy + OAuth trigger, no server data)_

### Routes/URLs

- `/login`

### Related Screens

- SCR001_HomePage: HomePage (Header logo link)
- SCR007_AuthCodeErrorPage: AuthCodeErrorPage (on OAuth failure, via `/auth/callback` redirect)

---

## SCR003_ProfilePage: ProfilePage

**Type**: atomic

### Description

`app/profile/page.tsx` — Server Component fetching identity (`getCurrentUserIdentity`, fail-safe to empty on no session — not gated), stats, and kudos in parallel, rendering an identity banner, stats panel, and a Sent/Received kudos list. H4/H5/H6/H2 do not fire at the screen level. H3 fails (only 1 named `<section>`: `ProfileKudosSection` `profile-kudos-section.tsx:52`; need ≥3). H1 fails (only 1 explicit feature ref found across the tree — F009 `profile-kudos-section.tsx:17`; need ≥3). Gate not met → **atomic**.

**H4 judgment call (documented per Trap 2 transparency, not silently applied or silently skipped):** `ProfileKudosSection` implements a Sent/Received toggle via `FilterDropdown` (`profile-kudos-section.tsx:31,45-49`) that swaps list content on the same URL — this is H4's *Intent* (mutually-exclusive content, same URL, user-selection-switched) via a non-standard control (dropdown, not `<Tab>`/`role="tab"`). However the toggle affects only the kudos-list sub-region; `ProfileIdentity` and `ProfileStats` above stay identical across both states — i.e. the *whole screen* is not tab-content, only one child region is. Per Signal Inference Fallback limits ("do not use to upgrade atomic → composite without a clear H-rule Intent match" on the *screen*), and to avoid the Trap-2 failure mode of mis-declaring it as a REG, I have NOT split this into `SCR003a`/`SCR003b` nor declared a REG for it — the toggle is documented here as UI behavior only. Flagging for reviewer confirmation given the partial-page scope is a judgment call, not a clean rule match.

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| ProfileIdentity | banner | Avatar/name/dept/tier (dept+tier are hardcoded placeholders, `profile/page.tsx:18-19`) |
| ProfileStats | panel | 5-row personal stats |
| ProfileKudosSection | list | Sent/Received toggle + own kudos feed (client-side filter, no refetch) |

### Data Displayed

- Data Entity 1: Current user identity (Supabase `auth.getUser()`, fail-safe to empty — `profile/page.tsx:32-47`)
- Data Entity 2: Kudos (own sent/received, via `getAllKudos()`)
- Data Entity 3: Sidebar stats (`getSidebarStats()`)

### Routes/URLs

- `/profile`

### Related Screens

- SCR001_HomePage: HomePage (Header logo link; AccountMenu "profile" link)

---

## SCR004_SunKudosPage: SunKudosPage

**Type**: composite

### Description

`app/sun-kudos/page.tsx` — Server Component fetching 5 data sets in parallel (`getAllKudos`, `getSpotlight`, `getSidebarStats`, `getRecentGifts`, `getSunnerOptions`) and composing 4 major sections plus shared header/footer chrome. H4/H5/H6 do not fire (no tabs/wizard/outlet at screen level — the profile-style dropdown toggle pattern is absent here). H2 does not fire (no domain-folder convention). H3 passes: 4 distinct named `<section>` wrappers — `KudosSearchBar` (`kudos-search-bar.tsx:37`), `HighlightKudosSection` (`highlight-kudos-section.tsx:53`), `SpotlightBoard` (`spotlight-board.tsx:26`), `AllKudosSection` (`all-kudos-section.tsx:29`). H1 passes: ≥3 distinct feature refs across the tree (F006 write-kudo composer `write-kudo-modal.tsx:33`, F007 Supabase-backed reads `all-kudos-section.tsx:16`, F008 spotlight/realtime `spotlight-board.tsx:9-13`, F015 heart-toggle `heart-button.tsx:9`). Gate: H1∧H3 → **composite**. Per the task brief, this is the composite-richest screen in the app.

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| Header / Footer | layout | Shared chrome |
| KudosKeyvisualBg / KudosHero | banner | Static keyvisual + title band |
| KudosSearchBar | section | Two entry-point pills; the prompt pill opens `WriteKudoModal` (`kudos-search-bar.tsx:47`) |
| HighlightKudosSection | section | Hashtag/department filters + top-5-liked carousel (`highlight-kudos-section.tsx`) |
| SpotlightBoard / SpotlightBoardLive | section | Live kudos count, pan/zoom constellation, roster search, activity ticker; Realtime-patched (`spotlight-board-live.tsx`) |
| AllKudosSection / KudosSidebar | section | Full kudos feed (each card has `HeartButton`) + stats/Secret-Box/recent-gifts sidebar |

### Data Displayed

- Data Entity 1: Kudos (feed + highlight top-5) — `getAllKudos()`
- Data Entity 2: Spotlight roster/nodes/count — `getSpotlight()`
- Data Entity 3: Sidebar stats — `getSidebarStats()`
- Data Entity 4: Recent gifts — `getRecentGifts()`
- Data Entity 5: Sunner directory (recipient autocomplete) — `getSunnerOptions()`

### Routes/URLs

- `/sun-kudos`

### Related Screens

- SCR001_HomePage: HomePage (KudosBanner CTA navigates here)
- SCR003_ProfilePage: ProfilePage (shares `KudoCard`/`HeartButton`/heart-toggle mutation surface)

### Regions

| Code | Label | Owner | Independence Signals |
|------|-------|-------|---------------------|
| REG002 | Hero + Search/Composer Entry | TBD (source cites F006) | Distinct mutation surface — the search-bar prompt pill opens `WriteKudoModal` → `createKudo` (ROUTE004), a write path not shared by any other region on this screen. `app/_components/sun-kudos/kudos-search-bar.tsx:41-59`, `write-kudo-modal.tsx:67-82` |
| REG003 | Highlight Kudos | TBD (source cites F007) | Distinct business workflow — client-owned filter state (hashtag+department, AND-combined) and a top-5-most-liked sort, independent `pageIndex` carousel state; resets independently of sibling regions on filter change. `app/_components/sun-kudos/highlight-kudos-section.tsx:29-50` |
| REG004 | Spotlight Board (live) | TBD (source cites F008) | Strongest signal — independent read channel: Supabase Realtime `postgres_changes` subscription on `public.kudos` INSERTs (`use-kudos-realtime.ts:34-47`), patching count/activity-ticker/live-notes with no page reload, decoupled from the page's initial server-rendered snapshot; also owns an independent pan/zoom canvas (`use-pan-zoom.ts`) and its own roster-search input. `app/_components/sun-kudos/spotlight-board-live.tsx:22-58` |
| REG005 | All Kudos Feed + Sidebar | TBD (source cites F015) | Distinct mutation surface — each `KudoCard`'s `HeartButton` calls `toggleHeart` (ROUTE005), a write path independent of the Hero/composer-entry region's `createKudo`; distinct validation/action path (optimistic like/unlike with server reconciliation and rollback). `app/_components/sun-kudos/heart-button.tsx:49-73` |

**Notes on overlay dialogs (H-rule judgment):** `WriteKudoModal` (`write-kudo-modal.tsx`) and `RulesModal` (`rules-modal.tsx`) are React-portal (`createPortal(..., document.body)`) overlay dialogs, not routed views and not tab-panel content on this screen — they are documented as the *mutation entry point* of REG001 (composer) and as a standalone content overlay off SCR001's FAB, not as their own SCR or REG (no distinct URL, no distinct data-loading state of their own beyond the parent's `sunnerOptions`/`open` prop). This mirrors the template's treatment of `MOD###` modals as ScreenFlow-level transitions (see `screen-flow.md § Region Transitions`), not ScreenList entries.

---

## SCR005_PrelaunchPage: PrelaunchPage

**Type**: atomic

### Description

`app/prelaunch/page.tsx` — standalone full-screen route with no Header/Footer chrome; a centered heading + live countdown. H3 fails (plain `<div>`s, no named `<section>`). H1 fails (only F011/F014 = 2 refs). Gate not met → **atomic**.

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| PrelaunchHeading | text | "Sự kiện sẽ bắt đầu sau" heading |
| CountdownRow | widget | Live DAYS/HOURS/MINUTES tiles, reuses `useCountdown` (`app/prelaunch/countdown-row.tsx:11`) |

### Data Displayed

- Data Entity 1: Event countdown state (client-computed)

### Routes/URLs

- `/prelaunch`

### Related Screens

- _(none — standalone route, no observed inbound/outbound navigation link in source)_

---

## SCR006_AwardsInformationPage: AwardsInformationPage

**Type**: atomic

### Description

`app/awards-information/page.tsx` — hero band, sticky anchor-nav sidebar, and 6 award-category detail sections, plus the shared Kudos CTA banner. H3 passes (3 distinct named-wrapper component types: `AwardsHero`, `AwardDetailSection`, `KudosBanner`); H1 fails — the only feature-code comment found (`award-detail-section.tsx:18`, "F014 — out of scope") is explicitly marked out of scope by its own author, leaving 0 genuine feature refs. H2 fails. Gate (needs 2-of-3) not met with only H3 passing → **atomic**.

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| AwardsHero | section | Hero band |
| AwardSidebarNav | nav | Sticky anchor nav (scroll-tracked active state, `award-sidebar-nav.tsx`) |
| AwardDetailSection | section | One per award category (×6), rendered from `AWARD_CATEGORIES` |
| KudosBanner | section | Shared CTA banner (same component as SCR001) |

### Data Displayed

- Data Entity 1: Award categories (static, `app/_lib/award-categories.ts`)

### Routes/URLs

- `/awards-information`

### Related Screens

- SCR001_HomePage: HomePage (deep-linked via `#<slug>` anchors from award cards)
- SCR004_SunKudosPage: SunKudosPage (via KudosBanner CTA)

---

## SCR007_AuthCodeErrorPage: AuthCodeErrorPage

**Type**: atomic

### Description

`app/auth/auth-code-error/page.tsx` — fallback shown when the OAuth `code` exchange fails or no code is present (ROUTE001 failure redirect target). Trivial static content; no H-rule fires.

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| AuthErrorContent | text | Heading + body + back-to-login link (`auth-error-content.tsx`) |

### Data Displayed

- _(none)_

### Routes/URLs

- `/auth/auth-code-error`

### Related Screens

- SCR002_LoginPage: LoginPage ("back to login" link)

---

## Summary

- **Total Screens**: 7 (7 atomic-or-composite SCRs; 2 composite, 5 atomic)
- **Total Regions**: 5 (1 under SCR001, 4 under SCR004)

---

## Cross-Reference Validation

- [x] All SCR### codes are unique
- [x] All SCR### codes are referenced in ScreenFlow.md
- [x] All related screen references are valid
- [x] All route URLs are properly formatted (route-view stack)
- [ ] All SCR### codes are referenced in FeatureList.md — **N/A this wave**: `feature-list.md` does not exist yet in this pipeline run (Wave 1 artifacts only: system-overview, architecture, route-list, data-model). Region `Owner` fields are marked `TBD` per Trap 6 (owner annotation present, citing the source-code F### comment for future reconciliation).
- [x] No orphaned screen references

## SCR008_SecretBoxModal: SecretBoxModal

**Feature:** F016 — Open Secret Box
**Type**: composite
**Route:** N/A — modal overlay (opened over `/sun-kudos` and `/profile`)
**Description:** Centered dark modal ("KHÁM PHÁ SECRET BOX CỦA BẠN") where a logged-in Sunner opens earned Secret Boxes: gift-box illustration (click to open while unopened > 0), instruction line hidden at 0, bottom counter "Secretbox chưa mở" + gold count, X close. Design: MoMorph frame J3-4YFIpMM.
**States:** anon (sign-in prompt), zero-boxes (inert box, instruction hidden), openable, opening (in-flight), badge-revealed, error-fallback
