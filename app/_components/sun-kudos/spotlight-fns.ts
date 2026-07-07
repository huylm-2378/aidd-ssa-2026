/**
 * Pure helpers for the Spotlight Live Board (F008). No React import — kept
 * unit-testable in isolation from the client components/hooks that use them.
 */

/** weight (1-5) → font-size scale in the constellation. Kept small (most nodes
 *  tiny, few large) so a dense cloud of ~200 nodes stays legible and evenly
 *  scattered like the Figma "Live board" rather than a wall of overlapping big
 *  text. */
export const SIZE_SCALE: Record<number, string> = {
  1: "text-[11px]",
  2: "text-xs",
  3: "text-sm",
  4: "text-base",
  5: "text-lg",
};

/** weight → colour, for depth (top weight gold, high white, rest dimmed). */
export function toneOf(weight: number): string {
  if (weight >= 5) return "text-[#ffea9e]";
  if (weight === 4) return "text-white";
  return "text-white/50";
}

/** Deterministic 1-5 weight from a name's index, so the cloud varies stably. */
export function weightOf(index: number): number {
  return ((index * 7 + 3) % 5) + 1;
}

/**
 * Deterministic scatter position for constellation node `index`, expressed as
 * a percent of the canvas box, inset into a 5-95% safe band so names never
 * touch the viewport edge. Uses two different irrational multipliers (the
 * fractional part of `index * constant`) so consecutive indices land in
 * visually distinct spots instead of a grid, while the same index always
 * yields the same spot (deterministic + testable).
 */
export function positionOf(index: number): { leftPct: number; topPct: number } {
  const fracX = (index * 12.9898) % 1;
  const fracY = (index * 78.233) % 1;
  return { leftPct: 5 + fracX * 90, topPct: 5 + fracY * 90 };
}

/** id → name lookup built from the server-fetched sunner list, used to
 *  resolve a realtime `receiver_id` (the raw row has no embedded name). */
export function buildNameById(
  sunners: readonly { id: string; name: string }[],
): Map<string, string> {
  return new Map(sunners.map((s) => [s.id, s.name]));
}

/** ISO timestamp → "HH:MMPM" (e.g. "08:30PM") in Asia/Ho_Chi_Minh, matching
 *  the static `SPOTLIGHT_ACTIVITY` ticker line format. */
export function formatTickerTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  // Intl may separate the meridiem with a narrow no-break space (U+202F);
  // \s matches it, so strip all whitespace and uppercase ("am"/"pm" -> "PM").
  return formatted.replace(/\s/g, "").toUpperCase();
}

/** A realtime `kudos` INSERT row's receiver → a ticker line. Unknown/missing
 *  receiver id (deleted sunner, not in the fetched list) falls back to a
 *  generic label rather than leaving the line blank. */
export function buildActivityEntry(
  row: { receiver_id: string | null; created_at: string },
  nameById: Map<string, string>,
): string {
  const name = (row.receiver_id && nameById.get(row.receiver_id)) || "Someone";
  return `${formatTickerTime(row.created_at)} ${name} đã nhận được một Kudos mới`;
}

/** Lowercase + strip diacritics (NFD combining marks) + explicit đ/Đ → d (NFD
 *  does NOT decompose đ, it's an atomic Vietnamese letter) + trim. */
const COMBINING_DIACRITICS = /[̀-ͯ]/g;

export function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/đ/g, "d")
    .trim();
}

/** Case/diacritic-insensitive "contains" match; an empty/whitespace query
 *  matches everything (FR-005 — clearing the search restores the full cloud). */
export function matchesQuery(name: string, query: string): boolean {
  const trimmed = query.trim();
  if (trimmed === "") return true;
  return normalizeForSearch(name).includes(normalizeForSearch(trimmed));
}
