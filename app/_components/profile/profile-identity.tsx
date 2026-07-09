"use client";

import KudoAvatar from "../sun-kudos/kudos-avatar";
import { useTranslation } from "../../_lib/i18n/use-translation";

/** Figma "danh hiệu" badge artwork (space encoded for the static asset path). */
const TIER_BADGE_SRC = "/profiles/danh%20hi%E1%BB%87u.png";

interface ProfileIdentityProps {
  name: string;
  avatarUrl?: string;
  /** No auth-metadata source for dept/tier — design-faithful placeholder. */
  department?: string;
  /** No auth-metadata source for dept/tier — design-faithful placeholder. */
  tier?: string;
}

const ICON_SLOT_COUNT = 7;

/**
 * Identity block (FR-003/FR-004): 200px avatar with a 4px white ring, gold
 * 36px name, department + tier row, and the icon-collection strip. Pure
 * presentational — no client state, safe inside the server page.
 */
export default function ProfileIdentity({
  name,
  avatarUrl,
  department = "CEVC3",
  tier = "Legend Hero",
}: ProfileIdentityProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="rounded-full ring-4 ring-white">
        <KudoAvatar name={name} src={avatarUrl} size={200} />
      </div>
      <h1 className="font-montserrat text-[36px] font-bold text-[#ffea9e]">
        {name}
      </h1>
      <div className="flex items-center gap-2">
        <span className="font-montserrat text-[22px] text-white">
          {department}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element -- static local badge, not a remote-optimised image */}
        <img src={TIER_BADGE_SRC} alt={tier} className="h-6 w-auto" />
      </div>
      <div className="mt-6 flex w-full flex-col items-center gap-3">
        <span className="font-montserrat text-[22px] text-white">
          {t("profile.iconCollection")}
        </span>
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: ICON_SLOT_COUNT }, (_, index) => (
            <div
              key={index}
              data-testid="icon-slot"
              aria-hidden
              className="h-16 w-16 rounded-full bg-white/5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
