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
 * touch the viewport edge.
 *
 * Uses the **R2 low-discrepancy sequence** (the 2D generalisation of the golden
 * ratio, built on the plastic number). Unlike the naive `(index * k) % 1` — which
 * pins `index 0` to `(0,0)` (a name stuck in the top-left corner) and, because
 * both axes are linear multiples of the same index, smears points along diagonal
 * stripes rather than filling the plane — R2 spreads points EVENLY across the box
 * with no clustering and no empty gutters. The `0.5 +` offset seats `index 0` at
 * the centre, so no index ever lands in a corner. Same index → same spot
 * (deterministic + testable).
 */
// Plastic number and its powers: a1 = 1/g, a2 = 1/g² (Martin Roberts' R2).
const R2_A1 = 0.7548776662466927;
const R2_A2 = 0.5698402909980532;

export function positionOf(index: number): { leftPct: number; topPct: number } {
  const fracX = (0.5 + R2_A1 * index) % 1;
  const fracY = (0.5 + R2_A2 * index) % 1;
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
