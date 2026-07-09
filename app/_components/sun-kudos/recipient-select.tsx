"use client";

import { useEffect, useRef, useState } from "react";
import { WRITE_KUDO_COPY, type SunnerOption } from "../../_lib/write-kudo-content";
import { useTranslation } from "../../_lib/i18n/use-translation";

interface RecipientSelectProps {
  value: SunnerOption | null;
  onChange: (sunner: SunnerOption | null) => void;
  /**
   * Recipient directory (F007: real Supabase rows — server-fetched or via
   * `useSunnerOptions`). NEVER a mock: mock ids ("sunner-3") once leaked into
   * `createKudo` and broke the uuid `receiver_id` insert.
   */
  options?: readonly SunnerOption[];
}

/**
 * "Người nhận *" — recipient autocomplete (FR-005, MoMorph `mms_B.2_Search`).
 * Controlled: parent owns `value`; this field only reports the selection.
 * Typing filters `options` (case-insensitive, contains); picking a result fills
 * the field and closes the list.
 */
export default function RecipientSelect({
  value,
  onChange,
  options = [],
}: RecipientSelectProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on a real outside click — NOT on blur. A blur-timeout close races
  // with focus churn (the dialog focus-trap / React StrictMode focus-bounce)
  // and would auto-close the list right after the modal auto-focuses this field,
  // making it look like the dropdown never loads until you click it.
  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const matches =
    query.trim().length === 0
      ? options
      : options.filter((sunner) =>
          sunner.name.toLowerCase().includes(query.trim().toLowerCase()),
        );

  function handleInputChange(next: string) {
    setQuery(next);
    setOpen(true);
    if (value !== null) onChange(null);
  }

  function handleSelect(sunner: SunnerOption) {
    onChange(sunner);
    setQuery(sunner.name);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="flex w-full items-center gap-4">
      <label
        htmlFor="write-kudo-recipient"
        className="flex w-[146px] shrink-0 items-center gap-0.5 font-montserrat text-base font-bold text-[#00101a]"
      >
        {t(WRITE_KUDO_COPY.recipientLabel)}
        <span className="text-[#e46060]">*</span>
      </label>

      <div className="relative flex-1">
        <input
          id="write-kudo-recipient"
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="write-kudo-recipient-list"
          autoComplete="off"
          placeholder={t(WRITE_KUDO_COPY.recipientPlaceholder)}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          // Open on user click or typing — NOT on focus: the dialog focus-trap
          // programmatically focuses this field when the modal opens, and opening
          // on that would auto-drop the list over the form. Click-outside closes.
          onClick={() => setOpen(true)}
          className="h-14 w-full rounded-lg border border-[#998c5f] bg-white px-6 py-4 font-montserrat text-base font-bold text-[#00101a] focus-visible:outline-none"
        />
        <DownIcon open={open} />

        {open && matches.length > 0 && (
          <ul
            id="write-kudo-recipient-list"
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 max-h-60 overflow-y-auto rounded-lg border border-[#998c5f] bg-white py-1 shadow-[0_4px_4px_rgba(0,0,0,0.15)]"
          >
            {matches.map((sunner) => (
              <li key={sunner.id} role="option" aria-selected={value?.id === sunner.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(sunner)}
                  className="flex w-full items-center justify-between px-6 py-2 text-left font-montserrat text-sm font-bold text-[#00101a] hover:bg-[#fff8e1]"
                >
                  <span>{sunner.name}</span>
                  <span className="text-xs font-normal text-[#998c5f]">{sunner.role}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DownIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute right-6 top-1/2 h-6 w-6 -translate-y-1/2 text-[#00101a] transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
