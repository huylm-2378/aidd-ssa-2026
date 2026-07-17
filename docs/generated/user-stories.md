# User Stories

**Project**: aidd-ssa-2026 (Sun* Annual Awards 2025)
**Generated**: 2026-07-17
**Analysis Scope**: 7 frontend pages (`screen-list.md` SCR001-SCR007), cross-referenced against `route-list.md` (Wave 1) and `permissions-matrix.md` (Wave 3). IPE run per `.claude/skills/rebuild-spec/references/user-stories-ipe-protocol.md` — `screen_source: route-view`, web vocabulary, no dfm-form/oracle-plsql reductions apply.

**Code Format**: All US codes follow `US###_NameSlug` (e.g., US001_SignInWithGoogle).

**US Types**: all 18 stories below are `ui` (screen-mapped). No `system`-typed story was warranted — the one candidate system automation (Spotlight Board's Supabase Realtime patch) is phrased from the visitor's viewpoint per the Wave-4 brief ("I see new kudos appear live") rather than split into a backend-only story, since it has a direct, named screen anchor (SCR004/REG004) and a human-observable outcome.

**Actors**: exactly 2, flat (no RBAC) — `visitor` (no Supabase session) and `authenticated user` (any signed-in Google-OAuth user), per `permissions-matrix.md` § System shape. Every US below names one of these two; neither "system" nor "application" is ever the actor.

**Note**: Feature mapping lives in FeatureList.md only (not yet generated this wave — Wave 5). This document omits F### references. UI stories map to `SCR###` / `SCR###/REG###`.

## Interaction Inventory

> One row per interactive element found in source. `[INERT]` rows are controls with no wired `on*` handler — visual-only per source comment, not counted toward the ≥N threshold (web analogue of the dfm-form "inert decoration" rule).

| Screen | Element | Type | Action | Endpoint |
|--------|---------|------|--------|---------|
| SCR002_LoginPage | GoogleLoginButton (`google-login-button.tsx:26-35`) | primary-action | Triggers `supabase.auth.signInWithOAuth` (PKCE) | Client SDK → redirect through ROUTE001 |
| SCR007_AuthCodeErrorPage | "Back to login" link (`auth-error-content.tsx:19-24`) | navigation | Navigates to `/login` | N/A |
| SCR001/SCR003/SCR004/SCR006 (shared Header) | AccountMenu "Sign out" form (`account-menu.tsx:84-93`) | primary-action | Submits `signOut` Server Action | ROUTE003 |
| SCR001/SCR003/SCR004/SCR006 (shared Header) | AccountMenu "Profile" link (`account-menu.tsx:75-82`) | navigation | Navigates to `/profile` | N/A |
| SCR001/SCR003/SCR004/SCR006 (shared Header) | AccountMenu "Sign in" link (`account-menu.tsx:97-103`) | navigation | Navigates to `/login` | N/A |
| SCR001/SCR002/SCR003/SCR004/SCR006/SCR007 (shared Header/minimal) | LanguageSwitcher VN/EN row (`language-switcher.tsx:90-105`) | secondary-action | Switches locale via `LanguageProvider` context | N/A (client context) |
| SCR001/SCR003/SCR004/SCR006 (shared Header, non-minimal) | Top nav links About/Awards/Kudos (`header.tsx:16-20,58-80`) | navigation | Navigates to `/`, `/awards-information`, `/sun-kudos` | N/A |
| SCR001_HomePage | AwardCard image/title/"Chi tiết" link ×6 (`award-card.tsx:40-82`) | navigation | Navigates to `/awards-information#<slug>` | N/A |
| SCR001_HomePage, SCR006_AwardsInformationPage | KudosBanner CTA (`kudos-banner.tsx:40-48`) | navigation | Navigates to `/sun-kudos` | N/A |
| SCR001_HomePage/REG001 | FAB "Viết KUDOS" pill (`floating-widget-button.tsx:77-81`) | secondary-action | Opens `WriteKudoModal` | N/A |
| SCR004_SunKudosPage/REG002 | KudosSearchBar prompt pill (`kudos-search-bar.tsx:41-59`) | secondary-action | Opens `WriteKudoModal` | N/A |
| SCR001_HomePage/REG001, SCR004_SunKudosPage/REG002 | WriteKudoModal submit button (`write-kudo-modal.tsx:167-176`) | primary-action | Submits the kudo | ROUTE004 (`createKudo`) |
| SCR004_SunKudosPage/REG005, SCR003_ProfilePage | HeartButton per `KudoCard` (`heart-button.tsx:77-104`) | primary-action | Toggles like/unlike | ROUTE005 (`toggleHeart`) |
| SCR001_HomePage/REG001 | FAB "Thể lệ" pill (`floating-widget-button.tsx:72-76`) | secondary-action | Opens `RulesModal` | N/A |
| SCR003_ProfilePage | ProfileKudosSection Sent/Received FilterDropdown (`profile-kudos-section.tsx:45-49,62-68`) | secondary-action | Switches own-kudos view (client-only, no refetch) | N/A |
| SCR004_SunKudosPage/REG003 | HighlightKudosSection Hashtag + Department FilterDropdown (`highlight-kudos-section.tsx:38-46,67-78`) | secondary-action | Filters highlight carousel (AND-combined, resets page) | N/A |
| SCR004_SunKudosPage/REG003 | HighlightCarousel prev/next arrows (`highlight-kudos-section.tsx:48-50`) | secondary-action | Pages the top-5 carousel | N/A |
| SCR004_SunKudosPage/REG004 | SpotlightBoardLive roster search input (`spotlight-board-live.tsx:75-82`) | secondary-action | Filters the constellation by name | N/A |
| SCR004_SunKudosPage/REG004 | SpotlightBoardLive count + activity ticker (passive, `spotlight-board-live.tsx:43-58`) | system-action | Patches live count/ticker on new-kudos INSERT | Supabase Realtime channel `kudos-live-board` |
| SCR006_AwardsInformationPage | AwardSidebarNav anchor links ×6 (`award-sidebar-nav.tsx:53-84`) | navigation | Scrolls to the matching award detail `<section>` | N/A |
| SCR004_SunKudosPage | KudosSearchBar profile pill (`kudos-search-bar.tsx:61-76`) | `[INERT]` | No `onClick` — visual-only entry point per source comment | excluded |
| SCR004_SunKudosPage/REG004 | SpotlightBoardLive "expand board" button (`spotlight-board-live.tsx:103-116`) | `[INERT]` | No `onClick` wired | excluded |
| SCR004_SunKudosPage/REG005 | KudosSidebar "Mở Secret Box" button (`kudos-sidebar.tsx:41-50`) | `[INERT]` | No `onClick` — visual-only CTA per source comment | excluded |

## User Story Index

| Code | Title | Type | Priority | Screens |
|------|-------|------|----------|---------|
| US001_SignInWithGoogle | Sign In With Google | ui | High | SCR002 |
| US002_ReturnToLoginAfterFailure | Return To Login After Failure | ui | Medium | SCR007 |
| US003_SignOut | Sign Out | ui | Medium | SCR001, SCR003, SCR004, SCR006 |
| US004_NavigateToProfile | Navigate To My Profile | ui | Low | SCR001, SCR003, SCR004, SCR006 |
| US005_NavigateToLoginPage | Navigate To Login Page | ui | Low | SCR001, SCR003, SCR004, SCR006 |
| US006_SwitchInterfaceLanguage | Switch Interface Language | ui | Medium | SCR001, SCR002, SCR003, SCR004, SCR006, SCR007 |
| US007_NavigateMainSections | Navigate Main Sections | ui | Medium | SCR001, SCR003, SCR004, SCR006 |
| US008_ViewAwardCategoryDetails | View Award Category Details | ui | Medium | SCR001, SCR006 |
| US009_NavigateToKudosBoard | Navigate To Kudos Board | ui | Medium | SCR001, SCR006 |
| US010_WriteKudo | Write A Kudo | ui | High | SCR001, SCR004 |
| US011_ToggleKudoLike | Toggle Kudo Like | ui | High | SCR003, SCR004 |
| US012_ViewKudosRules | View Kudos Rules | ui | Low | SCR001 |
| US013_SwitchKudosView | Switch Kudos View | ui | Medium | SCR003 |
| US014_FilterHighlightedKudos | Filter Highlighted Kudos | ui | Medium | SCR004 |
| US015_BrowseHighlightCarousel | Browse Highlight Carousel | ui | Low | SCR004 |
| US016_SearchSpotlightRoster | Search Spotlight Roster | ui | Low | SCR004 |
| US017_ViewLiveSpotlightUpdates | View Live Spotlight Updates | ui | Medium | SCR004 |
| US018_JumpToAwardCategory | Jump To Award Category | ui | Low | SCR006 |

---

## US001_SignInWithGoogle: Sign In With Google

**Type**: ui
**Interaction**: primary-action
**Priority**: High
**Estimate**: S

### User Story

As a visitor, I want to sign in with my Google account so that I can create and like Kudos under my own identity.

### Acceptance Criteria

- [ ] Clicking the Google button on `/login` calls `supabase.auth.signInWithOAuth({ provider: "google" })` with `redirectTo` set to `/auth/callback` (`google-login-button.tsx:14-20`).
- [ ] The button disables itself while the OAuth redirect is pending (`isPending`, `google-login-button.tsx:12,29`).
- [ ] On failed OAuth call, the button re-enables (`google-login-button.tsx:22`); on Supabase code-exchange failure downstream, the visitor lands on `/auth/auth-code-error` (see US002).

### Technical Notes

- **Endpoint**: N/A — client Supabase SDK call; the token exchange happens at ROUTE001 (`GET /auth/callback`, `route-list.md:14`).
- **Data Required**: None (no form fields on this screen).
- **Dependencies**: ROUTE001 (auth callback), PERM001/PERM002 downstream (session unlocks write actions).

### Screens

- SCR002_LoginPage: LoginPage

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor on `/login`, not signed in | Clicks the Google button | Browser redirects to Google, then back through `/auth/callback` to `next` (or `/`) with an active session |
| Error Case | Google auth code exchange fails | `/auth/callback` cannot resolve `code` | Visitor is redirected to `/auth/auth-code-error` (US002) |

---

## US002_ReturnToLoginAfterFailure: Return To Login After Failure

**Type**: ui
**Interaction**: navigation
**Priority**: Medium
**Estimate**: S

### User Story

As a visitor, I want to return to the login page after an OAuth failure so that I can retry signing in.

### Acceptance Criteria

- [ ] `/auth/auth-code-error` renders a heading, body copy, and a "back to login" link (`auth-error-content.tsx:15-24`).
- [ ] The link navigates to `/login` (`auth-error-content.tsx:19-24`).

### Technical Notes

- **Endpoint**: N/A — client-side `next/link` navigation.
- **Data Required**: None.
- **Dependencies**: US001 (this is its failure-path landing screen); ROUTE001 (fires the redirect that lands here).

### Screens

- SCR007_AuthCodeErrorPage: AuthCodeErrorPage

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor lands on `/auth/auth-code-error` | Clicks "back to login" | Browser navigates to `/login` |

---

## US003_SignOut: Sign Out

**Type**: ui
**Interaction**: primary-action
**Priority**: Medium
**Estimate**: S

### User Story

As an authenticated user, I want to sign out so that my session no longer stays active on this device.

### Acceptance Criteria

- [ ] The "Sign out" menu item renders only when `AccountMenu` holds a truthy `user` (`account-menu.tsx:68-93`).
- [ ] Submitting the form calls the `signOut` Server Action (`app/auth/actions.ts:9-14`), which clears session cookies, revalidates `/` layout, and redirects to `/`.
- [ ] `signOut` has no auth guard — safe to call in any session state (no-op if already signed out), per `route-list.md:38`.

### Technical Notes

- **Endpoint**: ROUTE003 (`signOut()` Server Action, `app/auth/actions.ts:9-14`).
- **Data Required**: None.
- **Dependencies**: PERM003_SignOut.

### Screens

- SCR001_HomePage: HomePage (shared Header)
- SCR003_ProfilePage: ProfilePage (shared Header)
- SCR004_SunKudosPage: SunKudosPage (shared Header)
- SCR006_AwardsInformationPage: AwardsInformationPage (shared Header)

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Authenticated user, AccountMenu open | Clicks "Sign out" | Session cookies clear, page redirects to `/`, AccountMenu shows "Sign in" |

---

## US004_NavigateToProfile: Navigate To My Profile

**Type**: ui
**Interaction**: navigation
**Priority**: Low
**Estimate**: S

### User Story

As an authenticated user, I want to open my profile from the account menu so that I can review my identity, stats, and kudos.

### Acceptance Criteria

- [ ] The "Profile" menu item renders only when signed in (`account-menu.tsx:74-82`).
- [ ] Clicking it navigates to `/profile` (SCR003_ProfilePage).

### Technical Notes

- **Endpoint**: N/A — `next/link` navigation.
- **Data Required**: None.
- **Dependencies**: PERM004_ViewOwnProfile (destination has no auth gate, renders for either role).

### Screens

- SCR001_HomePage, SCR003_ProfilePage, SCR004_SunKudosPage, SCR006_AwardsInformationPage (all shared Header)

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Authenticated user, AccountMenu open | Clicks "Profile" | Browser navigates to `/profile` |

---

## US005_NavigateToLoginPage: Navigate To Login Page

**Type**: ui
**Interaction**: navigation
**Priority**: Low
**Estimate**: S

### User Story

As a visitor, I want to open the login page from the account menu so that I can start signing in.

### Acceptance Criteria

- [ ] The "Sign in" menu item renders only when signed out (`account-menu.tsx:96-104`).
- [ ] Clicking it navigates to `/login` (SCR002_LoginPage).

### Technical Notes

- **Endpoint**: N/A — `next/link` navigation.
- **Data Required**: None.
- **Dependencies**: US001 (this is the entry point into the sign-in flow).

### Screens

- SCR001_HomePage, SCR003_ProfilePage, SCR004_SunKudosPage, SCR006_AwardsInformationPage (all shared Header)

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor, AccountMenu open | Clicks "Sign in" | Browser navigates to `/login` |

---

## US006_SwitchInterfaceLanguage: Switch Interface Language

**Type**: ui
**Interaction**: secondary-action
**Priority**: Medium
**Estimate**: S

### User Story

As a visitor, I want to switch the interface language between Vietnamese and English so that I can read the app in the language I prefer.

### Acceptance Criteria

- [ ] The trigger shows the active language's flag + code (`language-switcher.tsx:59-83`).
- [ ] Selecting VN or EN calls `setLang` on the `LanguageProvider` context, updating copy app-wide (`language-switcher.tsx:54-57`).
- [ ] The panel dismisses on outside-click or Escape and returns focus to the trigger (`language-switcher.tsx:37-52`, BL003).
- [ ] Identical behavior on the minimal Header variant (Login, AuthCodeError pages) — `LanguageSwitcher` always renders regardless of `minimal` (`header.tsx:104`).

### Technical Notes

- **Endpoint**: N/A — client-only context write, no server call.
- **Data Required**: None.
- **Dependencies**: BL003_LanguageSwitcherDismissListener.

### Background Logic

- BL003_LanguageSwitcherDismissListener: LanguageSwitcherDismissListener

### Screens

- SCR001_HomePage, SCR002_LoginPage, SCR003_ProfilePage, SCR004_SunKudosPage, SCR006_AwardsInformationPage, SCR007_AuthCodeErrorPage (shared Header, full and minimal variants)

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor, app in Vietnamese | Opens the switcher, picks "EN" | Copy across the app re-renders in English; panel closes |

---

## US007_NavigateMainSections: Navigate Main Sections

**Type**: ui
**Interaction**: navigation
**Priority**: Medium
**Estimate**: S

### User Story

As a visitor, I want to move between the Home, Awards, and Kudos pages from the top nav so that I can explore the site's main sections.

### Acceptance Criteria

- [ ] The nav renders "About" (`/`), "Awards" (`/awards-information`), and "Kudos" (`/sun-kudos`) links (`header.tsx:16-20`).
- [ ] The current route's link shows the gold "active" state (`header.tsx:63-74`).
- [ ] The nav is hidden on the minimal Header variant (`header.tsx:57,81`).
- [ ] Clicking "About" while already on `/` smooth-scrolls to top instead of a hard navigation (`header.tsx:22-28,68`).

### Technical Notes

- **Endpoint**: N/A — `next/link` navigation.
- **Data Required**: None.
- **Dependencies**: None.

### Screens

- SCR001_HomePage, SCR003_ProfilePage, SCR004_SunKudosPage, SCR006_AwardsInformationPage (shared Header, non-minimal)

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor on `/sun-kudos` | Clicks "Awards" | Browser navigates to `/awards-information` |

---

## US008_ViewAwardCategoryDetails: View Award Category Details

**Type**: ui
**Interaction**: navigation
**Priority**: Medium
**Estimate**: S

### User Story

As a visitor, I want to open an award category's detail page from the homepage so that I can learn what it recognizes.

### Acceptance Criteria

- [ ] Each of the 6 `AwardCard`s' image, title, and "Chi tiết" link all point to the same `/awards-information#<slug>` anchor (`award-card.tsx:31,40-82`, BR-006).
- [ ] Landing on `/awards-information#<slug>` scrolls to that award's `AwardDetailSection`.

### Technical Notes

- **Endpoint**: N/A — `next/link` anchor navigation.
- **Data Required**: `AWARD_CATEGORIES` (static, `app/_lib/award-categories.ts`).
- **Dependencies**: US018 (destination screen's own in-page nav).

### Screens

- SCR001_HomePage: HomePage (AwardsSection)
- SCR006_AwardsInformationPage: AwardsInformationPage (navigation target)

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor on `/` | Clicks an award card's "Chi tiết" | Browser navigates to `/awards-information#<slug>` and scrolls to that section |

---

## US009_NavigateToKudosBoard: Navigate To Kudos Board

**Type**: ui
**Interaction**: navigation
**Priority**: Medium
**Estimate**: S

### User Story

As a visitor, I want to open the Kudos board from a banner CTA so that I can browse or send kudos.

### Acceptance Criteria

- [ ] The `KudosBanner` CTA link navigates to `/sun-kudos` (`kudos-banner.tsx:40-48`).
- [ ] The same `KudosBanner` component renders on both HomePage and AwardsInformationPage.

### Technical Notes

- **Endpoint**: N/A — `next/link` navigation.
- **Data Required**: None.
- **Dependencies**: None.

### Screens

- SCR001_HomePage: HomePage
- SCR006_AwardsInformationPage: AwardsInformationPage

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor on `/` or `/awards-information` | Clicks the Kudos banner CTA | Browser navigates to `/sun-kudos` |

---

## US010_WriteKudo: Write A Kudo

**Type**: ui
**Interaction**: primary-action
**Priority**: High
**Estimate**: L

### User Story

As an authenticated user, I want to write a Kudo for a colleague so that my recognition appears on the public Kudos board.

### Acceptance Criteria

- [ ] The composer opens from the homepage FAB's "Viết KUDOS" pill (`floating-widget-button.tsx:77-81,117`) or the Kudos-page search bar's prompt pill (`kudos-search-bar.tsx:41-59`).
- [ ] Required fields: recipient, award title, body, ≥1 hashtag (`write-kudo-form.ts` `canSubmit`/`missingRequired`, referenced `write-kudo-modal.tsx:61,152-156,169`); optional: images, "anonymous" checkbox (`write-kudo-modal.tsx:134-144`).
- [ ] Submit calls `createKudo` (`app/sun-kudos/actions.ts`), which requires a resolved session — returns `{ ok: false, error: "auth_required" }` otherwise (`route-list.md:44`, PERM001).
- [ ] On success the modal closes and resets; on error the modal stays open with a translated error and no data loss (`write-kudo-modal.tsx:78-82`).
- [ ] Sender is always the caller's own `sunners` row — never client-supplied (`permissions-matrix.md:61-63`).
- [ ] Dialog supports Escape-to-close and focus return to its trigger (BL006_DialogA11yKeyListener); Hashtag field and Recipient select each dismiss independently on outside-click/Escape (BL004, BL005).

### Technical Notes

- **Endpoint**: ROUTE004 — `createKudo(input)` Server Action (`app/sun-kudos/actions.ts:56-76`).
- **Data Required**: `sunnerOptions` (recipient directory, server-fetched on `/sun-kudos`; client-fetched via `useSunnerOptions` when opened from the homepage FAB with no prop).
- **Dependencies**: PERM001_CreateKudo, BL004_HashtagFieldDismissListener, BL005_RecipientSelectDismissListener, BL006_DialogA11yKeyListener. The Rules drawer's own "Viết Kudo" CTA (`rules-modal.tsx:95-102`) also opens this same composer — a third entry point, not a separate flow (see US012).

### Background Logic

- BL004_HashtagFieldDismissListener: HashtagFieldDismissListener
- BL005_RecipientSelectDismissListener: RecipientSelectDismissListener
- BL006_DialogA11yKeyListener: DialogA11yKeyListener

### Screens

- SCR001_HomePage/REG001: FloatingWidgetButton
- SCR004_SunKudosPage/REG002: Hero + Search/Composer Entry

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Authenticated user, composer open, all required fields filled | Clicks "Send" | `kudos` row inserted, board revalidates, modal closes |
| Error Case | Visitor (no session) opens composer and submits | Clicks "Send" | `createKudo` returns `auth_required`; modal stays open showing the translated error |

---

## US011_ToggleKudoLike: Toggle Kudo Like

**Type**: ui
**Interaction**: primary-action
**Priority**: High
**Estimate**: M

### User Story

As an authenticated user, I want to like or unlike a Kudo so that I can show appreciation for a recognition I see on the board.

### Acceptance Criteria

- [ ] Clicking `HeartButton` optimistically flips `liked`/`count`, then calls `toggleHeart(kudoId)` (`heart-button.tsx:49-73`).
- [ ] On server rejection, the button rolls back to the pre-click state and shows an inline translated error (`heart-button.tsx:62-66`).
- [ ] A double-fire guard blocks a second click while a toggle is in flight (`heart-button.tsx:50,80`).
- [ ] RLS scopes the write to the caller's own `auth.uid()` — cannot toggle on another user's behalf (`permissions-matrix.md:94-104`, PERM002).
- [ ] The same `HeartButton` instance re-syncs from fresh server props after `revalidatePath` (`heart-button.tsx:34-47`), so a like toggled elsewhere reflects across all mounted instances of that card (Highlight, All Kudos, Profile).

### Technical Notes

- **Endpoint**: ROUTE005 — `toggleHeart(kudoId)` Server Action (`app/sun-kudos/actions.ts:138-141`).
- **Data Required**: `kudoId`, caller's own session.
- **Dependencies**: PERM002_ToggleLike.

### Screens

- SCR004_SunKudosPage/REG005: All Kudos Feed + Sidebar
- SCR003_ProfilePage: ProfileKudosSection (shares the same `KudoCard`/`HeartButton`)

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Authenticated user, unliked kudo | Clicks the heart | Count increments, heart fills, server confirms via `toggleHeart` |
| Error Case | Session expires mid-click | Clicks the heart | `toggleHeart` rejects; button rolls back to prior state, inline error shown |

---

## US012_ViewKudosRules: View Kudos Rules

**Type**: ui
**Interaction**: secondary-action
**Priority**: Low
**Estimate**: S

### User Story

As a visitor, I want to open the event rules drawer so that I understand how sending and receiving Kudos works.

### Acceptance Criteria

- [ ] Opens from the homepage FAB's "Thể lệ" pill (`floating-widget-button.tsx:72-76`).
- [ ] Shows receiver hero-badge tiers, the sender collectible-icon set, and the "Kudos Quốc Dân" copy — static, no data fetch (`rules-modal.tsx:54-84`).
- [ ] Its own "Viết Kudo" CTA closes the drawer and opens the composer (`rules-modal.tsx:95-102` → US010) — not a separate write flow.
- [ ] Escape/outside-click closes the drawer and returns focus to the FAB toggle (BL006_DialogA11yKeyListener).

### Technical Notes

- **Endpoint**: N/A — static content, no data.
- **Data Required**: None (static copy from `rules-content.ts`).
- **Dependencies**: BL001_FloatingWidgetDismissListener, BL006_DialogA11yKeyListener.

### Background Logic

- BL001_FloatingWidgetDismissListener: FloatingWidgetDismissListener
- BL006_DialogA11yKeyListener: DialogA11yKeyListener

### Screens

- SCR001_HomePage/REG001: FloatingWidgetButton

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor on `/` | Opens the FAB, clicks "Thể lệ" | Rules drawer opens with static rules copy |

---

## US013_SwitchKudosView: Switch Kudos View

**Type**: ui
**Interaction**: secondary-action
**Priority**: Medium
**Estimate**: S

### User Story

As an authenticated user, I want to switch between the Kudos I've sent and received on my profile so that I can review my own recognition history.

### Acceptance Criteria

- [ ] The FilterDropdown toggles between "Sent" and "Received" (`profile-kudos-section.tsx:33-49,62-68`).
- [ ] Switching filters client-side against the already-loaded kudos set — no refetch (`profile-kudos-section.tsx:20`).
- [ ] An empty active view shows the translated empty-state message (`profile-kudos-section.tsx:73-79`).

### Technical Notes

- **Endpoint**: N/A — client-side filter over server-loaded props.
- **Data Required**: `kudos` (own sent/received, via `getAllKudos()`), `currentUserName`.
- **Dependencies**: PERM004_ViewOwnProfile.

### Screens

- SCR003_ProfilePage: ProfilePage

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Authenticated user on `/profile`, default "Sent" view | Selects "Received" | List swaps to received kudos with no page reload |

---

## US014_FilterHighlightedKudos: Filter Highlighted Kudos

**Type**: ui
**Interaction**: secondary-action
**Priority**: Medium
**Estimate**: S

### User Story

As a visitor, I want to filter the highlighted kudos by hashtag or department so that I can find recognitions relevant to me.

### Acceptance Criteria

- [ ] Hashtag and Department dropdowns are independent, AND-combined filters over the top-5-most-liked set (`highlight-kudos-section.tsx:33-46,67-78`).
- [ ] Changing either filter resets the carousel to page 0 (`highlight-kudos-section.tsx:38-46`).
- [ ] An empty filtered result shows the translated empty-state message (`highlight-carousel.tsx:68-77`).

### Technical Notes

- **Endpoint**: N/A — client-side filter over server-loaded `kudos` prop.
- **Data Required**: `kudos` (via `getAllKudos()`).
- **Dependencies**: None.

### Screens

- SCR004_SunKudosPage/REG003: Highlight Kudos

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor on `/sun-kudos` | Picks a hashtag | Carousel narrows to matching kudos and resets to page 0 |

---

## US015_BrowseHighlightCarousel: Browse Highlight Carousel

**Type**: ui
**Interaction**: secondary-action
**Priority**: Low
**Estimate**: S

### User Story

As a visitor, I want to page through the highlight kudos carousel so that I can see more of the top-liked recognitions.

### Acceptance Criteria

- [ ] Prev/Next arrows advance `pageIndex` one card at a time, clamped to `[0, visibleKudos.length - 1]` (`highlight-kudos-section.tsx:48-50`).
- [ ] Neighboring cards render as a faded, non-interactive "peek" sliver at the edges (`highlight-carousel.tsx:20-40`).

### Technical Notes

- **Endpoint**: N/A — client-side pagination state.
- **Data Required**: The filtered set from US014.
- **Dependencies**: US014 (shares `pageIndex`/filter state in the same parent).

### Screens

- SCR004_SunKudosPage/REG003: Highlight Kudos

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor viewing card 1 of 5 | Clicks "Next" | Carousel advances to card 2, showing its peek siblings |

---

## US016_SearchSpotlightRoster: Search Spotlight Roster

**Type**: ui
**Interaction**: secondary-action
**Priority**: Low
**Estimate**: S

### User Story

As a visitor, I want to search the Spotlight roster so that I can find a specific Sunner on the constellation board.

### Acceptance Criteria

- [ ] The search input filters `SpotlightCanvas` nodes by name as the visitor types (`spotlight-board-live.tsx:75-86`).
- [ ] Query state is local to the client island — no server round-trip.

### Technical Notes

- **Endpoint**: N/A — client-side filter over the server-fetched `nodes` prop.
- **Data Required**: `nodes`, `roster` (via `getSpotlight()`).
- **Dependencies**: None.

### Screens

- SCR004_SunKudosPage/REG004: Spotlight Board (live)

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor on `/sun-kudos` | Types a Sunner's name | Constellation narrows to matching node(s) |

---

## US017_ViewLiveSpotlightUpdates: View Live Spotlight Updates

**Type**: ui
**Interaction**: system-action
**Priority**: Medium
**Estimate**: M

### User Story

As a visitor, I want to see new kudos appear live on the Spotlight board so that I feel the event's energy in real time without refreshing the page.

### Acceptance Criteria

- [ ] `SpotlightBoardLive` hydrates from the server snapshot (`initialCount`/`initialActivity`), then subscribes to a Supabase Realtime channel `"kudos-live-board"` filtered to `postgres_changes` INSERT on `public.kudos` (`use-kudos-realtime.ts:26-53`, `behavior-logic.md` § Realtime, BL-C03).
- [ ] Each INSERT increments the live count, prepends an activity-ticker line (capped at 10), and pushes a transient ~15s "live note" naming the receiver (`spotlight-board-live.tsx:43-58`).
- [ ] On `CHANNEL_ERROR`/`TIMED_OUT`, the board degrades silently to the static server-fetched snapshot — no thrown error, no user-facing error message (`business-rules.md:138-140`).
- [ ] The pan/zoom constellation canvas (drag, wheel-zoom clamped `[MIN_SCALE, MAX_SCALE]`, arrow-key pan) stays live-patchable underneath the ticker (BL007_PanZoomWheelListener).

### Technical Notes

- **Endpoint**: N/A (not a Server Action/route) — outbound Supabase Realtime subscription, no retry/backoff (`api-map.md:54`).
- **Data Required**: `initialCount`, `initialActivity` (via `getSpotlight()`/`getSidebarStats()`), `roster` (name lookup for ticker lines).
- **Dependencies**: BL007_PanZoomWheelListener; behavior-logic.md § Realtime (BL-C03, `use-kudos-realtime.ts:26-53`).

### Background Logic

- BL007_PanZoomWheelListener: PanZoomWheelListener

### Screens

- SCR004_SunKudosPage/REG004: Spotlight Board (live)

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor viewing the Spotlight board | Another user's Kudo insert fires elsewhere | Count increments, ticker line appears, transient live-note shows — no reload |
| Error Case | Realtime channel drops (`CHANNEL_ERROR`/`TIMED_OUT`) | Connection fails silently | Board keeps showing the last known static snapshot; no error surfaced to the visitor |

---

## US018_JumpToAwardCategory: Jump To Award Category

**Type**: ui
**Interaction**: navigation
**Priority**: Low
**Estimate**: S

### User Story

As a visitor, I want to jump to a specific award category via the sidebar nav so that I can quickly find its details without scrolling.

### Acceptance Criteria

- [ ] The sticky sidebar lists all 6 award categories as `#<slug>` anchor links (`award-sidebar-nav.tsx:53-84`).
- [ ] An `IntersectionObserver` highlights the category currently in view as the visitor scrolls (`award-sidebar-nav.tsx:21-43`).
- [ ] Hidden below `lg` breakpoint — sections stack full-width on smaller viewports (`award-sidebar-nav.tsx:12-15`).

### Technical Notes

- **Endpoint**: N/A — in-page anchor navigation.
- **Data Required**: `AWARD_CATEGORIES` (static).
- **Dependencies**: US008 (shares the same destination screen/anchors).

### Screens

- SCR006_AwardsInformationPage: AwardsInformationPage

### Test Scenarios

| Scenario | Given | When | Then |
|----------|-------|------|------|
| Happy Path | Visitor on `/awards-information`, desktop viewport | Clicks a sidebar nav item | Page scrolls to that award's detail section; nav highlights it |

---

## Screen → US Map

| Screen | US Codes |
|--------|---------|
| SCR001_HomePage | US003, US004, US005, US006, US007, US008, US009, US010, US012 |
| SCR002_LoginPage | US001, US006 |
| SCR003_ProfilePage | US003, US004, US005, US006, US007, US011, US013 |
| SCR004_SunKudosPage | US003, US004, US005, US006, US007, US010, US011, US014, US015, US016, US017 |
| SCR005_PrelaunchPage | _(none)_ |
| SCR006_AwardsInformationPage | US003, US004, US005, US006, US007, US009, US018 |
| SCR007_AuthCodeErrorPage | US002, US006 |

> `[IPE_ZERO]` — SCR005_PrelaunchPage has 0 interactive elements (a centered heading + a passive live-countdown display, no buttons/links in `app/prelaunch/page.tsx`, `prelaunch-heading.tsx`, `countdown-row.tsx`). No US maps to it; flagged for reviewer confirmation rather than fabricating an interaction.

## Cross-Reference Validation

- [x] All US### codes are unique — US001 through US018, contiguous.
- [x] All acceptance criteria are testable — each cites a concrete source line or observable behavior.
- [x] All technical notes are complete — Endpoint marked `N/A` only where no Server Action/route exists (verified against `route-list.md`).
- [ ] All US### codes are referenced in FeatureList.md — **N/A this wave**: `feature-list.md` does not exist yet (Wave 5).
- [x] All `ui` US### mapped to SCR### or SCR###/REG### — parent SCR verified against `screen-list.md` for every mapping above.
- [x] All system US### have at least one BL### mapped — N/A: no `system`-typed story exists this wave (see US Types note above); US017 (the closest candidate) is `ui`-typed with a real screen anchor and still cites its supporting BL### (BL007) plus the unindexed BL-C03 realtime item for traceability.

## Notes

- Every disclosure toggle (AccountMenu avatar button, LanguageSwitcher trigger, FAB round toggle, both FilterDropdown triggers) is UI chrome, not counted as its own interaction — only the resulting selection/action inside is a story, mirroring how the IPE protocol treats a dfm-form control's own open state as inert until its handler fires.
- 3 controls are `[INERT]` (no wired handler): KudosSearchBar's profile pill, SpotlightBoardLive's "expand board" button, KudosSidebar's "Mở Secret Box" button — all confirmed visual-only by their own source comments, excluded from the threshold count.
- WriteKudoModal's internal fields (RecipientSelect, HashtagField, ImageUploadField, anonymous checkbox) are not separate US — same actor, same `createKudo` endpoint, same data flow (Step 3 merge exception), folded into US010.
- HighlightKudosSection's two filter dropdowns (Hashtag, Department) merge into US014 for the same reason — same actor, same client-side filter operation, no branching between them.

## Unresolved Questions

- SCR003_ProfilePage's Sent/Received toggle (US013) has no real meaning for a signed-out visitor (`currentUserName` is empty, so `splitKudosByUser` matches nothing) — `screen-list.md`'s H4 judgment call already flagged this partial-page-scope ambiguity; carried forward here as an actor caveat rather than re-litigated.
- US006 (language) and US007 (top nav) are written once each but map to 4-6 screens via the shared `Header` component; if a future wave wants per-screen granularity here, these would need re-splitting — flagging so W4.5 doesn't read the multi-screen mapping as an error.
