# Phase 02 — createKudo sets sender_id + unit tests

## Context Links

- Spec: `spec/F007_KudosData/technical-spec.md` → **FR-011**, SC-008, SC-009
- Code to modify: `app/sun-kudos/actions.ts` (`createKudo`, lines 41–99)
- Test patterns: `app/sun-kudos/actions.test.ts` (existing `toggleHeart` mock shape)
- Read-only context: `app/_lib/kudos/map.ts` (`mapKudoRow` sender precedence), `queries.ts` (`KUDO_SELECT`)

## Overview

- **Priority:** P1 · **Status:** completed
- `createKudo` resolves the caller's own sunner row via `auth_user_id` and sets `sender_id` on the
  insert. Denormalized `sender_name`/`sender_avatar` stay as the display fallback. A lookup miss
  leaves `sender_id` NULL and **never fails the submit**. App-code only; no DB apply needed to
  typecheck or unit-test (the lookup is mocked).

## Key Insights

- `mapKudoRow` already handles both paths: `isUserSender` (denormalized name present) wins for
  display, so setting `sender_id` does **not** change card rendering (SC-009) — it only backfills
  the FK. No mapper or `KUDO_SELECT` change.
- Lookup miss is expected during the window between deploy and operator applying `0005`, or for any
  member without a linked row → must degrade to NULL, matching today's behavior (FR-011).
- The auth-required path (no session → `auth_required`) is unchanged.

## Requirements

- **FR-011:** `createKudo` selects `sunners.id WHERE auth_user_id = user.id`; sets `sender_id` on
  insert; miss → `sender_id: null`, submit still succeeds; existing denormalized fields untouched.

## Architecture

Data flow inside `createKudo` after the existing `auth.getUser()` check:

```
user (session) ─┐
                ├─▶ SELECT sunners.id WHERE auth_user_id = user.id (.maybeSingle)
                │        │ hit → senderId = row.id
                │        └ miss/error → senderId = null   (never throws)
receiver dept ──┴─▶ INSERT kudos { …, sender_id: senderId, sender_name, sender_avatar }
```

Insert gains one field: `sender_id: senderRow?.id ?? null`. Everything else in the insert object is
unchanged.

## Related Code Files

- **Modify:** `app/sun-kudos/actions.ts` — add the sunner lookup + `sender_id` on the insert.
- **Modify:** `app/sun-kudos/actions.test.ts` — add a `describe("createKudo")` block.
- **No change:** `map.ts`, `queries.ts`, `write-kudo-modal.tsx`.

## Implementation Steps

1. In `createKudo`, after the `if (!user)` guard and before/after the receiver-department query, add:
   ```ts
   const { data: senderRow } = await supabase
     .from("sunners")
     .select("id")
     .eq("auth_user_id", user.id)
     .maybeSingle();
   ```
   Wrapping try/catch already covers this; a thrown lookup falls through to the outer catch, so guard
   the value inline: `const senderId = senderRow?.id ?? null;`. (Prefer keeping the lookup inside the
   existing `try` so a miss returns `{ data: null }` rather than throwing — `.maybeSingle()` does not
   throw on zero rows.)
2. Add `sender_id: senderId` to the `.insert({ … })` object (alongside `sender_name`/`sender_avatar`).
3. Extend `actions.test.ts`: the current mock's `from()` returns a single `select→eq→maybeSingle`
   chain. `createKudo` now issues **two** distinct `.maybeSingle()` reads (sender lookup on
   `auth_user_id`, receiver lookup on `id`) plus an `.insert`. Update the mock so `select().eq()`
   returns a `maybeSingle` whose resolved value can be **queued per call** (e.g.
   `maybeSingle.mockResolvedValueOnce(sender).mockResolvedValueOnce(receiver)`), and `insert`
   returns `{ error: null }`. Keep the existing `toggleHeart` tests working (shared mock).

## Todo List

- [x] Add sunner lookup + `senderId` in `createKudo`
- [x] Add `sender_id: senderId` to the insert payload
- [x] Test: linked member → insert called with `sender_id` = the sunner id
- [x] Test: unlinked user (lookup miss) → insert called with `sender_id: null`, result `{ ok: true }`
- [x] Test: no session → `auth_required`, no lookup, no insert (unchanged path)
- [x] Test: missing fields → `missing_fields` before any client call (unchanged)
- [x] `npx tsc --noEmit` + `vitest run app/sun-kudos/actions.test.ts` green (227/227 vitest pass)

## Success Criteria

- SC-008 (code side): a logged-in submit calls insert with `sender_id` = caller's sunner id when a
  linked row exists (live DB assertion deferred to phase 04).
- FR-011: lookup miss keeps `sender_id` NULL and returns `{ ok: true }`.
- SC-009: card rendering unchanged — no assertion on `mapKudoRow` output changes.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Lookup throws and aborts submit | Low | Med | `.maybeSingle()` returns null on 0 rows; keep inside existing try; `senderRow?.id ?? null` |
| Mock can't distinguish two maybeSingle calls | Med | Low | Use `mockResolvedValueOnce` queue ordering (sender then receiver) |
| Regressing `toggleHeart` tests via shared mock edits | Low | Med | Additive mock changes only; run full test file |

## Security Considerations

- No new secrets, no service_role. Reads go through the existing anon server client (RLS public
  SELECT on `sunners`). No email read or stored.

## Next Steps

- Independent of phase 01/03 (disjoint files) → parallel-safe.
- Feeds phase 04 live check: submit while logged in → row has `sender_id`.
- Rollback: `git revert` the two owned files.
