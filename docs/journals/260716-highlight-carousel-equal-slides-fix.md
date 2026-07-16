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

## Follow-up: Fixed 525px Slides + Ellipsis (same day)

The user pushed the fix further: equal-per-page was not enough — slides must be a
constant size on *every* page, with long text cut by an ellipsis. MoMorph agreed:
every design slide is a fixed 528×525 instance and the body text node (`662:12223`)
literally ends in "...". Implementation: a new opt-in `fixed` mode on `KudoCard`
(single-line time/title/hashtags, `line-clamp-2` body — `line-clamp-1` when a photo
strip is present — one-row photos, `min-h-0 overflow-hidden` clipping) and
`lg:h-[525px]` on the carousel slot wrappers. Measured 525px across all five pages.

Two traps surfaced en route: a naive unconditional `h-[525px]` crushed the 375px
viewport into an unreadable card (fix: gate the fixed height to `lg`+, where the
1440px design applies), and `text-justify` + `line-clamp` stretched a two-word
clamped line into giant gaps (fix: drop justify in fixed mode). Three sun-kudos e2e
failures turned out to be pre-existing seed drift — live like-counts (F015 hearts)
reordered the top-5 and department counts — proven by failing identically on
stashed HEAD. Reviewer sealed 9/10, 0 critical; gate hard-SEALED.

## Follow-up 2: Edge Fade Overlays (same day)

Third request in the same area: the side peeks should *fade* into the dark page
background ("hiệu ứng mờ ở hai biên"), not dim uniformly. The design carries two
overlay frames over the side cards (`2940:13469`/`2940:13467`,
`linear-gradient(90°/270°, #00101A 50%, transparent)`); the implementation had
approximated them with `opacity-40`. Replaced with per-peek
`pointer-events-none absolute` gradient overlays (`bg-gradient-to-r|l
from-[#00101a] via-[#00101a]/60 to-transparent`). Verified with playwright+sharp
pixel profiling — left peek runs (1,16,26) at the outer edge to (234,228,208)
inward, right peek mirrored — plus a new e2e test pinning both overlays' computed
gradient directions (proven red without the fix). One measurement lesson: only
`element.screenshot()` gave trustworthy crops; `page.screenshot({clip})` with
boundingBox+scrollY math silently sampled the wrong region twice before that
became obvious.

---

## Lessons Learned

1. **Stretch is one level deep**: equal-height flex layouts need every intermediate wrapper to be a flex container (or the leaf to be `h-full`); auditing the chain beats guessing which class is missing.
2. **Measure before and after**: a 20-line Playwright script producing `{h, top, bottom}` per card made the defect, the fix, and the regression test all fall out of the same evidence.
3. **Fresh-machine e2e**: after an OS reinstall, budget for `mise install`, `npx playwright install chromium`, and system libs; the local `.deb` extract + `LD_LIBRARY_PATH` workaround unblocks CI-less boxes without root.
