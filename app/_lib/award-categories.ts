export interface AwardCategory {
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
}

/**
 * The 6 fixed award cards for the Homepage SAA awards grid.
 * Best Manager / Signature 2025 - Creator / MVP intentionally ship with the
 * identical description string, faithfully reproduced from the source design
 * (see technical-spec.md > Assumptions).
 */
export const AWARD_CATEGORIES: readonly AwardCategory[] = [
  {
    slug: "top-talent",
    title: "Top Talent",
    description: "Vinh danh top cá nhân xuất sắc trên mọi phương diện",
    imageSrc: "/homepage-saa/award-top-talent.png",
  },
  {
    slug: "top-project",
    title: "Top Project",
    description:
      "Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật",
    imageSrc: "/homepage-saa/award-top-project.png",
  },
  {
    slug: "top-project-leader",
    title: "Top Project Leader",
    description:
      "Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá,",
    imageSrc: "/homepage-saa/award-top-project-leader.png",
  },
  {
    slug: "best-manager",
    title: "Best Manager",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    imageSrc: "/homepage-saa/award-best-manager.png",
  },
  {
    slug: "signature-2025-creator",
    title: "Signature 2025 - Creator",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    imageSrc: "/homepage-saa/award-signature-2025-creator.png",
  },
  {
    slug: "mvp",
    title: "MVP (Most Valuable Person)",
    description:
      "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    imageSrc: "/homepage-saa/award-mvp.png",
  },
] as const;
