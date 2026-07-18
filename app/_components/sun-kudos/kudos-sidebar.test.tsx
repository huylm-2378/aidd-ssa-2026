import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import KudosSidebar from "./kudos-sidebar";
import { renderWithLang } from "../../_lib/i18n/test-utils";
import type { SunnerStat, RecentGiftSunner } from "../../_lib/sun-kudos-content";
import type { SecretBoxState } from "../../_lib/secret-box/queries";

const stats: SunnerStat[] = [
  { label: "stats.received", value: "25" },
  { label: "stats.sent", value: "25" },
  { label: "stats.hearts", value: "25" },
  { label: "stats.secretOpened", value: "25" },
  { label: "stats.secretUnopened", value: "25" },
];

const secretBox: SecretBoxState = { authState: "authed", unopened: 2, opened: 3 };

const recentGifts: RecentGiftSunner[] = [
  { name: "Trần Minh Anh", note: "Nhận được 1 áo phông SAA" },
];

describe("KudosSidebar (F014 i18n regression)", () => {
  it("renders translated VN stat labels by default, not raw message keys", () => {
    render(<KudosSidebar stats={stats} recentGifts={recentGifts} secretBox={secretBox} />);
    expect(screen.getByText("Số Kudos bạn nhận được:")).toBeInTheDocument();
    expect(screen.getByText("Số Secret Box chưa mở:")).toBeInTheDocument();
    // No raw dot-namespaced key should ever leak into the DOM.
    expect(screen.queryByText("stats.received")).toBeNull();
    expect(screen.queryByText("stats.secretUnopened")).toBeNull();
  });

  it("renders translated EN stat labels when the active locale is EN", () => {
    renderWithLang(<KudosSidebar stats={stats} recentGifts={recentGifts} secretBox={secretBox} />, "en");
    expect(screen.getByText("Kudos received:")).toBeInTheDocument();
    expect(screen.getByText("Secret Boxes unopened:")).toBeInTheDocument();
  });

  it("renders the recent-gifts heading and Secret Box CTA in VN by default (F014 round 3)", () => {
    render(<KudosSidebar stats={stats} recentGifts={recentGifts} secretBox={secretBox} />);
    expect(screen.getByText("10 Sunner nhận quà mới nhất")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mở Secret Box" })).toBeInTheDocument();
  });

  it("renders the recent-gifts heading and Secret Box CTA in EN when the active locale is EN", () => {
    renderWithLang(<KudosSidebar stats={stats} recentGifts={recentGifts} secretBox={secretBox} />, "en");
    expect(screen.getByText("10 most recent Sunner gift recipients")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open Secret Box" })).toBeInTheDocument();
  });
});
