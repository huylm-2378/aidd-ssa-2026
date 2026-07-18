# Phase 03 — Server Read Helper + openSecretBox() Action (Track B)

**Track:** B · **Depends on:** phase-02 (needs `open_secret_box()` + `sunner_badges`) ·
**Parallel with:** Track A

## Context Links
- Spec: `spec/open-secret-box/technical-spec.md` (FR-004, FR-005, FR-008; Assumption: 2-query read)
- Patterns: `app/sun-kudos/actions.ts` (server-action shape), `app/_lib/kudos/queries.ts:130-142`
  (`getSidebarStats` fail-safe read shape), `app/_lib/supabase/server.ts` (`createClient`),
  `app/_lib/write-kudo-error.ts` (stable-code → message)
- Tests precedent: `app/sun-kudos/actions.test.ts` (mock conventions)

## Overview
- **Priority:** P1 · **Status:** pending
- Read helper for the modal's initial `{ unopened, opened }`; `openSecretBox()` server action
  wrapping `supabase.rpc('open_secret_box')`; unit tests.

## Key Insights
- Per spec Assumption + locked decision 4: use a **2-query server read** (sum received-kudos
  `like_count` + count `sunner_badges`), NOT a dedicated read RPC — both tables allow public
  SELECT, so a SECURITY DEFINER wrapper is only needed for the write path (YAGNI).
- Action mirrors `createKudo`/`toggleHeart`: `"use server"` → `createClient()` → `auth.getUser()`
  → `rpc()` → typed `{ ok, error? }`. Caller translates codes (no UI copy in the action).
- 200-line file cap: prefer a new `app/_lib/secret-box/` module over bloating `queries.ts`.

## Requirements
- **Functional:** FR-004 (initial count read), FR-005 (open action → RPC), FR-008 (auth_required).
- **Error codes (stable):** `auth_required` | `no_boxes` | `unknown`.
- **Non-functional:** read is fail-safe (try/catch, returns `{unopened:0, opened:0}` on error);
  files < 200 lines.

## Architecture
- **Read helper `getSecretBoxState(supabase, authUserId)`:**
  - in: current session user id → resolve `sunners.id` via `.eq("auth_user_id", …).maybeSingle()`.
  - transform: `SUM(kudos.like_count WHERE receiver_id)`, `COUNT(sunner_badges)`,
    `unopened = GREATEST(0, floor(sum/5) − opened)` (BR-001, mirrored client-side of the RPC).
  - out: `{ unopened, opened }`; on any failure or missing sunner → `{0,0}` (edge-cases: unlinked
    sunner treated as zero entitlement).
- **Action `openSecretBox()`:**
  - in: none. `createClient()` → `auth.getUser()`; no user → `{ ok:false, error:"auth_required" }`.
  - transform: `supabase.rpc('open_secret_box')`; map RPC exception messages
    (`auth_required`/`no_boxes`) to stable codes, anything else → `unknown`.
  - out: `{ ok:true, badgeCode, remaining }` | `{ ok:false, error }`. `revalidatePath` as peers do.

## Related Code Files
- **Create:** `app/_lib/secret-box/queries.ts` (read helper), tests
  `app/_lib/secret-box/queries.test.ts`; add `openSecretBox()` to `app/sun-kudos/actions.ts`
  (extend existing file) + cases in `app/sun-kudos/actions.test.ts`.
  - If `actions.ts` nears the 200-line cap, extract to `app/_lib/secret-box/actions.ts` and
    re-export — decide at implementation time, do not pre-split.
- **Read for pattern:** `app/sun-kudos/actions.ts`, `app/_lib/kudos/queries.ts`.
- **Delete:** none.

## Implementation Steps
1. Add `getSecretBoxState()` to `app/_lib/secret-box/queries.ts` following `getSidebarStats`
   fail-safe shape (`.maybeSingle()`, try/catch, safe default).
2. Add `openSecretBox()` action: auth guard → `rpc('open_secret_box')` → map errors to typed codes.
3. Unit tests: entitled open → `{ok, badgeCode, remaining}`; no session → `auth_required`;
   RPC `no_boxes` → `no_boxes`; unexpected RPC error → `unknown`; read helper floors at zero and
   returns `{0,0}` for unlinked/missing sunner. Follow `actions.test.ts` mock conventions.
4. Run the compile/type check after edits.

## Todo List
- [x] `getSecretBoxState()` 2-query read, fail-safe, BR-001 floor
- [x] `openSecretBox()` action, auth guard, RPC call, typed codes
- [x] Error mapping `auth_required | no_boxes | unknown`
- [x] Unit tests for action + read helper (mock supabase per actions.test.ts)
- [x] Type check passes

## Success Criteria
- SC-001: read helper returns `FLOOR(received/5) − opened`, never negative.
- SC-005: no session → action short-circuits to `auth_required`, never calls the RPC.
- Tests green with no mocked DB writes faking success (mock the client, assert real code paths).

## Risk Assessment
- **RPC error surfaced as raw Postgres message (Med / Med):** leaks internals / breaks caller
  translation. Countermove: match on known substrings → stable codes, default `unknown`.
- **Read/RPC entitlement drift (Low / Med):** helper and RPC compute `unopened` independently. The
  RPC is authoritative; helper is display-only and re-validated server-side on open — acceptable.
- **File cap breach on `actions.ts` (Med / Low):** extract to `secret-box/actions.ts` if needed.

## Security Considerations
- Anon key only. Action never trusts client input; RPC re-derives entitlement (BR-002). No count or
  badge value crosses from client to server.

## Rollback
- Revert the action + helper additions (git); no DB change here. Phase-02 owns DB rollback.

## Next Steps
- Unblocks phase-04 integration (server components call `getSecretBoxState`; modal calls action).
