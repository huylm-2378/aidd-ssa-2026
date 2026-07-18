"use client";

import { useTranslation } from "../../_lib/i18n/use-translation";
import { matchesQuery, positionOf, SIZE_SCALE, weightOf } from "./spotlight-fns";
import { usePanZoom } from "./use-pan-zoom";
import type { LiveNote } from "./use-live-notes";

const ZOOM_STEP = 0.2;

const CTRL_BTN =
  "flex h-7 w-7 items-center justify-center rounded border border-[#2e3940] bg-black/40 text-white/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]";

/**
 * Pan/zoom constellation viewport (FR-003/004): each Sunner is a **node** — a
 * glowing dot + name label — scattered at deterministic pseudo-random
 * positions, sized by weight, inside a drag/wheel/keyboard pan+zoom viewport
 * (`usePanZoom` — CSS `transform`, no dependency). `query` (FR-005) dims
 * non-matching nodes and keeps matches at full gold prominence without
 * unmounting/reflowing. Live recipients (`liveNotes`, FR-011) each pulse their
 * node and surface a stacked top-left toast (newest on top, older pushed down),
 * fixed to the viewport outside the pan/zoom transform; each toast clears
 * itself after ~15s (see `useLiveNotes`).
 */
export default function SpotlightCanvas({
  nodes,
  query,
  liveNotes = [],
}: {
  nodes: readonly { id: string; name: string }[];
  query: string;
  liveNotes?: readonly LiveNote[];
}) {
  const { t } = useTranslation();
  const { containerRef, transform, onPointerDown, onPointerMove, onPointerUp, onKeyDown, zoomBy, reset } =
    usePanZoom();
  const isFiltering = query.trim() !== "";
  const liveIds = new Set(liveNotes.map((n) => n.id).filter((id): id is string => id != null));

  return (
    <div className="relative h-full">
      {/* Design B.7: names float directly on the photo panel — no inner framed box. */}
      <div
        ref={containerRef}
        role="application"
        aria-label={t("spotlight.canvasAria")}
        tabIndex={0}
        className="relative h-full w-full touch-none overflow-hidden rounded-3xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onKeyDown={onKeyDown}
      >
        {/* Node field is inset so names never collide with the count/search
            band (top) or the activity stack (bottom) — mirrors the design's
            empty margins around the cloud (names span ~y1707-2082 of the
            1658-2206 panel). */}
        <div
          className="absolute inset-x-4 bottom-24 top-[76px] motion-safe:transition-transform motion-safe:duration-75 sm:inset-x-8"
          style={{ transform, transformOrigin: "0 0" }}
        >
          {nodes.map((node, index) => {
            const weight = weightOf(index);
            const { leftPct, topPct } = positionOf(index);
            const hit = matchesQuery(node.name, query);
            const dim = isFiltering && !hit;
            const isLive = liveIds.has(node.id);
            // Gold ONLY for a search match. Default names stay white shades
            // (varied by weight); the live recipient takes the design's
            // highlight red (#F17676 — the one non-white name in frame B.7).
            const tone =
              isFiltering && hit
                ? "text-[#ffea9e]"
                : isLive
                  ? "text-[#f17676]"
                  : weight >= 4
                    ? "text-white"
                    : "text-white/70";
            return (
              <span
                key={index}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-montserrat font-bold leading-tight motion-safe:transition-opacity motion-safe:duration-150 ${
                  SIZE_SCALE[weight] ?? "text-base"
                } ${tone} ${isLive ? "motion-safe:animate-pulse" : ""} ${dim ? "opacity-20" : "opacity-100"}`}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              >
                {node.name}
              </span>
            );
          })}
        </div>

        {liveNotes.length > 0 && (
          <div className="pointer-events-none absolute left-4 top-[76px] z-10 flex flex-col gap-2 sm:left-6 sm:top-20">
            {liveNotes.map((note) => (
              <div
                key={note.key}
                className="flex items-center gap-2 rounded-full border border-[#ffea9e]/40 bg-black/70 px-3 py-1.5 backdrop-blur-sm"
              >
                <span className="max-w-[180px] truncate font-montserrat text-xs font-bold text-white">
                  {note.name}
                </span>
                <span className="hidden font-montserrat text-xs text-white/60 sm:inline">
                  {t("spotlight.justReceivedKudos")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Design shows a single pan-zoom affordance bottom-right (B.7.2); the
          zoom cluster sits just above the expand button, same corner. */}
      <div className="absolute bottom-14 right-4 flex gap-1.5">
        <button type="button" aria-label={t("spotlight.zoomOut")} onClick={() => zoomBy(-ZOOM_STEP)} className={CTRL_BTN}>
          −
        </button>
        <button type="button" aria-label={t("spotlight.resetPosition")} onClick={reset} className={CTRL_BTN}>
          ⟲
        </button>
        <button type="button" aria-label={t("spotlight.zoomIn")} onClick={() => zoomBy(ZOOM_STEP)} className={CTRL_BTN}>
          +
        </button>
      </div>
    </div>
  );
}
