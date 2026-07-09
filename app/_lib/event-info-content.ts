/**
 * Hero event info block content (datetime / venue). Ships with the MoMorph
 * mock's literal rendered copy per the approved spec (technical-spec.md >
 * Assumptions), kept as named constants rather than inline strings so they
 * can be swapped later without touching markup. These are data (a date, a
 * proper-noun venue), not UI copy, so they are NOT part of the i18n catalog
 * (F014) and stay untranslated in both locales.
 *
 * The broadcast note WAS here (`EVENT_BROADCAST_NOTE`) but is UI copy, so
 * F014 moved it to the i18n catalog as `hero.broadcastNote`.
 */
export const EVENT_DATETIME_LABEL = "26/12/2025";
export const EVENT_VENUE_LABEL = "Âu Cơ Art Center";
