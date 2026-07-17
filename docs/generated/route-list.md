# Route List

**Project**: aidd-ssa-2026 (Sun* Annual Awards 2025 — Next.js 16 App Router)
**Generated**: 2026-07-17

> Tier2 static parse — enumerated from Next.js App Router file conventions under `app/` (`page.tsx`, `route.ts`), root `proxy.ts` (Next 16's renamed `middleware.ts`), and `actions.ts` Server Actions. No probe manifest; no invented rows.

## Backend Routes

### File: app/auth/callback/route.ts

| Method | Path | Code | Owner F### | Handler | Middleware |
|--------|------|------|------------|---------|------------|
| GET | /auth/callback | ROUTE001 | F005 | `GET` (PKCE code exchange) | proxy (session refresh only) |

Auth note: no session required to *call* this route (it's the OAuth redirect target itself); it exchanges Supabase's `code` param for a session via `exchangeCodeForSession`, then redirects to `next` (sanitized) or `/auth/auth-code-error` on failure.

## Middleware / Proxy

> Next 16 renamed the `middleware.ts` file convention to `proxy.ts` (same signature, `config.matcher` unchanged). No file named `middleware.ts` exists in this repo — `proxy.ts` at the repo root is the sole entry.

### File: proxy.ts

| Method | Path (matcher) | Code | Owner F### | Handler | Middleware |
|--------|-----------------|------|------------|---------|------------|
| ALL | `/((?!_next/static\|_next/image\|favicon.ico\|.*\.(?:svg\|png\|jpg\|jpeg\|gif\|webp)$).*)` | ROUTE002 | F005 | `proxy()` → `updateSession()` | — (this IS the middleware) |

Auth note: **refresh-only** — calls `updateSession(request)` (`app/_lib/supabase/middleware.ts`) to keep the Supabase auth cookie current on every matched request. It does **not** gate/redirect any route; no page is protected by this proxy.

## Server Actions

> These are the app's write endpoints (`"use server"` functions), not URL-addressable routes — included per the app's own write-path convention.

### File: app/auth/actions.ts

| Action | Code | Owner F### | Auth Requirement | Effect |
|--------|------|------------|-------------------|--------|
| `signOut()` | ROUTE003 | F005 | Callable regardless of session state (no-op if already signed out) | Clears Supabase session cookies server-side, `revalidatePath("/", "layout")`, `redirect("/")` |

### File: app/sun-kudos/actions.ts

| Action | Code | Owner F### | Auth Requirement | Effect |
|--------|------|------------|-------------------|--------|
| `createKudo(input)` | ROUTE004 | F007 | **Requires session** — `supabase.auth.getUser()` must resolve a user; returns `{ ok: false, error: "auth_required" }` otherwise | Inserts `kudos` row (sender = logged-in user), `revalidatePath("/sun-kudos")` |
| `toggleHeart(kudoId)` | ROUTE005 | F015 | **Requires session** — same `getUser()` guard, returns `auth_required` otherwise | Insert/delete on `kudo_likes` (like/unlike), `revalidatePath("/sun-kudos")` + `revalidatePath("/profile")` |

## Frontend Routes/Pages

### File: app/page.tsx

| Path | Component | Route Name |
|------|-----------|------------|
| / | HomePage | home |

### File: app/login/page.tsx

| Path | Component | Route Name |
|------|-----------|------------|
| /login | LoginPage | login |

### File: app/profile/page.tsx

| Path | Component | Route Name |
|------|-----------|------------|
| /profile | ProfilePage | profile |

Auth note: **not gated** — renders for logged-out visitors too. `getCurrentUserIdentity()` fails safe to an empty identity when `getUser()` returns no user (F009 fail-safe, FR-001).

### File: app/sun-kudos/page.tsx

| Path | Component | Route Name |
|------|-----------|------------|
| /sun-kudos | SunKudosPage | sun-kudos |

### File: app/prelaunch/page.tsx

| Path | Component | Route Name |
|------|-----------|------------|
| /prelaunch | PrelaunchPage | prelaunch |

### File: app/awards-information/page.tsx

| Path | Component | Route Name |
|------|-----------|------------|
| /awards-information | AwardsInformationPage | awards-information |

### File: app/auth/auth-code-error/page.tsx

| Path | Component | Route Name |
|------|-----------|------------|
| /auth/auth-code-error | AuthCodeErrorPage | auth-code-error |

## Summary

| Category | Count |
|----------|-------|
| Backend API Routes (route.ts) | 1 |
| Middleware/Proxy (proxy.ts) | 1 |
| Server Actions (actions.ts) | 3 |
| Frontend Pages (page.tsx) | 7 |
| Total | 12 |
