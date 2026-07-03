import Image from "next/image";
import { KUDOS_HERO } from "../../_lib/sun-kudos-content";

/**
 * Hero band for `/sun-kudos` (MoMorph `Keyvisual` + `Frame 487` / `A_KV Kudos`,
 * node `2940:13436`): the homepage keyvisual artwork + diagonal scrim, a gold
 * eyebrow "Hệ thống ghi nhận và cảm ơn" (36px/700), and the large "KUDOS"
 * wordmark. The frame renders the wordmark in SVN-Gotham with a red Sun* "S"
 * glyph; both are unavailable as assets, so we render "KUDOS" as styled text in
 * the frame's warm `#dbd1c1` (KISS — swap for an exported wordmark only if a
 * 1512px fidelity check fails).
 */
export default function KudosHero() {
  return (
    <section
      className="relative isolate overflow-hidden px-6 pb-10 pt-16 sm:px-12 lg:px-[144px] lg:pb-16 lg:pt-24"
      aria-label="Sun* Kudos hero"
    >
      {/* mm:2940:13432 (Keyvisual) -- reuse the homepage keyvisual artwork anchored top + a diagonal
          scrim so the eyebrow + wordmark stay readable over the busy art. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden sm:block"
      >
        <Image
          src="/homepage-saa/keyvisual-bg.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00101a_0%,#00101a_42%,rgba(0,16,26,0.55)_60%,transparent_78%)] lg:bg-[linear-gradient(12deg,#00101a_23.7%,rgba(0,18,29,0.46)_38.34%,rgba(0,19,32,0)_48.92%)]" />
      </div>

      <div className="flex max-w-[1224px] flex-col items-start gap-2">
        {/* mm:2940:13439 -- gold eyebrow, 36px/700 Montserrat. */}
        <p className="font-montserrat text-2xl font-bold leading-tight text-[#ffea9e] sm:text-3xl lg:text-[36px] lg:leading-[44px]">
          {KUDOS_HERO.eyebrow}
        </p>
        {/* mm:2940:13441 -- "KUDOS" wordmark; #dbd1c1 warm tone, tight tracking. */}
        <h1 className="font-montserrat text-[64px] font-bold leading-none tracking-tight text-[#dbd1c1] sm:text-[96px] lg:text-[130px]">
          {KUDOS_HERO.wordmark}
        </h1>
      </div>
    </section>
  );
}
