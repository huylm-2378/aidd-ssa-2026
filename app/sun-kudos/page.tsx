import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sun* Kudos — Sun* Annual Awards 2025",
  description: "Sun* Kudos peer-recognition program detail page.",
};

/**
 * Minimal placeholder route so the homepage Kudos banner CTA and nav links
 * resolve to a real destination instead of a dead link (FR-010). Full Kudos
 * program content is out of scope for this feature.
 */
export default function SunKudosPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1224px] bg-[#00101a] px-6 py-16 text-white sm:px-12 lg:px-[144px]">
      <Link
        href="/"
        className="font-montserrat text-sm font-bold text-[#ffea9e] hover:underline"
      >
        ← Back to homepage
      </Link>

      <h1 className="mt-6 font-montserrat text-4xl font-bold text-[#ffea9e] sm:text-5xl">
        Sun* Kudos
      </h1>
      <p className="mt-4 max-w-2xl font-montserrat text-base leading-6 text-white/80">
        Sun* Kudos is Sun*&apos;s peer-recognition program. Full program
        details coming soon.
      </p>
    </main>
  );
}
