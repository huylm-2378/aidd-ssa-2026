import Image from "next/image";
import {
  AWARD_FRAME_SIZE,
  AWARD_FRAME_SRC,
  type AwardCategory,
} from "../../_lib/award-categories";
import { AwardDiamondIcon, AwardLicenseIcon } from "./award-icons";

interface AwardDetailSectionProps {
  award: AwardCategory;
  index: number;
}

/**
 * One award row on `/awards-information` (Figma `Frame 506` / `Frame 507`):
 * badge (shared frame + name logotype) alongside the long description,
 * quantity, and prize value(s). Layout alternates by `index` so badges
 * zig-zag left/right down the page; stacks vertically below `lg`.
 */
export default function AwardDetailSection({
  award,
  index,
}: AwardDetailSectionProps) {
  const isReversed = index % 2 !== 0;
  const hasMultiplePrizes = award.prizes.length > 1;

  return (
    <section
      id={award.slug}
      className={`flex scroll-mt-24 flex-col items-center gap-10 lg:items-start lg:gap-16 ${
        isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      {/* mm:MM_MEDIA_Award BG + Awards-Name -- same badge layering as award-card.tsx. */}
      <div className="relative aspect-square w-[240px] shrink-0 sm:w-[280px] lg:w-[336px]">
        <Image
          src={AWARD_FRAME_SRC}
          alt=""
          width={AWARD_FRAME_SIZE}
          height={AWARD_FRAME_SIZE}
          aria-hidden
          className="h-full w-full object-cover"
        />
        <Image
          src={award.nameSrc}
          alt={award.title}
          width={award.nameWidth}
          height={award.nameHeight}
          style={{ width: `${(award.nameWidth / AWARD_FRAME_SIZE) * 100}%` }}
          className="absolute left-1/2 top-1/2 h-auto -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="flex flex-1 flex-col items-start gap-6">
        <h2 className="flex items-center gap-3 font-montserrat text-2xl font-bold leading-8 text-[#ffea9e] sm:text-3xl">
          {/* mm:MM_MEDIA_Target -- the design's target glyph (white). unoptimized: tiny static icon. */}
          <Image
            src="/awards-information/target-icon.png"
            alt=""
            aria-hidden
            width={24}
            height={24}
            unoptimized
            className="h-6 w-6 shrink-0"
          />
          {award.title}
        </h2>

        <p className="text-justify font-montserrat text-base font-bold leading-6 tracking-[0.5px] text-white">
          {award.longDescription}
        </p>

        <hr className="w-full border-t border-[#2e3940]" />

        <div className="flex flex-wrap items-center gap-3">
          <AwardDiamondIcon className="h-6 w-6 shrink-0 text-white" />
          <span className="font-montserrat text-2xl font-bold leading-8 text-[#ffea9e]">
            Số lượng giải thưởng:
          </span>
          <span className="font-montserrat text-4xl font-bold leading-[44px] text-white">
            {award.quantity}
          </span>
          <span className="font-montserrat text-sm font-bold tracking-[0.1px] text-white">
            {award.quantityUnit}
          </span>
        </div>

        <hr className="w-full border-t border-[#2e3940]" />

        <div className="flex flex-col gap-4">
          {award.prizes.map((prize, prizeIndex) => (
            <div key={prizeIndex} className="flex flex-col gap-4">
              {hasMultiplePrizes && prizeIndex > 0 && (
                <p className="font-montserrat text-sm font-bold uppercase tracking-[0.15px] text-white/70">
                  Hoặc
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <AwardLicenseIcon className="h-6 w-6 shrink-0 text-white" />
                <span className="font-montserrat text-2xl font-bold leading-8 text-[#ffea9e]">
                  Giá trị giải thưởng:
                </span>
                <span className="font-montserrat text-4xl font-bold leading-[44px] text-white">
                  {prize.value}
                </span>
                <span className="font-montserrat text-sm font-bold tracking-[0.1px] text-white">
                  {prize.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
