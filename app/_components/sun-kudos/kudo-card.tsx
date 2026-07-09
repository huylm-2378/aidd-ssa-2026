"use client";

import type { KudoCard as KudoCardData } from "../../_lib/kudos-cards";
import { useTranslation } from "../../_lib/i18n/use-translation";
import KudoAvatar from "./kudos-avatar";
import TierBadge from "./tier-badge";

/** Sender/receiver identity block: avatar + name + role code + hero-tier badge. */
function Person({
  name,
  role,
  tier,
  avatar,
}: {
  name: string;
  role: string;
  tier: string;
  avatar?: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center">
      <KudoAvatar name={name} src={avatar} size={64} />
      <div className="flex flex-col items-center gap-1">
        <p className="font-montserrat text-base font-bold leading-6 tracking-[0.15px] text-[#00101a]">
          {name}
        </p>
        {(role || tier) && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {role && (
              <span className="font-montserrat text-sm font-bold leading-5 tracking-[0.1px] text-[#999]">
                {role}
              </span>
            )}
            <TierBadge tier={tier} />
          </div>
        )}
      </div>
    </div>
  );
}

const DIVIDER = "h-px w-full bg-[#ffea9e]";

/**
 * Shared Kudo card (MoMorph component `335:9620`), used by the Highlight
 * carousel and the All Kudos feed. Cream `#fff8e1` panel with a 4px gold
 * border: a sender → receiver header, a timestamp, a centered title, the body
 * in a gold-tinted box, an optional photo strip, red hashtags, and a footer
 * with the like count + visual-only "Copy Link" / "Xem chi tiết" actions.
 *
 * `isSpam` is a visual-only flag (F009 profile moderation view): it overlays
 * a red "Spam" pill top-right of the card and carries no data-layer meaning.
 */
export default function KudoCard({
  kudo,
  isSpam,
}: {
  kudo: KudoCardData;
  isSpam?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <article className="relative flex w-full flex-col gap-4 rounded-2xl border-4 border-[#ffea9e] bg-[#fff8e1] px-6 pb-4 pt-6 font-montserrat">
      {isSpam && (
        <span className="absolute right-4 top-4 rounded-full bg-[#d4271d] px-2 py-0.5 font-montserrat text-xs font-bold text-white">
          Spam
        </span>
      )}
      {/* mm:335:9442 -- sender → arrow → receiver */}
      <div className="flex items-start justify-between gap-4">
        <Person
          name={kudo.senderName}
          role={kudo.senderRole}
          tier={kudo.senderTier}
          avatar={kudo.senderAvatar}
        />
        <svg viewBox="0 0 24 24" className="mt-6 h-8 w-8 shrink-0 text-[#00101a]" fill="none" stroke="currentColor" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Person
          name={kudo.receiverName}
          role={kudo.receiverRole}
          tier={kudo.receiverTier}
          avatar={kudo.receiverAvatar}
        />
      </div>

      <div className={DIVIDER} />

      {/* mm:335:9448 -- content */}
      <div className="flex flex-col gap-4">
        <p className="font-bold leading-6 tracking-[0.5px] text-[#999]">
          {kudo.timeRange}
        </p>
        <p className="text-center text-base font-bold leading-6 tracking-[0.5px] text-[#00101a]">
          {kudo.title}
        </p>

        <div className="rounded-xl border border-[#ffea9e] bg-[#ffea9e]/40 px-6 py-4">
          <p className="text-justify text-lg font-bold leading-8 text-[#00101a]">
            {kudo.body}
          </p>
          {kudo.photos && kudo.photos.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Kudo photos">
              {kudo.photos.map((photo) => (
                <li
                  key={photo}
                  aria-hidden
                  className="h-12 w-16 shrink-0 rounded-md bg-[#00101a]/10"
                />
              ))}
            </ul>
          )}
        </div>

        <p className="font-bold leading-6 tracking-[0.5px] text-[#d4271d]">
          {kudo.hashtags.join(" ")}
        </p>
      </div>

      <div className={DIVIDER} />

      {/* mm:335:9461 -- footer: like count + visual-only actions */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <span className="flex items-center gap-2 text-2xl font-bold leading-8 text-[#00101a]">
          {kudo.likeCount.toLocaleString("vi-VN")}
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#d4271d]" fill="currentColor" aria-hidden>
            <path d="M12 21s-7.5-4.9-10-9.3C.5 8.6 2 5 5.5 5c2 0 3.3 1.2 4 2.3C10.2 6.2 11.5 5 13.5 5 17 5 18.5 8.6 17 11.7 14.5 16.1 12 21 12 21z" />
          </svg>
          <span className="sr-only">{t("sunKudos.likesSrLabel")}</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-label="Copy Link"
            className="flex items-center gap-1 rounded px-3 py-2 text-base font-bold tracking-[0.15px] text-[#00101a] transition-colors hover:bg-[#00101a]/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#998c5f]"
          >
            Copy Link
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
              <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={t("sunKudos.viewDetails")}
            className="flex items-center gap-1 rounded px-3 py-2 text-base font-bold tracking-[0.15px] text-[#00101a] transition-colors hover:bg-[#00101a]/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#998c5f]"
          >
            {t("sunKudos.viewDetails")}
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
              <path d="M7 17L17 7M17 7H8M17 7v9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
