/**
 * Vietnamese message fragment — F014 round 3 (FAB pills, the "Thể lệ" rules
 * drawer, and the `/sun-kudos` screen: hero, search bar, sidebar, carousel,
 * Spotlight Board). Composed into `vi.ts` alongside `vi-core.ts`.
 *
 * Reused existing keys (NOT duplicated here): `profile.openSecretBox`,
 * `common.sectionEyebrow`, `filter.clearAll` — see `sun-kudos-content.ts` /
 * `rules-content.ts` for where those get re-exported as `MessageKey`s.
 *
 * No `as const`/type annotation here for the same reason as `vi-core.ts` —
 * `typeof viKudos` must stay a precise literal-key map for `en-kudos.ts` to
 * check against.
 */
export const viKudos = {
  "fab.rules": "Thể lệ",
  "fab.writeKudos": "Viết KUDOS",
  "fab.openMenu": "Mở menu thao tác",
  "fab.closeMenu": "Đóng menu thao tác",

  "rules.title": "Thể lệ",
  "rules.receiversHeading": "NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC",
  "rules.receiversIntro":
    "Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile",
  "rules.sendersHeading": "NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN",
  "rules.sendersIntro":
    "Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ❤️ từ cộng đồng Sunner. Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA.",
  "rules.iconsNote": "Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025.",
  "rules.nationalHeading": "KUDOS QUỐC DÂN",
  "rules.nationalCopy":
    "5 Kudos nhận về nhiều ❤️ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần quà đặc biệt từ SAA 2025: Root Further.",
  "rules.closeLabel": "Đóng",
  "rules.writeLabel": "Viết KUDOS",

  "rules.tier.newHero.count": "Có 1-4 người gửi Kudos cho bạn",
  "rules.tier.newHero.desc":
    "Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn.",
  "rules.tier.risingHero.count": "Có 5-9 người gửi Kudos cho bạn",
  "rules.tier.risingHero.desc":
    "Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình.",
  "rules.tier.superHero.count": "Có 10–20 người gửi Kudos cho bạn",
  "rules.tier.superHero.desc":
    "Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến.",
  "rules.tier.legendHero.count": "Có hơn 20 người gửi Kudos cho bạn",
  "rules.tier.legendHero.desc":
    "Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình.",

  "sunKudos.heroEyebrow": "Hệ thống ghi nhận và cảm ơn",
  "sunKudos.searchPromptPlaceholder": "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?",
  "sunKudos.searchProfilePlaceholder": "Tìm kiếm profile Sunner",
  "sunKudos.highlightEmpty": "Không có Kudo phù hợp",
  "sunKudos.recentGiftsHeading": "10 Sunner nhận quà mới nhất",
  "sunKudos.departmentFilterLabel": "Phòng ban",
  "sunKudos.likesSrLabel": "lượt thích",
  "sunKudos.viewDetails": "Xem chi tiết",

  "carousel.prev": "Kudo trước",
  "carousel.next": "Kudo tiếp theo",
  "carousel.page": "Trang {current} trên {total}",

  "spotlight.searchLabel": "Tìm kiếm trong Spotlight Board",
  "spotlight.searchPlaceholder": "Tìm kiếm",
  "spotlight.recentActivity": "Hoạt động gần đây",
  "spotlight.expandBoard": "Mở rộng bảng",
  "spotlight.canvasAria":
    "Bảng chòm sao Sunner: kéo hoặc dùng phím mũi tên để di chuyển, phím cộng/trừ để phóng to/thu nhỏ",
  "spotlight.justReceivedKudos": "vừa nhận Kudos",
  "spotlight.receivedKudos": "đã nhận được một Kudos mới",
  "spotlight.zoomOut": "Thu nhỏ",
  "spotlight.resetPosition": "Đặt lại vị trí",
  "spotlight.zoomIn": "Phóng to",

  "hearts.like": "Thả tim",
  "hearts.unlike": "Bỏ tim",
  "hearts.signInRequired": "Đăng nhập để thả tim.",
  "hearts.error": "Không thể cập nhật. Vui lòng thử lại.",
};
