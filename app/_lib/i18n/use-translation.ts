import { createContext, useContext } from "react";
import { vi, type Messages, type MessageKey } from "./vi";
import { en } from "./en";

// Re-exported so consumers (components, tests) can `import { type MessageKey }
// from "./use-translation"` alongside `useTranslation` without a second
// import from "./vi".
export type { MessageKey };

export type Locale = "vi" | "en";

const catalogs: Record<Locale, Messages> = { vi, en };

/**
 * Replaces `{token}` placeholders in `template` with values from `vars`.
 * Pure. Returns `template` unchanged when `vars` is omitted; a token absent
 * from `vars` is left as-is rather than dropped.
 */
export function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, token: string) =>
    token in vars ? String(vars[token]) : match,
  );
}

/**
 * Builds a `t()` resolver bound to `lang`. Fallback chain: active locale ->
 * `vi` -> the raw key itself — so a bare key is only ever rendered if `vi`
 * genuinely lacks the entry too (never for a key that exists in `vi`, per
 * AC-3). Interpolates `{token}` vars on the way out.
 */
export function makeT(lang: Locale) {
  return function t(key: MessageKey, vars?: Record<string, string | number>): string {
    const raw = catalogs[lang][key] ?? vi[key] ?? key;
    return interpolate(raw, vars);
  };
}

interface LanguageContextValue {
  lang: Locale;
  setLang: (lang: Locale) => void;
  t: ReturnType<typeof makeT>;
}

/**
 * Default context value = a working VI translator. Components that consume
 * `useTranslation()` without a wrapping `LanguageProvider` (existing
 * unwrapped tests) still resolve real VI copy instead of crashing or
 * rendering raw keys (AC-7). `setLang` is a no-op here — there is no state
 * to update outside the provider.
 */
export const LanguageContext = createContext<LanguageContextValue>({
  lang: "vi",
  setLang: () => {},
  t: makeT("vi"),
});

export function useTranslation(): LanguageContextValue {
  return useContext(LanguageContext);
}
