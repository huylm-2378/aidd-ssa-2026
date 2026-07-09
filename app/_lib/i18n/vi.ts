import { viCore } from "./messages/vi-core";
import { viKudos } from "./messages/vi-kudos";
import { viComposer } from "./messages/vi-composer";

/**
 * Vietnamese message catalog — canonical shape for the app's i18n layer.
 *
 * Flat, dot-namespaced keys (e.g. "nav.about") rather than nested objects:
 * `t()` is a single object lookup, and every call site is compile-checked
 * against `MessageKey`. VI is the source language; `en.ts` must supply the
 * exact same key set (a missing/extra key there is a TypeScript error —
 * see technical-spec.md AC-2).
 *
 * Composed from per-area fragments under `messages/` so no single file
 * crosses the 200-line budget: `vi-core.ts` (chrome, homepage, Profile,
 * Awards-information — F014 rounds 1/2) + `vi-kudos.ts` (FAB pills, the
 * rules drawer, and the `/sun-kudos` screen — round 3) + `vi-composer.ts`
 * (the "Viết Kudo" composer modal — round 4). Do NOT add `as const` to any
 * fragment or here — that would widen values to string literal types and
 * force `en.ts` to match those literals instead of just `string`.
 */
export const vi = { ...viCore, ...viKudos, ...viComposer };

/** Canonical message shape, derived from the VI catalog. */
export type Messages = typeof vi;
/** Every valid translation key — inferred, not hand-maintained. */
export type MessageKey = keyof Messages;
