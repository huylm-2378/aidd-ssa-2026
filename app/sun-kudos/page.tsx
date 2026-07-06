import type { Metadata } from "next";
import Footer from "../_components/homepage-saa/footer";
import Header from "../_components/homepage-saa/header";
import AllKudosSection from "../_components/sun-kudos/all-kudos-section";
import HighlightKudosSection from "../_components/sun-kudos/highlight-kudos-section";
import KudosHero from "../_components/sun-kudos/kudos-hero";
import KudosKeyvisualBg from "../_components/sun-kudos/kudos-keyvisual-bg";
import KudosSearchBar from "../_components/sun-kudos/kudos-search-bar";
import SpotlightBoard from "../_components/sun-kudos/spotlight-board";
import {
  getAllKudos,
  getRecentGifts,
  getSidebarStats,
  getSpotlight,
  getSunnerOptions,
} from "../_lib/kudos/queries";

export const metadata: Metadata = {
  title: "Sun* Kudos — Sun* Annual Awards 2025",
  description: "Sun* Kudos peer-recognition program detail page.",
};

/**
 * Sun* Kudos board (F003) — now data-driven from Supabase (F007). This Server
 * Component fetches every section's data in parallel via the anon server client
 * and passes it down to the (mostly unchanged) presentational sections. The
 * Highlight filter/sort + carousel stay client-side over the fetched set. All
 * queries fail safe (empty view shape) so the page never crashes on a DB error
 * — sections render their own empty states. Reuses the homepage Header + Footer.
 */
export default async function SunKudosPage() {
  const [allKudos, spotlight, stats, recentGifts, sunnerOptions] = await Promise.all([
    getAllKudos(),
    getSpotlight(),
    getSidebarStats(),
    getRecentGifts(),
    getSunnerOptions(),
  ]);

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[#00101a]">
      <Header />
      <main className="flex-1">
        <div className="relative isolate overflow-hidden pb-8">
          <KudosKeyvisualBg />
          <KudosHero />
          <KudosSearchBar sunnerOptions={sunnerOptions} />
        </div>
        <HighlightKudosSection kudos={allKudos} />
        <SpotlightBoard count={spotlight.count} names={spotlight.names} />
        <AllKudosSection kudos={allKudos} stats={stats} recentGifts={recentGifts} />
      </main>
      <Footer />
    </div>
  );
}
