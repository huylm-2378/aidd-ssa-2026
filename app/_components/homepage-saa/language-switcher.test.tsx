import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithLang } from "../../_lib/i18n/test-utils";
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

// F014: selection now flows through `LanguageProvider` context instead of
// local state, so every render needs a provider. `renderWithLang` (default
// "vi") reproduces the old default-VN behavior for the F012 regression suite.
describe("LanguageSwitcher (F012)", () => {
  it("renders closed by default with the VN trigger", () => {
    renderWithLang(<LanguageSwitcher />);
    const trigger = getTrigger(false);

    expect(trigger).toHaveAttribute("aria-haspopup", "true");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("VN");
    // Panel should be closed, so EN button not visible
    expect(screen.queryByRole("button", { name: /EN/ })).not.toBeInTheDocument();
  });

  it("toggles the panel open on click, flipping aria-expanded", () => {
    renderWithLang(<LanguageSwitcher />);
    openPanel();

    const trigger = getTrigger(true);
    expect(trigger).toHaveTextContent("VN");
    // Both VN and EN buttons are now rendered in the panel
    expect(screen.getByRole("button", { name: /EN/ })).toBeInTheDocument();
  });

  it("both VN and EN rows render with flag images", () => {
    const { container } = renderWithLang(<LanguageSwitcher />);
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
    renderWithLang(<LanguageSwitcher />);
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
    renderWithLang(<LanguageSwitcher />);
    openPanel();

    fireEvent.click(screen.getByRole("button", { name: /EN/ }));

    const trigger = getTrigger(false);
    expect(trigger).toHaveTextContent("EN");
    // Panel should be closed
    expect(screen.queryByRole("button", { name: /VN/ })).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    renderWithLang(<LanguageSwitcher />);
    openPanel();

    fireEvent.keyDown(document, { key: "Escape" });

    const trigger = getTrigger(false);
    expect(trigger).toHaveFocus();
  });

  it("closes on outside mousedown", () => {
    renderWithLang(<LanguageSwitcher />);
    openPanel();

    fireEvent.mouseDown(document.body);

    getTrigger(false);
  });
});

// F014 AC-6/FR-005: setLang now flows through LanguageProvider context end-to-end.
describe("LanguageSwitcher context flow (F014)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("selecting EN persists the locale to localStorage via context", () => {
    renderWithLang(<LanguageSwitcher />);
    openPanel();

    fireEvent.click(screen.getByRole("button", { name: /EN/ }));

    expect(getTrigger(false)).toHaveTextContent("EN");
    expect(localStorage.getItem("saa-lang")).toBe("en");
  });
});
