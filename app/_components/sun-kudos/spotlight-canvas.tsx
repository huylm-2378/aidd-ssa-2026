"use client";

import { matchesQuery, positionOf, SIZE_SCALE, weightOf } from "./spotlight-fns";
import { usePanZoom } from "./use-pan-zoom";

const ZOOM_STEP = 0.2;

type Live = { id: string | null; name: string; tick: number } | null;

const CTRL_BTN =
  "flex h-7 w-7 items-center justify-center rounded border border-[#2e3940] bg-black/40 text-white/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]";

/**
 * Pan/zoom constellation viewport (FR-003/004): each Sunner is a **node** — a
 * glowing dot + name label — scattered at deterministic pseudo-random
 * positions, sized by weight, inside a drag/wheel/keyboard pan+zoom viewport
 * (`usePanZoom` — CSS `transform`, no dependency). `query` (FR-005) dims
 * non-matching nodes and keeps matches at full gold prominence without
 * unmounting/reflowing. The most-recent live recipient (`live`, FR-007) pulses
 * its node and surfaces a top-left "LIVE" badge (fixed to the viewport, outside
 * the pan/zoom transform).
 */
export default function SpotlightCanvas({
  nodes,
  query,
  live,
}: {
  nodes: readonly { id: string; name: string }[];
  query: string;
  live?: Live;
}) {
  const { containerRef, transform, onPointerDown, onPointerMove, onPointerUp, onKeyDown, zoomBy, reset } =
    usePanZoom();
  const isFiltering = query.trim() !== "";

  return (
    <div className="relative">
      <div
        ref={containerRef}
        role="application"
        aria-label="Bảng chòm sao Sunner: kéo hoặc dùng phím mũi tên để di chuyển, phím cộng/trừ để phóng to/thu nhỏ"
        tabIndex={0}
        className="relative h-[540px] w-full touch-none overflow-hidden rounded-xl border border-[#2e3940]/60 bg-black/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <div
          className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-75"
          style={{ transform, transformOrigin: "0 0" }}
        >
          {nodes.map((node, index) => {
            const weight = weightOf(index);
            const { leftPct, topPct } = positionOf(index);
            const hit = matchesQuery(node.name, query);
            const dim = isFiltering && !hit;
            const isLive = live?.id != null && node.id === live.id;
            // Gold ONLY for a search match. Default names stay white shades
            // (varied by weight); the live recipient is brightest white + pulse.
            const tone =
              isFiltering && hit
                ? "text-[#ffea9e]"
                : isLive || weight >= 4
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

        {live && (
          <div
            key={live.tick}
            className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-[#ffea9e]/40 bg-black/70 px-3 py-1.5 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 rounded-full bg-[#e46060] motion-safe:animate-ping" />
              <span className="relative h-2 w-2 rounded-full bg-[#e46060]" />
            </span>
            <span className="font-montserrat text-[11px] font-bold uppercase tracking-wider text-[#ffea9e]">
              Live
            </span>
            <span className="max-w-[180px] truncate font-montserrat text-xs font-bold text-white">
              {live.name}
            </span>
            <span className="hidden font-montserrat text-xs text-white/60 sm:inline">vừa nhận Kudos</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-3 left-3 flex gap-1.5">
        <button type="button" aria-label="Thu nhỏ" onClick={() => zoomBy(-ZOOM_STEP)} className={CTRL_BTN}>
          −
        </button>
        <button type="button" aria-label="Đặt lại vị trí" onClick={reset} className={CTRL_BTN}>
          ⟲
        </button>
        <button type="button" aria-label="Phóng to" onClick={() => zoomBy(ZOOM_STEP)} className={CTRL_BTN}>
          +
        </button>
      </div>
    </div>
  );
}
