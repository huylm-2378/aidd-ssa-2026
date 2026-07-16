"use client";

import type { KudoCard as KudoCardData } from "../../_lib/kudos-cards";
import { HIGHLIGHT_EMPTY } from "../../_lib/sun-kudos-content";
import { useTranslation } from "../../_lib/i18n/use-translation";
import KudoCard from "./kudo-card";

const PEEK_CLASS = "relative hidden w-[140px] shrink-0 overflow-hidden lg:flex";
const ARROW_BTN =
  "flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full text-white transition-colors hover:bg-white/10 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]";

/**
 * Decorative, non-interactive sliver of a neighboring card (FIX 1 peek).
 * `align="end"` shows the card's trailing edge (used on the left, nearest the
 * active card); `align="start"` shows its leading edge (used on the right).
 * Per the design's edge overlays (nodes `2940:13469`/`2940:13467`,
 * `linear-gradient(90deg, #00101A 50%, transparent)`), the sliver fades into
 * the page background toward the outer edge instead of dimming uniformly.
 */
function PeekSlot({ kudo, align }: { kudo?: KudoCardData; align: "start" | "end" }) {
  if (!kudo) {
    return <div className={PEEK_CLASS} aria-hidden />;
  }
  return (
    <div
      className={`${PEEK_CLASS} ${align === "end" ? "justify-end" : "justify-start"}`}
      aria-hidden
      inert
    >
      <div className="flex w-[528px] shrink-0 lg:h-[525px]">
        <KudoCard kudo={kudo} fixed />
      </div>
      <div
        className={`pointer-events-none absolute inset-0 z-10 from-[#00101a] via-[#00101a]/60 to-transparent ${
          align === "end" ? "bg-gradient-to-r" : "bg-gradient-to-l"
        }`}
      />
    </div>
  );
}

/**
 * Highlight carousel (MoMorph `B.2_HIGHLIGHT KUDOS`, node `2940:13461`): a
 * multi-card peek layout — the active card is centered at full width while
 * the previous/next cards show a partial, faded sliver at the edges. Below
 * `lg` the peeks are hidden and only the active card renders (no page
 * overflow at any width). At `lg`+ every slide is a fixed 525px-tall box per
 * the design frame (cards render in `fixed` mode, ellipsizing long content),
 * so the row never resizes while paging; below `lg` the single visible card
 * keeps clamped-but-intrinsic height (the 1440px design height would crush
 * narrow viewports). Arrows advance one card at a time;
 * `pageIndex` is owned by the parent so it can be reset when filters change
 * (FIX 3).
 */
export default function HighlightCarousel({
  kudos,
  pageIndex,
  onPrev,
  onNext,
}: {
  kudos: readonly KudoCardData[];
  pageIndex: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();

  if (kudos.length === 0) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="py-12 text-center font-montserrat text-lg font-bold text-[#999]"
      >
        {t(HIGHLIGHT_EMPTY)}
      </p>
    );
  }

  const safeIndex = Math.min(pageIndex, kudos.length - 1);
  const current = kudos[safeIndex];
  const prev = safeIndex > 0 ? kudos[safeIndex - 1] : undefined;
  const next = safeIndex < kudos.length - 1 ? kudos[safeIndex + 1] : undefined;

  return (
    <>
      <div className="flex items-stretch justify-center gap-4 lg:gap-6">
        <button
          type="button"
          onClick={onPrev}
          disabled={safeIndex === 0}
          aria-label={t("carousel.prev")}
          className={ARROW_BTN}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" aria-hidden>
            <path d="M15 6l-6 6 6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <PeekSlot kudo={prev} align="end" />

        <div className="flex w-full min-w-0 max-w-[528px] lg:h-[525px]">
          <KudoCard kudo={current} fixed />
        </div>

        <PeekSlot kudo={next} align="start" />

        <button
          type="button"
          onClick={onNext}
          disabled={safeIndex === kudos.length - 1}
          aria-label={t("carousel.next")}
          className={ARROW_BTN}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" aria-hidden>
            <path d="M9 6l6 6-6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <p
        className="text-center font-montserrat text-[28px] font-bold leading-9 text-[#999]"
        aria-label={t("carousel.page", { current: safeIndex + 1, total: kudos.length })}
      >
        {safeIndex + 1}/{kudos.length}
      </p>
    </>
  );
}
