"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "../../_lib/i18n/use-translation";

export default function KudosBanner() {
  const { t } = useTranslation();

  return (
    <section
      className="mx-auto max-w-[1512px] px-6 pb-16 sm:px-12 lg:px-[144px] lg:pb-24"
      aria-label={t("banner.sectionAria")}
    >
      {/* mm:I3390:10349;313:8415 -- card holds the Figma 1120x500 (ratio 2.24) so the background
          art is never vertically cropped; at lg the content is vertically centered inside it. */}
      <div className="relative isolate mx-auto max-w-[1120px] overflow-hidden rounded-2xl bg-[#0f0f0f] lg:flex lg:min-h-[500px] lg:items-center">
        {/* mm:I3390:10349;313:8416 -- Kudos card background (dark panel + gold arc, 1120x500) */}
        <Image
          src="/homepage-saa/kudos-background.png"
          alt=""
          fill
          aria-hidden
          className="object-cover"
        />

        {/* mm:I3390:10349;313:8419 -- content block: 457px column, 64px from the card's left edge */}
        <div className="relative flex flex-col items-start gap-8 px-6 py-12 sm:px-12 lg:my-0 lg:ml-16 lg:w-[457px] lg:gap-8 lg:px-0 lg:py-0">
          <div className="flex flex-col items-start gap-4">
            <p className="font-montserrat text-2xl leading-8 text-white">{t("banner.eyebrow")}</p>
            <h2 className="font-montserrat text-4xl font-bold leading-[1.1] tracking-tight text-[#ffea9e] sm:text-5xl lg:text-[57px] lg:leading-[64px]">
              {t("banner.title")}
            </h2>
            <p className="text-justify font-montserrat text-base font-bold leading-6 tracking-[0.5px] text-white">
              <span className="block font-bold">{t("banner.newPoint")}</span>
              {t("banner.body")}
            </p>
          </div>

          <Link
            href="/sun-kudos"
            className="flex items-center gap-2 rounded bg-[#ffea9e] px-4 py-4 font-montserrat text-base font-bold text-[#00101a] transition-all duration-200 hover:bg-[#fff8e1] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f] active:scale-[0.98]"
          >
            {t("common.detail")}
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" aria-hidden>
              <path d="M7 17L17 7M17 7H8M17 7v9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* mm:I3390:10349;329:2948 -- "S KUDOS" wordmark, centered on the right over the gold arc */}
        <Image
          src="/homepage-saa/kudos-wordmark.png"
          alt={t("banner.wordmarkAlt")}
          width={364}
          height={74}
          className="absolute right-8 top-1/2 hidden w-[240px] -translate-y-1/2 sm:block lg:right-[84px] lg:w-[364px]"
        />
      </div>
    </section>
  );
}
