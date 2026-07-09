import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithLang } from "../../_lib/i18n/test-utils";
import AwardDetailSection from "./award-detail-section";
import { AWARD_CATEGORIES } from "../../_lib/award-categories";

const topTalent = AWARD_CATEGORIES.find((a) => a.slug === "top-talent")!;
const signature = AWARD_CATEGORIES.find((a) => a.slug === "signature-2025-creator")!;

describe("AwardDetailSection (F014 VI/EN)", () => {
  it("renders VN copy by default: long description, labels, quantity unit, prize note", () => {
    renderWithLang(<AwardDetailSection award={topTalent} index={0} />, "vi");
    expect(screen.getByText(topTalent.longDescription)).toBeInTheDocument();
    expect(screen.getByText("Số lượng giải thưởng:")).toBeInTheDocument();
    expect(screen.getByText("Giá trị giải thưởng:")).toBeInTheDocument();
    expect(screen.getByText("Cá nhân")).toBeInTheDocument();
    expect(screen.getByText("cho mỗi giải thưởng")).toBeInTheDocument();
  });

  it("renders translated EN copy for the same award", () => {
    renderWithLang(<AwardDetailSection award={topTalent} index={0} />, "en");
    expect(
      screen.getByText(/Top Talent award honors all-round outstanding individuals/),
    ).toBeInTheDocument();
    expect(screen.getByText("Number of awards:")).toBeInTheDocument();
    expect(screen.getByText("Prize value:")).toBeInTheDocument();
    expect(screen.getByText("Individual")).toBeInTheDocument();
    expect(screen.getByText("per award")).toBeInTheDocument();
  });

  it("translates the 'Hoặc'/'Or' separator and both prize notes for a multi-prize award", () => {
    renderWithLang(<AwardDetailSection award={signature} index={0} />, "en");
    expect(screen.getByText("Or")).toBeInTheDocument();
    expect(screen.getByText("for the individual award")).toBeInTheDocument();
    expect(screen.getByText("for the team award")).toBeInTheDocument();
    expect(screen.getByText("Individual or Team")).toBeInTheDocument();
  });

  // Tripwire: a future award added to AWARD_CATEGORIES with a quantityUnit or
  // prize note missing from the component's key lookups would silently render
  // untranslated VI text in EN mode. Render EVERY award under EN and assert no
  // Vietnamese diacritics leak (award name images are alt-text only).
  it("renders every award fully translated under EN (no VI diacritics leak)", () => {
    const viDiacritics = /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;
    for (const award of AWARD_CATEGORIES) {
      const { container, unmount } = renderWithLang(
        <AwardDetailSection award={award} index={0} />,
        "en",
      );
      // Monetary values ("7.000.000 VNĐ") are untranslated data — drop them
      // before asserting so only genuine copy leaks trip the check.
      let text = container.textContent ?? "";
      for (const prize of award.prizes) text = text.replaceAll(prize.value, "");
      expect(text).not.toMatch(viDiacritics);
      unmount();
    }
  });
});
