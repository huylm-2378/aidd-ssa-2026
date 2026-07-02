import type { Metadata } from "next";
import Image from "next/image";
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
    <div className="relative isolate flex min-h-screen flex-col bg-[#00101a]">
      {/* mm:2167:9028 + mm:2167:9029 -- the keyvisual artwork is anchored to the very top of the
          page (behind the translucent sticky header, matching the Figma Keyvisual BG positioned at
          y=0), spanning down 1512x1392 so its bottom ends partway into the Root Further content
          (around the "Lễ trao giải Sun* Annual Awards 2025" paragraph); below it the page falls
          back to the solid dark background. Anchoring here rather than inside <main> keeps the art
          from being pushed down by the header's height. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden sm:block"
      >
        <Image
          src="/homepage-saa/keyvisual-bg.png"
          alt=""
          aria-hidden
          width={1512}
          height={1392}
          priority
          sizes="100vw"
          className="h-auto w-full"
        />
        {/* "Cover" diagonal scrim keeps the hero + body text readable over the art. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00101a_0%,#00101a_42%,rgba(0,16,26,0.55)_60%,transparent_78%)] lg:bg-[linear-gradient(12deg,#00101a_23.7%,rgba(0,18,29,0.46)_38.34%,rgba(0,19,32,0)_48.92%)]" />
      </div>
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
