import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfileKudosSection from "./profile-kudos-section";
import type { KudoCard } from "../../_lib/kudos-shared";

const CURRENT_USER = "Lê Minh Huy";

/** Minimal KudoCard fixture; only id/sender/receiver/title matter for this suite. */
function card(
  id: string,
  senderName: string,
  receiverName: string,
  title: string,
): KudoCard {
  return {
    id,
    senderName,
    senderRole: "CEVC10",
    senderTier: "New Hero",
    receiverName,
    receiverRole: "CEVC19",
    receiverTier: "Legend Hero",
    timeRange: "10:00 - 10/30/2025",
    title,
    body: "Cảm ơn vì tất cả",
    hashtags: [],
    likeCount: 0,
    department: "CEVC",
  };
}

const kudos: KudoCard[] = [
  card("k1", CURRENT_USER, "Trần Minh Anh", "Sent1"),
  card("k2", CURRENT_USER, "Huỳnh Dương Xuân Nhật", "Sent2"),
  card("k3", "Trần Minh Anh", CURRENT_USER, "Recv1"),
  card("k4", "Huỳnh Dương Xuân Nhật", CURRENT_USER, "Recv2"),
  card("k5", "Người ẩn danh", CURRENT_USER, "Recv3"),
];

describe("ProfileKudosSection", () => {
  it("defaults to the sent subset with the dropdown label showing its count", () => {
    render(<ProfileKudosSection kudos={kudos} currentUserName={CURRENT_USER} />);

    expect(
      screen.getByRole("button", { name: /Đã gửi \(2\)/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sent1")).toBeInTheDocument();
    expect(screen.getByText("Sent2")).toBeInTheDocument();
    expect(screen.queryByText("Recv1")).toBeNull();
  });

  it("switching to Đã nhận re-filters to the received subset without a reload", () => {
    render(<ProfileKudosSection kudos={kudos} currentUserName={CURRENT_USER} />);

    fireEvent.click(screen.getByRole("button", { name: /Đã gửi/ }));
    fireEvent.click(screen.getByRole("option", { name: "Đã nhận" }));

    expect(
      screen.getByRole("button", { name: /Đã nhận \(3\)/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Recv1")).toBeInTheDocument();
    expect(screen.getByText("Recv2")).toBeInTheDocument();
    expect(screen.getByText("Recv3")).toBeInTheDocument();
    expect(screen.queryByText("Sent1")).toBeNull();
    expect(screen.queryByText("Sent2")).toBeNull();
  });

  it("shows a graceful empty-state when the active subset is empty", () => {
    render(<ProfileKudosSection kudos={kudos} currentUserName="Nguyễn Văn A" />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});
