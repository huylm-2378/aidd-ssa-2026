"use client";

import { useState } from "react";
import type { KudoCard as KudoCardData } from "../../_lib/kudos-shared";
import {
  DEFAULT_KUDOS_TAB,
  splitKudosByUser,
  type KudoSplit,
} from "../../_lib/profile/split-kudos";
import KudoCard from "../sun-kudos/kudo-card";
import FilterDropdown from "../sun-kudos/filter-dropdown";

type View = keyof KudoSplit;

const VIEW_LABEL: Record<View, string> = {
  sent: "Đã gửi",
  received: "Đã nhận",
};

const VIEW_OPTIONS: readonly string[] = [VIEW_LABEL.sent, VIEW_LABEL.received];

const EMPTY_MESSAGE = "Chưa có Kudo nào";

/**
 * Profile Kudos section (F009 FR-007/008/009): the shared "Sun* Annual
 * Awards 2025 / KUDOS" title band plus a Sent/Received toggle over the
 * current user's own kudos. Filtering is entirely client-side against the
 * full kudos set the server page passed down — switching tabs never
 * refetches. This is the only client component in the profile feature.
 */
export default function ProfileKudosSection({
  kudos,
  currentUserName,
}: {
  kudos: readonly KudoCardData[];
  currentUserName: string;
}) {
  const [view, setView] = useState<View>(DEFAULT_KUDOS_TAB);

  const { sent, received } = splitKudosByUser(kudos, currentUserName);
  const active = view === "sent" ? sent : received;

  // FilterDropdown always renders a "Tất cả" clear row that reports `null`;
  // this toggle has no "all" state, so a clear click clamps back to default.
  const handleViewChange = (value: string | null) => {
    if (value === VIEW_LABEL.sent) setView("sent");
    else if (value === VIEW_LABEL.received) setView("received");
    else setView(DEFAULT_KUDOS_TAB);
  };

  return (
    <section className="flex flex-col gap-10 py-16" aria-label="Kudos của bạn">
      <header className="flex flex-col gap-4">
        <p className="font-montserrat text-2xl font-bold leading-8 text-white">
          Sun* Annual Awards 2025
        </p>
        <hr className="w-full border-t border-[#2e3940]" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-montserrat text-[57px] font-bold leading-[64px] text-[#ffea9e]">
            KUDOS
          </h2>
          <FilterDropdown
            label={VIEW_LABEL[view]}
            options={VIEW_OPTIONS}
            selected={VIEW_LABEL[view]}
            display={`${VIEW_LABEL[view]} (${active.length})`}
            onChange={handleViewChange}
          />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[680px] flex-col gap-8">
        {active.length === 0 ? (
          <p
            role="status"
            className="py-12 text-center font-montserrat text-lg font-bold text-[#999]"
          >
            {EMPTY_MESSAGE}
          </p>
        ) : (
          active.map((kudo) => <KudoCard key={kudo.id} kudo={kudo} />)
        )}
      </div>
    </section>
  );
}
