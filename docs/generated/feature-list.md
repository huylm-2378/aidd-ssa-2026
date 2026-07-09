# Feature List

## Feature Hierarchy

| # | Feature | Priority | Type | Status |
|---|---------|----------|------|--------|
| 1 | F001 — Homepage SAA | P1 | ui | implemented |
| 2 | F002 — Awards Information | P1 | ui | implemented |
| 3 | F003 — Sun* Kudos | P1 | ui | implemented |
| 4 | F004 — Login | P1 | ui | implemented |
| 5 | F005 — Google login with Supabase | P1 | auth | implemented |
| 6 | F006 — Write Kudo | P1 | ui | implemented |
| 7 | F008 — Sun* Kudos Live Spotlight Board | P1 | ui/realtime | implemented |
| 8 | F009 — User Profile | P1 | ui | implemented |
| 9 | F010 — Floating Action Button | P1 | ui | implemented |
| 10 | F011 — Countdown / Prelaunch Page | P1 | ui | implemented |
| 11 | F012 — Language Dropdown | P1 | ui | implemented |
| 12 | F013 — Rules Drawer (Thể lệ) | P1 | ui | implemented |
| 13 | F014 — Internationalization (i18n VN·EN) | P1 | infra/ui | implemented |

## Feature Details

### F001 — Homepage SAA

**Priority:** P1 | **Type:** ui | **Status:** implemented | **Slug:** F001_HomepageSaa

Public, unauthenticated single-page marketing site for Sun* Annual Awards 2025 ("Root Further"
theme) with a live event countdown, a 6-card award grid, a Sun* Kudos promo banner, and stub
routes for Awards Information / Sun* Kudos.

**Related:** screens: — | routes: /, /awards-information, /sun-kudos | models: —

### F002 — Awards Information

**Priority:** P1 | **Type:** ui | **Status:** implemented | **Slug:** F002_AwardsInformation

Public, unauthenticated Awards Information page detailing the six SAA 2025 award categories, with a
sticky anchor-nav sidebar; deep-link target for the homepage award cards, header nav, and hero CTA.
Static/client-rendered, reuses the homepage Header, Footer, and Kudos banner.

**Related:** screens: — | routes: /awards-information | models: AwardCategory

### F003 — Sun* Kudos

**Priority:** P1 | **Type:** ui | **Status:** implemented | **Slug:** F003_SunKudos

Public Sun* Kudos recognition-and-thanks wall: hero + Sunner search, a Highlight Kudos carousel with
Hashtag/Phòng ban filters, a Spotlight Board name word-cloud, and an All Kudos feed alongside a
personal-stats + Secret Box sidebar. Static/client-rendered, mock data only, replaces the former
placeholder route. Reuses the homepage Header and Footer.

**Related:** screens: — | routes: /sun-kudos | models: KudoCard, SunnerStat, SpotlightName, RecentGiftSunner

### F004 — Login

**Priority:** P1 | **Type:** ui | **Status:** implemented | **Slug:** F004_Login

Public, unauthenticated static clone of the MoMorph "Login" frame: full-bleed keyvisual, minimal
header (logo + language only), "ROOT FURTHER" logotype, two-line Vietnamese welcome copy, and a gold
"LOGIN With Google" button that mock-navigates to `/`. No auth backend. Reuses the homepage Header
and Footer via new opt-in `minimal` props (default-off elsewhere).

**Related:** screens: — | routes: /login | models: —

### F005 — Google login with Supabase

**Priority:** P1 | **Type:** auth | **Status:** implemented | **Slug:** F005_SupabaseGoogleLogin

Wires real Google OAuth (via Supabase `@supabase/ssr`, PKCE) behind the existing F004 `/login` screen:
a token-refresh-only root middleware, a callback route that exchanges the code for a session, an
auth-code-error failure page, a sign-out Server Action, and a real signed-in user (name/email/avatar)
in the shared Header account menu. Session-only — no `profiles` table, no RLS, no route protection; all
F001–F004 pages stay fully public. Continues F004 (modifies `google-login-button.tsx` and `header.tsx`).

**Related:** screens: — | routes: /login, /auth/callback, /auth/auth-code-error | models: —

### F006 — Write Kudo

**Priority:** P1 | **Type:** ui | **Status:** implemented | **Slug:** F006_WriteKudo

The "Viết Kudo" composer: a centered modal opened from the `/sun-kudos` hero prompt search bar (no new
route), implementing MoMorph frame "Viết Kudo" (`ihQ26W78P2`). Lets a Sunner pick a recipient, give an
award title, write a body via a visual rich-text toolbar over a textarea, tag up to 5 hashtags, attach
up to 5 images, and optionally send anonymously; Gửi is gated on required fields. Client-only, mock
recipient data, no backend/persistence. Previously deferred as a future feature in F003_SunKudos.

**Related:** screens: ihQ26W78P2 | routes: /sun-kudos | models: SunnerOption, WriteKudoForm

### F008 — Sun* Kudos Live Spotlight Board

**Priority:** P1 | **Type:** ui/realtime | **Status:** implemented | **Slug:** F008_KudosLiveBoard

Upgrades the `/sun-kudos` Spotlight Board from a static word-cloud (F003) into a real-time,
interactive pan/zoom constellation with a diacritic-insensitive Sunner search and a live activity
ticker, powered by a client-side Supabase Realtime subscription on `public.kudos` INSERT.

**Related:** screens: MaZUn5xHXZ | routes: /sun-kudos | models: kudos, sunners

### F009 — User Profile

**Priority:** P1 | **Type:** ui | **Status:** implemented | **Slug:** F009_UserProfile

The logged-in Sunner's own profile page at `/profile`: keyvisual banner, identity block (avatar,
name, department + tier — the latter two are design-faithful placeholders, no auth-metadata source),
a personal stats panel (Kudos received/sent, hearts received, Secret Box opened/unopened) sourced
from the existing `kudos_stats` singleton, and a Sent/Received Kudos feed reusing `KudoCard`. No new
DB schema/migration — reuses the F007 data layer and F005 identity read wholesale. Not auth-gated:
a logged-out visitor sees an empty identity block rather than a redirect.

**Related:** screens: 3FoIx6ALVb | routes: /profile | models: kudos_stats, KudoCard

### F010 — Floating Action Button

**Priority:** P1 | **Type:** ui | **Status:** implemented | **Slug:** F010_FloatingActionButton

Homepage-only fixed bottom-right widget (MoMorph frame "Floating Action Button - phim nổi chức
năng 2"): a round red toggle (`+` rotating into `×`) that reveals two gold pills, "Thể lệ" (link to
Awards Information) and "Viết KUDOS" (opens the existing `WriteKudoModal` composer). Builds out the
prior homepage stub `floating-widget-button.tsx` into the real widget. No new route, no data/schema
change, no auth change — pure client UI reusing F002's route and F006's modal.

**Related:** screens: Sv7DFwBw1h | routes: (homepage; links to /awards-information) | models: —

### F011 — Countdown / Prelaunch Page

**Priority:** P1 | **Type:** ui | **Status:** implemented | **Slug:** F011_CountdownPrelaunch

Standalone full-screen prelaunch route at `/prelaunch` (MoMorph frame "Countdown - Prelaunch page"):
Root-further keyvisual background, centered "Sự kiện sẽ bắt đầu sau" heading, and a live DAYS/HOURS/
MINUTES countdown. No site Header/Footer. Almost entirely an assembly of existing pieces — reuses
`useCountdown` and `CountdownTile` from the homepage hero plus `NEXT_PUBLIC_SAA_EVENT_START` (no new
config), and the login page's full-bleed keyvisual pattern. Extracted a shared `app/_lib/use-mounted.ts`
hook (previously private to `write-kudo-modal.tsx`, F006) to gate hydration-sensitive live digits. No
DB/schema change, no auth change.

**Related:** screens: 8PJQswPZmU | routes: /prelaunch | models: —

### F012 — Language Dropdown

**Priority:** P1 | **Type:** ui | **Status:** implemented | **Slug:** F012_LanguageDropdown

Builds out the header's language switcher (MoMorph "Dropdown-ngôn ngữ", `hUyaaugye2`) from an inline
emoji + plain-text list into its own `language-switcher.tsx` component: a rounded dark panel listing
VN/EN flag rows, active-language highlight, and outside-click/Escape dismiss (reuses the
`hashtag-field.tsx` dismiss pattern). `header.tsx` now renders `<LanguageSwitcher/>` in place of the
inline markup, unchanged elsewhere; shows in both the full and `minimal` header variants (so it's on
every header-bearing route, not just `/`). Client-only local state (VN default), no i18n/routing
wiring, no new route, no DB/schema/auth change.

**Related:** screens: hUyaaugye2 | routes: none — header component present on `/`, `/awards-information`,
`/sun-kudos`, `/profile`, `/login`, `/auth/auth-code-error` (all pages that render the shared Header;
`/prelaunch` has no Header by design) | models: —

### F013 — Rules Drawer (Thể lệ)

**Priority:** P1 | **Type:** ui | **Status:** implemented | **Slug:** F013_RulesModal

A right-anchored "Thể lệ" (rules) drawer opened from the homepage FAB's "Thể lệ" pill (MoMorph "Thể lệ
UPDATE", `b1Filzi9i6` / node `3204:6051`): a dark 553px panel with Hero badge tiers (New/Rising/Super/
Legend), a 6-icon collectible grid, and "Kudos Quốc Dân" copy, footed by Đóng/Viết KUDOS buttons. The
FAB's "Thể lệ" pill changes from a `<Link href="/awards-information">` to opening this modal ("Viết
KUDOS" inside it opens the existing `WriteKudoModal`). Reuses the `WriteKudoModal` portal/backdrop
shape, `useDialogA11y` (which gained `preventScroll: true` on its initial focus call), and `useMounted`.
Client-only, static copy in `app/_lib/rules-content.ts`, no data/model change, no new route, no DB/auth
change — the `/awards-information` route is unchanged and still reachable directly.

**Related:** screens: b1Filzi9i6 | routes: none — overlay opened from the homepage FAB (was
`/awards-information` before F013) | models: —

### F014 — Internationalization (i18n VN·EN)

**Priority:** P1 | **Type:** infra/ui | **Status:** implemented | **Slug:** F014_Internationalization

A real, dependency-free VN/EN i18n layer: a client `LanguageProvider` (React Context, default `vi`,
localStorage `saa-lang`) mounted in `app/layout.tsx`, typed flat-key catalogs (`app/_lib/i18n/vi.ts` /
`en.ts`, composed from per-area fragments under `app/_lib/i18n/messages/`, 162 keys, `en` compile-checked
against `vi`), and a `useTranslation()` hook exposing `t()`. Rewires F012's `LanguageSwitcher` from
local state to this context, and migrates the header, footer, account menu, and homepage components
(hero, kudos banner, awards section/cards, Root Further copy) to `t()`. Round 2 (same cycle) added the
Profile screen (identity block, stats panel, Kudos section) and the Awards-information page (hero +
per-award detail sections, incl. long descriptions/quantity units/prize notes); a new server→client
pipeline lets `mapStats()` (`app/_lib/kudos/map.ts`) hand components a catalog key (`MessageKey`)
instead of fixed copy, consumed by both `profile-stats.tsx` and `sun-kudos/kudos-sidebar.tsx`. Round 3
(same cycle) added the FAB pills + menu aria-labels, the whole "Thể lệ" rules drawer, and the
`/sun-kudos` screen itself (hero, search bar, sidebar recent-gifts heading + Secret Box CTA, highlight
carousel incl. `{current}`/`{total}` page interpolation, kudo-card view-details action, and the
Spotlight board's aria/zoom/reset/search/live ticker — `buildActivityEntry()` in `spotlight-fns.ts`
stays hook-free by taking a pre-translated `receivedLabel` param from its caller). Section headings
("ALL KUDOS"/"HIGHLIGHT KUDOS"/"SPOTLIGHT BOARD"), their landmark aria-labels, the "Hashtag" filter
label, and kudo-card's "Copy Link"/"Spam" stay English by design (nav-labels precedent), not gaps.
Round 4 (same cycle) added the Write Kudo composer (modal, rich-text toolbar, recipient/hashtag/image
fields), backed by a new `messages/{vi,en}-composer.ts` fragment; the `createKudo` server action now
returns a stable `CreateKudoErrorCode` instead of a VN string (a server action can't call `t()`), mapped
to composer copy by the new `resolveComposerError()` helper — a second server-boundary key-not-string
pattern alongside `mapStats()`. Round 5 (final) migrates the last three VN-only routes — `/login`,
`/prelaunch`, `/auth/auth-code-error` — each a Server Component exporting `metadata` that delegates its
translated copy to a new small `"use client"` leaf (`login-welcome.tsx`, `prelaunch-heading.tsx`,
`auth-error-content.tsx`); `google-login-button.tsx` and `countdown-row.tsx` also switch to `t()`.
`app/_lib/login-content.ts` (F004) is deleted, absorbed into the catalog. **The entire app is now
translated** — remaining untranslated is only page `metadata` (title/description, a structural
Server-Component boundary), mock/seed data, and the handful of design-English strings noted in F014's
spec (section headings, "Copy Link"/"Spam", tier/icon names). 202/202 tests passing across 32 files.
No new dependency, no routes/data/auth change.

**Related:** screens: hUyaaugye2 | routes: all pages with Header | models: —
