"use client";

import AwardCard from "./award-card";
import { AWARD_CATEGORIES } from "../../_lib/award-categories";
import { useTranslation } from "../../_lib/i18n/use-translation";

export default function AwardsSection() {
  const { t } = useTranslation();

  return (
    <section
      className="mx-auto flex max-w-[1512px] flex-col items-start gap-10 px-6 py-16 sm:px-12 lg:gap-20 lg:px-[144px] lg:py-24"
      aria-label={t("awards.sectionAria")}
    >
      <header className="flex w-full flex-col items-start gap-4">
        <p className="font-montserrat text-base leading-6 text-white/70">{t("awards.eyebrow")}</p>
        <hr className="w-full border-t border-[#2e3940]" />
        <h2 className="font-montserrat text-4xl font-bold leading-[1.1] tracking-tight text-[#ffea9e] sm:text-5xl lg:text-[57px] lg:leading-[64px]">
          {t("awards.heading")}
        </h2>
      </header>

      <div className="grid w-full grid-cols-1 gap-x-8 gap-y-10 min-[480px]:grid-cols-2 lg:grid-cols-3 lg:gap-x-20 lg:gap-y-16">
        {AWARD_CATEGORIES.map((award) => (
          <AwardCard key={award.slug} award={award} />
        ))}
      </div>
    </section>
  );
}
