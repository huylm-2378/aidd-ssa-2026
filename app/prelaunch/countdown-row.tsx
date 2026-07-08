"use client";

import CountdownTile from "../_components/homepage-saa/countdown-tile";
import { useCountdown } from "../_lib/use-countdown";
import { useMounted } from "../_lib/use-mounted";

const PLACEHOLDER = "00";

/**
 * Live DAYS / HOURS / MINUTES row for the prelaunch page (F011, FR-004/FR-005). Same
 * `useCountdown` + `CountdownTile` wiring as the homepage hero, gated behind `useMounted` so the
 * server render and first client paint both show the stable "00" placeholder — the live digits
 * only take over once mounted, avoiding a wall-clock hydration mismatch.
 */
export default function CountdownRow() {
  const mounted = useMounted();
  const { days, hours, minutes } = useCountdown(process.env.NEXT_PUBLIC_SAA_EVENT_START);

  const [d, h, m] = mounted ? [days, hours, minutes] : [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-[60px]">
      <CountdownTile value={d} label="DAYS" />
      <CountdownTile value={h} label="HOURS" />
      <CountdownTile value={m} label="MINUTES" />
    </div>
  );
}
