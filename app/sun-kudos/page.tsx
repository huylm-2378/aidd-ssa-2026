import type { Metadata } from "next";
import Footer from "../_components/homepage-saa/footer";
import Header from "../_components/homepage-saa/header";
import AllKudosSection from "../_components/sun-kudos/all-kudos-section";
import HighlightKudosSection from "../_components/sun-kudos/highlight-kudos-section";
import KudosHero from "../_components/sun-kudos/kudos-hero";
import KudosKeyvisualBg from "../_components/sun-kudos/kudos-keyvisual-bg";
import KudosSearchBar from "../_components/sun-kudos/kudos-search-bar";
import SpotlightBoard from "../_components/sun-kudos/spotlight-board";

export const metadata: Metadata = {
  title: "Sun* Kudos — Sun* Annual Awards 2025",
  description: "Sun* Kudos peer-recognition program detail page.",
};

/**
 * Faithful static clone of the MoMorph frame "Sun* Kudos - Live board"
 * (screenId `MaZUn5xHXZ`, node `2940:13431`): keyvisual hero + "KUDOS"
 * wordmark, a Sunner search bar, a Highlight Kudos carousel, a Spotlight Board
 * word-cloud, and an All Kudos feed alongside a personal-stats sidebar. Reuses
 * the homepage Header + Footer (both auto-light "Sun* Kudos" via `usePathname`).
 * Mock data only, light client-only interactivity — no backend, no persistence.
 */
export default function SunKudosPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[#00101a]">
      <Header />
      <main className="flex-1">
        {/* mm:2940:13432 -- the Keyvisual banner (frame y=0..512) spans the hero + search band and
            extends ~32px past the search row (search ends y=480), so it bleeds a little into the gap
            before the Highlight section. The wrapper's bottom padding sets that overhang; the KV is
            clipped to it. */}
        <div className="relative isolate overflow-hidden pb-8">
          <KudosKeyvisualBg />
          <KudosHero />
          <KudosSearchBar />
        </div>
        <HighlightKudosSection />
        <SpotlightBoard />
        <AllKudosSection />
      </main>
      <Footer />
    </div>
  );
}
