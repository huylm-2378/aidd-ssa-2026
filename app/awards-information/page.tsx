import type { Metadata } from "next";
import Link from "next/link";
import { AWARD_CATEGORIES } from "../_lib/award-categories";

export const metadata: Metadata = {
  title: "Awards Information — Sun* Annual Awards 2025",
  description: "Details for each Sun* Annual Awards 2025 award category.",
};

/**
 * Minimal placeholder route so homepage award-card links (image/title/"Chi
 * tiết") resolve to a real, anchor-targetable destination instead of a dead
 * link (FR-009). Full award-detail content is out of scope for this feature.
 */
export default function AwardsInformationPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1224px] bg-[#00101a] px-6 py-16 text-white sm:px-12 lg:px-[144px]">
      <Link
        href="/"
        className="font-montserrat text-sm font-bold text-[#ffea9e] hover:underline"
      >
        ← Back to homepage
      </Link>

      <h1 className="mt-6 font-montserrat text-4xl font-bold text-[#ffea9e] sm:text-5xl">
        Awards Information
      </h1>
      <p className="mt-4 max-w-2xl font-montserrat text-base leading-6 text-white/80">
        Details for each Sun* Annual Awards 2025 category. Full content
        coming soon.
      </p>

      <div className="mt-12 flex flex-col gap-16">
        {AWARD_CATEGORIES.map((award) => (
          <section
            key={award.slug}
            id={award.slug}
            className="scroll-mt-24 border-t border-[#2e3940] pt-8"
          >
            <h2 className="font-montserrat text-2xl font-bold text-white">
              {award.title}
            </h2>
            <p className="mt-2 max-w-2xl font-montserrat text-base leading-6 text-white/70">
              {award.description}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
