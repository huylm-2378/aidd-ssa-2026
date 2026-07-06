import { SPOTLIGHT_ACTIVITY } from "../../_lib/kudos-spotlight-names";
import { SECTION_EYEBROW } from "../../_lib/sun-kudos-content";

/** weight (1-5) → font-size scale in the cloud. */
const SIZE_SCALE: Record<number, string> = {
  1: "text-sm",
  2: "text-base",
  3: "text-xl",
  4: "text-2xl",
  5: "text-4xl",
};

/** weight → colour, for depth (top weight gold, high white, rest dimmed). */
function toneOf(weight: number): string {
  if (weight >= 5) return "text-[#ffea9e]";
  if (weight === 4) return "text-white";
  return "text-white/50";
}

/** Deterministic 1-5 weight from a name's index, so the cloud varies stably. */
function weightOf(index: number): number {
  return ((index * 7 + 3) % 5) + 1;
}

/**
 * Spotlight Board (MoMorph `Frame 552`, node `2940:14170`): the shared title
 * band + a dark rounded panel headed "<count> KUDOS" holding a name word-cloud
 * and a horizontally scrolling activity-log strip. The count + names come from
 * the server (F007, Supabase) via props; the activity strip is decorative.
 * The search field and expand control are visual-only.
 */
export default function SpotlightBoard({
  count,
  names,
}: {
  count: number;
  names: readonly string[];
}) {
  return (
    <section
      className="mx-auto flex max-w-[1512px] flex-col gap-10 px-6 py-16 sm:px-12 lg:px-[144px] lg:py-24"
      aria-label="Spotlight Board"
    >
      <header className="flex flex-col gap-4">
        <p className="font-montserrat text-2xl font-bold leading-8 text-white">
          {SECTION_EYEBROW}
        </p>
        <hr className="w-full border-t border-[#2e3940]" />
        <h2 className="font-montserrat text-4xl font-bold leading-tight tracking-tight text-[#ffea9e] sm:text-5xl lg:text-[57px] lg:leading-[64px]">
          SPOTLIGHT BOARD
        </h2>
      </header>

      <div className="relative overflow-hidden rounded-2xl border border-[#2e3940] bg-[#080c10] px-6 py-8 sm:px-10 sm:py-10">
        {/* visual-only search field (real labelled input, like KudosSearchBar) */}
        <div className="mb-6 flex w-full max-w-[220px] items-center gap-2 rounded-full border border-[#2e3940] bg-white/5 px-3 py-1.5">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" aria-hidden>
            <circle cx="11" cy="11" r="7" strokeWidth={1.8} />
            <path d="m20 20-3.5-3.5" strokeWidth={1.8} strokeLinecap="round" />
          </svg>
          <label htmlFor="spotlight-search" className="sr-only">
            Tìm kiếm trong Spotlight Board
          </label>
          <input
            id="spotlight-search"
            type="search"
            placeholder="Tìm kiếm"
            className="w-full bg-transparent font-montserrat text-xs text-white placeholder:text-white/50 focus-visible:outline-none"
          />
        </div>

        <p className="text-center font-montserrat text-4xl font-bold leading-tight sm:text-5xl">
          <span className="text-[#ffea9e]">{count}</span>{" "}
          <span className="text-white">KUDOS</span>
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {names.map((name, index) => {
            const weight = weightOf(index);
            return (
              <span
                key={`${name}-${index}`}
                className={`font-montserrat font-bold leading-tight ${SIZE_SCALE[weight] ?? "text-base"} ${toneOf(weight)}`}
              >
                {name}
              </span>
            );
          })}
        </div>

        <div className="mt-8 flex gap-8 overflow-x-auto border-t border-[#2e3940] pt-4" aria-label="Hoạt động gần đây">
          {SPOTLIGHT_ACTIVITY.map((line) => (
            <p key={line} className="shrink-0 whitespace-nowrap font-montserrat text-xs text-white/50">
              {line}
            </p>
          ))}
        </div>

        <button
          type="button"
          aria-label="Mở rộng bảng"
          className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded text-white/60 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
            <path d="M4 14v6h6M20 10V4h-6M14 4l6 6M4 20l6-6" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
