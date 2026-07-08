# System Permissions & Identity Model

> Forward-drafted for F005. Promoted to `docs/system/permissions.md` at implement-start.
> Session-only Google OAuth. No roles, no RLS, no protected routes (by design).

## Identity source of truth

Identity is the **Supabase auth session** backed by `auth.users`. There is **no application-side
`profiles` table**, no roles table, and no RLS policies — this was an explicit product decision for
F005. "Who is the user" is answered at runtime by `getUser()` (server) or the browser client
`getUser()` / `onAuthStateChange` (client). Nothing about the user is persisted by this app.

## Identity fields consumed (from the Google identity)

All under `user.user_metadata`, populated by the Google provider:

| Logical field | Resolution order |
|---|---|
| display name | `full_name` → `name` → `user.email` |
| email | `user.email` |
| avatar URL | `avatar_url` → `picture` |

A small derived view-model `{ name, email, avatarUrl }` is computed in the account menu for clean JSX.
Treat any of these as possibly missing (fallback chain above); never assume `user_metadata` shape.

## Authorization model: intentionally flat

- **No roles / permissions / tiers.** Every authenticated user is equivalent. There is nothing to
  authorize *for* — no gated page, no privileged action.
- **No route protection.** `/`, `/awards-information`, `/sun-kudos`, `/login`, `/profile` (F009), and
  all `/auth/*` routes are reachable without a session. The middleware refreshes tokens but never
  redirects on auth state. `/profile` is nominally "the logged-in Sunner's own profile" but is not
  auth-gated: a logged-out visitor renders it with an empty identity block instead of a redirect. Its
  reads are RLS-backed public data (`kudos_stats`, `kudos`, both from F007) plus, when a session exists,
  the caller's own `auth.getUser()` metadata — no new permission or RLS policy introduced.
- **The only state distinction is signed-in vs signed-out**, and it affects two things: the Header
  account menu (real user + Sign out, vs a Sign in link to `/login`), and F009's `/profile` page (identity
  block populated vs empty; the Sent/Received toggle filters kudos by the current user's display name, so
  logged-out or no-name-match yields empty subsets on both sides).

## Client-side identity read — rationale

Identity is read **client-side in the account menu**, not threaded as a server-provided `user` prop.
Rationale (DRY/KISS/YAGNI):

- The header is already `"use client"` and shared across every route; the only consumer of identity is
  the account menu inside it.
- Threading a `user` prop would force every page's server component (and the shared layout) to fetch
  `getUser()` and pass it down — touching many files for a single widget.
- `onAuthStateChange` gives live sign-in/sign-out updates without a full navigation.
- There is no security trade-off: nothing is *authorized* on this identity. It only chooses which menu
  items to show. (If a future feature gates a route or a privileged action, that decision MUST move
  server-side with `getUser()`/`getClaims()` — see below.)

## Server-side verification rule (for any future gating)

If protection is ever added, authorization decisions MUST be made server-side with `getUser()` (or
`getClaims()` where asymmetric JWT signing is enabled) — never `getSession()`, which trusts the raw
cookie and is documented insecure server-side. The client-side menu logic is presentation only and must
never be relied on to *enforce* access.

## Secrets & key handling

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon/publishable) are the only
  Supabase secrets in the client bundle — safe by design (anon key is public-scoped).
- The `service_role`/secret key is **not used by F005** and MUST NEVER be `NEXT_PUBLIC_`, imported by a
  Client Component, or reachable from `client.ts`.
- `.env` is gitignored; `.env.example` carries names + placeholders only.
- The exact key *value* type (legacy `eyJ…` anon JWT vs new `sb_publishable_…`) depends on project
  creation date — see technical-spec Assumptions.

## Redirect / callback trust boundary

The callback `next` parameter is attacker-controlled input. The actual host-takeover neutralizer is the
redirect construction itself — `app/auth/callback/route.ts` always redirects to `${origin}${next}`, so
`next` is appended after the app's own origin and can never resolve to a different host. `sanitizeNext`
(pure, unit-tested; rejects any value not starting with a single `/`, blocking `//host` and
`https://host` shapes, falling back to `/`) is defense-in-depth on top of that concatenation — it keeps
`next` a same-origin path even if the redirect logic is later refactored. Post-login always lands on
`/`.
