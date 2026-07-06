"use client";

import { useMemo, useState } from "react";
import { filterKudos, getHighlightKudos, HIGHLIGHT_KUDOS } from "../../_lib/kudos-cards";
import {
  DEPARTMENT_FILTERS,
  HASHTAG_FILTERS,
  SECTION_EYEBROW,
} from "../../_lib/sun-kudos-content";
import FilterDropdown from "./filter-dropdown";
import HighlightCarousel from "./highlight-carousel";

/**
 * Highlight Kudos section (MoMorph `B_Highlight`, node `2940:13451`): the
 * shared title band, Hashtag + Phòng ban filter dropdowns, and the
 * `HighlightCarousel`. Owns the filter state (FIX 3) and `pageIndex`; filters
 * narrow `HIGHLIGHT_KUDOS` (AND-combined) before the top-5-most-liked sort
 * (FIX 2), and changing either filter resets the carousel to page 0.
 */
export default function HighlightKudosSection() {
  const [hashtag, setHashtag] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const visibleKudos = useMemo(
    () => getHighlightKudos(filterKudos(HIGHLIGHT_KUDOS, { hashtag, department })),
    [hashtag, department],
  );

  const handleHashtagChange = (value: string | null) => {
    setHashtag(value);
    setPageIndex(0);
  };

  const handleDepartmentChange = (value: string | null) => {
    setDepartment(value);
    setPageIndex(0);
  };

  const goPrev = () => setPageIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setPageIndex((i) => Math.min(visibleKudos.length - 1, i + 1));

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
            <FilterDropdown
              label="Hashtag"
              options={HASHTAG_FILTERS}
              selected={hashtag}
              onChange={handleHashtagChange}
            />
            <FilterDropdown
              label="Phòng ban"
              options={DEPARTMENT_FILTERS}
              selected={department}
              onChange={handleDepartmentChange}
            />
          </div>
        </div>
      </header>

      <HighlightCarousel
        kudos={visibleKudos}
        pageIndex={pageIndex}
        onPrev={goPrev}
        onNext={goNext}
      />
    </section>
  );
}
