"use client";

import { useCallback, useMemo, useState } from "react";
import SpotlightCanvas from "./spotlight-canvas";
import SpotlightBoardBg from "./spotlight-board-bg";
import { buildActivityEntry, buildNameById } from "./spotlight-fns";
import { useKudosRealtime, type KudosInsertRow } from "./use-kudos-realtime";
import { useLiveNotes } from "./use-live-notes";

const ACTIVITY_CAP = 10;

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
      setActivity((prev) => [buildActivityEntry(row, nameById), ...prev].slice(0, ACTIVITY_CAP));
      const name = (row.receiver_id && nameById.get(row.receiver_id)) || "Someone";
      pushLive(row.receiver_id, name);
    },
    [nameById, pushLive],
  );

  useKudosRealtime(onInsert);

  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-[#998c5f]/40 bg-[#080c10] px-6 py-8 sm:px-8 sm:py-10">
      <SpotlightBoardBg />
      <p className="text-center font-montserrat text-4xl font-bold leading-tight sm:text-5xl">
        <span className="text-[#ffea9e]">{count}</span> <span className="text-white">KUDOS</span>
      </p>

      <div className="mt-6 flex w-full max-w-[220px] items-center gap-2 rounded-full border border-[#2e3940] bg-white/5 px-3 py-1.5">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" aria-hidden>
          <circle cx="11" cy="11" r="7" strokeWidth={1.8} />
          <path d="m20 20-3.5-3.5" strokeWidth={1.8} strokeLinecap="round" />
        </svg>
        <label htmlFor="spotlight-search" className="sr-only">
          Tìm kiếm trong Spotlight Board
        </label>
        <input
          id="spotlight-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm"
          className="w-full bg-transparent font-montserrat text-xs text-white placeholder:text-white/50 focus-visible:outline-none"
        />
      </div>

      <div className="mt-6">
        <SpotlightCanvas nodes={nodes} query={query} liveNotes={liveNotes} />
      </div>

      <div
        className="mt-8 flex gap-8 overflow-x-auto border-t border-[#2e3940] pt-4"
        aria-label="Hoạt động gần đây"
      >
        {activity.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className="shrink-0 whitespace-nowrap font-montserrat text-xs text-white/50"
          >
            {line}
          </p>
        ))}
      </div>

      <button
        type="button"
        aria-label="Mở rộng bảng"
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
