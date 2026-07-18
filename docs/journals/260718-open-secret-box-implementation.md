# 260718 — F016 Open Secret Box: implementation session (takumi, code discipline)

## What shipped

Executed `plans/260718-0451-open-secret-box/plan.md` end-to-end on branch `feat/open-secret-box`
using the MoMorph two-track protocol (Track A UI agent ∥ Track B backend in main thread).

- **Promote (Stage 0):** spec draft → `docs/features/F016_OpenSecretBox/` +
  `docs/screens/SCR008_SecretBoxModal/`, registered in `_canonical-fcodes.json`,
  `feature-list.md`, `screen-list.md`, `.rebuild-state.json`. Allocation note: canonical
  fcodes had drifted (7 entries) vs feature-list (15) — Step 0's max-of-both-sources rule
  yielded F016 correctly.
- **Track B:** `supabase/migrations/0006_secret_box.sql` — `sunner_badges` (CHECK on 6 badge
  codes, public-SELECT-only RLS) + `open_secret_box()` SECURITY DEFINER RPC: entitlement
  `GREATEST(0, FLOOR(sum received like_count / 5) − opened)`, weighted random
  30/25/10/5/20/10, atomic insert, **per-sunner `pg_advisory_xact_lock`** added beyond the
  plan sketch to kill the double-click double-grant race. Plus `getSecretBoxState()`
  (`app/_lib/secret-box/queries.ts`) and `openSecretBox()` server action
  (`app/sun-kudos/secret-box-actions.ts`) with stable error codes.
- **Track A (background implementer + momorph-implement-design):** `SecretBoxModal` +
  `SecretBoxIllustration`, pixel-values from MCP nodes, 3 design assets exported to
  `public/secret-box/`. Exact prop contract honored.
- **Integration:** both "Mở Secret Box" CTAs (kudos sidebar + profile stats) wired via
  `use-secret-box` hook; props threaded from both server pages; copy swapped to
  `secretBox.*` i18n keys (vi + en); inline error line added (modal contract extended with
  optional `errorKey`).
- **Temper:** tsc, eslint, vitest 239/239 (12 new F016 tests), F016 e2e 4/4 on a production
  build, `next build` clean. Evidence gate: **SEALED** (hard, exit 0). Reviewer: 9/10,
  0 critical.

## Gotchas recorded

1. **e2e had been running against a leftover `next dev` on port 3002** (previous session's
   background task). Killed it; canonical runs use `npm run start` per playwright config.
2. **4 full-suite e2e failures are main test debt, NOT F016** (verified: none of the
   implicated files appear in `git diff main --name-only`):
   - `content-and-widget.spec.ts:28,47` — FAB tests still query the pre-i18n English
     aria-label "Open quick actions"; F014 made it `t("fab.openMenu")` = "Mở menu thao tác".
   - `sun-kudos.spec.ts:72` — asserts `getByText("KUDOS", { exact: true })` in Spotlight;
     PR #25 merged the count into a single `{count} KUDOS` text node.
   - `write-kudo.spec.ts:145` — hashtag-cap flow times out; composer untouched by F016.
   Recommend a small follow-up session to fix these stale assertions.
3. **`react-hooks/refs` lint rule** flags every property access on a hook-returned object
   that contains a ref — destructure the hook result instead of passing `box.*` in JSX.
4. **Evidence `study-context.json` schema is strict** (task/mode/acceptanceCriteria/
   touchpoints/blastRadius/contracts only) — extra keys (`spec`, `plan`, `created`) block
   the gate.
5. `set-active-plan.cjs` no longer exists; active plan set by writing
   `/tmp/sk-session-<id>.json` (`activePlan`) per `tkm-config-utils.cjs`.
6. Turbopack refuses a symlinked `node_modules` in a git worktree ("points out of the
   filesystem root") — worktree-based main-vs-branch e2e comparison isn't viable; use
   `git diff main --name-only` reasoning instead.

## Operator follow-up (required for live behavior)

Apply `supabase/migrations/0006_secret_box.sql` in Supabase Dashboard → SQL Editor
(after 0001–0005 + seed), then run its verification queries. Until applied, the modal
works but every open returns the mapped RPC-missing error; display counts read 0 opened.
