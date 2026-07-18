"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "../../_lib/i18n/use-translation";
import SpotlightCanvas from "./spotlight-canvas";
import SpotlightBoardBg from "./spotlight-board-bg";
import { buildActivityEntry, buildNameById } from "./spotlight-fns";
import { useKudosRealtime, type KudosInsertRow } from "./use-kudos-realtime";
import { useLiveNotes } from "./use-live-notes";

const ACTIVITY_CAP = 10;
/** Design shows 6 stacked activity lines (nodes 3004:15995-15999 + 2940:14230). */
const ACTIVITY_CAP_VISIBLE = 6;

/**
 * Client island (F008) for the Spotlight Board's dark panel: owns the live
 * count, activity ticker, and search-query state, and mounts the pan/zoom
 * constellation (`SpotlightCanvas`). Hydrates from the server-fetched
 * snapshot (`initialCount`/`initialActivity`) then subscribes to Supabase
 * Realtime `kudos` INSERTs to patch count/ticker with no page refresh
 * (FR-002/006/007). Realtime failure degrades silently to the static
 * snapshot — no thrown error, no user-facing error (FR-008/SC-005).
 */
export default function SpotlightBoardLive({
  initialCount,
  nodes,
  roster,
  initialActivity,
}: {
  initialCount: number;
  nodes: readonly { id: string; name: string }[];
  roster: readonly { id: string; name: string }[];
  initialActivity: readonly string[];
}) {
  const { t } = useTranslation();
  const [count, setCount] = useState(initialCount);
  const [activity, setActivity] = useState<readonly string[]>(initialActivity);
  const [query, setQuery] = useState("");
  // Stack of transient live-recipient notes — each shows for ~15s then clears
  // itself; a new arrival is pushed on top of any still on screen.
  const { notes: liveNotes, push: pushLive } = useLiveNotes();

  const nameById = useMemo(() => buildNameById(roster), [roster]);

  const onInsert = useCallback(
    (row: KudosInsertRow) => {
      setCount((c) => c + 1);
      setActivity((prev) =>
        [buildActivityEntry(row, nameById, t("spotlight.receivedKudos")), ...prev].slice(
          0,
          ACTIVITY_CAP,
        ),
      );
      const name = (row.receiver_id && nameById.get(row.receiver_id)) || "Someone";
      pushLive(row.receiver_id, name);
    },
    [nameById, pushLive, t],
  );

  useKudosRealtime(onInsert);

  // Design frame B.7 (node 2940:14174): everything overlays one fixed-height
  // photo panel — count centered top (all white, 36px), search pill top-left
  // (gold-tint + #998C5F border), names float directly on the background, and
  // the activity log is a bottom-left vertical stack fading upward (newest at
  // the bottom, full opacity; oldest ~0.1 — nodes 3004:15995-15999).
  const visibleActivity = activity.slice(0, ACTIVITY_CAP_VISIBLE).slice().reverse();

  return (
    <div className="relative isolate h-[420px] overflow-hidden rounded-3xl border border-[#998c5f] bg-[#080c10] sm:h-[548px]">
      <SpotlightBoardBg />

      <div className="absolute inset-0">
        <SpotlightCanvas nodes={nodes} query={query} liveNotes={liveNotes} />
      </div>

      <p className="pointer-events-none absolute inset-x-0 top-4 text-center font-montserrat text-3xl font-bold leading-[44px] text-white sm:text-[36px]">
        {count} KUDOS
      </p>

      <div className="absolute left-4 top-5 flex h-[39px] w-[190px] items-center gap-1.5 rounded-full border border-[#998c5f] bg-[#ffea9e]/10 px-3 sm:left-6 sm:top-6 sm:w-[219px]">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/70" fill="none" stroke="currentColor" aria-hidden>
          <circle cx="11" cy="11" r="7" strokeWidth={1.8} />
          <path d="m20 20-3.5-3.5" strokeWidth={1.8} strokeLinecap="round" />
        </svg>
        <label htmlFor="spotlight-search" className="sr-only">
          {t("spotlight.searchLabel")}
        </label>
        <input
          id="spotlight-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("spotlight.searchPlaceholder")}
          className="w-full bg-transparent font-montserrat text-xs text-white placeholder:text-white/50 focus-visible:outline-none"
        />
      </div>

      <div
        className="pointer-events-none absolute bottom-5 left-4 right-16 flex flex-col sm:left-6"
        aria-label={t("spotlight.recentActivity")}
      >
        {visibleActivity.map((line, index, arr) => (
          <p
            key={`${line}-${index}`}
            style={{ opacity: Math.max(0.1, (index + 1) / arr.length) }}
            className="truncate font-montserrat text-sm font-bold leading-5 tracking-[0.1px] text-white"
          >
            {line}
          </p>
        ))}
      </div>

      <button
        type="button"
        aria-label={t("spotlight.expandBoard")}
        className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded text-white/60 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
          <path
            d="M4 14v6h6M20 10V4h-6M14 4l6 6M4 20l6-6"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
