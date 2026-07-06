"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { KUDOS_SEARCH } from "../../_lib/sun-kudos-content";
import WriteKudoModal from "./write-kudo-modal";

/**
 * Search bar for `/sun-kudos` (MoMorph `Button chuc nang`, node `2940:13448`):
 * two real search fields whose BACKGROUND is the exported pill image
 * (`mms_A.1_Button ghi nhận` 738x72 / `Tìm kiếm sunner` 381x72 — each bakes in
 * the frosted fill, gold border, icon, and resting label). A transparent
 * `<input>` overlays the image so the field stays functional; an sr-only
 * label carries the copy. The prompt pill is also the trigger for the
 * "Viết Kudo" composer modal (F006 FR-001) — it is `readOnly` and opens the
 * modal on focus/click rather than accepting free text.
 */
export default function KudosSearchBar() {
  const [profileQuery, setProfileQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const promptRef = useRef<HTMLInputElement>(null);

  // Transparent input laid over the pill image; left padding clears the baked-in icon.
  const inputClass =
    "absolute inset-0 h-full w-full rounded-full bg-transparent pl-14 pr-5 font-montserrat text-sm font-bold text-white caret-[#ffea9e] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e] sm:text-base";

  return (
    <>
      <section
        className="mx-auto flex max-w-[1512px] flex-col gap-4 px-6 sm:px-12 lg:flex-row lg:gap-8 lg:px-[144px]"
        aria-label="Sun* Kudos search"
      >
        <div className="relative overflow-hidden rounded-full backdrop-blur-2xl lg:flex-1">
          <Image
            src="/sun-kudos/search-prompt-pill.png"
            alt=""
            aria-hidden
            width={738}
            height={72}
            priority
            className="h-auto w-full"
          />
          <label htmlFor="kudos-prompt" className="sr-only">
            {KUDOS_SEARCH.promptPlaceholder}
          </label>
          <input
            id="kudos-prompt"
            ref={promptRef}
            type="text"
            value=""
            readOnly
            // Trigger on click / Enter / Space only — NOT onFocus: the dialog
            // restores focus to this input on close, which would otherwise
            // re-open it immediately (close→refocus→reopen loop).
            onClick={() => setComposerOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setComposerOpen(true);
              }
            }}
            aria-haspopup="dialog"
            className={inputClass}
          />
        </div>

        <div className="relative overflow-hidden rounded-full backdrop-blur-2xl lg:w-[381px] lg:shrink-0">
          <Image
            src="/sun-kudos/search-profile-pill.png"
            alt=""
            aria-hidden
            width={381}
            height={72}
            priority
            className="h-auto w-full"
          />
          <label htmlFor="kudos-profile-search" className="sr-only">
            {KUDOS_SEARCH.profilePlaceholder}
          </label>
          <input
            id="kudos-profile-search"
            type="search"
            value={profileQuery}
            onChange={(e) => setProfileQuery(e.target.value)}
            className={inputClass}
          />
        </div>
      </section>
      <WriteKudoModal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        triggerRef={promptRef}
      />
    </>
  );
}
