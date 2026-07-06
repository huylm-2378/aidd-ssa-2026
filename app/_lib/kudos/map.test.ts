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
    expect(rows[0]).toEqual({ label: "Số Kudos bạn nhận được:", value: "25" });
    expect(rows[4].label).toBe("Số Secret Box chưa mở:");
  });

  it("defaults to zeros when the stats row is missing", () => {
    const rows = mapStats(null);
    expect(rows.every((r) => r.value === "0")).toBe(true);
  });
});
