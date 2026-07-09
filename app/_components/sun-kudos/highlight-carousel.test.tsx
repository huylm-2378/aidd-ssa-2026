import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HighlightCarousel from "./highlight-carousel";
import { renderWithLang } from "../../_lib/i18n/test-utils";
import type { KudoCard as KudoCardData } from "../../_lib/kudos-cards";

const kudos: KudoCardData[] = [
  {
    id: "k1",
    senderName: "Huỳnh Dương Xuân Nhật",
    senderRole: "CEVC10",
    senderTier: "Rising Hero",
    receiverName: "Trần Minh Anh",
    receiverRole: "CEVC19",
    receiverTier: "Legend Hero",
    timeRange: "10:00 - 10/30/2025",
    title: "IDOL GIỚI TRẺ",
    body: "Cảm ơn em rất nhiều.",
    hashtags: ["#Dedicated"],
    likeCount: 10,
    department: "CEVC",
  },
  {
    id: "k2",
    senderName: "Trần Minh Anh",
    senderRole: "CEVC19",
    senderTier: "Legend Hero",
    receiverName: "Huỳnh Dương Xuân Nhật",
    receiverRole: "CEVC10",
    receiverTier: "Rising Hero",
    timeRange: "11:00 - 10/30/2025",
    title: "TEAM PLAYER",
    body: "Cảm ơn anh.",
    hashtags: ["#Teamwork"],
    likeCount: 5,
    department: "CEVC",
  },
];

describe("HighlightCarousel (F014 i18n round 3 — {current}/{total} interpolation)", () => {
  it("renders the VN page counter and arrow aria-labels by default", () => {
    render(<HighlightCarousel kudos={kudos} pageIndex={0} onPrev={vi.fn()} onNext={vi.fn()} />);

    expect(screen.getByLabelText("Trang 1 trên 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kudo trước" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kudo tiếp theo" })).toBeInTheDocument();
  });

  it("renders the interpolated EN page counter and arrow aria-labels when the active locale is EN", () => {
    renderWithLang(
      <HighlightCarousel kudos={kudos} pageIndex={1} onPrev={vi.fn()} onNext={vi.fn()} />,
      "en",
    );

    expect(screen.getByLabelText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous Kudo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next Kudo" })).toBeInTheDocument();
  });

  it("shows the VN empty state when there are no kudos", () => {
    render(<HighlightCarousel kudos={[]} pageIndex={0} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByText("Không có Kudo phù hợp")).toBeInTheDocument();
  });

  it("shows the EN empty state when there are no kudos and the active locale is EN", () => {
    renderWithLang(<HighlightCarousel kudos={[]} pageIndex={0} onPrev={vi.fn()} onNext={vi.fn()} />, "en");
    expect(screen.getByText("No Kudos match this filter")).toBeInTheDocument();
  });
});
