import type { MessageKey } from "./i18n/use-translation";

/**
 * Static labels and sidebar mock data for the Sun* Kudos page (F003).
 *
 * Copy is faithful to the MoMorph frame "Sun* Kudos - Live board"
 * (`MaZUn5xHXZ`): the hero eyebrow + wordmark, the two search-pill
 * placeholders, the Highlight-section filter option labels, the personal-stats
 * rows, and the "10 Sunner nhận quà mới nhất" list. Static content only.
 */
export interface SunnerStat {
  /**
   * F014: a translation key rather than raw copy — `mapStats()` (and the mock
   * `SUNNER_STATS` below) hand back `stats.*` keys, and consumers
   * (`profile-stats.tsx`, `kudos-sidebar.tsx`) resolve them via `t()` at
   * render time so the sidebar/profile panels re-render in the active locale.
   */
  label: MessageKey;
  value: string;
}

export interface RecentGiftSunner {
  name: string;
  note: string;
  avatar?: string;
}

/**
 * Hero band copy (keyvisual + "KUDOS" wordmark). F014: `eyebrowKey` is a
 * translation key, resolved via `t()` in `kudos-hero.tsx`; `wordmark` is the
 * brand name and stays literal in every locale.
 */
export const KUDOS_HERO = {
  eyebrowKey: "sunKudos.heroEyebrow" as MessageKey,
  wordmark: "KUDOS",
};

/** Search-bar pill placeholders (visual-only inputs) — F014 translation keys. */
export const KUDOS_SEARCH = {
  promptPlaceholderKey: "sunKudos.searchPromptPlaceholder" as MessageKey,
  profilePlaceholderKey: "sunKudos.searchProfilePlaceholder" as MessageKey,
};

/** Shared eyebrow above each gold section title — reuses the existing key. */
export const SECTION_EYEBROW: MessageKey = "common.sectionEyebrow";

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
export const HIGHLIGHT_EMPTY: MessageKey = "sunKudos.highlightEmpty";

/** Sidebar personal-stats panel — 5 rows (label + gold value). */
export const SUNNER_STATS: readonly SunnerStat[] = [
  { label: "stats.received", value: "25" },
  { label: "stats.sent", value: "25" },
  { label: "stats.hearts", value: "25" },
  { label: "stats.secretOpened", value: "25" },
  { label: "stats.secretUnopened", value: "25" },
];

/** Sidebar "10 Sunner nhận quà mới nhất" list heading — F014 translation key. */
export const RECENT_GIFTS_HEADING: MessageKey = "sunKudos.recentGiftsHeading";

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

/** Secret Box CTA label (visual-only button) — reuses the existing Profile key. */
export const SECRET_BOX_LABEL: MessageKey = "profile.openSecretBox";
