import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { vi } from "vitest";
import { renderWithLang } from "../../_lib/i18n/test-utils";
import { vi as viCatalog } from "../../_lib/i18n/vi";
import { en as enCatalog } from "../../_lib/i18n/en";
import Hero from "./hero";

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

// Stable countdown so the hero renders deterministic label text regardless
// of the actual event date/system clock.
vi.mock("../../_lib/use-countdown", () => ({
  useCountdown: () => ({ days: "05", hours: "12", minutes: "30", isPending: false }),
}));

// F014 AC-4: proves a migrated homepage component flips VI <-> EN live under
// the LanguageProvider.
describe("Hero (F014 i18n migration)", () => {
  it("renders VI copy by default", () => {
    renderWithLang(<Hero />, "vi");
    expect(screen.getByText(viCatalog["hero.timeLabel"])).toBeInTheDocument();
    expect(screen.getByText(viCatalog["hero.broadcastNote"])).toBeInTheDocument();
  });

  it("renders EN copy when the locale is en", () => {
    renderWithLang(<Hero />, "en");
    expect(screen.getByText(enCatalog["hero.timeLabel"])).toBeInTheDocument();
    expect(screen.getByText(enCatalog["hero.broadcastNote"])).toBeInTheDocument();
  });

  it("renders EN countdown tile labels when the locale is en", () => {
    renderWithLang(<Hero />, "en");
    expect(screen.getByText(enCatalog["countdown.days"])).toBeInTheDocument();
  });
});
