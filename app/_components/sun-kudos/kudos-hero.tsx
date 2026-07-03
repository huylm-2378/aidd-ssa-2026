import Image from "next/image";
import { KUDOS_HERO } from "../../_lib/sun-kudos-content";

/**
 * Hero band for `/sun-kudos` (MoMorph `Frame 487` / `A_KV Kudos`, node
 * `2940:13436`): a gold eyebrow "Hệ thống ghi nhận và cảm ơn" (36px/700) and
 * the exported "KUDOS" wordmark logo (`MM_MEDIA_Kudos logo`, node `2940:13440`
 * — the red Sun* "S" glyph + "KUDOS"). The wordmark is a decorative image; an
 * sr-only heading carries the accessible "KUDOS" name. The keyvisual artwork
 * behind it is rendered by `KudosKeyvisualBg`, hoisted to the page so it also
 * spans the search band below (matching the frame's 0-512 Keyvisual).
 */
export default function KudosHero() {
  return (
    <section
      className="relative px-6 pb-10 pt-16 sm:px-12 lg:px-[144px] lg:pb-16 lg:pt-24"
      aria-label="Sun* Kudos hero"
    >
      <div className="flex max-w-[1224px] flex-col items-start gap-2">
        {/* mm:2940:13439 -- gold eyebrow, 36px/700 Montserrat. */}
        <p className="font-montserrat text-2xl font-bold leading-tight text-[#ffea9e] sm:text-3xl lg:text-[36px] lg:leading-[44px]">
          {KUDOS_HERO.eyebrow}
        </p>
        {/* mm:2940:13440 -- "KUDOS" wordmark logo (red Sun* "S" + KUDOS). */}
        <h1 className="m-0">
          <span className="sr-only">{KUDOS_HERO.wordmark}</span>
          <Image
            src="/sun-kudos/kudos-logo.png"
            alt=""
            aria-hidden
            width={593}
            height={106}
            priority
            className="h-auto w-[280px] sm:w-[440px] lg:w-[560px]"
          />
        </h1>
      </div>
    </section>
  );
}
