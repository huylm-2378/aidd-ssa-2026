# System Architecture — Authentication (Supabase Google OAuth)

> Forward-drafted for F005. Promoted to `docs/system/architecture.md` at implement-start.
> Session-only, PKCE Google OAuth via `@supabase/ssr`. No DB schema, no route protection.

## Where auth sits in the app

The app is a Next.js 16.2.9 App Router marketing site (F001–F004: `/`, `/awards-information`,
`/sun-kudos`, `/login`) — all public, static/client-rendered. F005 adds an authentication *capability*
without changing that public posture: it introduces a Supabase session, but no page is gated behind it.

```
Next.js App Router
├── proxy.ts (root)  ── refresh-only ──▶ app/_lib/supabase/middleware.ts → updateSession()
├── app/
│   ├── (marketing pages — public, unchanged)
│   ├── login/page.tsx  ── renders ──▶ _components/login/google-login-button.tsx (client trigger)
│   ├── auth/
│   │   ├── callback/route.ts        (GET: exchangeCodeForSession → redirect)
│   │   ├── callback/redirect-guard.ts  (pure sanitizeNext — unit-tested)
│   │   ├── auth-code-error/page.tsx (failure landing)
│   │   └── actions.ts               ("use server": signOut)
│   └── _components/homepage-saa/
│       ├── header.tsx               (client; renders <AccountMenu/> when !minimal)
│       └── account-menu.tsx         (client; getUser + onAuthStateChange, sign-in/out UI)
└── app/_lib/supabase/
    ├── client.ts   (createBrowserClient)
    ├── server.ts   (createServerClient + await cookies())
    └── middleware.ts (updateSession helper)
```

## The three Supabase clients (why three)

`@supabase/ssr` needs different cookie plumbing per execution context:

- **Browser client** (`client.ts`) — runs in Client Components. Manages cookies via `document.cookie`
  automatically; no adapter. A module-level **singleton** (unlike the server client below) — the header
  and its account menu remount on every client-side navigation, so creating a fresh client per call
  would churn the `onAuthStateChange` subscription. Used by the login button (`signInWithOAuth`) and
  the account menu (`getUser`, `onAuthStateChange`).
- **Server client** (`server.ts`) — runs in Route Handlers / Server Actions / Server Components. Built
  per request with `await cookies()` (Next 15/16 async API) and a `getAll`/`setAll` cookie adapter.
  Never a singleton — a shared instance would leak one request's cookies into another.
- **Middleware helper** (`middleware.ts`) — runs at the edge on every matched request. Reads request
  cookies, refreshes the token via `getUser()`, and writes refreshed cookies onto the response.

Cookie adapter is `getAll()`/`setAll()` **only**. Supabase chunks large session cookies
(`sb-<ref>-auth-token.0/.1/…`); always go through the adapter, never hand-parse cookies.

## Data flows

### Sign-in (PKCE)
1. `GoogleLoginButton` (client) → `signInWithOAuth({provider:'google', redirectTo:<origin>/auth/callback})`.
2. supabase-js generates a PKCE `code_verifier` (stored in a cookie) and redirects the browser to Google
   via Supabase's `/auth/v1/authorize`.
3. User authenticates with Google → Google redirects to Supabase's own
   `https://<ref>.supabase.co/auth/v1/callback`.
4. Supabase finishes the handshake → redirects the browser to `<origin>/auth/callback?code=…`.
5. `app/auth/callback/route.ts` `GET`: `sanitizeNext(next)`, then `exchangeCodeForSession(code)` (validates
   the verifier, sets HttpOnly session cookies) → `redirect('/')`. On any failure → `/auth/auth-code-error`.

### Token refresh (every request)
`middleware.ts` → `updateSession()` builds a server client bound to the request, calls `getUser()`
immediately (no code between creation and the call — a race here causes random logouts), and returns the
mutated `supabaseResponse` untouched. This is the *only* place a stale access token gets proactively
refreshed before a Server Component reads it (Server Components can only read cookies, never write them).
**It performs no gating** — there is no `if (!user) redirect(...)`.

### Reading identity (client-side, in the header)
`AccountMenu` (client) calls the browser client `getUser()` on mount and subscribes to
`onAuthStateChange`; it re-renders on `SIGNED_IN` / `SIGNED_OUT`. This keeps identity local to the one
component that needs it, avoiding threading a `user` prop from every page's server component through the
shared layout (DRY/KISS — see permissions.md rationale).

### Sign-out
Account menu renders `<form action={signOut}>`. The `signOut` Server Action calls the server client's
`signOut()` (clears HttpOnly cookies server-side), `revalidatePath('/', 'layout')` (drops stale RSC
cache), then `redirect('/')`. `onAuthStateChange` fires `SIGNED_OUT` so the menu flips to logged-out.

## Why middleware exists with zero protected routes

Route protection and token refresh are different jobs. This app needs only the second. Without the
refresh middleware, an expiring access token would go stale until the user next hits a Route Handler or
Server Action — so server-side `getUser()` reads would start returning null well before the refresh
token expires, degrading the session-only UX even with no gated pages. The middleware is therefore
kept as required infrastructure, with the redirect/protection logic omitted.

## Server-side identity: `getUser()` not `getSession()`

`getSession()` returns whatever is in the cookie without re-verifying it against the Auth server and is
documented as insecure server-side. All server reads of "who is logged in" use `getUser()` (network
round-trip, authoritative). `getClaims()` (local JWKS signature verification) is a faster equivalent
where the project uses asymmetric JWT signing — a candidate follow-up, not adopted in F005.

## Boundaries / non-goals

No persisted user schema (`auth.users` is authoritative), no protected routes, no multi-provider auth.
Adding any of those is a separate feature. **RLS + migrations were introduced by F007** (below).

---

# Kudos data layer (F007)

> Promoted from the F007 forward-draft. The first application-owned Postgres schema (previously only
> `auth.users` existed). Moves the Sun* Kudos board (F003) + composer (F006) from static TS mocks to
> Supabase reads/writes.

## Schema (Supabase `public`)
`sunners`, `kudos` (arrays for `hashtags` / `image_urls`, denormalized `department` + `like_count`),
`recent_gifts`, and a single-row `kudos_stats` backing the sidebar. Delivered as
`supabase/migrations/0001_kudos_schema.sql` + `supabase/seed.sql` — **applied by the operator in the
Dashboard SQL Editor** (this environment has only the anon key: no DDL, no CLI, no psql).

## RLS
First use of Row-Level Security in the project. Public **SELECT** on all board tables (public
recognition wall). Kudos **INSERT** is demo-permissive (anon) so "Gửi" works without a login wall —
documented as production hardening (should become `authenticated`-only, leveraging the F005 session).

## Data access
Server Components read via the existing async server client (`app/_lib/supabase/server.ts`) through a
typed query module (`app/_lib/kudos/queries.ts`, pure mappers in `map.ts`, row types in `types.ts`).
`app/sun-kudos/page.tsx` fetches all sections in parallel and passes data down as props; the Highlight
filter/sort + carousel stay client-side over the fetched set. Writes go through the Server Action
`app/sun-kudos/actions.ts` (`createKudo`) then `revalidatePath('/sun-kudos')`.

## Failure posture
Every board query fails safe — a DB/network error or empty result returns an empty view shape and the
sections render a graceful empty state, never a crash (mirrors the countdown's "safe empty state").
