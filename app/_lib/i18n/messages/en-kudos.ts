import type { viKudos } from "./vi-kudos";

/**
 * English message fragment matching `vi-kudos.ts` key-for-key (F014 round 3:
 * FAB pills, rules drawer, `/sun-kudos` screen). Typed against
 * `keyof typeof viKudos` so a missing/extra key here is a compile error in
 * this file alone.
 */
export const enKudos: Record<keyof typeof viKudos, string> = {
  "fab.rules": "Rules",
  "fab.writeKudos": "Write KUDOS",
  "fab.openMenu": "Open action menu",
  "fab.closeMenu": "Close action menu",

  "rules.title": "Rules",
  "rules.receiversHeading": "KUDOS RECEIVERS: HERO BADGES FOR POSITIVE IMPACT",
  "rules.receiversIntro":
    "Based on how many teammates send you Kudos, you'll earn the matching Hero badge, shown right next to your profile name",
  "rules.sendersHeading": "KUDOS SENDERS: COLLECT ALL 6 ICONS, GET A MYSTERY GIFT",
  "rules.sendersIntro":
    "Every Kudos you send gets posted on the platform and can earn ❤️ from the Sunner community. For every 5 ❤️, you'll unlock a Secret Box with a chance to win one of SAA's 6 exclusive icons.",
  "rules.iconsNote": "Sunners who collect the full set of 6 icons will receive a mystery gift from SAA 2025.",
  "rules.nationalHeading": "NATIONAL KUDOS",
  "rules.nationalCopy":
    "The 5 Kudos with the most ❤️ across all of Sun* will officially become the National Kudos and receive a special gift from SAA 2025: Root Further.",
  "rules.closeLabel": "Close",
  "rules.writeLabel": "Write KUDOS",

  "rules.tier.newHero.count": "1-4 people have sent you Kudos",
  "rules.tier.newHero.desc":
    "The journey of spreading good things begins — the first words of thanks and recognition have found their way to you.",
  "rules.tier.risingHero.count": "5-9 people have sent you Kudos",
  "rules.tier.risingHero.desc":
    "You're steadily growing in your teammates' hearts through your kindness and dedication.",
  "rules.tier.superHero.count": "10–20 people have sent you Kudos",
  "rules.tier.superHero.desc":
    "You've become a trusted, beloved icon — always ready to help, and remembered by many teammates.",
  "rules.tier.legendHero.count": "More than 20 people have sent you Kudos",
  "rules.tier.legendHero.desc":
    "You've become a legend — someone who leaves an unforgettable mark on the team through heart and action.",

  "sunKudos.heroEyebrow": "A system for recognition and appreciation",
  "sunKudos.searchPromptPlaceholder": "Who do you want to send thanks and recognition to today?",
  "sunKudos.searchProfilePlaceholder": "Search for a Sunner profile",
  "sunKudos.highlightEmpty": "No Kudos match this filter",
  "sunKudos.recentGiftsHeading": "10 most recent Sunner gift recipients",
  "sunKudos.departmentFilterLabel": "Department",
  "sunKudos.likesSrLabel": "likes",
  "sunKudos.viewDetails": "View details",

  "carousel.prev": "Previous Kudo",
  "carousel.next": "Next Kudo",
  "carousel.page": "Page {current} of {total}",

  "spotlight.searchLabel": "Search the Spotlight Board",
  "spotlight.searchPlaceholder": "Search",
  "spotlight.recentActivity": "Recent activity",
  "spotlight.expandBoard": "Expand board",
  "spotlight.canvasAria":
    "Sunner constellation board: drag or use arrow keys to move, plus/minus to zoom in or out",
  "spotlight.justReceivedKudos": "just received a Kudos",
  "spotlight.receivedKudos": "received a new Kudos",
  "spotlight.zoomOut": "Zoom out",
  "spotlight.resetPosition": "Reset position",
  "spotlight.zoomIn": "Zoom in",

  "hearts.like": "Like this Kudos",
  "hearts.unlike": "Unlike this Kudos",
  "hearts.signInRequired": "Sign in to heart this Kudos.",
  "hearts.error": "Couldn't update. Please try again.",
};
