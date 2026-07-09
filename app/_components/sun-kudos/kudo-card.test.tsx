import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import KudoCard from "./kudo-card";
import type { KudoCard as KudoCardData } from "../../_lib/kudos-cards";

// KudoCard now renders HeartButton, which imports `toggleHeart` from a
// "use server" file (pulls in `next/headers`) -- that throws in jsdom.
// Precedent: write-kudo-modal.test.tsx:6-7 (F015 P03 R1).
vi.mock("../../sun-kudos/actions", () => ({
  toggleHeart: vi.fn(async () => ({ ok: true, liked: true, likeCount: 1 })),
}));

const baseKudo: KudoCardData = {
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
  hashtags: ["#Dedicated", "#Inspring"],
  likeCount: 1000,
  department: "CEVC",
};

describe("KudoCard", () => {
  it("renders the sender/receiver tier badges (guards the TierBadge extraction)", () => {
    render(<KudoCard kudo={baseKudo} />);
    expect(screen.getByText("Rising Hero")).toBeInTheDocument();
    expect(screen.getByText("Legend Hero")).toBeInTheDocument();
  });

  it("does not render a Spam pill when isSpam is omitted", () => {
    render(<KudoCard kudo={baseKudo} />);
    expect(screen.queryByText("Spam")).toBeNull();
  });

  it("does not render a Spam pill when isSpam is false", () => {
    render(<KudoCard kudo={baseKudo} isSpam={false} />);
    expect(screen.queryByText("Spam")).toBeNull();
  });

  it("renders a Spam pill top-right of the card when isSpam is true", () => {
    render(<KudoCard kudo={baseKudo} isSpam />);
    const pill = screen.getByText("Spam");
    expect(pill).toBeInTheDocument();
    expect(pill.className).toMatch(/absolute/);
    expect(pill.className).toMatch(/right-4/);
    expect(pill.className).toMatch(/top-4/);
  });
});
