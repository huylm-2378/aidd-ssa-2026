# Phase 04 — Integration + CTA Wiring (Integration)

**Track:** Integration · **Depends on:** phase-01 (Track A modal) AND phase-03 (Track B read +
action) — the single hard merge point.

## Context Links
- Spec: `spec/open-secret-box/technical-spec.md` (FR-001, FR-006, FR-007, FR-008, BR-004, DEC-001, US004)
- Screen spec: `spec/open-secret-box/screens/SCR-secret-box-modal/spec.md` (UI states)
- Edge cases: `spec/open-secret-box/edge-cases.md`
- CTAs: `app/_components/sun-kudos/kudos-sidebar.tsx:41-50`, `app/_components/profile/profile-stats.tsx:37-44`
- Mapping: `app/_lib/rules-content.ts:63-70` (`RULE_ICONS`)
- i18n: `app/_lib/i18n/messages/{vi,en}-{core,kudos}.ts`

## Overview
- **Priority:** P1 · **Status:** pending
- Wire both existing CTAs to the shared `SecretBoxModal`; replace Track A mock props with real
  server-provided state + the `openSecretBox()` action; map badge codes to art with fallback;
  handle 0-count and anon states; add i18n copy.

## Key Insights
- Both CTAs open ONE shared modal instance (FR-001) — lift modal open-state to the nearest common
  client boundary of each page (sidebar and profile are separate trees, so each hosts its own
  instance of the same component; the component is shared, the mount is per-page).
- Server components pass initial `{ unopened, opened, authState }` as props (FR-004) — no client
  fetch-on-open needed; RPC result drives the post-open counter.
- `badge_code → RULE_ICONS` is the BR-004 render point: unknown code → fallback image, never a raw
  interpolation or broken `<img>`.

## Requirements
- **Functional:** FR-001 (both CTAs → shared modal), FR-006 (badge_code → image, counter =
  `remaining`), FR-007 (box inert at 0), FR-008 (anon → inline sign-in), US004.
- **Rules:** BR-004 (fallback image), DEC-001 (click gate at `unopened <= 0`).
- **i18n:** new keys in vi + en. Frame copy stays Vietnamese verbatim in `vi` ("KHÁM PHÁ SECRET
  BOX CỦA BẠN", "Click vào box để mở", "Secretbox chưa mở"); `en` translated.

## Architecture
- **Data flow:** server component reads `getSecretBoxState()` → passes props to page's client
  boundary → `SecretBoxModal` renders. Box click → `onOpenBox()` → `openSecretBox()` action →
  on ok: set `lastBadgeCode`, `unopened = remaining`; on error: inline message via stable code.
- **Badge render:** `badgeSrc(code) = KNOWN.has(code) ? RULE_ICONS[code] : FALLBACK_BADGE_SRC` (BR-004).
- **Auth branch:** `authState === "anon"` → modal shows inline sign-in prompt, no counts, no action.
- **Gate:** `unopened <= 0` → instruction hidden (FR-003), box inert, `onOpenBox` no-op (DEC-001/FR-007).

## Related Code Files
- **Modify:** `app/_components/sun-kudos/kudos-sidebar.tsx` (add `onClick` + modal mount),
  `app/_components/profile/profile-stats.tsx` (same); the server components rendering each (pass
  initial props); `app/_lib/rules-content.ts` or a new `app/_lib/secret-box/badge-icons.ts`
  (code→src map + fallback — keep under 200 lines); `app/_lib/i18n/messages/vi-*.ts`, `en-*.ts`.
- **Modify (Track A output):** `SecretBoxModal` — replace mock props with real wiring, add badge
  render + error/auth states.
- **Create:** fallback badge asset reference (reuse an existing generic PNG or a design export).
- **Delete:** none.

## Implementation Steps
1. Confirm Track A's `SecretBoxModal` props match the phase-01 contract; reconcile if drifted.
2. Add `badge-icons.ts` mapping the 6 codes → `RULE_ICONS` PNGs + `FALLBACK_BADGE_SRC` (BR-004).
3. Wire `kudos-sidebar.tsx` CTA: `onClick` opens modal; host modal instance; pass server props.
4. Wire `profile-stats.tsx` CTA identically.
5. Server components: call `getSecretBoxState()`, pass `{ unopened, opened, authState }`.
6. Modal: on box click call `openSecretBox()`, apply `remaining`/`lastBadgeCode`; render error &
   anon inline states; enforce 0-count gate (FR-003, FR-007, DEC-001).
7. Add vi/en i18n keys; frame copy verbatim in vi.
8. Compile/type check.

## Todo List
- [x] Both CTAs open the shared modal (FR-001)
- [x] Server props supply initial `{unopened, opened, authState}`
- [x] Mock props replaced by real state + action
- [x] badge_code → image with fallback (BR-004)
- [x] 0-count: instruction hidden, box inert (FR-003, FR-007, DEC-001)
- [x] Anon → inline sign-in prompt (US004, FR-008)
- [x] vi + en i18n keys (frame copy verbatim in vi)
- [x] Type check passes

## Success Criteria
- SC-003: click at `unopened <= 0` fires no action, counter stays 00.
- Both CTAs open the same modal component; post-open the counter reflects RPC `remaining`.
- Unknown badge code → fallback image, no crash / no XSS.
- Signed-out → inline sign-in, no count computed, no RPC attempt.

## Risk Assessment
- **Two mount points diverge (Med / Med):** sidebar vs profile wire the modal differently.
  Countermove: single shared component + one badge-map util; only the mount/open-state differs.
- **`RULE_ICONS` ordering wrong (Med / High):** silently shows wrong art (open question #1).
  Countermove: centralize in `badge-icons.ts`; flag for design confirmation before release.
- **Stale `unopened` after open across the two entry points (Low / Med):** counter is per-modal
  session state; `revalidatePath` refreshes server props on next open. Acceptable this round.

## Security Considerations
- Client never sends count/badge; anon branch computes nothing and calls no RPC (BR-002, FR-008).
- Badge render escapes/whitelists the code (BR-004) — no raw value in the DOM.

## Next Steps
- Unblocks phase-05 (e2e + docs). Confirm open questions #1/#3 with design before release.
