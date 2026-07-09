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
recognition wall). Kudos **INSERT** is restricted to **`authenticated`** (migration `0002`): a Kudo must
have a real sender, so the composer's `createKudo` Server Action reads `auth.getUser()` and refuses
without a session. The sender's display name + avatar are denormalized onto `kudos`
(`sender_name`/`sender_avatar`) since the logged-in user isn't in the seeded `sunners` directory;
anonymous submissions hide them at render.

## Data access
Server Components read via the existing async server client (`app/_lib/supabase/server.ts`) through a
typed query module (`app/_lib/kudos/queries.ts`, pure mappers in `map.ts`, row types in `types.ts`).
`app/sun-kudos/page.tsx` fetches all sections in parallel and passes data down as props; the Highlight
filter/sort + carousel stay client-side over the fetched set. Writes go through the Server Action
`app/sun-kudos/actions.ts` (`createKudo`) then `revalidatePath('/sun-kudos')`.

## Failure posture
Every board query fails safe — a DB/network error or empty result returns an empty view shape and the
sections render a graceful empty state, never a crash (mirrors the countdown's "safe empty state").

---

# Live Spotlight Board realtime channel (F008)

> Promoted from the F008 forward-draft. Scope: the one new architectural element this feature
> introduces — a client-side Supabase Realtime channel layered over the existing server snapshot
> read path. Everything else (server read path, RLS, fail-safe) is unchanged from F007 above.

## New data-flow: server snapshot + client realtime overlay

Until F008, all Kudos data flowed **server → RSC → HTML** (one-shot reads through the anon
`@supabase/ssr` server client, RLS `public read`). The Live Board adds a **second, client-side
channel** layered on top of that same initial snapshot:

```
                 initial render (unchanged)
  Supabase ──(anon server client, RLS SELECT)──▶ getSpotlight() ──▶ <SpotlightBoard> (RSC shell)
                                                                          │ props: count, sunners[], activity[]
                                                                          ▼
                                                              <SpotlightBoard client island>
  Supabase Realtime ──(browser client singleton)──▶ channel('kudos-live-board')
      .on('postgres_changes', INSERT public.kudos) ──▶ count++, prepend activity, (names live)
```

- **Initial state**: server-fetched (fail-safe preserved — DB down → empty board, no crash).
- **Live overlay**: a Client Component subscribes in `useEffect` via the existing browser client
  singleton (`app/_lib/supabase/client.ts`), cleans up with `supabase.removeChannel(channel)`.
- **Boundary**: the browser client uses only `NEXT_PUBLIC_*` env vars (already present). No secrets
  cross to the client; realtime reads are gated by the same `"public read kudos"` RLS SELECT policy
  from F007.

## DB change

`public.kudos` is added to the `supabase_realtime` publication (migration `0003_kudos_realtime.sql`,
idempotent). INSERT-only use → no `REPLICA IDENTITY` change needed. RLS unchanged.

## Payload limitation (design consequence)

`postgres_changes` delivers the **raw row** (`payload.new`) — no PostgREST embedded joins. The
Kudos row has `receiver_id` but no `receiver_name`, so the client resolves names via an id→name map
built from the server-fetched `sunners` list (why `getSpotlight()` now selects `id,name`).

## Risks

- Postgres Changes broadcasts to every subscriber (no server-side row filtering); acceptable at this
  scale. Broadcast-from-DB is the higher-volume alternative (YAGNI now).
- No reconnect/backoff logic (v1). A dropped socket degrades to the static server snapshot.

## Internationalization (i18n)

The app uses a **dependency-free, client-side i18n layer** (no `next-intl`,
`react-i18next`, and no locale-prefixed routing — Next 16 App Router has no
built-in i18n routing).

### Shape

- **`LanguageProvider`** (`app/_components/i18n/language-provider.tsx`, `"use client"`)
  — React Context holding `lang: "vi" | "en"` (default `"vi"`). Mounted in
  `app/layout.tsx` (a Server Component) as a client wrapper around `{children}`,
  so the whole tree can read the active locale.
- **Catalogs** (`app/_lib/i18n/vi.ts`, `en.ts`) — plain typed objects, keyed by
  UI area (`header.*`, `footer.*`, `hero.*`, `awards.*`, `fab.*`, `rules.*`,
  `spotlight.*`, …). `vi` is the source of truth; the `Messages` type is
  derived from `vi` and `en` is compile-checked against it (missing EN key =
  TS error). Each catalog is now a thin composer over per-area fragment files
  under `app/_lib/i18n/messages/` (`{vi,en}-core.ts` for chrome/homepage/
  Profile/Awards-information, `{vi,en}-kudos.ts` for the FAB, rules drawer,
  and `/sun-kudos` screen) — the fragment split keeps every file under the
  200-line budget while `vi.ts`/`en.ts` still expose the single merged
  `Messages`/`MessageKey` shape the rest of the app imports.
- **`useTranslation()`** (`app/_lib/i18n/use-translation.ts`) — returns
  `{ t, lang, setLang }`. `t(key)` resolves a dot-path against the active
  catalog, falls back to the `vi` value (never a raw key), and does `{name}`
  interpolation.

### Server-produced UI labels (Profile + sun-kudos stats)

Not every translated string starts life as client-side copy. `mapStats()`
(`app/_lib/kudos/map.ts`, part of the F007 data layer) maps the single
`kudos_stats` row to the sidebar's five stat rows, and now returns each row's
`label` as a `MessageKey` (e.g. `"stats.received"`) rather than fixed VI text.
The client resolves it at render time — `profile-stats.tsx` (Profile screen)
and `sun-kudos/kudos-sidebar.tsx` both call `t(stat.label)` against the same
`SunnerStat[]` shape, so the one server-side change translates the stats panel
in both places without duplicating logic.

### Server-action error codes (Write Kudo composer)

A second server-boundary pattern, alongside `mapStats()` above: the
`createKudo` server action (`app/sun-kudos/actions.ts`, F007) has no React
context either, so on a known failure it returns a stable
`CreateKudoErrorCode` (`"missing_fields" | "auth_required" | "unknown"`)
instead of a VN string. The client-side helper `app/_lib/write-kudo-error.ts`'s
`resolveComposerError(t, error)` maps each code to a `composer.error.*`
catalog key; any other error value (a dynamic Supabase/`Error.message`
string) passes through untranslated, since it's already human-readable and
not one of the known codes. `write-kudo-content.ts`'s `WRITE_KUDO_COPY` and
`write-kudo-form.ts`'s `missingRequired()` follow the same
key-not-string convention — the modal translates and joins the returned
`MessageKey[]` into `composer.missingHint`'s `{fields}` interpolation.

### RSC pages with a client leaf (login, prelaunch, auth-code-error)

A third pattern, alongside the two server-boundary ones above: `/login`,
`/prelaunch`, and `/auth/auth-code-error` are Server Components that export
`metadata`, so none of them can call `useTranslation()` directly. Each page
stays a Server Component and delegates its translated copy to a small new
`"use client"` leaf — `login-welcome.tsx`, `prelaunch-heading.tsx`,
`auth-error-content.tsx` — that reads the context and renders the
`t()`-resolved text; the page composes the leaf alongside its existing
chrome/keyvisual markup, unchanged. `app/_lib/login-content.ts` (the F004
static-copy module) is deleted — its two strings now live as
`login.subtitle1`/`login.subtitle2` in the catalog, read by `login-welcome.tsx`.

### Hook-free modules stay hook-free

Some translated copy lives in plain data/helper modules that must not import
React hooks (e.g. `rules-content.ts`'s `RULES_COPY`/`RULE_TIERS`, and
`spotlight-fns.ts`'s pure helpers for the live board). The pattern: the
module holds `MessageKey`s (or takes a translated value as a parameter)
instead of calling `t()` itself, and the consuming component resolves the
active-locale text. Concretely, `buildActivityEntry()` takes a third
`receivedLabel: string` argument rather than hardcoding the VN ticker suffix
or importing `useTranslation()`; `spotlight-board-live.tsx` supplies
`t("spotlight.receivedKudos")` at the call site, keeping `spotlight-fns.ts`
importable from Node test files with no React runtime.

### Persistence & hydration

Locale persists in `localStorage` (`saa-lang`). The server always renders the
default `vi`; after mount the provider reads storage and updates state. This
accepts a one-frame flash of Vietnamese on an EN-persisted reload — a deliberate
KISS tradeoff over cookie-based SSR reads for an internal, no-SEO app.

### Boundaries

Server Components that export `metadata` (`login/page.tsx`, `prelaunch/page.tsx`,
`auth-code-error/page.tsx`) cannot read the Context, so their `title`/
`description` stay Vietnamese-only — a structural boundary (Server Component
`metadata` vs. Context), not a content gap, since round 5 migrated every
visible string on those three pages via the client-leaf pattern above. Mock/
seed data (real names, user-authored kudos bodies) is never translated. As of
round 5, the entire app's visible UI is migrated (see the server-key
pipeline, the server-action error-code pattern, and the client-leaf pattern
above); the only strings left untranslated are page `metadata`, mock/seed
data, and the handful below that stay English by design.
A handful of sun-kudos/highlight/all-kudos strings stay English **by
design** (section headings, their landmark aria-labels, the "Hashtag" filter
label, kudo-card's "Copy Link"/"Spam") — not a migration gap. Right after a
locale switch, the live activity ticker can briefly mix English (new
realtime rows) with Vietnamese (older static seed rows) until the seed rows
scroll off, since seed data is never translated.

## Kudos Hearts (F015)

### Schema addition (Supabase `public`)

- **`kudo_likes`** (migration `0004_kudos_likes.sql`): `(kudo_id uuid FK→kudos
  ON DELETE CASCADE, user_id uuid FK→auth.users ON DELETE CASCADE, created_at,
  PRIMARY KEY (kudo_id, user_id))` — one like per user per kudo by
  construction.
- `kudos.like_count` remains the denormalized read column; it is maintained
  exclusively by `AFTER INSERT/DELETE` triggers on `kudo_likes` (SECURITY
  DEFINER function). Clients never gain an UPDATE policy on `kudos`.

### RLS

- `kudo_likes`: SELECT for anon+authenticated (board is public-read);
  INSERT only `auth.uid() = user_id`; DELETE only own row; no UPDATE.
- Preserves the `0002` hardening posture: every write has a real actor.

### Write path

`HeartButton` (client, optimistic ±1 with rollback) → `toggleHeart` server
action (mirrors `createKudo`: `getUser()` → stable error codes
`auth_required`/`unknown` → insert-or-delete on unique violation → fresh count
returned → `revalidatePath`). Signed-out taps roll back and show a translated
inline prompt — no route gating.

### Read path

List queries also fetch the signed-in user's liked ids in one `kudo_likes`
SELECT and map `likedByMe` onto each kudo row; anon ⇒ `false`.
