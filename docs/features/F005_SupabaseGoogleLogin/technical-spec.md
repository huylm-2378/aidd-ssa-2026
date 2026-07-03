---
feature: F005_SupabaseGoogleLogin
title: Google login with Supabase
status: active
authored_by: create-plan
created: 2026-07-03
fcode: F005
route: /login, /auth/callback, /auth/auth-code-error
continues: F004
lang: en
---

# F005 — Google login with Supabase

## Summary

Wire **real** Google OAuth (via Supabase `@supabase/ssr`, PKCE) behind the existing F004 `/login`
screen. Session-only: no `profiles` table, no RLS, no migrations, **no route protection**. Identity is
read from the Supabase session / `auth.users` through `getUser()`. F005 replaces F004's mock
`<Link href="/">` Google button with a real `signInWithOAuth` trigger, adds the callback + error routes
and a sign-out Server Action, and wires the real signed-in user (name/email/avatar from Google) plus
Sign out / Sign in into the shared Header account menu. All existing marketing pages stay fully public.

F005 **continues F004** (F004 is completed — no blocker). It modifies one F004 file
(`google-login-button.tsx`) and one F001 file (`header.tsx`); everything else is additive.

## Scope decisions (confirmed with user — not open for re-litigation)

1. **NO route protection / no protected routes.** Middleware exists solely to refresh the auth token.
   `/`, `/awards-information`, `/sun-kudos`, `/login` all remain fully public.
2. **Session-only.** No `profiles` DB table, no RLS, no SQL migrations. Read identity from the Supabase
   session (`auth.users`) via `getUser()`.
3. **Header:** real Sign out + real signed-in user (name/email/avatar from Google identity); logged-out
   menu offers a **Sign in** link to `/login`.
4. **Post-login redirect target:** `/` (homepage).

## Architecture at a glance

```
Client Component (GoogleLoginButton)                 Browser
  signInWithOAuth({ provider:'google',                 |
    redirectTo: <origin>/auth/callback })  ─── PKCE ──▶ Google (via Supabase /authorize)
                                                         |
Supabase completes provider handshake ◀──────────────────
  redirects browser to <origin>/auth/callback?code=…
                                                         |
app/auth/callback/route.ts (GET)                         ▼
  exchangeCodeForSession(code) → sets HttpOnly cookies
  sanitizeNext(next) open-redirect guard → redirect '/'  (or /auth/auth-code-error on failure)
                                                         |
proxy.ts (every matched request)                         ▼
  updateSession() → getUser() refreshes the access-token cookie before Server Components read it
                                                         |
AccountMenu (Client Component)                           ▼
  browser client getUser() + onAuthStateChange → shows name/email/avatar or "Sign in"
  Sign out → <form action={signOut}> Server Action → supabase.auth.signOut() → redirect '/'
```

## Supabase client module map (repo convention: `app/_lib/supabase/`)

| Path | Kind | Role |
|---|---|---|
| `app/_lib/supabase/client.ts` | browser | `createBrowserClient` — Client Components only. No cookie adapter. |
| `app/_lib/supabase/server.ts` | server (async) | `createServerClient` + `await cookies()`; `getAll`/`setAll` adapter; new instance per request. |
| `app/_lib/supabase/middleware.ts` | edge helper | `updateSession(request)` — refresh-only; `getUser()` immediately after client creation. |
| `proxy.ts` (repo root) | Next entry (Next 16 renamed `middleware`→`proxy`) | delegates to `updateSession`; `matcher` excludes static assets. |

Import alias: `@/app/_lib/supabase/...` (tsconfig `@/*` → `./*`). Cookie adapter is **`getAll()`/`setAll()`
ONLY** — the legacy `get`/`set`/`remove` trio is disallowed by current `@supabase/ssr`.

## Functional requirements

- **FR-001 — Supabase client modules.** Create browser (`client.ts`), server (`server.ts`, async,
  `await cookies()`), and middleware helper (`middleware.ts`) per the research report. Each file < 200
  lines. Server client is instantiated per request (never a singleton).
- **FR-002 — Token-refresh middleware.** Root `proxy.ts` (Next 16's renamed `middleware` convention)
  delegates to `updateSession()`, which
  calls `getUser()` right after `createServerClient` (no code between them) and returns
  `supabaseResponse` unmodified. `matcher` excludes `_next/static`, `_next/image`, `favicon.ico`, and
  image assets. **Refresh-only — no `if (!user) redirect(...)` gating.**
- **FR-003 — Google OAuth sign-in trigger.** Convert `app/_components/login/google-login-button.tsx`
  from a server `<Link href="/">` into a `"use client"` component whose `onClick` calls
  `supabase.auth.signInWithOAuth({ provider:'google', options:{ redirectTo:`${location.origin}/auth/callback` } })`.
  Keep the existing gold pill styling and Google glyph byte-for-byte; keep the accessible label.
- **FR-004 — OAuth callback route.** `app/auth/callback/route.ts` (GET): read `code` + `next`; run
  `sanitizeNext(next)` guard; if `code` present, `await createClient()` then
  `exchangeCodeForSession(code)`; on success redirect to `${origin}${next}` (default `/`); on
  missing/failed code redirect to `/auth/auth-code-error`.
- **FR-005 — Auth-code-error page.** `app/auth/auth-code-error/page.tsx` — a small standalone page
  (reuse shared Header `minimal` + Footer `minimal` for visual consistency) explaining sign-in failed
  with a link back to `/login`.
- **FR-006 — Sign-out Server Action.** `app/auth/actions.ts` (`"use server"`): `signOut()` calls the
  server client's `signOut()`, `revalidatePath('/', 'layout')`, then `redirect('/')`. Invoked from the
  account menu via `<form action={signOut}>`.
- **FR-007 — Header signed-in user.** The account menu shows the real signed-in user's name
  (`user_metadata.full_name` ?? `user_metadata.name` ?? `email`), email, and avatar
  (`user_metadata.avatar_url` ?? `user_metadata.picture`) sourced from the Google identity. Read
  client-side via the browser client `getUser()` plus an `onAuthStateChange` subscription.
- **FR-008 — Header logged-out state.** When no session, the account menu offers a **Sign in** link to
  `/login` (and hides Profile/Sign out).
- **FR-009 — Env template.** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (names +
  placeholder values only) to `.env.example`. Real values live in gitignored `.env` (already present).
- **FR-010 — Public marketing pages.** `/`, `/awards-information`, `/sun-kudos`, `/login` render
  identically whether or not a session exists — no gating, no redirect to `/login`.

## Entities

**No database entities.** Identity is the Supabase auth session (`auth.users`), read at runtime via
`getUser()`. Fields consumed from the Google identity (all under `user.user_metadata`):

| Logical field | Source (in order of preference) |
|---|---|
| display name | `user_metadata.full_name` → `user_metadata.name` → `user.email` |
| email | `user.email` |
| avatar URL | `user_metadata.avatar_url` → `user_metadata.picture` |

A tiny typed view-model (e.g. `{ name, email, avatarUrl }`) may be derived in the account menu to keep
the JSX clean (DRY). No persisted schema, no migration.

## Success criteria

- **SC-001** — Clicking "LOGIN With Google" on `/login` initiates a redirect toward the configured
  Supabase `/auth/v1/authorize` endpoint (the button is a real trigger, no longer a `<Link href="/">`).
- **SC-002** — On a valid callback (`?code=…`), `exchangeCodeForSession` succeeds and the browser lands
  on `/` with a session set (HttpOnly cookies present).
- **SC-003** — A missing/invalid `code` redirects to `/auth/auth-code-error`, which renders standalone.
- **SC-004** — The callback `next` open-redirect guard: `next` is honoured only when it starts with a
  single `/` and not `//`; anything else (`//evil.com`, `https://evil.com`, empty, null) is discarded
  and the redirect falls back to `/`. (Unit-tested via the extracted `sanitizeNext` pure function.)
- **SC-005** — When signed in, the Header account menu shows the real Google name, email, and avatar.
- **SC-006** — Sign out clears the session server-side; the account menu returns to the logged-out
  state offering **Sign in**; no stale RSC shows the previous user.
- **SC-007** — When signed out, the account menu offers a **Sign in** link to `/login`.
- **SC-008** — `/`, `/awards-information`, `/sun-kudos` load without a session and never redirect to
  `/login` (existing F001–F004 e2e stay green).
- **SC-009** — Middleware refreshes the access-token cookie on matched requests without gating any
  route (a stale-but-valid session is transparently refreshed).
- **SC-010** — `npx tsc --noEmit`, `npm run lint`, and `npm test` pass; no regression to F001–F004.

## Security

- **Secrets handling.** Only the anon/publishable key may sit behind a `NEXT_PUBLIC_` prefix. The
  `service_role`/secret key MUST NEVER be `NEXT_PUBLIC_`, never imported by a Client Component, and
  never reachable from `client.ts`. `.env` stays gitignored (`.env*` in `.gitignore`); `.env.example`
  carries names + placeholders only. Never commit real keys.
- **`getUser()` over `getSession()` server-side.** `getSession()` trusts the raw cookie without
  re-verifying against the Auth server and is documented as insecure server-side. Use `getUser()` in
  middleware and any server read of identity. (`getClaims()` is a faster, still-secure alternative iff
  the project uses asymmetric JWT signing — see Assumptions.)
- **Open-redirect guard.** The callback redirects to `${origin}${next}` (route.ts) — `next` is always
  appended *after* the app's own origin, so even an unsanitized value can never resolve to a different
  host; this concatenation is what actually neutralizes host-takeover. `sanitizeNext` (accepts `next`
  ONLY when `next.startsWith('/') && !next.startsWith('//')`, else falls back to `/`) is correct
  defense-in-depth on top of that — it keeps `next` a same-origin path even if the redirect were later
  refactored to drop the `${origin}` prefix. The double-slash check matters for that defense-in-depth:
  the research report's `!next.startsWith('/')` predicate alone lets protocol-relative `//evil.com`
  through; the corrected predicate rejects it.
- **PKCE.** `@supabase/ssr` clients are PKCE by default; the `code_verifier` cookie is validated in
  `exchangeCodeForSession`. No manual flow-type config.
- **HttpOnly cookie clearing.** Sign out runs through a Server Action so HttpOnly session cookies are
  cleared server-side (a bare client `signOut()` only clears the in-browser client state).
- **Redirect allow-list.** `<origin>/auth/callback` must be present in Supabase Dashboard → Auth → URL
  Configuration → Redirect URLs. Google Cloud Console's authorized redirect URI is Supabase's own
  `https://<project-ref>.supabase.co/auth/v1/callback` (external setup, not code).

## Constraints

- `.claude/rules/development-rules.md`: kebab-case filenames, every code file < 200 lines,
  YAGNI/KISS/DRY, real implementation (no stubs).
- **Next 16.2.9 has intentional breaking changes (AGENTS.md).** Follow the research report patterns —
  in particular `cookies()` is **async** in Next 15/16 (`await cookies()`), so the server client factory
  is `async` and every call site `await`s it. If `node_modules/next/dist/docs/` is readable in the
  implement environment, confirm `cookies()`/middleware/route-handler shapes against it; otherwise rely
  on the research report (`plans/reports/researcher-260703-1719-supabase-google-oauth.md`).
- Do NOT install `@supabase/auth-helpers-nextjs` (deprecated). Packages: `@supabase/supabase-js`
  (~2.110.0) + `@supabase/ssr` (~0.12.0).
- **Environment guardrail:** the literal word "build" is refused by the session Bash guardrail — use
  `npx tsc --noEmit` as the type-check substitute; `npm run build` must be run locally by the user for
  full verification.

## Out of scope

Route protection / protected routes; `profiles` table, RLS, or any SQL migration; email/password or
other providers; server-side threading of a `user` prop through every page; refresh-token rotation
tuning; internationalising the auth copy (language switcher stays visual-only per F004).

## Assumptions / unresolved

- **API key type (from researcher Q1).** Is this Supabase project pre- or post-2025-11-01? Determines
  whether `NEXT_PUBLIC_SUPABASE_ANON_KEY` holds a legacy `eyJ…` anon JWT or a new `sb_publishable_…`
  string. The env var **name** stays as-is either way; confirm the value type in Dashboard → API.
- **JWT signing algorithm (from researcher Q2).** Symmetric (legacy HS256) vs asymmetric (JWKS/ES256,
  default for new projects). If asymmetric, `getClaims()` could replace `getUser()` for a faster,
  still-cryptographically-verified server read. Default to `getUser()` now; revisit iff confirmed
  asymmetric.
- **Dashboard middleware snippet drift (from researcher Q3).** The `@supabase/ssr` middleware shape has
  changed across versions; sanity-check against this project's Dashboard "Connect" snippet at implement
  time before finalising the `updateSession` helper (`app/_lib/supabase/middleware.ts`), which the root
  `proxy.ts` delegates to.
- **Google Cloud OAuth client (from researcher Q4) — RESOLVED.** User confirmed the Google Cloud OAuth
  client + Supabase Google provider setup is complete (Supabase project ref's `/auth/v1/callback`
  registered in Google Cloud Console). No longer a blocker for the manual round-trip.
- **e2e coverage honesty.** The full Google round-trip cannot be automated (real Google + a test user).
  Automation covers the testable surface only; the round-trip is a documented **manual** verification.
