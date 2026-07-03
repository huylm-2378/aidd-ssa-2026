/**
 * Mock Kudo cards for the Sun* Kudos page (F003), faithful to the MoMorph frame
 * "Sun* Kudos - Live board" (`MaZUn5xHXZ`). Each card pairs a sender + receiver
 * (role code + hero-tier badge) with a timestamp, title, body, hashtags, and a
 * like count; `photos` optionally renders a placeholder thumbnail strip. Static
 * data only — no assets are exported for avatars/photos.
 */
export interface KudoCard {
  id: string;
  senderName: string;
  senderRole: string;
  senderTier: string;
  senderAvatar?: string;
  receiverName: string;
  receiverRole: string;
  receiverTier: string;
  receiverAvatar?: string;
  /** Display timestamp range, e.g. "10:00 - 10/30/2025". */
  timeRange: string;
  title: string;
  body: string;
  hashtags: readonly string[];
  /** Raw like count; rendered localized (e.g. 1000 → "1.000"). */
  likeCount: number;
  /** Optional photo captions; each renders one placeholder thumbnail. */
  photos?: readonly string[];
}
const BODY_LONG =
  "Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn " +
  "của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực " +
  "hơn nữa trong công việc. <3 và cuộc sống...";
const BODY_SHORT =
  "Cảm ơn anh đã luôn kiên nhẫn review từng dòng code và chỉ cho em những điểm " +
  "cần cải thiện. Em học được rất nhiều từ cách anh làm việc mỗi ngày.";
/** Highlight Kudos carousel — one card per page (indicator "n/5"). */
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
  },
];

/** All Kudos feed — vertical list; some carry a photo strip. */
export const ALL_KUDOS: readonly KudoCard[] = [
  {
    id: "all-1",
    senderName: "Huỳnh Dương Xuân Nhật",
    senderRole: "CEVC10",
    senderTier: "New Hero",
    receiverName: "Trần Minh Anh",
    receiverRole: "CEVC19",
    receiverTier: "Legend Hero",
    timeRange: "10:00 - 10/30/2025",
    title: "IDOL GIỚI TRẺ",
    body: BODY_LONG,
    hashtags: ["#Dedicated", "#Inspring"],
    likeCount: 1000,
    photos: ["photo-a", "photo-b", "photo-c", "photo-d", "photo-e", "photo-f"],
  },
  {
    id: "all-2",
    senderName: "Phạm Thu Hà",
    senderRole: "CEVC07",
    senderTier: "Rising Hero",
    receiverName: "Nguyễn Hoàng Linh",
    receiverRole: "CEVC12",
    receiverTier: "Legend Hero",
    timeRange: "09:15 - 10/28/2025",
    title: "NGƯỜI THẦM LẶNG",
    body: BODY_LONG,
    hashtags: ["#Teamwork", "#Support"],
    likeCount: 1000,
    photos: ["photo-a", "photo-b", "photo-c", "photo-d", "photo-e"],
  },
  {
    id: "all-3",
    senderName: "Lê Quốc Bảo",
    senderRole: "CEVC22",
    senderTier: "Legend Hero",
    receiverName: "Đỗ Khánh Chi",
    receiverRole: "CEVC05",
    receiverTier: "Rising Hero",
    timeRange: "14:40 - 10/25/2025",
    title: "CHỖ DỰA CỦA TEAM",
    body: BODY_SHORT,
    hashtags: ["#Leadership", "#Trust"],
    likeCount: 1000,
    photos: ["photo-a", "photo-b", "photo-c", "photo-d", "photo-e", "photo-f"],
  },
  {
    id: "all-4",
    senderName: "Vũ Ngọc Mai",
    senderRole: "CEVC14",
    senderTier: "Rising Hero",
    receiverName: "Hoàng Anh Tú",
    receiverRole: "CEVC30",
    receiverTier: "New Hero",
    timeRange: "16:20 - 10/22/2025",
    title: "SÁNG TẠO KHÔNG NGỪNG",
    body: BODY_LONG,
    hashtags: ["#Creative", "#Inspring"],
    likeCount: 1000,
    photos: ["photo-a", "photo-b", "photo-c", "photo-d", "photo-e"],
  },
  {
    id: "all-5",
    senderName: "Bùi Thanh Sơn",
    senderRole: "CEVC02",
    senderTier: "Legend Hero",
    receiverName: "Ngô Phương Thảo",
    receiverRole: "CEVC18",
    receiverTier: "Rising Hero",
    timeRange: "11:05 - 10/20/2025",
    title: "TẬN TÂM VỚI KHÁCH HÀNG",
    body: BODY_SHORT,
    hashtags: ["#Dedicated", "#Customer"],
    likeCount: 958,
  },
  {
    id: "all-6",
    senderName: "Đặng Hải Đăng",
    senderRole: "CEVC26",
    senderTier: "New Hero",
    receiverName: "Trịnh Bảo Ngọc",
    receiverRole: "CEVC09",
    receiverTier: "Rising Hero",
    timeRange: "08:30 - 10/18/2025",
    title: "NĂNG LƯỢNG TÍCH CỰC",
    body: BODY_LONG,
    hashtags: ["#Positive", "#Energy"],
    likeCount: 1104,
  },
];
