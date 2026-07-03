# Feature List

## Feature Hierarchy

| # | Feature | Priority | Type | Status |
|---|---------|----------|------|--------|
| 1 | F001 — Homepage SAA | P1 | ui | implemented |
| 2 | F002 — Awards Information | P1 | ui | implemented |
| 3 | F003 — Sun* Kudos | P1 | ui | implemented |
| 4 | F004 — Login | P1 | ui | implemented |
| 5 | F005 — Google login with Supabase | P1 | auth | implemented |

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
