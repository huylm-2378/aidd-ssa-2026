import Image from "next/image";

interface KudoAvatarProps {
  name: string;
  /** Optional avatar image; falls back to initials when omitted. */
  src?: string;
  /** Rendered diameter in px (default 64, matching the card avatars). */
  size?: number;
}

/** First letters of the first two words, e.g. "Huỳnh Dương Xuân" → "HD". */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/**
 * Shared avatar for Kudo cards (sender/receiver) and the sidebar recent-gifts
 * list (MoMorph `MM_MEDIA_Avatar`, 64px, white 1.87px ring). Renders the image
 * when `src` is given, otherwise a neutral initials placeholder — avoids
 * exporting 100+ avatar assets for a static mock clone.
 */
export default function KudoAvatar({ name, src, size = 64 }: KudoAvatarProps) {
  const dimension = { width: size, height: size };

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 rounded-full border-2 border-white object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden
      style={dimension}
      className="flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#00101a] font-montserrat font-bold text-[#ffea9e]"
    >
      {initialsOf(name)}
    </span>
  );
}
