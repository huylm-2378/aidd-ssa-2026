import { BODY_LONG, BODY_SHORT, type KudoCard } from "./kudos-shared";

export type { KudoCard };
export { ALL_KUDOS } from "./all-kudos-data";

/**
 * Highlight Kudos mock data + pure helpers (F003), faithful to the MoMorph
 * frame "Sun* Kudos - Live board" (`MaZUn5xHXZ`). `ALL_KUDOS` and the shared
 * `KudoCard` shape live in sibling files (`all-kudos-data.ts`,
 * `kudos-shared.ts`) and are re-exported here so existing imports keep
 * working; see those files for the card shape and the "All Kudos" feed.
 */
export const HIGHLIGHT_KUDOS: readonly KudoCard[] = [
  {
    id: "hl-1",
    senderName: "Huỳnh Dương Xuân Nhật",
    senderRole: "CEVC10",
    senderTier: "Rising Hero",
    receiverName: "Trần Minh Anh",
    receiverRole: "CEVC19",
    receiverTier: "Legend Hero",
    timeRange: "10:00 - 10/30/2025",
    title: "IDOL GIỚI TRẺ",
    body: BODY_LONG,
    hashtags: ["#Dedicated", "#Inspring"],
    likeCount: 1000,
    department: "CEVC",
  },
  {
    id: "hl-2",
    senderName: "Phạm Thu Hà",
    senderRole: "CEVC07",
    senderTier: "New Hero",
    receiverName: "Nguyễn Hoàng Linh",
    receiverRole: "CEVC12",
    receiverTier: "Rising Hero",
    timeRange: "09:15 - 10/28/2025",
    title: "NGƯỜI THẦM LẶNG",
    body: BODY_SHORT,
    hashtags: ["#Teamwork", "#Support"],
    likeCount: 842,
    department: "Product",
  },
  {
    id: "hl-3",
    senderName: "Lê Quốc Bảo",
    senderRole: "CEVC22",
    senderTier: "Legend Hero",
    receiverName: "Đỗ Khánh Chi",
    receiverRole: "CEVC05",
    receiverTier: "Rising Hero",
    timeRange: "14:40 - 10/25/2025",
    title: "CHỖ DỰA CỦA TEAM",
    body: BODY_LONG,
    hashtags: ["#Leadership", "#Trust"],
    likeCount: 1520,
    department: "Design",
  },
  {
    id: "hl-4",
    senderName: "Vũ Ngọc Mai",
    senderRole: "CEVC14",
    senderTier: "Rising Hero",
    receiverName: "Hoàng Anh Tú",
    receiverRole: "CEVC30",
    receiverTier: "New Hero",
    timeRange: "16:20 - 10/22/2025",
    title: "SÁNG TẠO KHÔNG NGỪNG",
    body: BODY_SHORT,
    hashtags: ["#Creative", "#Inspring"],
    likeCount: 673,
    department: "Marketing",
  },
  {
    id: "hl-5",
    senderName: "Bùi Thanh Sơn",
    senderRole: "CEVC02",
    senderTier: "Legend Hero",
    receiverName: "Ngô Phương Thảo",
    receiverRole: "CEVC18",
    receiverTier: "Legend Hero",
    timeRange: "11:05 - 10/20/2025",
    title: "TẬN TÂM VỚI KHÁCH HÀNG",
    body: BODY_LONG,
    hashtags: ["#Dedicated", "#Customer"],
    likeCount: 1289,
    department: "Operation",
  },
];

/** Filter criteria for narrowing a Kudo feed (FIX 3); `null`/omitted = "all". */
export interface KudoFilter {
  hashtag?: string | null;
  department?: string | null;
}

/**
 * Pure: keep only cards matching the given hashtag AND department. Either
 * criterion left `null`/undefined is not applied (acts as "Tất cả").
 */
export function filterKudos(
  cards: readonly KudoCard[],
  filter: KudoFilter = {},
): KudoCard[] {
  return cards.filter((card) => {
    if (filter.hashtag && !card.hashtags.includes(filter.hashtag)) {
      return false;
    }
    if (filter.department && card.department !== filter.department) {
      return false;
    }
    return true;
  });
}

/**
 * Pure: the top `limit` cards by `likeCount` descending. Ties keep their
 * original relative order (Array#sort is a stable sort).
 */
export function getHighlightKudos(
  cards: readonly KudoCard[],
  limit = 5,
): KudoCard[] {
  return [...cards].sort((a, b) => b.likeCount - a.likeCount).slice(0, limit);
}
