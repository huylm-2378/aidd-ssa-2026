"use client";

import type { SunnerStat } from "../../_lib/sun-kudos-content";
import { useTranslation } from "../../_lib/i18n/use-translation";

interface ProfileStatsProps {
  stats: SunnerStat[];
}

/** Figma gift icon for the "Mở Secret Box" button (space encoded for the path). */
const SECRET_BOX_ICON_SRC = "/profiles/Vector%20(3).png";

/** Index of the first row (Secret Box opened) that gets a divider above it. */
const SECRET_BOX_DIVIDER_INDEX = 3;

/**
 * Personal-stats panel (FR-005/FR-006): 5 label/value rows fed straight from
 * `getSidebarStats()` — labels are fixed copy owned by the data layer, never
 * re-mapped or hardcoded here — plus a divider before the Secret-Box pair and
 * a visual-only "Mở Secret Box" button.
 */
export default function ProfileStats({ stats }: ProfileStatsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex w-[680px] max-w-full flex-col gap-4 rounded-[17px] border border-[#998c5f] bg-[#00070c] p-10">
      {stats.map((stat, index) => (
        <div key={stat.label}>
          {index === SECRET_BOX_DIVIDER_INDEX && (
            <div className="mb-4 h-px bg-[#2e3940]" />
          )}
          <div className="flex justify-between font-montserrat text-base text-white">
            <span>{t(stat.label)}</span>
            <span className="font-bold text-[#ffea9e]">{stat.value}</span>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffea9e] p-4 font-montserrat font-bold text-[#00101a]"
      >
        {t("profile.openSecretBox")}
        {/* eslint-disable-next-line @next/next/no-img-element -- static local icon, not a remote-optimised image */}
        <img src={SECRET_BOX_ICON_SRC} alt="" aria-hidden className="h-[21px] w-[21px]" />
      </button>
    </div>
  );
}
