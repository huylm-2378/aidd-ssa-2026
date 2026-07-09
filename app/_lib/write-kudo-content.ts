import type { MessageKey } from "./i18n/use-translation";

/**
 * Static copy for the "Viết Kudo" composer modal (F006), faithful to the
 * MoMorph frame "Viết Kudo" (`ihQ26W78P2` / node `520:11602`, modal instance
 * `520:11647`). Required-field `*` markers are appended at render time, not
 * baked into these labels.
 *
 * F014 round 4: `WRITE_KUDO_COPY` holds i18n catalog KEYS (`composer.*`),
 * not raw strings — consumers resolve them via `t()` at render time (same
 * pattern as `SunnerStat.label` in `sun-kudos-content.ts`).
 *
 * The old mock `SUNNER_OPTIONS` list is gone: its fake ids ("sunner-1..9")
 * leaked into `createKudo`'s uuid `receiver_id` insert. Recipients now always
 * come from real `sunners` rows (server-fetched or `useSunnerOptions`).
 */
export interface SunnerOption {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

/**
 * Fixed catalog of selectable hashtags for the composer dropdown (FR-008,
 * MoMorph "Dropdown list hashtag" `p9zO-c4a4x`). These are the Sun* company
 * values — a stable set, so a static constant (not a DB table) is the KISS
 * source. ("#High-performing" corrects the design's "#High-perorming" typo.)
 */
export const HASHTAG_OPTIONS: readonly string[] = [
  "#High-performing",
  "#BE PROFESSIONAL",
  "#BE OPTIMISTIC",
  "#BE A TEAM",
  "#THINK OUTSIDE THE BOX",
  "#GET RISKY",
  "#GO FAST",
  "#WASSHOI",
];

/** Catalog keys for every field in the composer (FR-004..011). */
export const WRITE_KUDO_COPY = {
  title: "composer.title",
  recipientLabel: "composer.recipientLabel",
  recipientPlaceholder: "composer.recipientPlaceholder",
  awardLabel: "composer.awardLabel",
  awardPlaceholder: "composer.awardPlaceholder",
  awardHints: ["composer.awardHint1", "composer.awardHint2"],
  contentPlaceholder: "composer.contentPlaceholder",
  contentHint: "composer.contentHint",
  communityStandards: "composer.communityStandards",
  hashtagLabel: "composer.hashtagLabel",
  addHashtag: "composer.addHashtag",
  maxNote: "composer.maxNote", // keep in sync with MAX_HASHTAGS in write-kudo-form.ts (kept literal to avoid a circular import)
  imageLabel: "composer.imageLabel",
  addImage: "composer.addImage",
  anonymousLabel: "composer.anonymousLabel",
  cancel: "composer.cancel",
  submit: "composer.submit",
} satisfies Record<string, MessageKey | readonly MessageKey[]>;
