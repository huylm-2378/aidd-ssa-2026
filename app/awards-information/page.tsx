import type { Metadata } from "next";
import AwardDetailSection from "../_components/awards-information/award-detail-section";
import AwardSidebarNav from "../_components/awards-information/award-sidebar-nav";
import AwardsHero from "../_components/awards-information/awards-hero";
import Footer from "../_components/homepage-saa/footer";
import Header from "../_components/homepage-saa/header";
import KudosBanner from "../_components/homepage-saa/kudos-banner";
import { AWARD_CATEGORIES } from "../_lib/award-categories";

export const metadata: Metadata = {
  title: "Awards Information — Sun* Annual Awards 2025",
  description: "Details for each Sun* Annual Awards 2025 award category.",
};

/**
 * Faithful implementation of the MoMorph "Hệ thống giải" frame
 * (screenId `zFYDgyj_pD`, node `313:8436`): hero band, a sticky anchor nav
 * alongside the 6 award detail sections, then the shared Kudos banner and
 * footer. Destination for the homepage award cards' `#<slug>` deep links.
 */
export default function AwardsInformationPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[#00101a]">
      <Header />
      <main className="flex-1">
        <AwardsHero />

        <section
          className="mx-auto flex max-w-[1512px] flex-col gap-10 px-6 py-16 sm:px-12 lg:flex-row lg:gap-16 lg:px-[144px] lg:py-24"
          aria-label="Award details"
        >
          <AwardSidebarNav />
          <div className="flex flex-1 flex-col gap-16 lg:gap-24">
            {AWARD_CATEGORIES.map((award, index) => (
              <AwardDetailSection key={award.slug} award={award} index={index} />
            ))}
          </div>
        </section>

        <KudosBanner />
      </main>
      <Footer />
    </div>
  );
}
