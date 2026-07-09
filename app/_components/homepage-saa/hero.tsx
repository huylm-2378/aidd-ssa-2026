"use client";

import Image from "next/image";
import Link from "next/link";
import CountdownTile from "./countdown-tile";
import { useCountdown } from "../../_lib/use-countdown";
import { useTranslation } from "../../_lib/i18n/use-translation";
import { EVENT_DATETIME_LABEL, EVENT_VENUE_LABEL } from "../../_lib/event-info-content";

export default function Hero() {
  const { t } = useTranslation();
  const { days, hours, minutes, isPending } = useCountdown(
    process.env.NEXT_PUBLIC_SAA_EVENT_START,
  );

  return (
    <section
      className="relative px-6 pb-16 pt-24 sm:px-12 lg:px-[144px] lg:pb-0 lg:pt-24"
      aria-label={t("hero.sectionAria")}
    >
      {/* The keyvisual artwork (mm:2167:9028) + Cover scrim (mm:2167:9029) are rendered once in
          page.tsx as a shared background spanning this hero AND the Root Further content section,
          matching the Figma Keyvisual BG (1512x1392) that ends partway into the content. */}
      <div className="flex max-w-[1224px] flex-col items-start gap-10">
        {/* mm:2788:12911 -- design's exact "Root Further" logotype (custom lettering, interlocking OO) */}
        <h1>
          <Image
            src="/homepage-saa/root-further-logo.png"
            alt={t("hero.logoAlt")}
            width={451}
            height={200}
            priority
            className="h-auto w-[220px] sm:w-[300px] lg:w-[451px]"
          />
        </h1>

        <div className="flex flex-col items-start gap-4">
          {isPending && (
            <p className="font-montserrat text-2xl font-bold leading-8 text-white">
              {t("hero.comingSoon")}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 sm:gap-10">
            <CountdownTile value={days} label={t("countdown.days")} />
            <CountdownTile value={hours} label={t("countdown.hours")} />
            <CountdownTile value={minutes} label={t("countdown.minutes")} />
          </div>
        </div>

        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-14">
            <p className="font-montserrat text-sm font-bold leading-6 tracking-[0.15px] text-white sm:text-base">
              {t("hero.timeLabel")}{" "}
              <span className="text-2xl leading-8 text-[#ffea9e]">
                {EVENT_DATETIME_LABEL}
              </span>
            </p>
            <p className="font-montserrat text-sm font-bold leading-6 tracking-[0.15px] text-white sm:text-base">
              {t("hero.venueLabel")}{" "}
              <span className="text-2xl leading-8 text-[#ffea9e]">
                {EVENT_VENUE_LABEL}
              </span>
            </p>
          </div>
          <p className="font-montserrat text-sm font-bold leading-6 tracking-[0.5px] text-white sm:text-base">
            {t("hero.broadcastNote")}
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-4 sm:gap-10">
          <Link
            href="/awards-information"
            className="flex items-center gap-2 rounded-lg bg-[#ffea9e] px-6 py-4 font-montserrat text-lg font-bold text-[#00101a] shadow-sm transition-all duration-200 hover:bg-[#fff8e1] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101a] active:scale-[0.98]"
          >
            {t("hero.aboutAwards")}
            <ArrowUpRightIcon />
          </Link>
          <Link
            href="/sun-kudos"
            className="flex items-center gap-2 rounded-lg border border-[#998c5f] bg-[#ffea9e]/10 px-6 py-4 font-montserrat text-lg font-bold text-white transition-all duration-200 hover:bg-[#ffea9e]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101a] active:scale-[0.98]"
          >
            {t("hero.aboutKudos")}
            <ArrowUpRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" aria-hidden>
      <path d="M7 17L17 7M17 7H8M17 7v9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
