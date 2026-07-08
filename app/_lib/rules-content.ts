/**
 * Static copy for the "Thể lệ" (rules) drawer (F013), faithful to the MoMorph
 * frame "Thể lệ UPDATE" (fileKey `9ypp4enmFmdK3YAFJLIu6C`, screenId
 * `b1Filzi9i6`, figma node `3204:6051`). All strings are verbatim per the
 * technical spec (FR-003..FR-006). Hero badge and collectible icon assets
 * live under `public/rules-icons/` (provided, not generated) — paths are
 * percent-encoded (spaces and the Vietnamese "ệ") so they resolve without a
 * redirect from the Next.js static file server.
 */

export interface RuleTier {
  name: string;
  badgeSrc: string;
  countLabel: string;
  description: string;
}

export interface CollectibleIcon {
  name: string;
  src: string;
}

/** Hero badge tiers, ascending order (FR-004). */
export const RULE_TIERS: readonly RuleTier[] = [
  {
    name: "New Hero",
    badgeSrc: "/rules-icons/MM_MEDIA_New%20Hero.png",
    countLabel: "Có 1-4 người gửi Kudos cho bạn",
    description:
      "Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn.",
  },
  {
    name: "Rising Hero",
    badgeSrc: "/rules-icons/MM_MEDIA_Rising%20Hero.png",
    countLabel: "Có 5-9 người gửi Kudos cho bạn",
    description: "Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình.",
  },
  {
    name: "Super Hero",
    badgeSrc: "/rules-icons/MM_MEDIA_Super%20Hero.png",
    countLabel: "Có 10–20 người gửi Kudos cho bạn",
    description:
      "Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến.",
  },
  {
    name: "Legend Hero",
    badgeSrc: "/rules-icons/MM_MEDIA_Legend%20Hero.png",
    countLabel: "Có hơn 20 người gửi Kudos cho bạn",
    description:
      "Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình.",
  },
] as const;

/**
 * Collectible icons, mapped in file order to the design labels (FR-005). See
 * technical-spec.md "Unresolved questions" #1 — order assumed from provided
 * filenames, to be corrected if the mapping is wrong.
 */
export const RULE_ICONS: readonly CollectibleIcon[] = [
  { name: "REVIVAL", src: "/rules-icons/Huy%20hi%E1%BB%87u.png" },
  { name: "TOUCH OF LIGHT", src: "/rules-icons/Huy%20hi%E1%BB%87u%20(1).png" },
  { name: "STAY GOLD", src: "/rules-icons/Huy%20hi%E1%BB%87u%20(2).png" },
  { name: "FLOW TO HORIZON", src: "/rules-icons/Huy%20hi%E1%BB%87u%20(3).png" },
  { name: "BEYOND THE BOUNDARY", src: "/rules-icons/Huy%20hi%E1%BB%87u%20(4).png" },
  { name: "ROOT FURTHER", src: "/rules-icons/Huy%20hi%E1%BB%87u%20(5).png" },
] as const;

/** Verbatim copy for every static text field in the drawer (FR-003, FR-006, FR-007). */
export const RULES_COPY = {
  title: "Thể lệ",
  receiversHeading: "NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC",
  receiversIntro:
    "Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile",
  sendersHeading: "NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN",
  sendersIntro:
    "Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ❤️ từ cộng đồng Sunner. Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA.",
  iconsNote: "Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025.",
  nationalHeading: "KUDOS QUỐC DÂN",
  nationalCopy:
    "5 Kudos nhận về nhiều ❤️ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần quà đặc biệt từ SAA 2025: Root Further.",
  closeLabel: "Đóng",
  writeLabel: "Viết KUDOS",
} as const;
