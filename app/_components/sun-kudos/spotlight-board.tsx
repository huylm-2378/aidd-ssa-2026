import { SPOTLIGHT_ACTIVITY } from "../../_lib/kudos-spotlight-names";
import { SECTION_EYEBROW } from "../../_lib/sun-kudos-content";
import SpotlightBoardLive from "./spotlight-board-live";

/**
 * Spotlight Board (MoMorph `Frame 552`, node `2940:14170`) — RSC shell for the
 * shared title band (FR-001, unchanged). The dark panel body — live count,
 * pan/zoom Sunner constellation, functional search, and activity ticker — is
 * a `"use client"` island (`SpotlightBoardLive`, F008) hydrated from the
 * server-fetched snapshot and patched in real time via Supabase Realtime.
 */
export default function SpotlightBoard({
  count,
  nodes,
  roster,
}: {
  count: number;
  nodes: readonly { id: string; name: string }[];
  roster: readonly { id: string; name: string }[];
}) {
  return (
    <section
      className="mx-auto flex max-w-[1512px] flex-col gap-10 px-6 py-16 sm:px-8 lg:px-16 lg:py-24"
      aria-label="Spotlight Board"
    >
      <header className="flex flex-col gap-4">
        <p className="font-montserrat text-2xl font-bold leading-8 text-white">{SECTION_EYEBROW}</p>
        <hr className="w-full border-t border-[#2e3940]" />
        <h2 className="font-montserrat text-4xl font-bold leading-tight tracking-tight text-[#ffea9e] sm:text-5xl lg:text-[57px] lg:leading-[64px]">
          SPOTLIGHT BOARD
        </h2>
      </header>

      <SpotlightBoardLive
        initialCount={count}
        nodes={nodes}
        roster={roster}
        initialActivity={SPOTLIGHT_ACTIVITY}
      />
    </section>
  );
}
