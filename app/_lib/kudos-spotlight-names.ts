/**
 * Spotlight Board word-cloud data for the Sun* Kudos page (F003).
 *
 * The MoMorph frame packs 118 name nodes into `B.7_Spotlight`; per the spec
 * assumption we render a representative sample (~60) at varied sizes rather
 * than cloning every node. `weight` (1-5) drives the font-size scale in the
 * cloud; higher weight = larger + more prominent. `SPOTLIGHT_TOTAL` and the
 * activity-log lines are static mock content matching the frame's "388 KUDOS".
 */
export interface SpotlightName {
  name: string;
  /** 1-5 → maps to a fixed font-size/opacity scale in the cloud. */
  weight: number;
}

/** Heading figure shown on the dark board ("388 KUDOS"). */
export const SPOTLIGHT_TOTAL = "388";

export const SPOTLIGHT_NAMES: readonly SpotlightName[] = [
  { name: "Nguyễn Hoàng Linh", weight: 5 },
  { name: "Trần Minh Anh", weight: 4 },
  { name: "Nguyễn Văn Quý", weight: 4 },
  { name: "Phạm Thu Hà", weight: 3 },
  { name: "Lê Quốc Bảo", weight: 5 },
  { name: "Đỗ Khánh Chi", weight: 2 },
  { name: "Vũ Ngọc Mai", weight: 3 },
  { name: "Hoàng Anh Tú", weight: 4 },
  { name: "Bùi Thanh Sơn", weight: 2 },
  { name: "Ngô Phương Thảo", weight: 3 },
  { name: "Đặng Hải Đăng", weight: 1 },
  { name: "Trịnh Bảo Ngọc", weight: 4 },
  { name: "Huỳnh Dương Xuân Nhật", weight: 5 },
  { name: "Cao Minh Khôi", weight: 2 },
  { name: "Lý Thảo Vy", weight: 3 },
  { name: "Dương Gia Hân", weight: 1 },
  { name: "Phan Đức Duy", weight: 4 },
  { name: "Võ Hồng Phúc", weight: 2 },
  { name: "Đinh Tiến Đạt", weight: 3 },
  { name: "Tạ Quỳnh Như", weight: 1 },
  { name: "Mai Xuân Trường", weight: 4 },
  { name: "Chu Bảo Trâm", weight: 2 },
  { name: "Hồ Nhật Nam", weight: 3 },
  { name: "Lương Thùy Dung", weight: 2 },
  { name: "Nguyễn Khắc Hiếu", weight: 5 },
  { name: "Trần Gia Bảo", weight: 1 },
  { name: "Phạm Bích Ngọc", weight: 3 },
  { name: "Đoàn Minh Quân", weight: 4 },
  { name: "Bùi Tuấn Kiệt", weight: 2 },
  { name: "Vương Hải Yến", weight: 3 },
  { name: "Lê Thị Kim Oanh", weight: 1 },
  { name: "Nguyễn Đăng Khoa", weight: 4 },
  { name: "Trần Thảo Nguyên", weight: 2 },
  { name: "Hoàng Bảo Long", weight: 3 },
  { name: "Phùng Mỹ Linh", weight: 1 },
  { name: "Đặng Quốc Cường", weight: 4 },
  { name: "Nguyễn Thanh Tùng", weight: 2 },
  { name: "Lê Hà My", weight: 3 },
  { name: "Vũ Đình Phong", weight: 1 },
  { name: "Trương Ngọc Ánh", weight: 3 },
  { name: "Phạm Anh Khoa", weight: 2 },
  { name: "Nguyễn Bá Chức", weight: 4 },
  { name: "Đỗ Thu Trang", weight: 1 },
  { name: "Hoàng Việt Anh", weight: 3 },
  { name: "Lê Nhật Minh", weight: 2 },
  { name: "Trần Kim Chi", weight: 1 },
  { name: "Nguyễn Hữu Thắng", weight: 4 },
  { name: "Phan Thị Lan", weight: 2 },
  { name: "Vũ Mạnh Hùng", weight: 3 },
  { name: "Đào Ngọc Diệp", weight: 1 },
  { name: "Bùi Xuân Hòa", weight: 2 },
  { name: "Lê Anh Dũng", weight: 3 },
  { name: "Nguyễn Thùy Linh", weight: 1 },
  { name: "Trần Đức Anh", weight: 4 },
  { name: "Phạm Hồng Sơn", weight: 2 },
  { name: "Hoàng Thu Hương", weight: 3 },
  { name: "Ngô Bá Khá", weight: 1 },
  { name: "Đinh Thị Huệ", weight: 2 },
  { name: "Lưu Quang Vũ", weight: 3 },
  { name: "Nguyễn Cẩm Tú", weight: 2 },
];

/** Scrolling activity-log strip beneath the word-cloud. */
export const SPOTLIGHT_ACTIVITY: readonly string[] = [
  "08:30PM Nguyễn Bá Chức đã nhận được một Kudos mới",
  "08:29PM Trần Minh Anh vừa gửi lời cảm ơn đến Phạm Thu Hà",
  "08:27PM Lê Quốc Bảo đã nhận được một Kudos mới",
  "08:25PM Vũ Ngọc Mai vừa ghi nhận Hoàng Anh Tú",
  "08:22PM Nguyễn Hoàng Linh đã nhận được một Kudos mới",
  "08:20PM Bùi Thanh Sơn vừa gửi lời cảm ơn đến Ngô Phương Thảo",
];
