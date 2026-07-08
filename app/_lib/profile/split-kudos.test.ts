import { describe, it, expect } from "vitest";
import { splitKudosByUser } from "./split-kudos";
import type { KudoCard } from "../kudos-shared";

/** Minimal KudoCard fixture; only sender/receiver names matter for this logic. */
function card(id: string, senderName: string, receiverName: string): KudoCard {
  return {
    id,
    senderName,
    senderRole: "CEVC10",
    senderTier: "New Hero",
    receiverName,
    receiverRole: "CEVC19",
    receiverTier: "Legend Hero",
    timeRange: "10:00 - 10/30/2025",
    title: "Cảm ơn",
    body: "Cảm ơn vì tất cả",
    hashtags: [],
    likeCount: 0,
    department: "CEVC",
  };
}

describe("splitKudosByUser", () => {
  const currentUser = "Lê Minh Huy";
  const kudos: KudoCard[] = [
    card("k1", currentUser, "Trần Minh Anh"), // sent
    card("k2", "Huỳnh Dương Xuân Nhật", currentUser), // received
    card("k3", "Người ẩn danh", "Trần Minh Anh"), // neither
  ];

  it("partitions kudos the user sent (senderName exact match)", () => {
    const { sent } = splitKudosByUser(kudos, currentUser);
    expect(sent).toHaveLength(1);
    expect(sent[0].id).toBe("k1");
  });

  it("partitions kudos the user received (receiverName exact match)", () => {
    const { received } = splitKudosByUser(kudos, currentUser);
    expect(received).toHaveLength(1);
    expect(received[0].id).toBe("k2");
  });

  it("returns both empty when the name matches neither sender nor receiver", () => {
    const result = splitKudosByUser(kudos, "Nguyễn Văn A");
    expect(result.sent).toEqual([]);
    expect(result.received).toEqual([]);
  });

  it("returns both empty for an empty kudos list", () => {
    const result = splitKudosByUser([], currentUser);
    expect(result).toEqual({ sent: [], received: [] });
  });

  it("returns both empty when the name is empty or whitespace", () => {
    expect(splitKudosByUser(kudos, "")).toEqual({ sent: [], received: [] });
    expect(splitKudosByUser(kudos, "   ")).toEqual({ sent: [], received: [] });
  });

  it("an anonymous sender never counts as sent for a real user's name", () => {
    // k3's sender was anonymized to "Người ẩn danh", which never equals a
    // real display name — so it can't accidentally match as "sent" for
    // whoever actually sent it.
    const result = splitKudosByUser(kudos, currentUser);
    expect(result.sent.map((c) => c.id)).not.toContain("k3");
  });

  it("includes a self-kudo in both sent and received", () => {
    const selfKudo = card("k4", currentUser, currentUser);
    const result = splitKudosByUser([...kudos, selfKudo], currentUser);
    expect(result.sent.map((c) => c.id)).toContain("k4");
    expect(result.received.map((c) => c.id)).toContain("k4");
  });
});
