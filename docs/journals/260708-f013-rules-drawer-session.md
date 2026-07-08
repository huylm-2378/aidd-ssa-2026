# F013: Thể Lệ Rules Drawer — Modal Composition and the Figma Node-ID Bridge

**Date**: 2026-07-08 15:45
**Severity**: N/A (Shipped)
**Component**: Rules Drawer Modal (MoMorph screen b1Filzi9i6)
**Status**: Resolved

## What Happened

Shipped F013 — the Sun* Kudos "Thể Lệ" (Rules) drawer — as a right-side dark modal housing rules, hero badge, and 6 collectible icons. Full Takumi cycle: design from Figma node 3204:6051, implemented via branch `feature/rules-modal`, commit 8ab630b, PR #18. FAB "Thể lệ" pill rewired from a dormant `/awards-information` link to open the modal; "Viết KUDOS" inside chains to the composer.

Architecture:
- **Reuse**: WriteKudoModal's portal + useDialogA11y + useMounted; no new dialog infrastructure.
- **Content**: Hero badge + 6 collectible icons extracted to `app/_lib/rules-content.ts`; images are user-provided under `public/rules-icons/`.
- **Design Bridge**: Figma link pasted by user had no auth connector, but node-id (3204:6051) was mapped to MoMorph screenId (b1Filzi9i6) via `list_frames` figma_node_id field — frame remained readable. Reusable trick: Figma node-id → MoMorph screenId mapping through list_frames.
- **Outcome**: 155 tests pass, build clean, evidence-gate SEALED.

## The Brutal Truth

Found a real UX bug on test run: useDialogA11y focuses the first focusable element on modal open. The drawer's only focusables are footer buttons (Close/Cancel). Opening the modal scrolled the panel straight to the footer, hiding the title and all content. Silent, invisible failure — tester caught it mid-interaction.

Also stung: post-delivery, hero badge images were being crushed into 64×64 squares (h-16 w-16). They're wide pill-shaped images; squished them to nothing. Collectible icons need squares, badges need width — missed the distinction on first pass.

## Technical Details

**Figma node-id bridge:**
User pasted a Figma link; the connector has no auth. But the node-id (3204:6051) was present in the link. Mapped it via MoMorph's `list_frames` endpoint: each frame carries a `figma_node_id` field. Queried the list, found the match, got the screenId (b1Filzi9i6), and pulled the design. Works once per session; no need for live Figma sync. **Reusable pattern for when Figma auth is unavailable.**

**Dialog focus fix:**
Added `preventScroll: true` to the initial `focus()` call in `app/_components/use-dialog-a11y.ts` (line ~24). Tells the browser: "move focus, but don't scroll the viewport." Applies to all dialogs (WriteKudoModal unaffected). Browser support is solid; no feature detection needed.

**Image sizing split:**
- Hero badge: `h-7 w-auto object-contain` (flexible width, maintains aspect).
- Collectible icons (×6): `h-8 w-8` (square, remain unchanged).

**Alt text discipline:**
Badge and icon images are decorative (context is provided by surrounding text). Applied `alt=""` and `aria-hidden="true"` where appropriate.

**Test reference typing:**
Removed `as any` cast on test ref; typed it correctly to `RefObject<HTMLDivElement>`. Small win; keeps TypeScript from rotting.

## What We Tried

1. **Embedding rules directly in the footer**: Cluttered. Drawer modal was cleaner.
2. **Syncing rules from live Figma**: No auth. Node-id mapping proved sufficient.
3. **Auto-focus on "Viết KUDOS" button**: Broke the reading flow; Close button focus was right.

## Root Cause Analysis

The focus bug came from not thinking through the dialog's content depth. useDialogA11y was written with short modals in mind (all content visible on open). Drawer is tall; first focusable is at the bottom. Silent failure made it invisible until testing. The fix (preventScroll) is trivial and applies broadly — a win hidden in the bug.

Badge image sizing came from not distinguishing image types during the Tailwind pass. All images are rounded; all images need sizing. Missed the semantic difference between decorative icons and illustrative badges.

## Lessons Learned

1. **Figma auth missing? Use node-id mapping.** Figma links embed node-ids; MoMorph's list_frames carries them. Bridge between unavailable auth and readable design.
2. **Focus management needs depth-awareness.** Dialogs with tall content need preventScroll on first focus. Update the shared hook once; benefits all.
3. **Image semantics shape sizing.** Decorative icons vs. illustrative badges are different; w-auto vs. w-8 is the difference between readable and crushed.
4. **Process win: async testing/review without race.** Ran tester and reviewer in parallel; applied all nits only after both finished (memory from F012's write-race). No conflicts, cleaner final state.

## Next Steps

No operator steps. Modal is live; rules are readable; tests pass. Optional: add a breadcrumb "Home → Rules" above the close button if UX wants it (out of scope).
