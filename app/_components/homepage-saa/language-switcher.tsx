"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation, type Locale } from "../../_lib/i18n/use-translation";

type LangCode = "VN" | "EN";

const LANGUAGES: readonly { code: LangCode; label: string; flag: string }[] = [
  { code: "VN", label: "VN", flag: "/language-dropdown/VN%20-%20Vietnam.png" },
  { code: "EN", label: "EN", flag: "/language-dropdown/GB-NIR%20-%20Northern%20Ireland.png" },
];

/** UI-language tokens ("VN"/"EN") <-> app locale ("vi"/"en") -- not translated copy. */
const CODE_BY_LOCALE: Record<Locale, LangCode> = { vi: "VN", en: "EN" };
const LOCALE_BY_CODE: Record<LangCode, Locale> = { VN: "vi", EN: "en" };

/**
 * Header language switcher (F012, MoMorph "Dropdown-ngôn ngữ" `hUyaaugye2`).
 * Extracted from `header.tsx`: trigger shows the active language's flag +
 * code + a rotating chevron; the panel lists VN/EN rows with flag icons and
 * highlights the active one. Dismiss (outside mousedown + Escape) mirrors the
 * `hashtag-field.tsx` / `floating-widget-button.tsx` pattern, including focus
 * return to the trigger. Selection flows through the `LanguageProvider`
 * context (F014) -- picking EN/VN here changes app copy everywhere.
 */
export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  // Close the panel on outside click or Escape (mirrors hashtag-field.tsx).
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function selectLang(code: LangCode) {
    setLang(LOCALE_BY_CODE[code]);
    close();
  }

  const selectedLang = CODE_BY_LOCALE[lang];
  const active = LANGUAGES.find((item) => item.code === selectedLang) ?? LANGUAGES[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-0.5 rounded p-2 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e] sm:p-4"
      >
        <FlagIcon flag={active.flag} />
        <span>{active.label}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 flex min-w-[140px] flex-col rounded-lg border border-[#998c5f] bg-[#00070c] p-1.5">
          {LANGUAGES.map((language) => {
            const isActive = language.code === selectedLang;
            return (
              <button
                key={language.code}
                type="button"
                onClick={() => selectLang(language.code)}
                className={`flex w-full items-center justify-between gap-2 rounded px-4 py-4 text-left transition-colors ${
                  isActive ? "bg-[#ffea9e]/20" : "hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FlagIcon flag={language.flag} />
                  <span className="font-montserrat text-[16px] font-bold tracking-[0.15px] text-white">
                    {language.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Decorative flag icon — the adjacent VN/EN text label carries the meaning, so alt is empty. */
function FlagIcon({ flag }: { flag: string }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- static local flag asset */}
      <img src={flag} alt="" aria-hidden className="h-[15px] w-5 object-contain" />
    </span>
  );
}
