import type { SunnerStat } from "../../_lib/sun-kudos-content";

interface ProfileStatsProps {
  stats: SunnerStat[];
}

/** Index of the first row (Secret Box opened) that gets a divider above it. */
const SECRET_BOX_DIVIDER_INDEX = 3;

/**
 * Personal-stats panel (FR-005/FR-006): 5 label/value rows fed straight from
 * `getSidebarStats()` — labels are fixed copy owned by the data layer, never
 * re-mapped or hardcoded here — plus a divider before the Secret-Box pair and
 * a visual-only "Mở Secret Box" button.
 */
export default function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="flex w-[680px] max-w-full flex-col gap-4 rounded-[17px] border border-[#998c5f] bg-[#00070c] p-10">
      {stats.map((stat, index) => (
        <div key={stat.label}>
          {index === SECRET_BOX_DIVIDER_INDEX && (
            <div className="mb-4 h-px bg-[#2e3940]" />
          )}
          <div className="flex justify-between font-montserrat text-base text-white">
            <span>{stat.label}</span>
            <span className="font-bold text-[#ffea9e]">{stat.value}</span>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="w-full rounded-lg bg-[#ffea9e] p-4 font-montserrat font-bold text-[#00101a]"
      >
        Mở Secret Box
      </button>
    </div>
  );
}
