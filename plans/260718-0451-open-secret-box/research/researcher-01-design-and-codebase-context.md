# Research Context — Open Secret Box (design + codebase survey)

Feature: Open Secret Box modal ("Open secret box- chưa mở", screenId J3-4YFIpMM, fileKey 9ypp4enmFmdK3YAFJLIu6C).
MoMorph ref: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/J3-4YFIpMM
Locked decisions: see ../clarifications.md (authoritative — do not re-open).

## 1. Design (frame J3-4YFIpMM — the "unopened" modal state)

Visual (from frame image):
- Dark modal (near-black bg), centered.
- Title top-center, gold, bold, uppercase: **"KHÁM PHÁ SECRET BOX CỦA BẠN"** (NOT "MỞ SECRET BOX THÀNH CÔNG" — that title belongs to the success-state frame, out of scope).
- Close "X" button top-right, white.
- Thin divider under the title.
- Instruction line, small white bold, centered: **"Click vào box để mở"**.
- Large square illustration centered: black gift box with gold ribbon on a gold podium, gold sparkles (asset must be exported/added; no existing box illustration in repo).
- Bottom center: label "Secretbox chưa mở" (small, white) + count "05" (large, bold, gold/yellow).

MoMorph design items (4, spec_progress all completed):
- A `1466:7678` Title (label): shown while modal open; not interactive; modal closes via "X".
- B `1466:7681` Instruction text (label): "Click vào box để tiếp tục mở" per spec / "Click vào box để mở" per this frame's image; **hidden when unopened count = 0**.
- C `1466:7684` Box image (card): illustration of gift box; on open shows the received badge image inside. Business rules embedded in spec: badge probabilities Stay Gold 30%, Flow to Horizon 25%, Beyond the Boundary 10%, Root Further 5%, Touch of Light 20%, Revival 10%; exactly 1 random badge per opening; **click disabled when unopened count = 0**.
- D `1466:7689` Unopened count (label): "Secretbox chưa mở" (small white) + number (large bold yellow); not interactive; reflects backend data.

## 2. Test cases (19, key requirements)

- ACCESSING: modal opens only for logged-in users; per locked decision the CTA still opens the modal but the content/count is real per-user data (0 boxes → instruction hidden, box click disabled).
- GUI: title centered/visible on all viewports; instruction hidden at count 0; box image centered, no distortion; each of the 6 badge images distinct/visible when shown; counter label white + number yellow bold, non-interactive; X always visible top-right.
- FUNCTION: click box with count>0 → random badge assigned, count −1, UI shows the new badge; click with count=0 → no effect; X closes modal.
- Business logic: probability distribution as in item C; exactly one badge per open.
- Data validation: count always reflects backend value (test data: 0, 1, 4, max); invalid/corrupt badge data → fallback image, no crash, no XSS.
- SECURITY: client-side manipulation of count or badge image must not persist — backend (RPC) is authoritative; anon key cannot forge badges/counts.

## 3. Codebase survey (verified 2026-07-18)

Stack: Next.js 16 App Router, React 19, Tailwind v4, Supabase via @supabase/ssr, **anon key only** (no service_role, no CLI — DDL applied manually in Dashboard SQL Editor).

Existing (reuse):
- CTAs (both visual-only, no onClick): `app/_components/sun-kudos/kudos-sidebar.tsx:41-50` and `app/_components/profile/profile-stats.tsx:37-44`; label key `profile.openSecretBox`.
- Modal pattern: `app/_components/sun-kudos/rules-modal.tsx` — createPortal to body, `useMounted` (`app/_lib/use-mounted.ts`), `useDialogA11y` (`app/_components/sun-kudos/use-dialog-a11y.ts`, Escape/focus-trap/scroll-lock/restore-focus), props `{open, onClose, triggerRef?}`. Rules/write modals are right drawers (`items-stretch justify-end`); this feature is a CENTERED dialog → use `items-center justify-center`.
- Badge PNGs: `public/rules-icons/Huy hiệu.png` … `Huy hiệu (5).png`, mapped in `app/_lib/rules-content.ts:63-70` `RULE_ICONS` (REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER — assumed mapping per docstring).
- Server actions pattern: `app/sun-kudos/actions.ts` — "use server", validate → `createClient()` (`app/_lib/supabase/server.ts`) → `auth.getUser()` → mutate → `revalidatePath` → typed `{ok, error?}` with stable error codes; caller translates via `app/_lib/resolve-heart-error.ts` pattern (F014).
- Auth→sunner link: `sunners.auth_user_id` (migration `supabase/migrations/0005_sunners_auth_link.sql`); lookup precedent `actions.ts:72-76` `.eq("auth_user_id", user.id).maybeSingle()`.
- Hearts source of truth: `public.kudo_likes` (migration 0004) + denormalized `kudos.like_count` maintained by SECURITY DEFINER trigger `kudo_likes_count_sync()`. Hearts received by a sunner = sum of `like_count` over `kudos` rows where `receiver_id` = their sunner id.
- Sidebar/profile stats: `getSidebarStats()` `app/_lib/kudos/queries.ts:130-142` reads global demo singleton `kudos_stats` (id=1) — per-user secret-box stats do NOT exist yet.
- i18n: `app/_lib/i18n/messages/{vi,en}-{core,kudos}.ts`; existing keys `profile.openSecretBox`, `stats.secretOpened`, `stats.secretUnopened`.
- RLS precedent: SECURITY DEFINER fns pin `set search_path = public` (0004, 0005). All tables public SELECT.

Does NOT exist (to create):
- No secret box/badge table, no `sunner_badges`, no RPC, no per-user unopened count anywhere.
- No box illustration asset (gift-box-on-podium image from the design must be added, e.g. `public/secret-box/`).

## 4. Locked architecture (from clarifications — spec must encode these)

1. Unopened count = `floor(total hearts on kudos received by current sunner / 5) − count(sunner_badges rows for that sunner)`. Never negative (GREATEST 0).
2. New migration 0006: table `public.sunner_badges` (id uuid PK default gen_random_uuid(), sunner_id uuid NOT NULL FK→sunners ON DELETE CASCADE, badge_code text NOT NULL CHECK in 6 codes, created_at timestamptz default now()); RLS: public SELECT, NO client INSERT/UPDATE/DELETE.
3. RPC `public.open_secret_box()` SECURITY DEFINER, `set search_path = public`: resolves caller sunner via `auth.uid()`→`sunners.auth_user_id` (else error code), computes entitlement, if unopened ≤ 0 → error code `no_boxes`; else weighted-random badge (30/25/10/5/20/10) via `random()`, INSERT into sunner_badges, RETURNS badge_code + remaining unopened count. Client calls `supabase.rpc('open_secret_box')` from a Next.js server action.
4. A read helper (RPC or view) for the modal's initial count, e.g. `get_secret_box_state()` returning unopened + opened for the current user — or compute in the server component with two queries (sum like_count of received kudos; count sunner_badges). Spec should pick ONE approach and justify.
5. Both CTAs open one shared modal component. Modal fetches per-user state (server-provided props or client fetch on open — spec picks; note kudos sidebar is currently server-rendered via queries.ts, profile too).
6. Badge codes (stable, English): STAY_GOLD, FLOW_TO_HORIZON, BEYOND_THE_BOUNDARY, ROOT_FURTHER, TOUCH_OF_LIGHT, REVIVAL. Map to RULE_ICONS PNGs for display.
7. Logged-out user: CTAs currently render for everyone; modal must handle auth_required (reuse login-prompt precedent if one exists in write-kudo flow — check `app/_components/sun-kudos/write-kudo-modal.tsx` handling of auth).
8. Out of scope: "action bấm mở" animation frames, standby/result frames, syncing `kudos_stats` singleton, per-user stats rows in sidebar (sidebar keeps global demo stats this round unless trivially wireable).
