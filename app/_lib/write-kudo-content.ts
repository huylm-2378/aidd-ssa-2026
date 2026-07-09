import type { MessageKey } from "./i18n/use-translation";

/**
 * Static copy + mock recipient list for the "Viết Kudo" composer modal (F006),
 * faithful to the MoMorph frame "Viết Kudo" (`ihQ26W78P2` / node `520:11602`,
 * modal instance `520:11647`). Required-field `*` markers are appended at
 * render time, not baked into these labels. Recipient names are reused from
 * `sun-kudos-content.ts` / `kudos-cards.ts` to keep the mock world consistent.
 *
 * F014 round 4: `WRITE_KUDO_COPY` holds i18n catalog KEYS (`composer.*`),
 * not raw strings — consumers resolve them via `t()` at render time (same
 * pattern as `SunnerStat.label` in `sun-kudos-content.ts`).
 */
export interface SunnerOption {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

/** Mock Sunner directory for the recipient autocomplete (FR-005). No real lookup. */
export const SUNNER_OPTIONS: readonly SunnerOption[] = [
  { id: "sunner-1", name: "Trần Minh Anh", role: "CEVC19" },
  { id: "sunner-2", name: "Phạm Thu Hà", role: "CEVC07" },
  { id: "sunner-3", name: "Nguyễn Hoàng Linh", role: "CEVC12" },
  { id: "sunner-4", name: "Lê Quốc Bảo", role: "CEVC22" },
  { id: "sunner-5", name: "Đỗ Khánh Chi", role: "CEVC05" },
  { id: "sunner-6", name: "Vũ Ngọc Mai", role: "CEVC14" },
  { id: "sunner-7", name: "Hoàng Anh Tú", role: "CEVC30" },
  { id: "sunner-8", name: "Ngô Phương Thảo", role: "CEVC18" },
  { id: "sunner-9", name: "Đặng Hải Đăng", role: "CEVC26" },
];

/**
 * Fixed catalog of selectable hashtags for the composer dropdown (FR-008,
 * MoMorph "Dropdown list hashtag" `p9zO-c4a4x`). These are the Sun* company
 * values — a stable set, so a static constant (not a DB table) is the KISS
 * source. ("#High-performing" corrects the design's "#High-perorming" typo.)
 */
export const HASHTAG_OPTIONS: readonly string[] = [
  "#High-performing",
  "#BE PROFESSIONAL",
  "#BE OPTIMISTIC",
  "#BE A TEAM",
  "#THINK OUTSIDE THE BOX",
  "#GET RISKY",
  "#GO FAST",
  "#WASSHOI",
];

/** Catalog keys for every field in the composer (FR-004..011). */
export const WRITE_KUDO_COPY = {
  title: "composer.title",
  recipientLabel: "composer.recipientLabel",
  recipientPlaceholder: "composer.recipientPlaceholder",
  awardLabel: "composer.awardLabel",
  awardPlaceholder: "composer.awardPlaceholder",
  awardHints: ["composer.awardHint1", "composer.awardHint2"],
  contentPlaceholder: "composer.contentPlaceholder",
  contentHint: "composer.contentHint",
  communityStandards: "composer.communityStandards",
  hashtagLabel: "composer.hashtagLabel",
  addHashtag: "composer.addHashtag",
  maxNote: "composer.maxNote", // keep in sync with MAX_HASHTAGS in write-kudo-form.ts (kept literal to avoid a circular import)
  imageLabel: "composer.imageLabel",
  addImage: "composer.addImage",
  anonymousLabel: "composer.anonymousLabel",
  cancel: "composer.cancel",
  submit: "composer.submit",
} satisfies Record<string, MessageKey | readonly MessageKey[]>;
