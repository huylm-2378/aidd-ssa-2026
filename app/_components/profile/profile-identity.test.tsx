import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileIdentity from "./profile-identity";

describe("ProfileIdentity", () => {
  it("renders the name and default department + tier", () => {
    render(<ProfileIdentity name="Trần Minh Anh" />);
    expect(screen.getByText("Trần Minh Anh")).toBeInTheDocument();
    expect(screen.getByText("CEVC3")).toBeInTheDocument();
    expect(screen.getByText("Legend Hero")).toBeInTheDocument();
  });

  it("renders a custom department and tier when provided", () => {
    render(
      <ProfileIdentity name="Lê Minh Huy" department="CEVC10" tier="Rising Hero" />,
    );
    expect(screen.getByText("CEVC10")).toBeInTheDocument();
    expect(screen.getByText("Rising Hero")).toBeInTheDocument();
  });

  it("renders the icon-collection label and exactly 7 decorative slots", () => {
    render(<ProfileIdentity name="Trần Minh Anh" />);
    expect(screen.getByText("Bộ sưu tập icon của tôi")).toBeInTheDocument();
    const slots = document.querySelectorAll('[data-testid="icon-slot"]');
    expect(slots).toHaveLength(7);
  });
});
