/**
 * Static copy for the "Thể lệ" (rules) drawer (F013), faithful to the MoMorph
 * frame "Thể lệ UPDATE" (fileKey `9ypp4enmFmdK3YAFJLIu6C`, screenId
 * `b1Filzi9i6`, figma node `3204:6051`). Hero badge and collectible icon
 * assets live under `public/rules-icons/` (provided, not generated) — paths
 * are percent-encoded (spaces and the Vietnamese "ệ") so they resolve
 * without a redirect from the Next.js static file server.
 *
 * F014 round 3: every translatable string below is a `MessageKey` (see
 * `app/_lib/i18n/messages/vi-kudos.ts` for the VI source copy) rather than a
 * raw string, so this stays a plain, hook-free data module while
 * `rules-modal.tsx` resolves the active-locale text via `t()` at render
 * time. Tier `name`s and icon `name`s stay literal English — they are not
 * translated (design tier/icon names).
 */
import type { MessageKey } from "./i18n/use-translation";

export interface RuleTier {
  name: string;
  badgeSrc: string;
  countKey: MessageKey;
  descKey: MessageKey;
}

export interface CollectibleIcon {
  name: string;
  src: string;
}

/** Hero badge tiers, ascending order (FR-004). */
export const RULE_TIERS: readonly RuleTier[] = [
  {
    name: "New Hero",
    badgeSrc: "/rules-icons/MM_MEDIA_New%20Hero.png",
    countKey: "rules.tier.newHero.count",
    descKey: "rules.tier.newHero.desc",
  },
  {
    name: "Rising Hero",
    badgeSrc: "/rules-icons/MM_MEDIA_Rising%20Hero.png",
    countKey: "rules.tier.risingHero.count",
    descKey: "rules.tier.risingHero.desc",
  },
  {
    name: "Super Hero",
    badgeSrc: "/rules-icons/MM_MEDIA_Super%20Hero.png",
    countKey: "rules.tier.superHero.count",
    descKey: "rules.tier.superHero.desc",
  },
  {
    name: "Legend Hero",
    badgeSrc: "/rules-icons/MM_MEDIA_Legend%20Hero.png",
    countKey: "rules.tier.legendHero.count",
    descKey: "rules.tier.legendHero.desc",
  },
];

/**
 * Collectible icons, mapped in file order to the design labels (FR-005). See
 * technical-spec.md "Unresolved questions" #1 — order assumed from provided
 * filenames, to be corrected if the mapping is wrong.
 */
export const RULE_ICONS: readonly CollectibleIcon[] = [
  { name: "REVIVAL", src: "/rules-icons/Huy%20hi%E1%BB%87u.png" },
  { name: "TOUCH OF LIGHT", src: "/rules-icons/Huy%20hi%E1%BB%87u%20(1).png" },
  { name: "STAY GOLD", src: "/rules-icons/Huy%20hi%E1%BB%87u%20(2).png" },
  { name: "FLOW TO HORIZON", src: "/rules-icons/Huy%20hi%E1%BB%87u%20(3).png" },
  { name: "BEYOND THE BOUNDARY", src: "/rules-icons/Huy%20hi%E1%BB%87u%20(4).png" },
  { name: "ROOT FURTHER", src: "/rules-icons/Huy%20hi%E1%BB%87u%20(5).png" },
] as const;

/** Translation keys for every static text field in the drawer (FR-003, FR-006, FR-007). */
export const RULES_COPY = {
  title: "rules.title",
  receiversHeading: "rules.receiversHeading",
  receiversIntro: "rules.receiversIntro",
  sendersHeading: "rules.sendersHeading",
  sendersIntro: "rules.sendersIntro",
  iconsNote: "rules.iconsNote",
  nationalHeading: "rules.nationalHeading",
  nationalCopy: "rules.nationalCopy",
  closeLabel: "rules.closeLabel",
  writeLabel: "rules.writeLabel",
} satisfies Record<string, MessageKey>;
