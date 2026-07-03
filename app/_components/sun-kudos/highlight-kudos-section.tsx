"use client";

import { useState } from "react";
import { HIGHLIGHT_KUDOS } from "../../_lib/kudos-cards";
import {
  DEPARTMENT_FILTERS,
  HASHTAG_FILTERS,
  SECTION_EYEBROW,
} from "../../_lib/sun-kudos-content";
import KudoCard from "./kudo-card";

/** Visual-only filter dropdown (selection does not narrow the mock feed). */
function FilterDropdown({
  label,
  options,
}: {
  label: string;
  options: readonly string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-[#998c5f] bg-[#ffea9e]/10 px-4 py-2 font-montserrat text-sm font-bold text-white transition-colors hover:bg-[#ffea9e]/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]"
      >
        {selected ?? label}
        <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" aria-hidden>
          <path d="M6 9l6 6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-10 mt-2 min-w-[160px] overflow-hidden rounded-md border border-[#998c5f] bg-[#101417] shadow-lg"
        >
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={selected === option}
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left font-montserrat text-sm text-white transition-colors hover:bg-white/10"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Highlight Kudos section (MoMorph `B_Highlight`, node `2940:13451`): the shared
 * title band, Hashtag + Phòng ban filter dropdowns, and a one-card-per-page
 * carousel driven by prev/next arrows with an "n/N" indicator. Filters are
 * visual-only (per spec assumption); only the carousel holds real state.
 */
export default function HighlightKudosSection() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = HIGHLIGHT_KUDOS.length;
  const goPrev = () => setPageIndex((i) => Math.max(0, i - 1));
  const goNext = () => setPageIndex((i) => Math.min(pageCount - 1, i + 1));
  const current = HIGHLIGHT_KUDOS[pageIndex];

  return (
    <section
      className="mx-auto flex max-w-[1512px] flex-col gap-10 px-6 py-16 sm:px-12 lg:px-[144px] lg:py-24"
      aria-label="Highlight Kudos"
    >
      <header className="flex flex-col gap-4">
        <p className="font-montserrat text-2xl font-bold leading-8 text-white">
          {SECTION_EYEBROW}
        </p>
        <hr className="w-full border-t border-[#2e3940]" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-montserrat text-4xl font-bold leading-tight tracking-tight text-[#ffea9e] sm:text-5xl lg:text-[57px] lg:leading-[64px]">
            HIGHLIGHT KUDOS
          </h2>
          <div className="flex items-center gap-2">
            <FilterDropdown label="Hashtag" options={HASHTAG_FILTERS} />
            <FilterDropdown label="Phòng ban" options={DEPARTMENT_FILTERS} />
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center gap-4 sm:gap-8">
        <button
          type="button"
          onClick={goPrev}
          disabled={pageIndex === 0}
          aria-label="Kudo trước"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" aria-hidden>
            <path d="M15 6l-6 6 6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="w-full min-w-0 max-w-[528px]">
          <KudoCard kudo={current} />
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={pageIndex === pageCount - 1}
          aria-label="Kudo tiếp theo"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" aria-hidden>
            <path d="M9 6l6 6-6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <p
        className="text-center font-montserrat text-[28px] font-bold leading-9 text-[#999]"
        aria-label={`Trang ${pageIndex + 1} trên ${pageCount}`}
      >
        {pageIndex + 1}/{pageCount}
      </p>
    </section>
  );
}
