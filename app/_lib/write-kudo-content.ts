/**
 * Static copy + mock recipient list for the "Viết Kudo" composer modal (F006),
 * faithful to the MoMorph frame "Viết Kudo" (`ihQ26W78P2` / node `520:11602`,
 * modal instance `520:11647`). All strings are verbatim per the technical spec
 * (FR-004..011); required-field `*` markers are appended at render time, not
 * baked into these labels. Recipient names are reused from
 * `sun-kudos-content.ts` / `kudos-cards.ts` to keep the mock world consistent.
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

/** Verbatim copy for every field in the composer (FR-004..011). */
export const WRITE_KUDO_COPY = {
  title: "Gửi lời cám ơn và ghi nhận đến đồng đội",
  recipientLabel: "Người nhận",
  recipientPlaceholder: "Tìm kiếm",
  awardLabel: "Danh hiệu",
  awardPlaceholder: "Dành tặng một danh hiệu cho đồng đội",
  awardHints: [
    "Ví dụ: Người truyền động lực cho tôi.",
    "Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn.",
  ],
  contentPlaceholder: "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!",
  contentHint: 'Bạn có thể "@ + tên" để nhắc tới đồng nghiệp khác',
  communityStandards: "Tiêu chuẩn cộng đồng",
  hashtagLabel: "Hashtag",
  addHashtag: "+ Hashtag",
  maxNote: "Tối đa 5", // keep in sync with MAX_HASHTAGS in write-kudo-form.ts (kept literal to avoid a circular import)
  imageLabel: "Image",
  addImage: "+ Image",
  anonymousLabel: "Gửi lời cám ơn và ghi nhận ẩn danh",
  cancel: "Hủy",
  submit: "Gửi",
} as const;
