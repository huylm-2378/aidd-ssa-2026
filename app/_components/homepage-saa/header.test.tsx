import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Header from "./header";

// Mock next/image and next/link to avoid SSR hydration issues in tests.
vi.mock("next/image", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock AccountMenu to avoid Supabase initialization in tests.
vi.mock("./account-menu", () => ({
  default: () => <button type="button" aria-haspopup="menu" />,
}));

describe("Header (F012 integration)", () => {
  it("full header renders nav links, notification bell, and language switcher", () => {
    render(<Header />);

    // Nav should be visible
    expect(screen.getByRole("link", { name: /About SAA 2025/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Award Information/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sun\* Kudos/ })).toBeInTheDocument();

    // Notification bell should be visible
    expect(screen.getByRole("button", { name: /Notifications/ })).toBeInTheDocument();

    // Language switcher (trigger) should be visible
    expect(screen.getByRole("button", { expanded: false })).toBeInTheDocument();
    expect(screen.getByRole("button", { expanded: false })).toHaveTextContent("VN");
  });

  it("minimal header hides nav, bell, and account but shows language switcher (F012 FR-007)", () => {
    render(<Header minimal />);

    // Nav should NOT be visible
    expect(screen.queryByRole("link", { name: /About SAA 2025/ })).not.toBeInTheDocument();

    // Notification bell should NOT be visible
    expect(screen.queryByRole("button", { name: /Notifications/ })).not.toBeInTheDocument();

    // Account menu button should NOT be visible (it has aria-haspopup)
    const allHasPopupButtons = screen.queryAllByRole("button", { name: "" });
    const accountMenu = allHasPopupButtons.filter(
      (btn) => btn.getAttribute("aria-haspopup") === "menu"
    );
    expect(accountMenu.length).toBe(0);

    // BUT language switcher SHOULD still be visible
    expect(screen.getByRole("button", { expanded: false })).toBeInTheDocument();
    expect(screen.getByRole("button", { expanded: false })).toHaveTextContent("VN");
  });

  it("logo always renders in both header variants", () => {
    const { rerender } = render(<Header />);
    expect(screen.getByAltText(/Sun\* Annual Awards logo/)).toBeInTheDocument();

    rerender(<Header minimal />);
    expect(screen.getByAltText(/Sun\* Annual Awards logo/)).toBeInTheDocument();
  });
});
