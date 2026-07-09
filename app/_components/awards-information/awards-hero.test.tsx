import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithLang } from "../../_lib/i18n/test-utils";
import AwardsHero from "./awards-hero";

describe("AwardsHero (F014 VI/EN)", () => {
  it("renders the VN eyebrow and heading by default", () => {
    renderWithLang(<AwardsHero />, "vi");
    expect(screen.getByText("Sun* Annual Awards 2025")).toBeInTheDocument();
    expect(screen.getByText("Hệ thống giải thưởng SAA 2025")).toBeInTheDocument();
  });

  it("renders the translated EN heading (eyebrow stays the same brand string)", () => {
    renderWithLang(<AwardsHero />, "en");
    expect(screen.getByText("Sun* Annual Awards 2025")).toBeInTheDocument();
    expect(screen.getByText("SAA 2025 Awards System")).toBeInTheDocument();
  });
});
