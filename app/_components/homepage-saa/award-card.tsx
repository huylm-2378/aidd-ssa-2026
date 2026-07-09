"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AWARD_FRAME_SIZE,
  AWARD_FRAME_SRC,
  type AwardCategory,
} from "../../_lib/award-categories";
import { useTranslation, type MessageKey } from "../../_lib/i18n/use-translation";

interface AwardCardProps {
  award: AwardCategory;
}

/**
 * A single award card. Image, title, and "Chi tiết" link all navigate to the
 * same Awards Information anchor (BR-006).
 *
 * Renders one of 6 award background images cropped from the design screenshot
 * (see plans/260702-0952-homepage-saa/data/assets.md).
 */
/* mm:I2167:9075;214:1019;81:2442 */
/* mm:I2167:9076;214:1019;81:2442 */
/* mm:I2167:9077;214:1019;81:2442 */
/* mm:I2167:9079;214:1019;81:2442 */
/* mm:I2167:9080;214:1019;81:2442 */
/* mm:I2167:9081;214:1019;81:2442 */
export default function AwardCard({ award }: AwardCardProps) {
  const { t } = useTranslation();
  const href = `/awards-information#${award.slug}`;
  // Homepage description is a localized catalog entry, keyed off the shared
  // `award-categories.ts` slug (F014 -- that data file is out of scope /
  // shared with awards-information, so its `description` field stays VI-only
  // and this component reads the translated copy from the catalog instead).
  const descriptionKey = `awards.desc.${award.slug}` as MessageKey;

  return (
    <article className="flex flex-col items-start gap-6">
      <Link
        href={href}
        className="group relative block aspect-square w-full overflow-hidden rounded-[24px] border border-[#ffea9e] shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287] transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e]"
      >
        {/* mm:MM_MEDIA_Award BG -- shared glowing frame */}
        <Image
          src={AWARD_FRAME_SRC}
          alt=""
          width={AWARD_FRAME_SIZE}
          height={AWARD_FRAME_SIZE}
          aria-hidden
          className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
        />
        {/* mm:Awards-Name -- award-name logotype centered in the frame, scaled to its Figma proportion */}
        <Image
          src={award.nameSrc}
          alt={award.title}
          width={award.nameWidth}
          height={award.nameHeight}
          style={{ width: `${(award.nameWidth / AWARD_FRAME_SIZE) * 100}%` }}
          className="absolute left-1/2 top-1/2 h-auto -translate-x-1/2 -translate-y-1/2"
        />
      </Link>

      <div className="flex flex-col items-start gap-1">
        <Link
          href={href}
          className="font-montserrat text-2xl leading-8 text-[#ffea9e] transition-colors hover:text-white focus-visible:outline-none focus-visible:underline"
        >
          {award.title}
        </Link>
        <p className="line-clamp-2 font-montserrat text-base leading-6 tracking-[0.5px] text-white">
          {t(descriptionKey)}
        </p>
        <Link
          href={href}
          className="flex items-center gap-1 py-4 font-montserrat text-base font-medium leading-6 tracking-[0.15px] text-white transition-colors hover:text-[#ffea9e] focus-visible:outline-none focus-visible:underline"
        >
          {t("common.detail")}
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" aria-hidden>
            <path d="M7 17L17 7M17 7H8M17 7v9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
