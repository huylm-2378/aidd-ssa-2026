"use client";

import {
  RECENT_GIFTS_HEADING,
  SECRET_BOX_LABEL,
  type RecentGiftSunner,
  type SunnerStat,
} from "../../_lib/sun-kudos-content";
import { useTranslation } from "../../_lib/i18n/use-translation";
import KudoAvatar from "./kudos-avatar";

/**
 * All Kudos sidebar (MoMorph `Frame 502` right column): a personal-stats panel
 * (5 rows), a visual-only "Mở Secret Box" CTA, and the "10 Sunner nhận quà mới
 * nhất" list. Sticky on desktop; stacks full-width beneath the feed below `lg`.
 * Stats + recent-gifts come from the server (F007, Supabase) via props.
 */
export default function KudosSidebar({
  stats,
  recentGifts,
}: {
  stats: readonly SunnerStat[];
  recentGifts: readonly RecentGiftSunner[];
}) {
  const { t } = useTranslation();
  return (
    <aside className="flex w-full flex-col gap-6 font-montserrat lg:sticky lg:top-24 lg:w-[360px] lg:shrink-0">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#2e3940] bg-[#101417] p-6">
        <ul className="flex flex-col gap-3">
          {stats.map((stat) => (
            <li key={stat.label} className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-white sm:text-base">
                {t(stat.label)}
              </span>
              <span className="text-xl font-bold text-[#ffea9e]">
                {stat.value}
              </span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label={t(SECRET_BOX_LABEL)}
          className="flex items-center justify-center gap-2 rounded bg-[#ffea9e] px-4 py-3 text-base font-bold text-[#00101a] transition-all duration-200 hover:bg-[#fff8e1] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101417] active:scale-[0.98]"
        >
          {t(SECRET_BOX_LABEL)}
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
            <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-[#2e3940] bg-[#101417] p-6">
        <h3 className="text-base font-bold text-[#ffea9e]">
          {t(RECENT_GIFTS_HEADING)}
        </h3>
        <ul className="flex flex-col gap-4">
          {recentGifts.map((sunner, index) => (
            <li key={`${sunner.name}-${index}`} className="flex items-center gap-3">
              <KudoAvatar name={sunner.name} src={sunner.avatar} size={40} />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{sunner.name}</span>
                <span className="text-xs text-white/60">{sunner.note}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
