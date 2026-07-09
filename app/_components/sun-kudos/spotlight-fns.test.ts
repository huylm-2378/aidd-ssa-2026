import { describe, it, expect } from "vitest";
import {
  buildActivityEntry,
  buildNameById,
  formatTickerTime,
  matchesQuery,
  normalizeForSearch,
  positionOf,
  toneOf,
  weightOf,
} from "./spotlight-fns";

describe("weightOf", () => {
  it("is deterministic — same index always yields the same weight", () => {
    expect(weightOf(3)).toBe(weightOf(3));
  });

  it("stays within the 1-5 range for a range of indices", () => {
    for (let i = 0; i < 50; i++) {
      const w = weightOf(i);
      expect(w).toBeGreaterThanOrEqual(1);
      expect(w).toBeLessThanOrEqual(5);
    }
  });
});

describe("positionOf", () => {
  it("is deterministic — same index always yields the same position", () => {
    expect(positionOf(7)).toEqual(positionOf(7));
  });

  it("keeps leftPct/topPct within the 5-95% safe band", () => {
    for (let i = 0; i < 50; i++) {
      const { leftPct, topPct } = positionOf(i);
      expect(leftPct).toBeGreaterThanOrEqual(5);
      expect(leftPct).toBeLessThan(95);
      expect(topPct).toBeGreaterThanOrEqual(5);
      expect(topPct).toBeLessThan(95);
    }
  });

  it("does not pin index 0 to the top-left corner (regression: seats it at centre)", () => {
    const { leftPct, topPct } = positionOf(0);
    expect(leftPct).toBeCloseTo(50, 1);
    expect(topPct).toBeCloseTo(50, 1);
  });

  it("distributes names evenly across all four quadrants (regression: no empty left gutter)", () => {
    const quadrants = { tl: 0, tr: 0, bl: 0, br: 0 };
    const N = 60;
    for (let i = 0; i < N; i++) {
      const { leftPct, topPct } = positionOf(i);
      const left = leftPct < 50;
      const top = topPct < 50;
      if (top && left) quadrants.tl++;
      else if (top && !left) quadrants.tr++;
      else if (!top && left) quadrants.bl++;
      else quadrants.br++;
    }
    // Even coverage: every quadrant populated, none hogging (< 40% of the total).
    for (const count of Object.values(quadrants)) {
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThan(N * 0.4);
    }
  });
});

describe("toneOf", () => {
  it("weight >= 5 is gold", () => {
    expect(toneOf(5)).toBe("text-[#ffea9e]");
  });

  it("weight 4 is white", () => {
    expect(toneOf(4)).toBe("text-white");
  });

  it("weight below 4 is dimmed", () => {
    expect(toneOf(1)).toBe("text-white/50");
    expect(toneOf(3)).toBe("text-white/50");
  });
});

describe("normalizeForSearch", () => {
  it("strips NFD-decomposable diacritics and lowercases", () => {
    expect(normalizeForSearch("Huỳnh Dương")).toBe("huynh duong");
  });

  it("maps Vietnamese đ/Đ to d (NFD does not decompose it)", () => {
    expect(normalizeForSearch("Đặng Hải")).toBe("dang hai");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeForSearch("  Trần Minh Anh  ")).toBe("tran minh anh");
  });
});

describe("matchesQuery", () => {
  it("an empty (or whitespace-only) query matches everything", () => {
    expect(matchesQuery("Nguyễn Văn A", "")).toBe(true);
    expect(matchesQuery("Nguyễn Văn A", "   ")).toBe(true);
  });

  it("matches case- and diacritic-insensitively as a substring", () => {
    expect(matchesQuery("Vũ Ngọc Mai Dương", "duong")).toBe(true);
    expect(matchesQuery("Vũ Ngọc Mai Dương", "DƯƠNG")).toBe(true);
  });

  it("returns false when the query does not occur in the name", () => {
    expect(matchesQuery("Vũ Ngọc Mai", "xyz")).toBe(false);
  });
});

describe("buildNameById", () => {
  it("builds a Map with every sunner id resolving to its name", () => {
    const map = buildNameById([
      { id: "s1", name: "Nguyễn Hoàng Linh" },
      { id: "s2", name: "Trần Minh Anh" },
    ]);
    expect(map.get("s1")).toBe("Nguyễn Hoàng Linh");
    expect(map.get("s2")).toBe("Trần Minh Anh");
    expect(map.size).toBe(2);
  });
});

describe("buildActivityEntry", () => {
  const nameById = buildNameById([{ id: "s1", name: "Nguyễn Bá Chức" }]);
  // Callers pass the phrase pre-translated via t("spotlight.receivedKudos") (F014).
  const RECEIVED_VI = "đã nhận được một Kudos mới";

  it("resolves a known receiver id to a ticker line", () => {
    const entry = buildActivityEntry(
      { receiver_id: "s1", created_at: "2025-10-30T13:30:00Z" },
      nameById,
      RECEIVED_VI,
    );
    expect(entry).toBe("08:30PM Nguyễn Bá Chức đã nhận được một Kudos mới");
  });

  it("falls back to 'Someone' for a null receiver id", () => {
    const entry = buildActivityEntry(
      { receiver_id: null, created_at: "2025-10-30T13:30:00Z" },
      nameById,
      RECEIVED_VI,
    );
    expect(entry).toContain("Someone đã nhận được một Kudos mới");
  });

  it("falls back to 'Someone' for an unknown receiver id", () => {
    const entry = buildActivityEntry(
      { receiver_id: "unknown-id", created_at: "2025-10-30T13:30:00Z" },
      nameById,
      RECEIVED_VI,
    );
    expect(entry).toContain("Someone đã nhận được một Kudos mới");
  });

  it("renders the ticker line in EN when given the EN phrase", () => {
    const entry = buildActivityEntry(
      { receiver_id: "s1", created_at: "2025-10-30T13:30:00Z" },
      nameById,
      "received a new Kudos",
    );
    expect(entry).toBe("08:30PM Nguyễn Bá Chức received a new Kudos");
  });
});

describe("formatTickerTime", () => {
  it("formats a fixed ISO timestamp as HH:MMPM in Asia/Ho_Chi_Minh", () => {
    // 13:30 UTC -> 20:30 (+07) -> 08:30PM.
    expect(formatTickerTime("2025-10-30T13:30:00Z")).toBe("08:30PM");
  });

  it("has no internal space and an uppercase meridiem", () => {
    const result = formatTickerTime("2025-10-30T13:30:00Z");
    expect(result).not.toMatch(/\s/);
    expect(result).toMatch(/[AP]M$/);
  });

  it("returns an empty string for an invalid date", () => {
    expect(formatTickerTime("not-a-date")).toBe("");
  });
});
