import { ALL_KUDOS } from "../../_lib/kudos-cards";
import { SECTION_EYEBROW } from "../../_lib/sun-kudos-content";
import KudoCard from "./kudo-card";
import KudosSidebar from "./kudos-sidebar";

/**
 * All Kudos section (MoMorph `C_All kudos`, node `2940:13475`): the shared
 * title band above a two-column body — a vertical feed of `KudoCard`s (left)
 * beside the stats + Secret Box + recent-gifts `KudosSidebar` (right). Columns
 * sit side by side at `lg+` and stack (sidebar under the feed) below `lg`.
 */
export default function AllKudosSection() {
  return (
    <section
      className="mx-auto flex max-w-[1512px] flex-col gap-10 px-6 py-16 sm:px-12 lg:px-[144px] lg:py-24"
      aria-label="All Kudos"
    >
      <header className="flex flex-col gap-4">
        <p className="font-montserrat text-2xl font-bold leading-8 text-white">
          {SECTION_EYEBROW}
        </p>
        <hr className="w-full border-t border-[#2e3940]" />
        <h2 className="font-montserrat text-4xl font-bold leading-tight tracking-tight text-[#ffea9e] sm:text-5xl lg:text-[57px] lg:leading-[64px]">
          ALL KUDOS
        </h2>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col gap-8">
          {ALL_KUDOS.map((kudo) => (
            <KudoCard key={kudo.id} kudo={kudo} />
          ))}
        </div>
        <KudosSidebar />
      </div>
    </section>
  );
}
