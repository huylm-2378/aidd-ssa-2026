# F009: User Profile Page — Reuse, Layout Regression, and the Display-Name Toggle Trap

**Date**: 2026-07-08 13:57
**Severity**: N/A (Shipped)
**Component**: User Profile / Profile bản thân (MoMorph screen 3FoIx6ALVb)
**Status**: Resolved (specification sealed)

## What Happened

Shipped F009 — the `/profile` "Profile bản thân" page — through the full Takumi cycle (study → spec → blueprint → forge in 3 parallel waves → temper → inspect → deliver). PR #13 (commit d16c7a6). 115 tests pass, production build clean, spec promoted to `docs/features/F009_UserProfile/`.

Heavy reuse of the sun-kudos layer: Header, Footer, KudosKeyvisualBg, KudoCard, KudoAvatar, FilterDropdown from the component library; getAllKudos, getSidebarStats, mapKudoRow from queries; identity and stats data sources aligned with existing patterns. No schema changes or migrations.

New artifacts:
- `app/profile/page.tsx` (async Server Component with fail-safe error boundary)
- `app/_components/profile/` (ProfileIdentity, ProfileStats, ProfileKudosSection)
- `app/_lib/profile/split-kudos.ts` (pure utility: splits kudos into sent vs received on display name)
- `TierBadge` extracted from KudoCard and moved to shared design system
- FilterDropdown enhanced with optional `display` prop (decouples trigger text from option match key)
- KudoCard gain `isSpam` prop for visual-only pill rendering
- account-menu updated with `/profile` link

Product decisions (confirmed):
- User identity pulled from logged-in Google auth metadata (dept/tier are design placeholders with no auth source)
- Stats drawn from `kudos_stats` GLOBAL singleton (not per-user isolation)
- Sent/Received toggle is client-side only, keyed on user's display name matching against kudo sender/receiver names
- Secret Box button and Spam pill are visual-only (no backend logic)

## The Brutal Truth

The spec-to-code translation was clean, but layout hidden a trap. Review surfaced two real issues on the first pass, both caught and fixed before merge:

**(1) Full-Bleed Column Collapse**: ProfileKudosSection inherited the full-bleed wrapper classes from AllKudosSection (`max-w-[1512px] lg:px-[144px]`) — these tell the browser to size itself to 1512px wide with 144px side padding. Inside a 680px profile column, the component collapsed to ~360px. Silent regression — jsdom unit tests can't see layout; only smoke/visual check surfaced it. Stripped the inherited classes and replaced with `w-full` for proper column fill.

**(2) FilterDropdown Aria-Selected Mismatch**: FilterDropdown stores an option ID as `selected` state, but the trigger button receives a formatted string like `"Sent (45)"`. When aria-selected tries to match, it reads the string and never matches the underlying key. User can change the filter but screen readers report stale state. Fixed by adding an optional `display` prop that separates the trigger text (`"Sent (45)"`) from the internal match key (`"sent"`) — now `aria-selected` reads the key and reflects correctly.

## Technical Details

**Component Hierarchy**:
- `app/profile/page.tsx`: fetches google auth user + kudos + stats, passes to ProfileIdentity, ProfileStats, ProfileKudosSection.
- `ProfileIdentity`: renders Google avatar + name + dept/tier badges (placeholders).
- `ProfileStats`: sidebar widget — received/sent counts, top kudos metric, hardcoded from `kudos_stats` singleton.
- `ProfileKudosSection`: wraps filtered kudos list; accepts sent/received toggle prop; renders via ProfileKudoCard.

**Data Split Logic** (`split-kudos.ts`):
```ts
export const splitKudosByUserDisplayName = (
  kudos: KudoRow[],
  userDisplayName: string
): { sent: KudoRow[]; received: KudoRow[] } => {
  return {
    sent: kudos.filter(k => k.sender_name === userDisplayName),
    received: kudos.filter(k => k.receiver_name === userDisplayName),
  };
};
```
Pure, testable, no side effects.

**TierBadge Extraction**: Moved from `KudoCard` to `app/_components/design-system/tier-badge.tsx` — visual spec shared, reduces duplication, clearer reuse contract.

**FilterDropdown Enhancement**:
```ts
interface FilterDropdownProps {
  options: { id: string; label: string }[];
  selected: string; // the match key
  display?: string; // optional: what to show on the button. Falls back to finding label by selected id.
  onSelect: (id: string) => void;
}
```
Decoupling text from match key unblocks stats like `"Sent (45)"` while keeping aria-selected honest.

## What We Tried

1. **Inheriting full-bleed layout from AllKudosSection**: Made sense for code reuse; broke layout in the column context. Stripped and used `w-full` instead.
2. **Using `selected` string as both match key and aria-selected value**: Can't work when the UI needs to display a formatted label. Added optional `display` prop.
3. **Per-user stats isolation**: User requested — checked spec, confirmed identity is from Google auth (no auth-backed DB user). Fell back to global `kudos_stats` singleton with a note in docs.
4. **Backend-driven sent/received split**: Ruled out — no `user_id` in kudos table, only names. Client-side split on display name match is the constraint.

## Root Cause Analysis

**Layout Collapse**: Copy-paste efficiency. The wrapper classes work in the full-width board context; they're silent failures in a constrained column. The grain showed: container children don't know their parent's viewport — CSS class names aren't scoped to context, and reuse without *intent-checking* is a trap.

**Aria-Selected Mismatch**: The FilterDropdown was designed with a single `selected` value doing double duty (internal key + external label). Once stats needed formatted labels like `"Sent (45)"`, the dual-role broke. Fix: explicit dual-prop pattern (`selected` for matching, `display` for rendering).

**Display-Name Toggle Fragility**: Google-authenticated users don't exist in the sunners table, so the sent/received split relies on name-matching. If a user's display name doesn't match any kudos sender/receiver name, they see empty sent/received lists. Accepted for the demo; production would need user_id in the kudos table or auth-driven isolation.

## Lessons Learned

1. **Copy-Pasting Layout Classes Is Silent Regression**: Full-bleed wrappers travel invisibly. When a component moves from max-width layout to a constrained column, check the root wrapper — remove `max-w-*` and `lg:px-*` classes. jsdom can't catch this; visual smoke test is essential.

2. **Aria Attributes Need Their Own Match Keys**: When UI text can be formatted (e.g., with counts or icons), separate the *internal key* from the *display text*. Let aria attributes read the key; let the user see the formatted label. Prevents stale screen-reader state.

3. **Identity Source Drives Data Isolation**: If user identity comes from Google auth (not the DB), per-user stats must either (a) exist as a separate table keyed by Google ID, or (b) fall back to global metrics. Don't pretend per-user isolation when the data source doesn't support it.

4. **Name-Based Joins Are Fragile**: Splitting sent/received on `display_name` match works for the demo but breaks on duplicates or user renames. Production: encode user_id in the kudos table; join on that instead.

## Next Steps

1. **Auth-Backed User Isolation** (Owner: Security/F010+) — Once Google auth ID is persisted as `user_id` in kudos, stats and split-kudos can filter per-user. Timeline: next auth enhancement.

2. **Migrate FilterDropdown usages** (Owner: Design System) — Apply the `display` prop pattern to any FilterDropdown that formats labels. Audit sidebar filters, spotlight board search. Timeline: follow-up cleanup.

3. **Add visual-regression guard to profile** (Owner: QA) — Smoke test profile layout at 320px (mobile) and 768px (tablet) to catch future full-bleed class copy-paste. Timeline: test suite hardening.

4. **Document Display-Name Limitation** (Owner: Docs) — Note in F009 spec that sent/received isolation relies on name-matching and can hit empty state. Users need to understand the constraint. Timeline: spec documentation already sealed.

---

115 tests pass, production build clean, feature ship-ready. The two layout issues were caught in review and fixed before merge. The display-name toggle is known-fragile and scoped to demo; production isolates by auth-user. Code is sealed and ready.

Commit d16c7a6 on `feature/user-profile-page` — PR #13 merged.
