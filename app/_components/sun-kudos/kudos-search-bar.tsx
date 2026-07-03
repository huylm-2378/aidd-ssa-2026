"use client";

import { useState } from "react";
import { KUDOS_SEARCH } from "../../_lib/sun-kudos-content";

/**
 * Search bar for `/sun-kudos` (MoMorph `Button chuc nang`, node `2940:13448`):
 * two gold-tinted rounded pills — a wide "write a Kudo" prompt with a pen icon
 * and a narrower "search Sunner profile" field with a magnifier icon. Both are
 * controlled inputs holding local state only; they submit nothing and trigger
 * no action (visual-only per FR-004).
 */
export default function KudosSearchBar() {
  const [prompt, setPrompt] = useState("");
  const [profileQuery, setProfileQuery] = useState("");

  const pillClass =
    "flex items-center gap-4 rounded-full border border-[#998c5f] bg-[rgba(255,234,158,0.10)] px-4 py-3";
  const inputClass =
    "w-full bg-transparent font-montserrat text-sm font-bold tracking-[0.15px] text-white placeholder:text-white/70 focus-visible:outline-none sm:text-base";

  return (
    <section
      className="mx-auto flex max-w-[1512px] flex-col gap-4 px-6 sm:px-12 lg:flex-row lg:gap-8 lg:px-[144px]"
      aria-label="Sun* Kudos search"
    >
      <div className={`${pillClass} lg:flex-1`}>
        {/* mm:I2940:13449;186:2759 (MM_MEDIA_Pen) */}
        <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#ffea9e]" fill="none" stroke="currentColor" aria-hidden>
          <path d="M12 20h9" strokeWidth={1.8} strokeLinecap="round" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <label htmlFor="kudos-prompt" className="sr-only">
          {KUDOS_SEARCH.promptPlaceholder}
        </label>
        <input
          id="kudos-prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={KUDOS_SEARCH.promptPlaceholder}
          className={inputClass}
        />
      </div>

      <div className={`${pillClass} lg:w-[381px] lg:shrink-0`}>
        {/* mm:I2940:13450;186:2759 (MM_MEDIA_Search) */}
        <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#ffea9e]" fill="none" stroke="currentColor" aria-hidden>
          <circle cx="11" cy="11" r="7" strokeWidth={1.8} />
          <path d="m20 20-3.5-3.5" strokeWidth={1.8} strokeLinecap="round" />
        </svg>
        <label htmlFor="kudos-profile-search" className="sr-only">
          {KUDOS_SEARCH.profilePlaceholder}
        </label>
        <input
          id="kudos-profile-search"
          type="search"
          value={profileQuery}
          onChange={(e) => setProfileQuery(e.target.value)}
          placeholder={KUDOS_SEARCH.profilePlaceholder}
          className={inputClass}
        />
      </div>
    </section>
  );
}
