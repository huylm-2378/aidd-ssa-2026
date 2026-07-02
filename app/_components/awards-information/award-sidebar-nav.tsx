"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AWARD_CATEGORIES } from "../../_lib/award-categories";

/**
 * Sticky left-hand anchor nav for `/awards-information` (Figma
 * `mms_C_Menu list`). Scroll-spies the 6 award detail sections to highlight
 * the one currently in view, gold like the header's active nav state.
 *
 * Hidden below `lg` — the design only shows this two-column layout on
 * desktop; sections stack full-width on smaller viewports (see plan.md
 * "Risks / open questions").
 */
export default function AwardSidebarNav() {
  const [activeSlug, setActiveSlug] = useState<string>(
    AWARD_CATEGORIES[0]?.slug ?? "",
  );

  useEffect(() => {
    const sections = AWARD_CATEGORIES.map((award) =>
      document.getElementById(award.slug),
    ).filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveSlug(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0.1 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Award categories"
      className="sticky top-24 hidden w-[280px] shrink-0 flex-col items-start gap-2 self-start lg:flex"
    >
      {AWARD_CATEGORIES.map((award) => {
        const isActive = award.slug === activeSlug;
        return (
          <a
            key={award.slug}
            href={`#${award.slug}`}
            aria-current={isActive ? "location" : undefined}
            className={`flex items-center gap-3 border-b px-4 py-3 font-montserrat text-base font-bold tracking-[0.15px] transition-colors ${
              isActive
                ? "border-[#ffea9e] text-[#ffea9e] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]"
                : "border-transparent text-white hover:text-[#ffea9e]"
            }`}
          >
            {/* mm:MM_MEDIA_Target -- glowing gold target when active, plain white when not.
                The active asset (32x34) keeps its glow uncropped and renders at native size so its
                inner circle (20px) matches the white icon; the glow overflows this fixed 20px slot,
                keeping the label column aligned. unoptimized: tiny static icon, skip the optimizer. */}
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
              <Image
                src={
                  isActive
                    ? "/awards-information/target-icon-active.png"
                    : "/awards-information/target-icon.png"
                }
                alt=""
                aria-hidden
                width={isActive ? 32 : 20}
                height={isActive ? 34 : 20}
                unoptimized
                className="max-w-none"
              />
            </span>
            {award.navLabel ?? award.title}
          </a>
        );
      })}
    </nav>
  );
}
