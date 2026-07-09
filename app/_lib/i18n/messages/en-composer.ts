import type { viComposer } from "./vi-composer";

/**
 * English message fragment matching `vi-composer.ts` key-for-key (F014
 * round 4: the "Viết Kudo" composer modal). Typed against
 * `keyof typeof viComposer` so a missing/extra key here is a compile error
 * in this file alone.
 */
export const enComposer: Record<keyof typeof viComposer, string> = {
  "composer.title": "Send thanks and recognition to a teammate",
  "composer.recipientLabel": "Recipient",
  "composer.recipientPlaceholder": "Search",
  "composer.awardLabel": "Award",
  "composer.awardPlaceholder": "Give your teammate an award",
  "composer.awardHint1": "e.g. The person who motivates me.",
  "composer.awardHint2": "The award will show as your Kudos' title.",
  "composer.contentPlaceholder": "Share your thanks and recognition for your teammate here!",
  "composer.contentHint": 'You can "@ + name" to mention another teammate',
  "composer.communityStandards": "Community standards",
  "composer.hashtagLabel": "Hashtag",
  "composer.addHashtag": "+ Hashtag",
  "composer.maxNote": "Max 5",
  "composer.imageLabel": "Image",
  "composer.addImage": "+ Image",
  "composer.anonymousLabel": "Send this thanks and recognition anonymously",
  "composer.cancel": "Cancel",
  "composer.submit": "Send",

  "composer.toolbar.bold": "Bold",
  "composer.toolbar.italic": "Italic",
  "composer.toolbar.strikethrough": "Strikethrough",
  "composer.toolbar.numberList": "Numbered list",
  "composer.toolbar.link": "Insert link",
  "composer.toolbar.quote": "Quote",

  "composer.imageAlt": "Attached image {n}",
  "composer.removeImage": "Remove image",
  "composer.removeHashtag": "Remove hashtag {tag}",

  "composer.field.recipient": "Recipient",
  "composer.field.award": "Award",
  "composer.field.content": "Content",
  "composer.field.hashtag": "at least 1 Hashtag",
  "composer.missingHint": "Required to send: {fields}",

  "composer.error.missingFields": "Missing required fields.",
  "composer.error.authRequired": "You need to sign in to send a Kudos.",
  "composer.error.unknown": "An unknown error occurred.",
  "composer.error.sendFailed": "Couldn't send the Kudos. Please try again.",
};
