"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageContext, makeT, type Locale } from "../../_lib/i18n/use-translation";

const STORAGE_KEY = "saa-lang";

/**
 * Client-only i18n root, mounted in `app/layout.tsx` wrapping `{children}`.
 * `layout.tsx` stays a Server Component — this provider only wraps its
 * children in a client boundary; `metadata` and server-rendered descendants
 * pass through unaffected (see docs/system/architecture.md > i18n).
 *
 * State inits to `"vi"` so the server render and first client paint match
 * (no hydration mismatch); the persisted choice is restored in a post-mount
 * effect, accepting a one-frame VI flash on an EN-persisted reload — a KISS
 * tradeoff over cookie-based SSR locale (technical-spec.md U4).
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Locale>("vi");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "vi" || stored === "en") {
        // One-time restore of the persisted locale after mount. This can't be
        // done during render (localStorage isn't available on the server, and
        // reading it synchronously on first client render would cause a
        // hydration mismatch), so a post-mount effect is the correct place —
        // not the "derive state, don't setState-in-effect" case the rule
        // otherwise guards against.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLangState(stored);
      }
    } catch {
      // localStorage unavailable (SSR guard / privacy mode) -- keep default "vi".
    }
  }, []);

  const setLang = useCallback((next: Locale) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage write failed (quota / disabled) -- in-memory state still updates.
    }
  }, []);

  // Rebuild `t` only when `lang` changes, not on every render (NFR: cheap lookup).
  const value = useMemo(() => ({ lang, setLang, t: makeT(lang) }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
