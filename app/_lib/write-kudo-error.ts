/**
 * Resolves a `CreateKudoResult.error` (F007's server action) into a
 * user-facing message for the composer modal (F014 round 4).
 *
 * A server action has no React context, so it can't call `t()` — known
 * failures come back as a stable `CreateKudoErrorCode`, which this module
 * translates. Anything else (a Supabase `error.message` or a caught
 * `Error.message`) is a dynamic, already-human-readable string and is
 * returned as-is. Pure — no DOM, no network — so it's unit-testable in
 * isolation like `write-kudo-form.ts`.
 */
import type { CreateKudoErrorCode } from "../sun-kudos/actions";
import type { MessageKey } from "./i18n/use-translation";

const ERROR_MESSAGE_KEYS: Record<CreateKudoErrorCode, MessageKey> = {
  missing_fields: "composer.error.missingFields",
  auth_required: "composer.error.authRequired",
  unknown: "composer.error.unknown",
};

/**
 * Caveat of the `code | rawMessage` union: a dynamic message that literally
 * equals a code (e.g. a DB error reading "unknown") would be translated as
 * the code. Unreachable with current Supabase/schema messages — if the code
 * set grows, switch to a `code:`-prefixed convention instead.
 */
function isKnownErrorCode(code: string): code is CreateKudoErrorCode {
  return code in ERROR_MESSAGE_KEYS;
}

/** `error` undefined -> the generic "send failed" fallback (translated). */
export function resolveComposerError(
  t: (key: MessageKey) => string,
  error: string | undefined,
): string {
  if (!error) return t("composer.error.sendFailed");
  return isKnownErrorCode(error) ? t(ERROR_MESSAGE_KEYS[error]) : error;
}
