/**
 * Pure form model + validation for the "Viết Kudo" composer (F006). No DOM,
 * no network — the orchestrator (`WriteKudoModal`) owns the single mutable
 * `WriteKudoForm` and calls `canSubmit` to gate the "Gửi" button
 * (FR-011/SC-002). Unit-tested in isolation in `write-kudo-form.test.ts`.
 */
import type { SunnerOption } from "./write-kudo-content";

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
 * Labels of the required fields still missing, in form order. Empty → the form
 * is submittable. Drives both the "Gửi" gate and the "what's missing" hint so
 * the two never disagree (FR-006, FR-007, FR-008, FR-011). Whitespace-only
 * award/body text does not count as filled.
 */
export function missingRequired(form: WriteKudoForm): string[] {
  const missing: string[] = [];
  if (form.recipient === null) missing.push("Người nhận");
  if (form.award.trim().length === 0) missing.push("Danh hiệu");
  if (form.body.trim().length === 0) missing.push("Nội dung");
  if (form.hashtags.length < 1) missing.push("ít nhất 1 Hashtag");
  return missing;
}

/** "Gửi" is enabled iff no required field is missing. */
export function canSubmit(form: WriteKudoForm): boolean {
  return missingRequired(form).length === 0;
}
