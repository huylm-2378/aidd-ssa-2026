/**
 * Vietnamese message fragment — F014 round 4 (the "Viết Kudo" composer
 * modal: title/labels/placeholders, the rich-text toolbar, hashtag/image
 * fields, the missing-required-field hint, and the server-action error
 * copy). Composed into `vi.ts` alongside `vi-core.ts` / `vi-kudos.ts`.
 *
 * Values here are consumed two ways:
 * - Most call sites hold the KEY itself (see `write-kudo-content.ts`'s
 *   `WRITE_KUDO_COPY`, `write-kudo-form.ts`'s `missingRequired()`) and the
 *   component resolves it via `t()` at render time.
 * - `composer.missingHint`, `composer.imageAlt`, `composer.removeHashtag`
 *   take `{token}` interpolation vars.
 *
 * No `as const`/type annotation here for the same reason as the other
 * fragments — `typeof viComposer` must stay a precise literal-key map for
 * `en-composer.ts` to check against.
 */
export const viComposer = {
  "composer.title": "Gửi lời cám ơn và ghi nhận đến đồng đội",
  "composer.recipientLabel": "Người nhận",
  "composer.recipientPlaceholder": "Tìm kiếm",
  "composer.awardLabel": "Danh hiệu",
  "composer.awardPlaceholder": "Dành tặng một danh hiệu cho đồng đội",
  "composer.awardHint1": "Ví dụ: Người truyền động lực cho tôi.",
  "composer.awardHint2": "Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn.",
  "composer.contentPlaceholder": "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!",
  "composer.contentHint": 'Bạn có thể "@ + tên" để nhắc tới đồng nghiệp khác',
  "composer.communityStandards": "Tiêu chuẩn cộng đồng",
  "composer.hashtagLabel": "Hashtag",
  "composer.addHashtag": "+ Hashtag",
  "composer.maxNote": "Tối đa 5",
  "composer.imageLabel": "Image",
  "composer.addImage": "+ Image",
  "composer.anonymousLabel": "Gửi lời cám ơn và ghi nhận ẩn danh",
  "composer.cancel": "Hủy",
  "composer.submit": "Gửi",

  "composer.toolbar.bold": "In đậm",
  "composer.toolbar.italic": "In nghiêng",
  "composer.toolbar.strikethrough": "Gạch ngang",
  "composer.toolbar.numberList": "Danh sách số",
  "composer.toolbar.link": "Chèn liên kết",
  "composer.toolbar.quote": "Trích dẫn",

  "composer.imageAlt": "Ảnh đính kèm {n}",
  "composer.removeImage": "Xóa ảnh",
  "composer.removeHashtag": "Xóa hashtag {tag}",

  "composer.field.recipient": "Người nhận",
  "composer.field.award": "Danh hiệu",
  "composer.field.content": "Nội dung",
  "composer.field.hashtag": "ít nhất 1 Hashtag",
  "composer.missingHint": "Cần điền để gửi: {fields}",

  "composer.error.missingFields": "Thiếu trường bắt buộc.",
  "composer.error.authRequired": "Bạn cần đăng nhập để gửi Kudo.",
  "composer.error.unknown": "Lỗi không xác định.",
  "composer.error.sendFailed": "Không gửi được Kudo. Vui lòng thử lại.",
};
