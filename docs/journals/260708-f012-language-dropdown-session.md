# F012: Language Dropdown — Refactor to Fixture, Write Race in Parallel Review

**Date**: 2026-07-08 16:55
**Severity**: Low
**Component**: Homepage SAA / Language Switcher (MoMorph hUyaaugye2)
**Status**: Resolved

## What Happened

Shipped F012 — the language dropdown switcher for the homepage header. Branch feature/language-dropdown, commit ce5096d, PR #17. The work was a **refactor, not a new feature**: the header already had an inline VN/EN text switcher (emoji badge + plain text, toggle-only). Task was to extract it into a dedicated dropdown component, match the Figma panel design (flag icons, highlight on active), and clean up the header.

**Outcome:**
- New component at `app/_components/homepage-saa/language-switcher.tsx`.
- Dropdown triggers from header, displays VN/EN rows with flag images (public/language-dropdown/), active state highlighted.
- Outside-click and Escape key dismiss; focus returns to trigger button.
- Header slimmed from ~170 to 108 lines; old inline switcher + dead `isLangOpen`/`selectedLang` state removed.
- Client-only VN default (no i18n wiring upstream).
- Review: APPROVE-WITH-NITS/SEALED, 8/10, 0 critical.

## The Brutal Truth

The honest sting here is not in the feature — it shipped clean — but in the **process collision**. Reviewer and tester agents ran in parallel (correct for speed), and the nit fixes I applied touched the test file *while the tester was still writing to it*. My Write hit "file modified since read" errors, had to reconcile manually. It ultimately landed (144 green tests), but the friction was real: applying review nits to source code while concurrent agents are editing the tests that depend on that source creates a write race on the test file. That's not a bug in the code; it's a coordination gap in the workflow.

Also: the alt-text and flag design details felt small, but they were right. Flags as pure decoration (alt="" aria-hidden) — the VN/EN text carries all the semantic meaning. That's the kind of detail that docs miss, and it only surfaced in review.

## Technical Details

**Component shape:**
- Trigger: header button with active language emoji.
- Menu: positioned absolute, VN and EN rows with flag img + text.
- Dismiss: outside-click listener (hashtag-field.tsx pattern), Escape key, return focus via `ref.current?.focus()`.
- State: single `open` boolean; `selectLang(lang)` closes menu and returns focus.

**Reuse:**
- Hashtag dropdown dismiss pattern (outside-click + Escape).
- Design tokens (spacing, shadows, rounded corners).
- Header trigger classes (button styling, active states).

**Flag assets:**
- public/language-dropdown/VN - Vietnam.png
- public/language-dropdown/GB-NIR - Northern Ireland.png
- User provided; decorative (no alt text needed beyond aria-hidden).

**Nits applied (post-review):**
1. Removed conflicting `rounded-sm + rounded` pair on active row — Tailwind v4 doesn't guarantee class-order cascade; single `rounded-md` is safer.
2. Made flags decorative: `alt="" aria-hidden="true"`. Text carries meaning.
3. Routed `selectLang()` through `close()` to ensure focus return for keyboard users.

## What We Tried

1. Inline switcher redesign (no extraction): felt messy in the header component; nope.
2. Flags with alt text ("Vietnam", "English"): reviewer nit — redundant when VN/EN text is present; removed.
3. Focus management only on Escape: nit — applies on outside-click too for consistency.

## Root Cause Analysis

**Why a refactor, not new?** The feature already existed inline; the spec asked for the Figma panel design + organized component. Extraction meant cleaning up a cluttered header and moving the switch logic somewhere reusable.

**The write race:** Two agents operating on overlapping file graphs in parallel is fast, but when review nits touch the source file and tests depend on that source, the test agent's concurrent writes to the test file create a collision on reconciliation. Not a code bug — a workflow coordination issue.

**Design details:** Flag decoration status is usually overlooked, but it matters for accessibility. Reviewer caught it; it's the kind of thing that stays in the team's hands-on knowledge only if it lands in a note like this.

## Lessons Learned

1. **Refactor beats redesign.** The switcher existed; extracting + styling is faster and lower-risk than rewriting from scratch.
2. **Reuse patterns early.** Hashtag field already had a clean dismiss pattern; copy it instead of inventing.
3. **Flags are decoration, text is meaning.** aria-hidden + alt="" when the semantic content is text-only.
4. **Sequential > parallel when nits touch source.** Running review and test in parallel works until the reviewer's source nits invalidate the tester's test file writes. Either sequence them (review → apply nits → test runs fresh), or have one authoritative pass on nit-fixes before tests finalize.
5. **Focus management is accessibility, not polish.** Return focus on Escape and outside-click, not just one or the other.

## Next Steps

- **Monitor:** Watch for language persistence edge cases (navigation, page reload). Client-only means it resets; may warrant future i18n wiring.
- **Coordination:** On next parallel review + test session, apply nits after BOTH agents finish, or lock nit-fixes to a single authoritative pass once tests are stable.
- **Optional:** If user flags that language doesn't persist across navigation, add localStorage + SSR-safe hydration logic.
