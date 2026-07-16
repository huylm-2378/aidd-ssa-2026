# Fix: Highlight Carousel Equal-Height Slides — Session Delivered

**Date**: 2026-07-16
**Severity**: Normal
**Component**: Sun* Kudos / Highlight carousel (F003)
**Status**: Resolved & Committed

---

## What Happened

Ran the fix-bug pipeline (survey → diagnose → repair → verify+prevent) on the Highlight Kudos carousel (MoMorph frame `MaZUn5xHXZ`): visible slides rendered at unequal heights — the active card measured 558px while the adjacent peek card floated at 466px, diverging from the design where all three slides are top- and bottom-aligned. Root cause: `KudoCard` height was intrinsic (content-driven); the carousel row's `items-stretch` stretched only the wrapper divs, not the `<article>` inside them. Fix was pure Tailwind: made the card wrappers `flex` so the article stretches, added `self-stretch` to the article, `flex-1` to the content column and gold body box (footer stays pinned to the card bottom), and `self-center` on the arrow buttons to match the design's vertically centered arrows. Verified all reuse sites (All Kudos feed, profile list) are structural no-ops. Post-fix measurements: 558/558 on page 1, 678/678/678 on page 2. New e2e regression test proven red without the fix, green with it. 223 vitest pass, tsc clean, eslint clean on changed files, next build clean. Reviewer SEALED 9/10, 0 critical; evidence gate hard-SEALED.

---

## The Brutal Truth

The bug itself was a ten-minute CSS diagnosis; the machine reinstall around it cost more than the fix. Node was gone (`mise install` + shell activation recovered it), Playwright browsers were gone, and chromium refused to launch on missing `libasound.so.2` with no sudo available. Workaround that saved the session: `apt-get download libasound2t64`, extract the `.deb` locally, and point `LD_LIBRARY_PATH` at it — no root required. That trick belongs in the toolbox, but the durable fix is a one-time `sudo apt install libasound2t64`.

One diagnosis subtlety worth remembering: `items-stretch` on a flex row is not transitive. It stretches direct children only; a block-level card one level deeper keeps its intrinsic height, and the layout *looks* almost right until content lengths diverge. The measurement script (bounding-box heights via Playwright `evaluate`) turned a vague "slides look uneven" into exact numbers before and after — evidence, not eyeballing.

---

## Technical Details

**Delivered changes**:
- `app/_components/sun-kudos/highlight-carousel.tsx` — active/peek wrappers → `flex`; arrows → `self-center`
- `app/_components/sun-kudos/kudo-card.tsx` — article → `self-stretch`; content div + body box → `flex-1`
- `e2e/sun-kudos.spec.ts` — new regression test: page 2 shows exactly 3 articles, all sharing one height and top edge
- `docs/features/F003_SunKudos/technical-spec.md` — FR-005 now names the equal-height, top/bottom-aligned rendering

**Evidence**: `plans/reports/fix-highlight-carousel-equal-slides/evidence/` (study-context, temper-results, inspection-verdict — SEALED)

**Contracts**: `KudoCard(kudo, isSpam)` and `HighlightCarousel(kudos, pageIndex, onPrev, onNext)` unchanged.

---

## Lessons Learned

1. **Stretch is one level deep**: equal-height flex layouts need every intermediate wrapper to be a flex container (or the leaf to be `h-full`); auditing the chain beats guessing which class is missing.
2. **Measure before and after**: a 20-line Playwright script producing `{h, top, bottom}` per card made the defect, the fix, and the regression test all fall out of the same evidence.
3. **Fresh-machine e2e**: after an OS reinstall, budget for `mise install`, `npx playwright install chromium`, and system libs; the local `.deb` extract + `LD_LIBRARY_PATH` workaround unblocks CI-less boxes without root.
