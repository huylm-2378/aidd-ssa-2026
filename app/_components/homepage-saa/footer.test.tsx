import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { vi } from "vitest";
import { renderWithLang } from "../../_lib/i18n/test-utils";
import { vi as viCatalog } from "../../_lib/i18n/vi";
import { en as enCatalog } from "../../_lib/i18n/en";
import Footer from "./footer";

// Mock next/image and next/navigation the same way header.test.tsx does.
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

// F014 AC-4: proves a migrated chrome component flips VI <-> EN live under
// the LanguageProvider, not just at the hook level.
describe("Footer (F014 i18n migration)", () => {
  it("renders VI copyright text by default", () => {
    renderWithLang(<Footer />, "vi");
    expect(screen.getByText(viCatalog["footer.copyright"])).toBeInTheDocument();
  });

  it("renders EN copyright text when the locale is en", () => {
    renderWithLang(<Footer />, "en");
    expect(screen.getByText(enCatalog["footer.copyright"])).toBeInTheDocument();
  });

  it("renders EN nav labels when the locale is en", () => {
    renderWithLang(<Footer />, "en");
    expect(screen.getByRole("link", { name: enCatalog["nav.about"] })).toBeInTheDocument();
  });
});
