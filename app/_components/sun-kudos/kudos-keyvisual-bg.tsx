import Image from "next/image";

/**
 * Full-width Keyvisual banner (MoMorph `Keyvisual`, node `2940:13432` — a
 * 1440x512 top banner) for `/sun-kudos`. Rendered edge-to-edge and top-anchored
 * so it spans the whole hero + search band (in the frame the search pills at
 * y=408-480 sit inside the 0-512 keyvisual), with its streaks bleeding left
 * behind the logo. The Figma `Cover` scrim darkens the bottom-left for
 * readability. Meant to sit inside a `relative` wrapper that clips it.
 */
export default function KudosKeyvisualBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden sm:block"
    >
      <Image
        src="/sun-kudos/kv-background.png"
        alt=""
        aria-hidden
        width={1440}
        height={512}
        priority
        sizes="100vw"
        className="h-auto w-full"
      />
      <div className="absolute inset-0 bg-[linear-gradient(25deg,#00101a_14.74%,rgba(0,19,32,0)_47.8%)]" />
      {/* Deepen the lower band to solid navy so the search pills sit on a dark backdrop (as in the
          frame): the artwork fades out below the "KUDOS" logo, leaving subtle glass on dark. The
          gradient spans the whole KV so the solid zone reaches up to the search row. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#00101a_0%,#00101a_32%,rgba(0,16,26,0)_58%)]" />
    </div>
  );
}
