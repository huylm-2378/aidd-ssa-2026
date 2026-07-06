import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import KudoAvatar from "./kudos-avatar";

describe("KudoAvatar", () => {
  it("renders a plain <img> with the exact remote src (no next/image host whitelist needed)", () => {
    const url = "https://lh3.googleusercontent.com/a/ABC123=s96-c";
    render(<KudoAvatar name="Lê Minh Huy" src={url} />);
    const img = screen.getByRole("img", { name: "Lê Minh Huy" });
    // next/image would rewrite src to /_next/image?url=... — a plain <img> keeps it verbatim.
    expect(img.getAttribute("src")).toBe(url);
  });

  it("falls back to initials when no src is given", () => {
    render(<KudoAvatar name="Huỳnh Dương Xuân" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("HD")).toBeInTheDocument();
  });
});
