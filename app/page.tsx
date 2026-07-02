import type { Metadata } from "next";
import Header from "./_components/homepage-saa/header";
import Hero from "./_components/homepage-saa/hero";
import RootFurtherContent from "./_components/homepage-saa/root-further-content";
import AwardsSection from "./_components/homepage-saa/awards-section";
import KudosBanner from "./_components/homepage-saa/kudos-banner";
import FloatingWidgetButton from "./_components/homepage-saa/floating-widget-button";
import Footer from "./_components/homepage-saa/footer";

export const metadata: Metadata = {
  title: "Sun* Annual Awards 2025 — Root Further",
  description:
    "Sun* Annual Awards 2025 (theme \"Root Further\"): event countdown, award categories, and Sun* Kudos.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#00101a]">
      <Header />
      <main className="flex-1">
        <Hero />
        <RootFurtherContent />
        <AwardsSection />
        <KudosBanner />
      </main>
      <FloatingWidgetButton />
      <Footer />
    </div>
  );
}
