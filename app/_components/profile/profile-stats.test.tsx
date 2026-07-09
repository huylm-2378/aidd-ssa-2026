import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileStats from "./profile-stats";
import { renderWithLang } from "../../_lib/i18n/test-utils";
import type { SunnerStat } from "../../_lib/sun-kudos-content";

const stats: SunnerStat[] = [
  { label: "stats.received", value: "25" },
  { label: "stats.sent", value: "12" },
  { label: "stats.hearts", value: "40" },
  { label: "stats.secretOpened", value: "3" },
  { label: "stats.secretUnopened", value: "2" },
];

describe("ProfileStats", () => {
  it("renders all 5 VI labels (default, no provider) and their values", () => {
    render(<ProfileStats stats={stats} />);
    expect(screen.getByText("Số Kudos bạn nhận được:")).toBeInTheDocument();
    expect(screen.getByText("Số Kudos bạn đã gửi:")).toBeInTheDocument();
    expect(screen.getByText("Số tim bạn nhận được:")).toBeInTheDocument();
    expect(screen.getByText("Số Secret Box bạn đã mở:")).toBeInTheDocument();
    expect(screen.getByText("Số Secret Box chưa mở:")).toBeInTheDocument();
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

  it("renders EN labels and button text when the active locale is EN", () => {
    renderWithLang(<ProfileStats stats={stats} />, "en");
    expect(screen.getByText("Kudos received:")).toBeInTheDocument();
    expect(screen.getByText("Secret Boxes unopened:")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open Secret Box" }),
    ).toBeInTheDocument();
  });
});
