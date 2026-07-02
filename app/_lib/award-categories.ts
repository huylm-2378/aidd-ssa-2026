export interface AwardCategory {
  slug: string;
  title: string;
  description: string;
  /** Award-name logotype overlaid on the shared glowing frame. */
  nameSrc: string;
  /** Native pixel size of the name logotype (used to preserve its Figma scale). */
  nameWidth: number;
  nameHeight: number;
}

/**
 * The 6 fixed award cards for the Homepage SAA awards grid.
 *
 * Each card renders the shared glowing frame (`award-bg.png`, Figma
 * MM_MEDIA_Award BG, 336x336) with the award's name logotype centered on top
 * (Figma Awards-Name node, centered both axes inside the frame).
 *
 * Best Manager / Signature 2025 - Creator / MVP intentionally ship with the
 * identical description string, faithfully reproduced from the source design
 * (see technical-spec.md > Assumptions).
 */
export const AWARD_CATEGORIES: readonly AwardCategory[] = [
  {
    slug: "top-talent",
    title: "Top Talent",
    description: "Vinh danh top cá nhân xuất sắc trên mọi phương diện",
    nameSrc: "/homepage-saa/award-name-top-talent.png",
    nameWidth: 222,
    nameHeight: 36,
  },
  {
    slug: "top-project",
    title: "Top Project",
    description:
      "Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật",
    nameSrc: "/homepage-saa/award-name-top-project.png",
    nameWidth: 232,
    nameHeight: 35,
  },
  {
    slug: "top-project-leader",
    title: "Top Project Leader",
    description:
      "Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá,",
    nameSrc: "/homepage-saa/award-name-top-project-leader.png",
    nameWidth: 232,
    nameHeight: 64,
  },
  {
    slug: "best-manager",
    title: "Best Manager",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameSrc: "/homepage-saa/award-name-best-manager.png",
    nameWidth: 232,
    nameHeight: 30,
  },
  {
    slug: "signature-2025-creator",
    title: "Signature 2025 - Creator",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameSrc: "/homepage-saa/award-name-signature-2025-creator.png",
    nameWidth: 232,
    nameHeight: 54,
  },
  {
    slug: "mvp",
    title: "MVP (Most Valuable Person)",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    nameSrc: "/homepage-saa/award-name-mvp.png",
    nameWidth: 116,
    nameHeight: 52,
  },
] as const;

/** The shared glowing award frame behind every card's name (Figma 336x336). */
export const AWARD_FRAME_SRC = "/homepage-saa/award-bg.png";
export const AWARD_FRAME_SIZE = 336;
