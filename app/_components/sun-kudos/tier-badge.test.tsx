import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TierBadge from "./tier-badge";

describe("TierBadge", () => {
  it("renders nothing when tier is an empty string", () => {
    const { container } = render(<TierBadge tier="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the tier text when tier is provided", () => {
    render(<TierBadge tier="Legend Hero" />);
    expect(screen.getByText("Legend Hero")).toBeInTheDocument();
  });

  it("renders with the correct styling (gold border, gold-tinted background, dark text)", () => {
    render(<TierBadge tier="Rising Hero" />);
    const badge = screen.getByText("Rising Hero");
    expect(badge.className).toMatch(/rounded-full/);
    expect(badge.className).toMatch(/border-\[#ffea9e\]/);
    expect(badge.className).toMatch(/bg-\[#ffea9e\]\/20/);
    expect(badge.className).toMatch(/text-\[#8a6d1a\]/);
  });

  it("renders with montserrat font and bold weight", () => {
    render(<TierBadge tier="New Hero" />);
    const badge = screen.getByText("New Hero");
    expect(badge.className).toMatch(/font-montserrat/);
    expect(badge.className).toMatch(/font-bold/);
  });
});
