/**
 * Shared `KudoCard` shape + reusable body copy for the Sun* Kudos mock data
 * (F003). Split out of `kudos-cards.ts` so both that file and
 * `all-kudos-data.ts` can depend on it without a circular import, keeping
 * each data file under the 200-line cap.
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
  /** Receiver's department; one of `DEPARTMENT_FILTERS` (sun-kudos-content.ts). */
  department: string;
  /** Optional photo captions; each renders one placeholder thumbnail. */
  photos?: readonly string[];
}

export const BODY_LONG =
  "Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn " +
  "của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực " +
  "hơn nữa trong công việc. <3 và cuộc sống...";

export const BODY_SHORT =
  "Cảm ơn anh đã luôn kiên nhẫn review từng dòng code và chỉ cho em những điểm " +
  "cần cải thiện. Em học được rất nhiều từ cách anh làm việc mỗi ngày.";
