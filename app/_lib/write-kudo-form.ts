/**
 * Pure form model + validation for the "Viết Kudo" composer (F006). No DOM,
 * no network — the orchestrator (`WriteKudoModal`) owns the single mutable
 * `WriteKudoForm` and calls `canSubmit` to gate the "Gửi" button
 * (FR-011/SC-002). Unit-tested in isolation in `write-kudo-form.test.ts`.
 */
import type { SunnerOption } from "./write-kudo-content";
import type { MessageKey } from "./i18n/use-translation";

export const MAX_HASHTAGS = 5;
export const MAX_IMAGES = 5;

export interface KudoImage {
  id: string;
  url: string;
}

export interface WriteKudoForm {
  recipient: SunnerOption | null;
  award: string;
  body: string;
  hashtags: string[];
  images: KudoImage[];
  anonymous: boolean;
}

export const EMPTY_FORM: WriteKudoForm = {
  recipient: null,
  award: "",
  body: "",
  hashtags: [],
  images: [],
  anonymous: false,
};

/**
 * i18n catalog keys for the required fields still missing, in form order.
 * Empty → the form is submittable. Drives both the "Gửi"/"Send" gate and the
 * "what's missing" hint so the two never disagree (FR-006, FR-007, FR-008,
 * FR-011). Whitespace-only award/body text does not count as filled.
 *
 * F014 round 4: returns `MessageKey`s (not raw labels) — the caller
 * (`WriteKudoModal`) resolves each via `t()` at render time (same pattern as
 * `SunnerStat.label` in `sun-kudos-content.ts`).
 */
export function missingRequired(form: WriteKudoForm): MessageKey[] {
  const missing: MessageKey[] = [];
  if (form.recipient === null) missing.push("composer.field.recipient");
  if (form.award.trim().length === 0) missing.push("composer.field.award");
  if (form.body.trim().length === 0) missing.push("composer.field.content");
  if (form.hashtags.length < 1) missing.push("composer.field.hashtag");
  return missing;
}

/** "Gửi" is enabled iff no required field is missing. */
export function canSubmit(form: WriteKudoForm): boolean {
  return missingRequired(form).length === 0;
}
