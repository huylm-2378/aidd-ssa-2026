import Image from "next/image";

/**
 * Decorative background for the Spotlight "Live board" panel (F008, MoMorph
 * `B.7_Spotlight` — nodes `image 24/25` + `Root further mo rong 1`). Three
 * stacked layers, faithful to the Figma fills:
 *  1. the "Root Further" keyvisual, `object-cover` + dimmed (the design's
 *     `url(...) cover` fill);
 *  2. a ~80% dark scrim (the design's `linear-gradient(rgba(0,0,0,.7))`
 *     overlay) so the white/gold name cloud stays readable;
 *  3. a screen-blended particle/star field (approximates the design's
 *     screen-blend network graphic), with a gentle motion-safe twinkle so the
 *     board reads as "live".
 * Purely visual: `aria-hidden`, `pointer-events-none`, sits at `-z-10` inside
 * the panel's own stacking context (panel is `isolate`) so it paints above the
 * panel's base colour but below the content.
 */
export default function SpotlightBoardBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Image
        src="/sun-kudos/kv-background.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-[#04070b]/80" />
      <div className="absolute inset-0 opacity-60 mix-blend-screen motion-safe:animate-pulse [background-image:radial-gradient(1px_1px_at_20%_30%,rgba(255,255,255,0.7),transparent),radial-gradient(1px_1px_at_70%_62%,rgba(255,234,158,0.6),transparent),radial-gradient(1.5px_1.5px_at_42%_82%,rgba(255,255,255,0.5),transparent),radial-gradient(1px_1px_at_85%_24%,rgba(255,255,255,0.6),transparent),radial-gradient(1px_1px_at_55%_14%,rgba(255,234,158,0.5),transparent),radial-gradient(1.5px_1.5px_at_12%_70%,rgba(255,255,255,0.45),transparent),radial-gradient(1px_1px_at_92%_75%,rgba(255,234,158,0.5),transparent)] [background-size:260px_260px]" />
    </div>
  );
}
