import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileIdentity from "./profile-identity";

describe("ProfileIdentity", () => {
  it("renders the name, default department and the tier badge image", () => {
    render(<ProfileIdentity name="Trần Minh Anh" />);
    expect(screen.getByText("Trần Minh Anh")).toBeInTheDocument();
    expect(screen.getByText("CEVC3")).toBeInTheDocument();
    const badge = screen.getByAltText("Legend Hero");
    expect(badge.tagName).toBe("IMG");
    expect(badge).toHaveAttribute("src", expect.stringContaining("/profiles/"));
  });

  it("renders a custom department and tier when provided", () => {
    render(
      <ProfileIdentity name="Lê Minh Huy" department="CEVC10" tier="Rising Hero" />,
    );
    expect(screen.getByText("CEVC10")).toBeInTheDocument();
    expect(screen.getByAltText("Rising Hero")).toBeInTheDocument();
  });

  it("renders the icon-collection label and exactly 7 circular slots", () => {
    render(<ProfileIdentity name="Trần Minh Anh" />);
    expect(screen.getByText("Bộ sưu tập icon của tôi")).toBeInTheDocument();
    const slots = document.querySelectorAll('[data-testid="icon-slot"]');
    expect(slots).toHaveLength(7);
    for (const slot of slots) expect(slot).toHaveClass("rounded-full");
  });
});
