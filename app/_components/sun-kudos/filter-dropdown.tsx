"use client";

import { useState } from "react";
import { useTranslation } from "../../_lib/i18n/use-translation";

/**
 * Controlled filter dropdown for the Highlight Kudos section (FIX 3). Renders
 * an explicit translated "clear" entry (`filter.clearAll`) above `options` to
 * reset the selection back to "all"; the actual filtering happens in the
 * parent, which owns `selected`.
 *
 * `selected` is the match key compared against `options` for `aria-selected`.
 * Optional `display` overrides only the trigger button's text (e.g. to append
 * a count) without breaking that option-matching contract.
 */
export default function FilterDropdown({
  label,
  options,
  selected,
  display,
  onChange,
}: {
  label: string;
  options: readonly string[];
  selected: string | null;
  display?: string;
  onChange: (value: string | null) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const choose = (value: string | null) => {
    onChange(value);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-[#998c5f] bg-[#ffea9e]/10 px-4 py-2 font-montserrat text-sm font-bold text-white transition-colors hover:bg-[#ffea9e]/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]"
      >
        {display ?? selected ?? label}
        <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" aria-hidden>
          <path d="M6 9l6 6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-10 mt-2 min-w-[160px] overflow-hidden rounded-md border border-[#998c5f] bg-[#101417] shadow-lg"
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={selected === null}
              onClick={() => choose(null)}
              className="block w-full px-4 py-2 text-left font-montserrat text-sm font-bold text-[#ffea9e] transition-colors hover:bg-white/10"
            >
              {t("filter.clearAll")}
            </button>
          </li>
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={selected === option}
                onClick={() => choose(option)}
                className="block w-full px-4 py-2 text-left font-montserrat text-sm text-white transition-colors hover:bg-white/10"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
