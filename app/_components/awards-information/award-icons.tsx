interface AwardIconProps {
  className?: string;
}

/**
 * Small monochrome glyphs used across the Awards Information sidebar and
 * detail sections (Figma `MM_MEDIA_Target` / `MM_MEDIA_Diamond` /
 * `MM_MEDIA_License`). Inlined as SVG rather than exported PNGs — simple
 * single-color shapes, so no extra network requests (KISS).
 */
export function AwardDiamondIcon({ className }: AwardIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path
        d="M2.5 9L12 21L21.5 9L17 3H7L2.5 9Z"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M2.5 9H21.5M8.5 3L12 9L15.5 3M9 9L12 21L15 9"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AwardLicenseIcon({ className }: AwardIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <circle cx="12" cy="9" r="6" strokeWidth={1.5} />
      <path
        d="M8.5 14L7 21l5-2.5L17 21l-1.5-7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
