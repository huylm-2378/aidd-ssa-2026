/**
 * Resolves a `ToggleHeartResult.error` (F015's server action) into a
 * user-facing message for `HeartButton`. Mirrors `resolveComposerError` /
 * `write-kudo-error.ts` exactly, one level down for the hearts feature.
 *
 * A server action has no React context, so it can't call `t()` — known
 * failures come back as a stable `ToggleHeartErrorCode`, which this module
 * translates. Anything else (a Supabase `error.message` or a caught
 * `Error.message`) is a dynamic, already-human-readable string and is
 * returned as-is. Pure — no DOM, no network — so it's unit-testable in
 * isolation.
 */
import type { ToggleHeartErrorCode } from "../sun-kudos/actions";
import type { MessageKey } from "./i18n/use-translation";

const ERROR_MESSAGE_KEYS: Record<ToggleHeartErrorCode, MessageKey> = {
  auth_required: "hearts.signInRequired",
  unknown: "hearts.error",
};

function isKnownErrorCode(code: string): code is ToggleHeartErrorCode {
  return code in ERROR_MESSAGE_KEYS;
}

/** `error` undefined -> the generic "couldn't update" fallback (translated). */
export function resolveHeartError(
  t: (key: MessageKey) => string,
  error: string | undefined,
): string {
  if (!error) return t("hearts.error");
  return isKnownErrorCode(error) ? t(ERROR_MESSAGE_KEYS[error]) : error;
}
