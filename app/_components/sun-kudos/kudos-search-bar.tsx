"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { KUDOS_SEARCH } from "../../_lib/sun-kudos-content";
import type { SunnerOption } from "../../_lib/write-kudo-content";
import WriteKudoModal from "./write-kudo-modal";

/**
 * Search bar for `/sun-kudos` (MoMorph `Button chuc nang`, node `2940:13448`):
 * two pill BUTTONS whose face is the exported pill image (each bakes in the
 * frosted fill, gold border, icon, and label). The prompt pill opens the "Viết
 * Kudo" composer (F006 FR-001); the profile pill is a visual-only entry point.
 * As real `<button>`s they get native Enter/Space activation — the label lives
 * in the image, so each carries an `aria-label`.
 */
export default function KudosSearchBar({
  sunnerOptions,
}: {
  sunnerOptions?: readonly SunnerOption[];
}) {
  const [composerOpen, setComposerOpen] = useState(false);
  const promptRef = useRef<HTMLButtonElement>(null);

  const pillClass =
    "relative block overflow-hidden rounded-full backdrop-blur-2xl transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101a]";

  return (
    <>
      <section
        className="mx-auto flex max-w-[1512px] flex-col gap-4 px-6 sm:px-12 lg:flex-row lg:gap-8 lg:px-[144px]"
        aria-label="Sun* Kudos search"
      >
        <button
          id="kudos-prompt"
          ref={promptRef}
          type="button"
          aria-haspopup="dialog"
          aria-label={KUDOS_SEARCH.promptPlaceholder}
          onClick={() => setComposerOpen(true)}
          className={`${pillClass} lg:flex-1`}
        >
          <Image
            src="/sun-kudos/search-prompt-pill.png"
            alt=""
            aria-hidden
            width={738}
            height={72}
            priority
            className="pointer-events-none h-auto w-full"
          />
        </button>

        <button
          id="kudos-profile-search"
          type="button"
          aria-label={KUDOS_SEARCH.profilePlaceholder}
          className={`${pillClass} lg:w-[381px] lg:shrink-0`}
        >
          <Image
            src="/sun-kudos/search-profile-pill.png"
            alt=""
            aria-hidden
            width={381}
            height={72}
            priority
            className="pointer-events-none h-auto w-full"
          />
        </button>
      </section>
      <WriteKudoModal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        triggerRef={promptRef}
        sunnerOptions={sunnerOptions}
      />
    </>
  );
}
