import Image from "next/image";

/**
 * Hero band for `/awards-information`: the design's dedicated keyvisual
 * banner (Figma `mms_3_Keyvisual` / `image 20`, node `2167:5138`, 1440x547)
 * + scrim, the Root Further logo, and a title block mirroring
 * `awards-section.tsx`'s header (label + divider + gold `<h1>`).
 */
export default function AwardsHero() {
  return (
    <section
      className="relative isolate overflow-hidden px-6 pb-16 pt-16 sm:px-12 lg:px-[144px] lg:pb-24 lg:pt-24"
      aria-label="Awards information hero"
    >
      {/* mm:2167:5138 (image 20) -- the design's dedicated hero banner art + diagonal scrim so
          readability holds over the title block below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden sm:block"
      >
        <Image
          src="/awards-information/hero-keyvisual.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00101a_0%,#00101a_42%,rgba(0,16,26,0.55)_60%,transparent_78%)] lg:bg-[linear-gradient(12deg,#00101a_23.7%,rgba(0,18,29,0.46)_38.34%,rgba(0,19,32,0)_48.92%)]" />
      </div>

      <div className="flex max-w-[1224px] flex-col items-start gap-10">
        {/* mm:2788:12911 -- same Root Further logotype as the homepage hero. */}
        <Image
          src="/homepage-saa/root-further-logo.png"
          alt="Root Further"
          width={451}
          height={200}
          priority
          className="h-auto w-[220px] sm:w-[300px] lg:w-[451px]"
        />

        {/* mm:313:8453 -- the title band is centered (Figma "Sun* Annual Awards 2025" is
            centered 24px/700 white; "Hệ thống giải thưởng SAA 2025" sits in a center-justified
            frame). The Root Further logo above stays left-aligned per the KV frame. */}
        <header className="flex w-full flex-col gap-4 text-center">
          <p className="font-montserrat text-2xl font-bold leading-8 text-white">
            Sun* Annual Awards 2025
          </p>
          <hr className="w-full border-t border-[#2e3940]" />
          <h1 className="font-montserrat text-4xl font-bold leading-[1.1] tracking-tight text-[#ffea9e] sm:text-5xl lg:text-[57px] lg:leading-[64px]">
            Hệ thống giải thưởng SAA 2025
          </h1>
        </header>
      </div>
    </section>
  );
}
