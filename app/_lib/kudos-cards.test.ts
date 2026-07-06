import { describe, it, expect } from "vitest";
import {
  filterKudos,
  getHighlightKudos,
  HIGHLIGHT_KUDOS,
  type KudoFilter,
} from "./kudos-cards";
import type { KudoCard } from "./kudos-shared";

const CARD = (overrides: Partial<KudoCard>): KudoCard => ({
  id: "id",
  senderName: "Sender",
  senderRole: "R1",
  senderTier: "New Hero",
  receiverName: "Receiver",
  receiverRole: "R2",
  receiverTier: "New Hero",
  timeRange: "10:00 - 01/01/2026",
  title: "Title",
  body: "Body",
  hashtags: [],
  likeCount: 0,
  department: "CEVC",
  ...overrides,
});

describe("getHighlightKudos (F003 FIX 2)", () => {
  it("sorts by likeCount descending", () => {
    const cards = [
      CARD({ id: "a", likeCount: 10 }),
      CARD({ id: "b", likeCount: 50 }),
      CARD({ id: "c", likeCount: 30 }),
    ];

    expect(getHighlightKudos(cards).map((c) => c.id)).toEqual(["b", "c", "a"]);
  });

  it("limits to the given count (default 5)", () => {
    const cards = Array.from({ length: 8 }, (_, i) =>
      CARD({ id: `c${i}`, likeCount: i }),
    );

    expect(getHighlightKudos(cards)).toHaveLength(5);
    expect(getHighlightKudos(cards, 2)).toHaveLength(2);
  });

  it("keeps stable order for ties", () => {
    const cards = [
      CARD({ id: "a", likeCount: 10 }),
      CARD({ id: "b", likeCount: 10 }),
    ];

    expect(getHighlightKudos(cards).map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("does not mutate the source array", () => {
    const cards = [CARD({ id: "a", likeCount: 1 }), CARD({ id: "b", likeCount: 2 })];
    const copy = [...cards];

    getHighlightKudos(cards);

    expect(cards).toEqual(copy);
  });

  it("reflects real HIGHLIGHT_KUDOS mock data sorted by likeCount", () => {
    const result = getHighlightKudos(HIGHLIGHT_KUDOS);
    const likeCounts = result.map((c) => c.likeCount);

    expect(likeCounts).toEqual([...likeCounts].sort((a, b) => b - a));
  });
});

describe("filterKudos (F003 FIX 3)", () => {
  const cards = [
    CARD({ id: "a", hashtags: ["#Dedicated"], department: "CEVC" }),
    CARD({ id: "b", hashtags: ["#Teamwork"], department: "Product" }),
    CARD({ id: "c", hashtags: ["#Dedicated", "#Teamwork"], department: "CEVC" }),
  ];

  it("returns all cards when no filter is given", () => {
    expect(filterKudos(cards)).toHaveLength(3);
  });

  it("filters by hashtag only", () => {
    const filter: KudoFilter = { hashtag: "#Teamwork" };
    expect(filterKudos(cards, filter).map((c) => c.id)).toEqual(["b", "c"]);
  });

  it("filters by department only", () => {
    const filter: KudoFilter = { department: "CEVC" };
    expect(filterKudos(cards, filter).map((c) => c.id)).toEqual(["a", "c"]);
  });

  it("combines hashtag and department with AND", () => {
    const filter: KudoFilter = { hashtag: "#Teamwork", department: "CEVC" };
    expect(filterKudos(cards, filter).map((c) => c.id)).toEqual(["c"]);
  });

  it("returns an empty array when nothing matches", () => {
    const filter: KudoFilter = { hashtag: "#Nope" };
    expect(filterKudos(cards, filter)).toEqual([]);
  });

  it("treats null hashtag/department as 'Tất cả' (no-op)", () => {
    const filter: KudoFilter = { hashtag: null, department: null };
    expect(filterKudos(cards, filter)).toHaveLength(3);
  });
});
