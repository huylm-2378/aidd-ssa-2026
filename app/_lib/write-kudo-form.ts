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
 * "Gửi" is enabled iff recipient, danh hiệu, content, and at least one
 * hashtag are all set (FR-006, FR-007, FR-008, FR-011). Whitespace-only
 * award/body text does not count as filled.
 */
export function canSubmit(form: WriteKudoForm): boolean {
  return (
    form.recipient !== null &&
    form.award.trim().length > 0 &&
    form.body.trim().length > 0 &&
    form.hashtags.length >= 1
  );
}
