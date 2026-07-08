import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileStats from "./profile-stats";
import type { SunnerStat } from "../../_lib/sun-kudos-content";

const stats: SunnerStat[] = [
  { label: "Số Kudos bạn nhận được:", value: "25" },
  { label: "Số Kudos bạn đã gửi:", value: "12" },
  { label: "Số tim bạn nhận được:", value: "40" },
  { label: "Số Secret Box bạn đã mở:", value: "3" },
  { label: "Số Secret Box chưa mở:", value: "2" },
];

describe("ProfileStats", () => {
  it("renders all 5 labels and their values", () => {
    render(<ProfileStats stats={stats} />);
    for (const { label } of stats) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders a divider element right before the Secret-Box row pair", () => {
    render(<ProfileStats stats={stats} />);
    const openedRow = screen.getByText("Số Secret Box bạn đã mở:").closest("div");
    const divider = openedRow?.previousElementSibling;
    expect(divider).not.toBeNull();
    expect(divider?.className).toMatch(/bg-\[#2e3940\]/);
  });

  it("does not render a divider before the first three rows", () => {
    render(<ProfileStats stats={stats} />);
    const receivedRow = screen.getByText("Số Kudos bạn nhận được:").closest("div");
    expect(receivedRow?.previousElementSibling).toBeNull();
  });

  it("renders an inert 'Mở Secret Box' button (no click handler wired)", () => {
    render(<ProfileStats stats={stats} />);
    const button = screen.getByRole("button", { name: "Mở Secret Box" });
    expect(button).toHaveAttribute("type", "button");
  });
});
