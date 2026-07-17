# Feature List

**Project**: aidd-ssa-2026 (Sun* Annual Awards 2025)
**Generated**: 2026-07-17
**Analysis Scope**: Synthesis of `user-stories.md` (US001-US018), `screen-list.md` (SCR001-SCR007 + REG001-REG005), `route-list.md` (ROUTE001-005), `data-model.md` (MODEL001-006), `behavior-logic.md` (BL001-007), `permissions-matrix.md` (PERM001-007) onto the **15 pre-existing canonical F### codes** in `docs/features/` (F001-F015). Per hard constraint, these codes/names/order are preserved verbatim — none renumbered, none invented. Region-owner "TBD" annotations in `screen-list.md` (SCR004/REG003, all four SCR-shell regions) are resolved here to their definitive F### per each feature's `technical-spec.md` scope statement (Wave 5's job); two cases override the tentative code-comment citation with a scope-statement-backed call — see notes under F003 and F007.

**Code Format**: All codes follow `F###_NameSlug` format — codes are canonical/fixed for this repo (not generated this wave).
**Screen Code Format**: `SCR###_NameSlug` | `SCR###/REG###` for region-scoped references.
**User Story Code Format**: `US###_NameSlug`.
**Background Logic Code Format**: `BL###_NameSlug`.
**Permission Code Format**: `PERM###_NameSlug`.

**Feature Types**:
- `ui` - Feature has UI screens (SCR###) and no distinct backend route/action of its own
- `background` - Feature has no SCR###/REG### of its own (data/backend layer or cross-cutting infra)
- `mixed` - Feature has both a SCR###/REG### and a backend Route/Action (ROUTE###) or BL###

**Related Screens column format**: `SCR###`, `SCR###/REG###`, or comma-separated mixed. Partial-screen ownership honored — a feature with only a `SCR###/REG###` ref does not claim the parent `SCR###` shell; the shell is owned separately by the feature listed with a bare `SCR###` ref.

**Cross-reference**: See `screen-list.md` Regions subsections for REG### definitions.

## Feature Hierarchy

**Note on ordering**: Per hard constraint, this table and the Feature Details below use the **canonical F001→F015 order** (not priority-sorted) to preserve the existing `docs/features/` numbering exactly. Priority levels: **P0** core/blocking, **P1** high, **P2** medium, **P3** low.

| Code | Name | Type | Language | Workspace | Priority |
|------|------|------|----------|-----------|----------|
| F001_HomepageSaa | Homepage SAA | ui | TypeScript/TSX | web (`app/`) | P1 |
| F002_AwardsInformation | Awards Information | ui | TypeScript/TSX | web (`app/`) | P1 |
| F003_SunKudos | Sun* Kudos | ui | TypeScript/TSX | web (`app/`) | P1 |
| F004_Login | Login | ui | TypeScript/TSX | web (`app/`) | P1 |
| F005_SupabaseGoogleLogin | Supabase Google Login | mixed | TypeScript/TSX | web (`app/`) | P1 |
| F006_WriteKudo | Write Kudo | mixed | TypeScript/TSX | web (`app/`) | P1 |
| F007_KudosData | Kudos Data (Supabase) | background | TypeScript + SQL | web (`app/` + `supabase/`) | P1 |
| F008_KudosLiveBoard | Kudos Live Board | mixed | TypeScript/TSX | web (`app/`) | P1 |
| F009_UserProfile | User Profile | ui | TypeScript/TSX | web (`app/`) | P2 |
| F010_FloatingActionButton | Floating Action Button | mixed | TypeScript/TSX | web (`app/`) | P1 |
| F011_CountdownPrelaunch | Countdown Prelaunch | mixed | TypeScript/TSX | web (`app/`) | P3 |
| F012_LanguageDropdown | Language Dropdown | background | TypeScript/TSX | web (`app/`) | P2 |
| F013_RulesModal | Rules Modal | ui | TypeScript/TSX | web (`app/`) | P3 |
| F014_Internationalization | Internationalization | background | TypeScript | web (`app/`) | P2 |
| F015_KudosHearts | Kudos Hearts | mixed | TypeScript + SQL | web (`app/` + `supabase/`) | P1 |

## Feature Details

### F001_HomepageSaa: Homepage SAA

**Type**: ui
**Description**: Public, unauthenticated landing page at `/`. Input: none (static + client countdown env var). Process: renders sticky Header/Footer chrome, hero keyvisual, "Root Further" theme copy, 6 award-category cards, and the Kudos CTA banner — no data fetch, no mutation. Output: the SCR001 page shell that hosts F010's FAB overlay and deep-links into F002/F003.

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: ~6 (Header, Hero, RootFurtherContent, AwardsSection, KudosBanner, Footer)

**Related Screens**:
- SCR001_HomePage: HomePage (shell — owns the bare screen; SCR001/REG001 is owned separately by F010)

**Related User Stories**:
- US007_NavigateMainSections: Navigate Main Sections
- US009_NavigateToKudosBoard: Navigate To Kudos Board

**Related APIs/Routes**:
- _(none — static page, no ROUTE### of its own)_

**Related Data Models**:
- _(none — no server data fetch)_

**Related Background Logic**:
- _(none — see F010/F011/F012 for the FAB, countdown, and language-switcher listeners hosted inside this page)_

**Related Permissions**:
- _(none)_

---

### F002_AwardsInformation: Awards Information

**Type**: ui
**Description**: Public Awards Information page at `/awards-information`. Input: none (static `AWARD_CATEGORIES` data + `#<slug>` anchor from inbound links). Process: renders hero band, sticky sidebar anchor-nav with scroll-tracked active state, and 6 award-detail sections; reuses Header/Footer/KudosBanner. Output: the SCR006 page shell, the deep-link target for F001's award cards and header nav.

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: 4 (AwardsHero, AwardSidebarNav, AwardDetailSection ×6, KudosBanner reused)

**Related Screens**:
- SCR006_AwardsInformationPage: AwardsInformationPage (shell)

**Related User Stories**:
- US008_ViewAwardCategoryDetails: View Award Category Details
- US018_JumpToAwardCategory: Jump To Award Category

**Related APIs/Routes**:
- _(none — static page)_

**Related Data Models**:
- _(none — static `AWARD_CATEGORIES` config, not a modeled DB entity)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

### F003_SunKudos: Sun* Kudos

**Type**: ui
**Description**: Public Sun* Kudos board page at `/sun-kudos` — the composite screen shell. Input: 5 server-parallel data fetches (`getAllKudos`, `getSpotlight`, `getSidebarStats`, `getRecentGifts`, `getSunnerOptions`). Process: renders hero/keyvisual + search-bar container, and owns the Highlight Kudos section's own client-side hashtag/department filter (AND-combined) + top-5-most-liked carousel/pagination in full (per its own FR-005) — this **overrides** `screen-list.md`'s tentative `SCR004/REG003` "TBD (source cites F007)" note, since the region's actual behavior (filtering/paging UI) is spec'd entirely under this feature's FR-005, with F007 only as the underlying data source, not the feature owner. Output: the SCR004 shell hosting F006 (composer entry), F008 (spotlight board), and F015 (heart toggle) as sibling regions.

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: ~5 (KudosHero/KudosKeyvisualBg, KudosSearchBar container, HighlightKudosSection, AllKudosSection container, Header/Footer reused)

**Related Screens**:
- SCR004_SunKudosPage: SunKudosPage (shell)
- SCR004/REG003: Highlight Kudos

**Related User Stories**:
- US014_FilterHighlightedKudos: Filter Highlighted Kudos
- US015_BrowseHighlightCarousel: Browse Highlight Carousel

**Related APIs/Routes**:
- _(none directly — page-level reads are RLS-backed public SELECTs, see F007/PERM005)_

**Related Data Models**:
- _(none owned directly — consumes MODEL002_Kudo via F007's read layer)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none directly — inherits PERM005_ReadBoardTables via F007)_

---

### F004_Login: Login

**Type**: ui
**Description**: Static clone of the MoMorph "Login" frame at `/login`. Input: none. Process: renders full-bleed keyvisual, minimal header (logo + language switcher only), "ROOT FURTHER" logotype, welcome copy, and the Google login button shell. Output: the SCR002 page shell — the real OAuth trigger behind the button is wired separately by F005 (this feature predates and is continued by F005; no auth logic lives here).

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: 2 (LoginWelcome, GoogleLoginButton shell)

**Related Screens**:
- SCR002_LoginPage: LoginPage (shell)

**Related User Stories**:
- _(none directly — the screen's one interactive control's real behavior is US001, owned by F005; this feature is the static shell only)_

**Related APIs/Routes**:
- _(none)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

### F005_SupabaseGoogleLogin: Supabase Google Login

**Type**: mixed
**Description**: Real Google OAuth (Supabase `@supabase/ssr`, PKCE) wired behind F004's `/login` screen. Input: visitor's Google identity via OAuth redirect. Process: `signInWithOAuth` trigger → ROUTE001 code-exchange → session cookie refresh via ROUTE002 proxy on every request → `AccountMenu` renders auth-state-based menu items → ROUTE003 `signOut` on demand. Output: an active Supabase session (or a graceful redirect to SCR007 on failure); session-only, no route protection anywhere in the app.

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: ~5 (GoogleLoginButton wired, `/auth/callback` route handler, `signOut` action, AccountMenu auth-state wiring, `proxy.ts`)

**Related Screens**:
- SCR007_AuthCodeErrorPage: AuthCodeErrorPage (shell)
- SCR002_LoginPage: LoginPage (behavior wiring on top of F004's shell)

**Related User Stories**:
- US001_SignInWithGoogle: Sign In With Google
- US002_ReturnToLoginAfterFailure: Return To Login After Failure
- US003_SignOut: Sign Out
- US004_NavigateToProfile: Navigate To My Profile
- US005_NavigateToLoginPage: Navigate To Login Page

**Related APIs/Routes**:
- (GET) ROUTE001 `/auth/callback`
- (ALL) ROUTE002 `proxy.ts` (session-refresh middleware)
- (Server Action) ROUTE003 `signOut()`

**Related Data Models**:
- MODEL003_AuthUser

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM003_SignOut: Sign out
- PERM007_AccountMenuAuthState: Header account-menu item set

---

### F006_WriteKudo: Write Kudo

**Type**: mixed
**Description**: The "Viết Kudo" composer modal. Input: recipient, award title, body, ≥1 hashtag (required), images + anonymous flag (optional) — opened from SCR004/REG002's search-bar prompt pill (owned here) or from SCR001/REG001's FAB pill (owned by F010) or from F013's Rules drawer CTA. Process: client-side form validation (`canSubmit`/`missingRequired`), then submits to F007's `createKudo` Server Action. Output: on success, modal closes/resets and the board (F007-backed) revalidates; on error, modal stays open with a translated inline error.

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: 5 (WriteKudoModal, RecipientSelect, HashtagField, ImageUploadField, KudoEditor)

**Related Screens**:
- SCR004/REG002: Hero + Search/Composer Entry

**Related User Stories**:
- US010_WriteKudo: Write A Kudo

**Related APIs/Routes**:
- _(none owned directly — submits to ROUTE004, owned by F007)_

**Related Data Models**:
- _(none owned directly — writes to MODEL002_Kudo, owned by F007)_

**Related Background Logic**:
- BL004_HashtagFieldDismissListener: HashtagFieldDismissListener
- BL005_RecipientSelectDismissListener: RecipientSelectDismissListener
- BL006_DialogA11yKeyListener: DialogA11yKeyListener (shared with F013's RulesModal)

**Related Permissions**:
- _(none owned directly — enforced by PERM001_CreateKudo, owned by F007)_

---

### F007_KudosData: Kudos Data (Supabase)

**Type**: background
**Description**: Data/backend layer making F003's board and F006's composer real. Input: DDL + seed SQL (`supabase/migrations/0001,0002,0005`, `seed.sql`), and `createKudo(input)` calls from F006. Process: defines the `sunners`/`kudos`/`recent_gifts`/`kudos_stats` schema, RLS (public SELECT, authenticated-only INSERT on `kudos`), a server-side query layer (`getAllKudos`, `getSpotlight`, `getSidebarStats`, `getRecentGifts`, `getSunnerOptions`), and the `createKudo` Server Action (sender resolved server-side from the caller's session, never client-supplied). Output: persisted `kudos` rows, revalidated `/sun-kudos`; this override of `screen-list.md`'s "TBD (source cites F007)" tag on `SCR004/REG003` is resolved to F003 (see F003 note) — this feature owns no SCR/REG itself, only the data plane underneath them.

**Workspace**: web (`app/`) + `supabase/`
**Languages**: TypeScript + SQL
**Components**: N/A (backend/data layer — migrations, `queries.ts`, `actions.ts`)

**Related Screens**:
- _(none — backend/data layer; consumed by SCR003/SCR004 via read APIs)_

**Related User Stories**:
- _(none directly — underlies US010 (F006) and the board reads on SCR003/SCR004)_

**Related APIs/Routes**:
- (Server Action) ROUTE004 `createKudo(input)`

**Related Data Models**:
- MODEL001_Sunner
- MODEL002_Kudo
- MODEL005_RecentGift
- MODEL006_KudosStat

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM001_CreateKudo: Create a Kudo (insert into `kudos`)
- PERM005_ReadBoardTables: Public SELECT on `sunners`/`kudos`/`recent_gifts`/`kudos_stats`

---

### F008_KudosLiveBoard: Kudos Live Board

**Type**: mixed
**Description**: Real-time upgrade of the Spotlight Board section on `/sun-kudos`. Input: server-fetched initial count/roster/activity (`getSpotlight`/`getSidebarStats`) + a Supabase Realtime subscription on `public.kudos` INSERTs (channel `"kudos-live-board"`). Process: renders a pan/zoom constellation canvas of distinct-receiver name nodes, a functional roster search (client-side filter/highlight), and live-patches count/activity-ticker/live-notes on each INSERT with no reload; silently degrades to the static snapshot on `CHANNEL_ERROR`/`TIMED_OUT` (no retry, no user-facing error). Output: the SCR004/REG004 live board region.

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: 5 (SpotlightBoard, SpotlightBoardLive, SpotlightCanvas, `use-pan-zoom`, `use-kudos-realtime`)

**Related Screens**:
- SCR004/REG004: Spotlight Board (live)

**Related User Stories**:
- US016_SearchSpotlightRoster: Search Spotlight Roster
- US017_ViewLiveSpotlightUpdates: View Live Spotlight Updates

**Related APIs/Routes**:
- _(none — outbound Supabase Realtime subscription only, not a Server Action/route)_

**Related Data Models**:
- _(none owned directly — reads MODEL002_Kudo, owned by F007)_

**Related Background Logic**:
- BL007_PanZoomWheelListener: PanZoomWheelListener

**Related Permissions**:
- _(none — public read, see PERM005 under F007)_

---

### F009_UserProfile: User Profile

**Type**: ui
**Description**: The logged-in (or logged-out, fail-safe) Sunner's own profile page at `/profile`. Input: `auth.getUser()` identity (fails safe to empty), own kudos via `getAllKudos()`, sidebar stats via `getSidebarStats()`. Process: renders identity banner, 5-row stats panel, and a Sent/Received kudos toggle that filters the already-loaded set client-side (no refetch). Output: the SCR003 page shell; reuses F007's data layer and F015's `KudoCard`/`HeartButton` wholesale.

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: 3 (ProfileIdentity, ProfileStats, ProfileKudosSection)

**Related Screens**:
- SCR003_ProfilePage: ProfilePage (shell)

**Related User Stories**:
- US013_SwitchKudosView: Switch Kudos View

**Related APIs/Routes**:
- _(none — frontend page, no backend route entry)_

**Related Data Models**:
- _(none owned directly — reads MODEL002_Kudo/MODEL006_KudosStat, owned by F007)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM004_ViewOwnProfile: View `/profile`

---

### F010_FloatingActionButton: Floating Action Button

**Type**: mixed
**Description**: Fixed bottom-right widget on the homepage. Input: click on the collapsed gold pill. Process: toggles open/closed; when open, reveals two stacked action pills ("Thể lệ" / "Viết KUDOS") plus a red static "×" close toggle; a document-level dismiss listener closes it on outside-click/Escape. Output: opens F013's Rules drawer or F006's Write-Kudo composer — this widget owns only the trigger/menu chrome, not the destination flows.

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: 1 (FloatingWidgetButton, collapsed + open states)

**Related Screens**:
- SCR001/REG001: FloatingWidgetButton

**Related User Stories**:
- _(none directly — this widget is the shared entry point for US010 (F006) and US012 (F013), owned by those features)_

**Related APIs/Routes**:
- _(none)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- BL001_FloatingWidgetDismissListener: FloatingWidgetDismissListener

**Related Permissions**:
- _(none)_

---

### F011_CountdownPrelaunch: Countdown Prelaunch

**Type**: mixed
**Description**: Standalone full-screen prelaunch route at `/prelaunch`, with no Header/Footer chrome. Input: `NEXT_PUBLIC_SAA_EVENT_START` env var (shared with F001's Hero countdown). Process: `useCountdown` recomputes days/hours/minutes remaining every 60s via `setInterval`, gated behind a `useMounted` flag to avoid SSR/client time mismatch; freezes to "00" on missing/malformed input rather than throwing. Output: a live countdown display; per `screen-list.md`'s own `[IPE_ZERO]` flag, no US maps to this screen (0 interactive elements — heading + passive countdown only, no inbound/outbound nav observed in source).

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: 2 (PrelaunchHeading, CountdownRow)

**Related Screens**:
- SCR005_PrelaunchPage: PrelaunchPage (shell)

**Related User Stories**:
- _(none — `[IPE_ZERO]`, no US maps to SCR005 per user-stories.md)_

**Related APIs/Routes**:
- _(none)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- BL002_CountdownRefreshTimer: CountdownRefreshTimer

**Related Permissions**:
- _(none)_

---

### F012_LanguageDropdown: Language Dropdown

**Type**: background
**Description**: The header's VN/EN language switcher widget. Input: click on the flag+code trigger. Process: renders a rounded dark panel listing 🇻🇳 VN / 🇬🇧 EN with the active language highlighted; a document-level dismiss listener closes it on outside-click/Escape with focus return to the trigger. Output: calls `setLang` on F014's `LanguageProvider` context (this feature's own original "client-only local state" decision was superseded by F014's context wiring — see F012's own doc note). Not a `screen-list.md` SCR/REG entry — it is a cross-cutting Header component rendered on SCR001, SCR002, SCR003, SCR004, SCR006, and SCR007 (all screens with the shared Header, per `user-stories.md` US006's screen list; absent on SCR005 which has no Header).

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: 1 (LanguageSwitcher)

**Related Screens**:
- _(none — cross-cutting Header widget, not its own ScreenList SCR/REG entry; see Description for the 6 screens it renders on)_

**Related User Stories**:
- US006_SwitchInterfaceLanguage: Switch Interface Language

**Related APIs/Routes**:
- _(none — client-only context write)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- BL003_LanguageSwitcherDismissListener: LanguageSwitcherDismissListener

**Related Permissions**:
- _(none)_

---

### F013_RulesModal: Rules Modal

**Type**: ui
**Description**: The right-side "Thể lệ" (rules) drawer opened from F010's FAB pill. Input: none (static content from `rules-content.ts`). Process: renders a dark scrollable panel — Hero-tier badges, a 6-icon collectible set, "Kudos Quốc Dân" copy — with "Đóng" and "Viết KUDOS" footer buttons; the latter closes this drawer and opens F006's composer. Output: static informational content; not a `screen-list.md` SCR/REG entry — documented there as a standalone overlay off SCR001's FAB, mirroring F006's WriteKudoModal treatment.

**Workspace**: web (`app/`)
**Languages**: TypeScript/TSX
**Components**: 1 (RulesModal)

**Related Screens**:
- SCR001/REG001: FloatingWidgetButton (overlay trigger, owned by F010 — RulesModal is a portal-rendered overlay off this region's "Thể lệ" pill; not its own ScreenList SCR/REG entry per `screen-list.md` § SCR004 Notes on overlay dialogs, which documents the parallel WriteKudoModal treatment)

**Related User Stories**:
- US012_ViewKudosRules: View Kudos Rules

**Related APIs/Routes**:
- _(none)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none owned directly — shares BL006_DialogA11yKeyListener with F006, listed under F006)_

**Related Permissions**:
- _(none)_

---

### F014_Internationalization: Internationalization

**Type**: background
**Description**: The app's real i18n layer. Input: user's language selection from F012's switcher. Process: a `LanguageProvider` React Context holds the active locale, typed message catalogs (`vi.ts`/`en.ts`, split into per-area fragments) back a `useTranslation()` hook (`t(key)`, `{ lang, setLang }`), with localStorage persistence. Output: translated copy across the always-visible chrome (Header/Footer), F001's homepage, F009's Profile screen, F002's Awards-Information page, and F003/F008/F013's Sun*-Kudos-area copy (search bar, sidebar, highlight-empty state, kudo-card actions, carousel controls, spotlight aria labels, activity ticker, rules drawer). No screen or region of its own — pure cross-cutting infrastructure.

**Workspace**: web (`app/`)
**Languages**: TypeScript
**Components**: 3 (LanguageProvider, `useTranslation` hook, message catalogs)

**Related Screens**:
- _(none — infrastructure; migrates copy across F001/F002/F003/F008/F009/F013's screens, not owning any SCR/REG itself)_

**Related User Stories**:
- _(none directly — supports US006 (F012), which triggers the locale switch this feature renders)_

**Related APIs/Routes**:
- _(none — client-side context + localStorage only)_

**Related Data Models**:
- _(none)_

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- _(none)_

---

### F015_KudosHearts: Kudos Hearts

**Type**: mixed
**Description**: Per-user like/heart toggle on each Kudo card. Input: click on a `KudoCard`'s heart icon (any authenticated Sunner). Process: optimistically flips `liked`/`count` client-side, calls `toggleHeart(kudoId)`; on server rejection rolls back to the pre-click state with an inline translated error; a double-fire guard blocks a second click in flight; RLS scopes the write to the caller's own `auth.uid()` (composite PK `(kudo_id, user_id)` enforces one-like-per-user-per-kudo). Output: an incremented/decremented `kudos.like_count` (DB-trigger-synced, never client-set) visible across every mounted `KudoCard` instance after `revalidatePath`. Owns `SCR004/REG005` per `screen-list.md`'s explicit independence-signal citation (the region boundary is drawn specifically around this toggle's mutation surface).

**Workspace**: web (`app/`) + `supabase/`
**Languages**: TypeScript + SQL
**Components**: 2 (HeartButton, `0004_kudos_likes.sql` migration + `toggleHeart` action)

**Related Screens**:
- SCR004/REG005: All Kudos Feed + Sidebar

**Related User Stories**:
- US011_ToggleKudoLike: Toggle Kudo Like

**Related APIs/Routes**:
- (Server Action) ROUTE005 `toggleHeart(kudoId)`

**Related Data Models**:
- MODEL004_KudoLike

**Related Background Logic**:
- _(none)_

**Related Permissions**:
- PERM002_ToggleLike: Like / unlike a Kudo (insert/delete `kudo_likes`)
- PERM006_ReadKudoLikes: Public SELECT on `kudo_likes`

---

## Summary

- **Total Features**: 15
- **Total Screens**: 7 (SCR001-SCR007; 5 regions: SCR001/REG001, SCR004/REG002-004)
- **Total User Stories**: 18
- **Total Routes**: 5 (ROUTE001-005 — backend GET/proxy/Server Actions only; the app's 7 frontend pages have no ROUTE### code per `route-list.md`'s own scheme and are covered via Related Screens instead)
- **Total Data Models**: 6
- **Total Background Logic**: 7
- **Total Permissions**: 7
- **Languages Detected**: TypeScript, TSX, SQL

## Cross-Reference Validation

- [x] All F### codes are unique — canonical F001-F015, preserved verbatim per hard constraint
- [x] All F### codes are referenced in UserStories.md — 12 of 15 features carry ≥1 US (F004, F007, F010, F014 legitimately carry none — static shell / backend layer / shared-widget / infra respectively; each documents the US it enables under a sibling feature)
- [x] All screen references are valid (SCR### or SCR###/REG### in ScreenList; bare-SCR and region refs both accepted)
- [x] All user story references are valid (US### in UserStories) — US001-US018 all placed, each exactly once
- [x] All route references are valid (ROUTE### in RouteList) — ROUTE001-005 all placed, each exactly once
- [x] All data model references are valid (MODEL### in DataModel) — MODEL001-006 all placed, each exactly once
- [x] All behavior logic references are valid (BL### in BehaviorLogic) — BL001-007 all placed, each exactly once
- [x] All permission references are valid (PERM### in Permissions) — PERM001-007 all placed, each exactly once
- [x] Every US has a parent feature (F###) — US001-US018 each map to exactly one F###
- [x] Every screen has a parent feature (F###) — SCR001-SCR007 each map to exactly one shell-owning F###; all 5 regions map to exactly one F### each
- [x] Every route maps to a feature (F###) — ROUTE001-003→F005, ROUTE004→F007, ROUTE005→F015
- [x] Every data model maps to a feature (F###) — MODEL001/002/005/006→F007, MODEL003→F005, MODEL004→F015
- [x] Every background logic maps to a feature (F###) — BL001→F010, BL002→F011, BL003→F012, BL004/005/006→F006, BL007→F008
- [x] Every permission maps to a feature (F###) — PERM001/005→F007, PERM002/006→F015, PERM003/007→F005, PERM004→F009

## Unresolved Questions

- `SCR004/REG003` (Highlight Kudos) is assigned to F003 here, overriding `screen-list.md`'s tentative "TBD (source cites F007)" code-comment citation — the override is based on F003's own FR-005 fully specifying the filter/carousel UI behavior, with F007 only as the underlying data source. Flagging for reviewer confirmation since this is a judgment call, not a literal citation match.
- F004 (Login) and F010 (Floating Action Button) carry zero directly-owned User Stories by design (their interactive behavior is specified under F005 and F006/F013 respectively) — confirm this "shell/entry-point feature with no own US" pattern is acceptable for the W5.6 gate, which requires every US (not every F) to have a parent.
- BL006_DialogA11yKeyListener and BL002_CountdownRefreshTimer are each shared by two features (F006/F013 and F001/F011 respectively) but assigned a single primary owner here (F006, F011) per single-intent scope — the secondary consumer is noted in the owner's Description rather than double-listed.
