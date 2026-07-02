"use client";

import Link from "next/link";
import CountdownTile from "./countdown-tile";
import { useCountdown } from "../../_lib/use-countdown";
import {
  EVENT_BROADCAST_NOTE,
  EVENT_DATETIME_LABEL,
  EVENT_VENUE_LABEL,
} from "../../_lib/event-info-content";

export default function Hero() {
  const { days, hours, minutes, isPending } = useCountdown(
    process.env.NEXT_PUBLIC_SAA_EVENT_START,
  );

  return (
    <section
      className="relative isolate overflow-hidden bg-[#00101a] px-6 pb-16 pt-24 sm:px-12 lg:px-[144px] lg:pb-24 lg:pt-24"
      aria-label="Event hero"
    >
      {/* mm:2167:9028 */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden bg-contain bg-right-top bg-no-repeat opacity-90 [mask-image:linear-gradient(to_right,transparent,black_18%)] sm:block sm:w-3/4 lg:w-3/5"
        style={{ backgroundImage: "url(/homepage-saa/keyvisual-bg.png)" }}
        aria-hidden
      />

      <div className="flex max-w-[1224px] flex-col items-start gap-10">
        <h1 className="font-montserrat text-6xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
          Root
          <br />
          Further
        </h1>

        <div className="flex flex-col items-start gap-4">
          {isPending && (
            <p className="font-montserrat text-2xl font-bold leading-8 text-white">
              Coming soon
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 sm:gap-10">
            <CountdownTile value={days} label="DAYS" />
            <CountdownTile value={hours} label="HOURS" />
            <CountdownTile value={minutes} label="MINUTES" />
          </div>
        </div>

        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-14">
            <p className="font-montserrat text-sm font-bold leading-6 tracking-[0.15px] text-white sm:text-base">
              Thời gian:{" "}
              <span className="text-2xl leading-8 text-[#ffea9e]">
                {EVENT_DATETIME_LABEL}
              </span>
            </p>
            <p className="font-montserrat text-sm font-bold leading-6 tracking-[0.15px] text-white sm:text-base">
              Địa điểm:{" "}
              <span className="text-2xl leading-8 text-[#ffea9e]">
                {EVENT_VENUE_LABEL}
              </span>
            </p>
          </div>
          <p className="font-montserrat text-sm font-bold leading-6 tracking-[0.5px] text-white sm:text-base">
            {EVENT_BROADCAST_NOTE}
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-4 sm:gap-10">
          <Link
            href="/awards-information"
            className="flex items-center gap-2 rounded-lg bg-[#ffea9e] px-6 py-4 font-montserrat text-lg font-bold text-[#00101a] shadow-sm transition-all duration-200 hover:bg-[#fff8e1] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101a] active:scale-[0.98]"
          >
            ABOUT AWARDS
            <ArrowUpRightIcon />
          </Link>
          <Link
            href="/sun-kudos"
            className="flex items-center gap-2 rounded-lg border border-[#998c5f] bg-[#ffea9e]/10 px-6 py-4 font-montserrat text-lg font-bold text-white transition-all duration-200 hover:bg-[#ffea9e]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101a] active:scale-[0.98]"
          >
            ABOUT KUDOS
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
