/**
 * The clickable gift-box illustration (region R4, MoMorph node `1466:7684`
 * "C_Box image") for `SecretBoxModal` (F016). Split out of the main modal
 * file to keep both under the 200-line budget and to isolate the
 * asset-layering + badge-fallback logic from the dialog chrome.
 *
 * Layers (bottom to top), all extracted from the Figma frame
 * `J3-4YFIpMM`:
 * 1. `MM_MEDIA_box quà chưa mở` (node `1466:7686`) — the box/podium/sparkle
 *    photo, exported as `/secret-box/box-qua-chua-mo.svg`, fills the frame.
 * 2. `MM_MEDIA_hiệu ứng box quà` (node `1466:7685`) — a secondary sparkle
 *    overlay, exported as `/secret-box/hieu-ung-box-qua.png`. The design's
 *    raw CSS is a fixed-pixel `background: url(...) -102.944px -102.487px /
 *    138.527% 138.527% no-repeat` — both offsets resolve to ~48.7-48.9% of
 *    the (bg-size − container-size) span, i.e. Figma's fractional export of
 *    plain centering. Using `center` instead of the literal px offsets keeps
 *    the exact 138.527% zoom (the real design value) while staying correct
 *    at any container width (Phase 4 responsive requirement — fixed px
 *    background-position would drift off-center once the frame is scaled
 *    down for a 375px viewport).
 * 3. The revealed badge image (when `lastBadgeCode` is set), centered on
 *    top — not present in this "chưa mở" (unopened) design frame, but
 *    required by the shared component contract (FR-006) for when
 *    integration wires in a real open result.
 */
import { RULE_ICONS } from "../../_lib/rules-content";

interface SecretBoxIllustrationProps {
  disabled: boolean;
  opening: boolean;
  onClick: () => void;
  lastBadgeCode: string | null;
}

/** `sunner_badges.badge_code` (F016) -> `RULE_ICONS` display name (rules-content.ts). */
const BADGE_NAME_BY_CODE: Record<string, string> = {
  STAY_GOLD: "STAY GOLD",
  FLOW_TO_HORIZON: "FLOW TO HORIZON",
  BEYOND_THE_BOUNDARY: "BEYOND THE BOUNDARY",
  ROOT_FURTHER: "ROOT FURTHER",
  TOUCH_OF_LIGHT: "TOUCH OF LIGHT",
  REVIVAL: "REVIVAL",
};

/** BR-004: unknown/corrupt `badge_code` -> generic fallback icon, never a crash or a broken `<img>`. */
function resolveBadgeSrc(badgeCode: string | null): string | null {
  if (!badgeCode) return null;
  const name = BADGE_NAME_BY_CODE[badgeCode];
  const icon = name ? RULE_ICONS.find((entry) => entry.name === name) : undefined;
  return icon?.src ?? null;
}

export default function SecretBoxIllustration({ disabled, opening, onClick, lastBadgeCode }: SecretBoxIllustrationProps) {
  const badgeSrc = resolveBadgeSrc(lastBadgeCode);
  const showUnknownBadgeFallback = lastBadgeCode !== null && badgeSrc === null;

  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      aria-busy={opening}
      onClick={onClick}
      className="relative mx-auto aspect-square w-full max-w-[557px] overflow-hidden transition-opacity disabled:cursor-not-allowed data-[opening=true]:cursor-wait data-[opening=true]:opacity-80"
      data-opening={opening}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static local design asset */}
      <img src="/secret-box/box-qua-chua-mo.svg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "url(/secret-box/hieu-ung-box-qua.png) center / 138.527% 138.527% no-repeat" }}
      />
      {badgeSrc && (
        // eslint-disable-next-line @next/next/no-img-element -- static local design asset
        <img
          src={badgeSrc}
          alt=""
          aria-hidden
          className="absolute inset-0 m-auto h-1/3 w-1/3 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        />
      )}
      {showUnknownBadgeFallback && <UnknownBadgeFallback />}
    </button>
  );
}

/** BR-004 fallback — no badge PNG exists for an unrecognized `badge_code`, so render an inline glyph instead of nothing/broken. */
function UnknownBadgeFallback() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="absolute inset-0 m-auto h-16 w-16 text-[#ffea9e] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <path
        d="M9.5 9.5a2.5 2.5 0 0 1 4.906-.732c.198.53.114 1.14-.22 1.593l-.813 1.05a2.1 2.1 0 0 0-.373 1.312V13"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
