/**
 * Static labels and sidebar mock data for the Sun* Kudos page (F003).
 *
 * Copy is faithful to the MoMorph frame "Sun* Kudos - Live board"
 * (`MaZUn5xHXZ`): the hero eyebrow + wordmark, the two search-pill
 * placeholders, the Highlight-section filter option labels, the personal-stats
 * rows, and the "10 Sunner nhận quà mới nhất" list. Static content only.
 */
export interface SunnerStat {
  label: string;
  value: string;
}

export interface RecentGiftSunner {
  name: string;
  note: string;
  avatar?: string;
}

/** Hero band copy (keyvisual + "KUDOS" wordmark). */
export const KUDOS_HERO = {
  eyebrow: "Hệ thống ghi nhận và cảm ơn",
  wordmark: "KUDOS",
} as const;

/** Search-bar pill placeholders (visual-only inputs). */
export const KUDOS_SEARCH = {
  promptPlaceholder: "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?",
  profilePlaceholder: "Tìm kiếm profile Sunner",
} as const;

/** Shared eyebrow above each gold section title. */
export const SECTION_EYEBROW = "Sun* Annual Awards 2025";

/** Highlight-section filter dropdown options — wired to real filtering (FIX 3). */
export const HASHTAG_FILTERS: readonly string[] = [
  "#Dedicated",
  "#Inspring",
  "#Teamwork",
  "#Leadership",
  "#Creative",
];

export const DEPARTMENT_FILTERS: readonly string[] = [
  "CEVC",
  "Product",
  "Design",
  "Marketing",
  "Operation",
];

/** Shown when the Highlight filter combination matches no Kudo. */
export const HIGHLIGHT_EMPTY = "Không có Kudo phù hợp";

/** Sidebar personal-stats panel — 5 rows (label + gold value). */
export const SUNNER_STATS: readonly SunnerStat[] = [
  { label: "Số Kudos bạn nhận được:", value: "25" },
  { label: "Số Kudos bạn đã gửi:", value: "25" },
  { label: "Số tim bạn nhận được:", value: "25" },
  { label: "Số Secret Box bạn đã mở:", value: "25" },
  { label: "Số Secret Box chưa mở:", value: "25" },
];

/** Sidebar "10 Sunner nhận quà mới nhất" list. */
export const RECENT_GIFTS_HEADING = "10 Sunner nhận quà mới nhất";

export const RECENT_GIFT_SUNNERS: readonly RecentGiftSunner[] = [
  { name: "Huỳnh Dương Xuân", note: "Nhận được 1 áo phông SAA" },
  { name: "Trần Minh Anh", note: "Nhận được 1 áo phông SAA" },
  { name: "Phạm Thu Hà", note: "Nhận được 1 bình giữ nhiệt SAA" },
  { name: "Nguyễn Hoàng Linh", note: "Nhận được 1 áo phông SAA" },
  { name: "Lê Quốc Bảo", note: "Nhận được 1 sổ tay SAA" },
  { name: "Đỗ Khánh Chi", note: "Nhận được 1 áo phông SAA" },
  { name: "Vũ Ngọc Mai", note: "Nhận được 1 bình giữ nhiệt SAA" },
  { name: "Hoàng Anh Tú", note: "Nhận được 1 áo phông SAA" },
  { name: "Ngô Phương Thảo", note: "Nhận được 1 sổ tay SAA" },
  { name: "Đặng Hải Đăng", note: "Nhận được 1 áo phông SAA" },
];

/** Secret Box CTA label (visual-only button). */
export const SECRET_BOX_LABEL = "Mở Secret Box";
