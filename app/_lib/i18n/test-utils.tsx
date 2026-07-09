import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { LanguageProvider } from "../../_components/i18n/language-provider";
import type { Locale } from "./use-translation";

/**
 * Test-only render helper. Seeds `localStorage["saa-lang"]` with `lang`
 * BEFORE mounting `LanguageProvider`, then renders `ui` inside it.
 *
 * Timing note: the provider always mounts with state `"vi"` first (no
 * hydration mismatch by design — see `language-provider.tsx`) and restores
 * the persisted value in a post-mount `useEffect`. React flushes passive
 * effects synchronously inside the `act()` that Testing Library's `render()`
 * already wraps, so by the time this function returns, a non-default `lang`
 * has already been applied — callers don't need an extra `act()`/`findBy*`.
 *
 * Never imported by route code — test-only, so it never reaches the prod
 * bundle even though it pulls in `@testing-library/react`.
 */
export function renderWithLang(ui: ReactElement, lang: Locale = "vi") {
  try {
    localStorage.setItem("saa-lang", lang);
  } catch {
    // Ignore -- test environments (jsdom) always provide localStorage.
  }
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}
