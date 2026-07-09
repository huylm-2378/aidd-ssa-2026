import { describe, it, expect } from "vitest";
import { mapKudoRow, mapStats, formatTimeRange } from "./map";
import type { KudoRow } from "./types";

const baseRow: KudoRow = {
  id: "k1",
  title: "IDOL GIỚI TRẺ",
  body: "cảm ơn",
  hashtags: ["#Dedicated", "#Inspring"],
  image_urls: ["ph1", "ph2"],
  department: "CEVC",
  like_count: 1000,
  is_anonymous: false,
  created_at: "2025-10-30T03:00:00Z", // 10:00 in Asia/Ho_Chi_Minh (+07)
  sender_name: null,
  sender_avatar: null,
  sender: { name: "Huỳnh Dương Xuân Nhật", role_code: "CEVC10", tier: "New Hero", avatar_url: null },
  receiver: { name: "Trần Minh Anh", role_code: "CEVC19", tier: "Legend Hero", avatar_url: null },
};

describe("mapKudoRow", () => {
  it("maps a row to the KudoCard view shape", () => {
    const card = mapKudoRow(baseRow);
    expect(card.id).toBe("k1");
    expect(card.senderName).toBe("Huỳnh Dương Xuân Nhật");
    expect(card.senderRole).toBe("CEVC10");
    expect(card.receiverName).toBe("Trần Minh Anh");
    expect(card.receiverTier).toBe("Legend Hero");
    expect(card.hashtags).toEqual(["#Dedicated", "#Inspring"]);
    expect(card.likeCount).toBe(1000);
    expect(card.department).toBe("CEVC");
    expect(card.photos).toHaveLength(2);
  });

  it("uses the logged-in user (sender_name/avatar) over the sunner join, without role/tier", () => {
    const card = mapKudoRow({
      ...baseRow,
      sender_name: "Lê Minh Huy",
      sender_avatar: "https://example.com/a.png",
    });
    expect(card.senderName).toBe("Lê Minh Huy");
    expect(card.senderAvatar).toBe("https://example.com/a.png");
    // A logged-in sender isn't in the sunner directory → no role/tier badge.
    expect(card.senderRole).toBe("");
    expect(card.senderTier).toBe("");
  });

  it("anonymous overrides the logged-in sender name", () => {
    const card = mapKudoRow({ ...baseRow, sender_name: "Lê Minh Huy", is_anonymous: true });
    expect(card.senderName).toBe("Người ẩn danh");
    expect(card.senderAvatar).toBeUndefined();
  });

  it("hides the sender when anonymous", () => {
    const card = mapKudoRow({ ...baseRow, is_anonymous: true });
    expect(card.senderName).toBe("Người ẩn danh");
    expect(card.senderRole).toBe("");
    expect(card.senderAvatar).toBeUndefined();
    // Receiver is still shown.
    expect(card.receiverName).toBe("Trần Minh Anh");
  });

  it("falls back gracefully when a joined person or arrays are missing", () => {
    const card = mapKudoRow({
      ...baseRow,
      sender: null,
      hashtags: null,
      image_urls: null,
    });
    expect(card.senderName).toBe("Sunner");
    expect(card.hashtags).toEqual([]);
    expect(card.photos).toBeUndefined();
  });

  it("defaults likedByMe to false when the second arg is omitted", () => {
    const card = mapKudoRow(baseRow);
    expect(card.likedByMe).toBe(false);
  });

  it("sets likedByMe to true when passed true", () => {
    const card = mapKudoRow(baseRow, true);
    expect(card.likedByMe).toBe(true);
  });

  it("sets likedByMe to false when passed false explicitly", () => {
    const card = mapKudoRow(baseRow, false);
    expect(card.likedByMe).toBe(false);
  });
});

describe("formatTimeRange", () => {
  it("formats an ISO timestamp as HH:MM - MM/DD/YYYY in Asia/Ho_Chi_Minh", () => {
    expect(formatTimeRange("2025-10-30T03:00:00Z")).toBe("10:00 - 10/30/2025");
  });

  it("returns empty string for an invalid date", () => {
    expect(formatTimeRange("not-a-date")).toBe("");
  });
});

describe("mapStats", () => {
  it("maps the stats row to the 5 sidebar rows", () => {
    const rows = mapStats({
      received: 25,
      sent: 25,
      hearts: 25,
      secret_box_opened: 25,
      secret_box_unopened: 25,
    });
    expect(rows).toHaveLength(5);
    expect(rows[0]).toEqual({ label: "stats.received", value: "25" });
    expect(rows[4].label).toBe("stats.secretUnopened");
  });

  it("defaults to zeros when the stats row is missing", () => {
    const rows = mapStats(null);
    expect(rows.every((r) => r.value === "0")).toBe(true);
  });
});
