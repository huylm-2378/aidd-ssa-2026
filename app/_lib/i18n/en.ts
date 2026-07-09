import type { Messages } from "./vi";
import { enCore } from "./messages/en-core";
import { enKudos } from "./messages/en-kudos";
import { enComposer } from "./messages/en-composer";

/**
 * English message catalog. Must carry the exact key set of `vi.ts` — the
 * `Messages` type (derived from `vi`) makes a missing or extra key a
 * TypeScript compile error (AC-2).
 *
 * Composed from `messages/en-core.ts` + `messages/en-kudos.ts` +
 * `messages/en-composer.ts`, mirroring the `vi-core.ts` / `vi-kudos.ts` /
 * `vi-composer.ts` split. Each fragment is already type-checked against its
 * VI counterpart (`Record<keyof typeof viCore, string>` etc.); this
 * assignment is the final check that all three fragment pairs together
 * match `vi`'s full key set.
 *
 * Strings already English in the VI catalog (brand names, nav labels) keep
 * the identical value here; everything else is a machine translation by the
 * implementer, open to later human review (see technical-spec.md U3).
 */
export const en: Messages = { ...enCore, ...enKudos, ...enComposer };
