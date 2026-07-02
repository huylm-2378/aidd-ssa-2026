/** A single prize row rendered under "Giá trị giải thưởng:" on the Awards Information page. */
export interface AwardPrize {
  value: string;
  note: string;
}

export interface AwardCategory {
  slug: string;
  title: string;
  /**
   * Short label for the Awards Information sidebar anchor-nav (Figma
   * `mms_C_Menu list`). Defaults to `title`; set only where the design's nav
   * label is shorter than the section heading (e.g. MVP → "MVP").
   */
  navLabel?: string;
  description: string;
  /** Award-name logotype overlaid on the shared glowing frame. */
  nameSrc: string;
  /** Native pixel size of the name logotype (used to preserve its Figma scale). */
  nameWidth: number;
  nameHeight: number;
  /** Full detail paragraph shown on the Awards Information page (differs per award). */
  longDescription: string;
  /** Number of winners, e.g. "10", "02", "01". */
  quantity: string;
  /** Unit label next to the quantity, e.g. "Cá nhân" | "Tập thể" | "Cá nhân hoặc tập thể". */
  quantityUnit: string;
  /** 1 entry for most awards, 2 for Signature (individual vs. collective prize). */
  prizes: AwardPrize[];
}

/**
 * The 6 fixed award cards for the Homepage SAA awards grid, extended with the
 * detail-page copy rendered on `/awards-information`.
 *
 * Each card renders the shared glowing frame (`award-bg.png`, Figma
 * MM_MEDIA_Award BG, 336x336) with the award's name logotype centered on top
 * (Figma Awards-Name node, centered both axes inside the frame).
 *
 * Best Manager / Signature 2025 - Creator / MVP intentionally ship with the
 * identical short `description` string, faithfully reproduced from the source
 * design (see technical-spec.md > Assumptions). Their `longDescription`
 * strings differ per award and come from the MoMorph "Hệ thống giải" frame.
 */
export const AWARD_CATEGORIES: readonly AwardCategory[] = [
  {
    slug: "top-talent",
    title: "Top Talent",
    description: "Vinh danh top cá nhân xuất sắc trên mọi phương diện",
    nameSrc: "/homepage-saa/award-name-top-talent.png",
    nameWidth: 222,
    nameHeight: 36,
    longDescription:
      "Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể.",
    quantity: "10",
    quantityUnit: "Cá nhân",
    prizes: [{ value: "7.000.000 VNĐ", note: "cho mỗi giải thưởng" }],
  },
  {
    slug: "top-project",
    title: "Top Project",
    description:
      "Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật",
    nameSrc: "/homepage-saa/award-name-top-project.png",
    nameWidth: 232,
    nameHeight: 35,
    longDescription:
      "Giải thưởng Top Project vinh danh các tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng, hiệu quả vận hành tối ưu và tinh thần làm việc tận tâm. Đây là các dự án có độ phức tạp kỹ thuật cao, hiệu quả tối ưu hóa nguồn lực và chi phí tốt, đề xuất các ý tưởng có giá trị cho khách hàng, đem lại lợi nhuận vượt trội và nhận được phản hồi tích cực từ khách hàng. Các thành viên tuân thủ nghiêm ngặt các tiêu chuẩn phát triển nội bộ trong phát triển dự án, tạo nên một hình mẫu về sự xuất sắc và chuyên nghiệp.",
    quantity: "02",
    quantityUnit: "Tập thể",
    prizes: [{ value: "15.000.000 VNĐ", note: "cho mỗi giải thưởng" }],
  },
  {
    slug: "top-project-leader",
    title: "Top Project Leader",
    description:
      "Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá,",
    nameSrc: "/homepage-saa/award-name-top-project-leader.png",
    nameWidth: 232,
    nameHeight: 64,
    longDescription:
      "Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc – những người hội tụ năng lực quản lý vững vàng, khả năng truyền cảm hứng mạnh mẽ, và tư duy “Aim High – Be Agile” trong mọi bài toán và bối cảnh. Dưới sự dẫn dắt của họ, các thành viên không chỉ cùng nhau vượt qua thử thách và đạt được mục tiêu đề ra, mà còn giữ vững ngọn lửa nhiệt huyết, tinh thần Wasshoi, và trưởng thành để trở thành phiên bản tinh hoa – hạnh phúc hơn của chính mình.",
    quantity: "03",
    quantityUnit: "Cá nhân",
    prizes: [{ value: "7.000.000 VNĐ", note: "cho mỗi giải thưởng" }],
  },
  {
    slug: "best-manager",
    title: "Best Manager",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameSrc: "/homepage-saa/award-name-best-manager.png",
    nameWidth: 232,
    nameHeight: 30,
    longDescription:
      "Giải thưởng Best Manager vinh danh những nhà lãnh đạo tiêu biểu – người đã dẫn dắt đội ngũ của mình tạo ra kết quả vượt kỳ vọng, tác động nổi bật đến hiệu quả kinh doanh và sự phát triển bền vững của tổ chức. Dưới sự lãnh đạo của họ, đội ngũ luôn chinh phục và làm chủ mọi mục tiêu bằng năng lực đa nhiệm, khả năng phối hợp hiệu quả, và tư duy ứng dụng công nghệ linh hoạt trong kỷ nguyên số. Họ truyền cảm hứng để tập thể trở nên tự tin tràn đầy năng lượng, sẵn sàng đón nhận, thậm chí dẫn dắt tạo ra những thay đổi có tính cách mạng.",
    quantity: "01",
    quantityUnit: "Cá nhân",
    prizes: [{ value: "10.000.000 VNĐ", note: "cho mỗi giải thưởng" }],
  },
  {
    slug: "signature-2025-creator",
    title: "Signature 2025 - Creator",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameSrc: "/homepage-saa/award-name-signature-2025-creator.png",
    nameWidth: 232,
    nameHeight: 54,
    longDescription:
      "Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ.  Trong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần “Creator” đặc trưng của Sun*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun* tạo giá trị.",
    quantity: "01",
    quantityUnit: "Cá nhân hoặc tập thể",
    prizes: [
      { value: "5.000.000 VNĐ", note: "cho giải cá nhân" },
      { value: "8.000.000 VNĐ", note: "cho giải tập thể" },
    ],
  },
  {
    slug: "mvp",
    title: "MVP (Most Valuable Person)",
    navLabel: "MVP",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameSrc: "/homepage-saa/award-name-mvp.png",
    nameWidth: 116,
    nameHeight: 52,
    longDescription:
      "Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun*. Họ là người đã thể hiện năng lực vượt trội, tinh thần cống hiến bền bỉ, và tầm ảnh hưởng sâu rộng, để lại dấu ấn mạnh mẽ trong hành trình của Sun* suốt năm qua.  Không chỉ nổi bật bởi hiệu suất và kết quả công việc, họ còn là nguồn cảm hứng lan tỏa – thông qua suy nghĩ, hành động và ảnh hưởng tích cực của mình đối với tập thể. MVP là người hội tụ đầy đủ phẩm chất của người Sun* ưu tú, đồng thời mang trên mình trọng trách lớn lao: trở thành hình mẫu đại diện cho con người và tinh thần Sun*, góp phần dẫn dắt tập thể vươn tới những đỉnh cao mới.",
    quantity: "01",
    quantityUnit: "Cá nhân",
    prizes: [{ value: "15.000.000 VNĐ", note: "cho mỗi giải thưởng" }],
  },
] as const;

/** The shared glowing award frame behind every card's name (Figma 336x336). */
export const AWARD_FRAME_SRC = "/homepage-saa/award-bg.png";
export const AWARD_FRAME_SIZE = 336;
