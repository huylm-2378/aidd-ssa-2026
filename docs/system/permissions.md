# Permissions

**Project**: aidd-ssa-2026 (Sun* Annual Awards 2025)
**Generated**: 2026-07-17
**Analysis Scope**: Derived from [permissions-matrix.md](permissions-matrix.md).

> **Curated, plain-language view.** This document is for PM, BA, and client audiences who
> need to understand access without reading raw codes. The raw PERM### matrix lives at
> [permissions-matrix.md](permissions-matrix.md). This prose is derived FROM that matrix.

## Authorization System Type

**System Type**: `hybrid` (flat authentication check + resource-ownership on likes; no role hierarchy)

| System Type | Description |
|-------------|-------------|
| `rbac` | Role-Based Access Control — roles (admin, user, manager) drive access |
| `abac` | Attribute-Based Access Control — policies on attributes (department, owner, status) |
| `acl` | Access Control List — explicit per-user permissions |
| `ownership` | Resource Ownership — owner_id / created_by / can_edit rules |
| `hybrid` | Mixed — roles combined with ownership checks |
| `other` | Custom permission logic |

This system has no roles table and no tiers of privilege — every signed-in visitor is treated identically.
The one place "ownership" shows up is likes: a user can only add or remove *their own* like on a Kudo,
never someone else's. Everything else reduces to a single question: is this visitor signed in or not.

**Identified Roles**:
- Anonymous visitor (no session)
- Authenticated Sunner (signed in via Google OAuth)

## Curated View

- **Anyone** — signed in or not — can browse the whole site: the homepage, Awards Information, the
  Sun* Kudos board (feed, spotlight, highlights, sidebar stats), and even their own `/profile` page (it
  simply shows without a name/avatar if nobody is signed in).
- **Anonymous visitors** can look at everything but cannot write anything: they cannot post a Kudo and
  cannot like/unlike one. Trying either from a signed-out state (should the UI ever allow it to be
  attempted) is rejected by the database itself, not just the app.
- **Authenticated Sunners** can do everything an anonymous visitor can, plus: post a new Kudo to any
  recipient, and like or unlike any Kudo. They cannot like or unlike on someone else's behalf — only their
  own like can be toggled.
- **No one** — signed in or not — has admin, moderator, or elevated privileges of any kind. There is no
  such role in this system.

## Access Boundaries

There is exactly one boundary in this system: **signed in vs. not**. It is not enforced by hiding pages —
every page is reachable by everyone, with no login wall and no redirect-if-logged-out behavior anywhere.
Instead, the boundary sits at the two actions that change data: creating a Kudo and toggling a like. Both
are blocked for a signed-out visitor at the database level (the actual authorization boundary), with the
application code adding its own matching check as a second, redundant layer.

The only other place identity affects what's on screen is cosmetic: the account menu in the header shows
a name, a link to your profile, and a sign-out button when you're signed in, or just a sign-in link when
you're not. That's a display choice, not an access restriction — nothing behind those links is actually
gated.

Ownership only matters for likes: your like belongs to you, and no other Sunner's action can add or
remove it. There is no equivalent ownership concept for Kudos themselves — any signed-in Sunner may send
one to any other Sunner, with no restriction on sender/receiver pairing.

## DB-Side Identity Link (first-login trigger)

When a member signs in with Google for the first time, a database trigger (`handle_new_member()` on
`auth.users`, migration `0005_sunners_auth_link.sql`) automatically creates their row in the public
`sunners` directory so they can receive Kudos. Three properties matter for the permission model:
it runs as SECURITY DEFINER with a pinned `search_path = public` (so no extra INSERT policy was
opened on `sunners`); it can never block a signup (any error is swallowed and the login proceeds);
and it introduces no service-role key — the app keeps running on the anon key only. Trade-off
accepted by decision (2026-07-17): `sunners` stays publicly readable, so real member display
names/avatars are visible without signing in. Email is never stored in `sunners`.

## Special Conditions

No feature flags, A/B experiments, environment-based feature gating, or locale-based access rules exist
anywhere in this codebase. The one environment variable read outside Supabase connection config is the
event's start date/time used to drive the countdown display — a configuration value, not an access gate.

No special conditions identified beyond the signed-in/signed-out boundary described above. Raw per-gate
detail (exact policy names, file:line citations) lives in [permissions-matrix.md](permissions-matrix.md).
