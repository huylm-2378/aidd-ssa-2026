import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LanguageSwitcher from "./language-switcher";

// Only the trigger carries `aria-expanded`, so `{ expanded }` uniquely
// targets it even though a highlighted row can share its accessible name
// (flag alt text + language code).
function getTrigger(expanded: boolean) {
  return screen.getByRole("button", { expanded });
}

function openPanel() {
  fireEvent.click(getTrigger(false));
}

describe("LanguageSwitcher (F012)", () => {
  it("renders closed by default with the VN trigger", () => {
    render(<LanguageSwitcher />);
    const trigger = getTrigger(false);

    expect(trigger).toHaveAttribute("aria-haspopup", "true");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("VN");
    // Panel should be closed, so EN button not visible
    expect(screen.queryByRole("button", { name: /EN/ })).not.toBeInTheDocument();
  });

  it("toggles the panel open on click, flipping aria-expanded", () => {
    render(<LanguageSwitcher />);
    openPanel();

    const trigger = getTrigger(true);
    expect(trigger).toHaveTextContent("VN");
    // Both VN and EN buttons are now rendered in the panel
    expect(screen.getByRole("button", { name: /EN/ })).toBeInTheDocument();
  });

  it("both VN and EN rows render with flag images", () => {
    const { container } = render(<LanguageSwitcher />);
    openPanel();

    // Flags are decorative (alt=""), so we query the DOM directly for img elements
    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBeGreaterThanOrEqual(2); // trigger flag + at least VN row flag

    // Check VN flag src (trigger)
    expect(Array.from(imgs).some((img) =>
      img.src.includes("VN") && img.src.includes("Vietnam"),
    )).toBe(true);

    // Check EN flag has correct src (row) - also with URL encoding
    expect(Array.from(imgs).some(
      (img) =>
        img.src.includes("GB-NIR") && img.src.includes("Northern%20Ireland"),
    )).toBe(true);
  });

  it("VN row is highlighted by default (active language)", () => {
    render(<LanguageSwitcher />);
    openPanel();

    // The trigger shares the text "VN" as the active row, so grab all matches
    // and check the last one (the row is rendered after the trigger in the panel).
    const vnMatches = screen.getAllByRole("button", { name: /^VN$/ });
    const vnRow = vnMatches[vnMatches.length - 1];
    const enRow = screen.getByRole("button", { name: /^EN$/ });

    expect(vnRow.className).toContain("bg-[#ffea9e]/20");
    expect(enRow.className).not.toContain("bg-[#ffea9e]/20");
  });

  it("selecting EN updates the trigger and closes the panel", () => {
    render(<LanguageSwitcher />);
    openPanel();

    fireEvent.click(screen.getByRole("button", { name: /EN/ }));

    const trigger = getTrigger(false);
    expect(trigger).toHaveTextContent("EN");
    // Panel should be closed
    expect(screen.queryByRole("button", { name: /VN/ })).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    render(<LanguageSwitcher />);
    openPanel();

    fireEvent.keyDown(document, { key: "Escape" });

    const trigger = getTrigger(false);
    expect(trigger).toHaveFocus();
  });

  it("closes on outside mousedown", () => {
    render(<LanguageSwitcher />);
    openPanel();

    fireEvent.mouseDown(document.body);

    getTrigger(false);
  });
});
