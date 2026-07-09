"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_HASHTAGS } from "../../_lib/write-kudo-form";
import { HASHTAG_OPTIONS, WRITE_KUDO_COPY } from "../../_lib/write-kudo-content";
import { useTranslation } from "../../_lib/i18n/use-translation";

interface HashtagFieldProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

const LISTBOX_ID = "hashtag-dropdown";

/**
 * "Hashtag *" multi-select dropdown (F006 FR-008, MoMorph "Dropdown list
 * hashtag" `p9zO-c4a4x`). Options come from the fixed `HASHTAG_OPTIONS`
 * catalog. Controlled: parent owns `value`. A "+ Hashtag" pill toggles a
 * dropdown of checkable rows; clicking a row toggles that tag in `value`.
 * Capped at `MAX_HASHTAGS` — unselected rows disable once the cap is reached.
 * Selected tags also render as removable chips so the closed field shows the
 * current choice (the design frame only depicts the open dropdown).
 */
export default function HashtagField({ value, onChange }: HashtagFieldProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const atCap = value.length >= MAX_HASHTAGS;

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle(tag: string) {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else if (value.length < MAX_HASHTAGS) {
      onChange([...value, tag]);
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap items-start gap-2">
        <div ref={rootRef} className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls={LISTBOX_ID}
            onClick={() => setOpen((o) => !o)}
            className="flex h-12 items-center gap-2 rounded-lg border border-[#998c5f] bg-white px-2 text-left"
          >
            <PlusIcon />
            <span className="flex flex-col leading-tight">
              <span className="font-montserrat text-base font-bold text-[#00101a]">
                {t(WRITE_KUDO_COPY.hashtagLabel)}
                <span className="text-[#e46060]">*</span>
              </span>
              <span className="font-montserrat text-xs font-bold text-[#998c5f]">
                {t(WRITE_KUDO_COPY.maxNote)}
              </span>
            </span>
          </button>

          {open && (
            <ul
              id={LISTBOX_ID}
              aria-label={t(WRITE_KUDO_COPY.hashtagLabel)}
              className="absolute left-0 top-full z-10 mt-1 flex w-[318px] flex-col gap-0.5 rounded-lg border border-[#998c5f] bg-[#00070c] p-1.5"
            >
              {HASHTAG_OPTIONS.map((tag) => {
                const selected = value.includes(tag);
                const disabled = !selected && atCap;
                return (
                  <li key={tag}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      disabled={disabled}
                      onClick={() => toggle(tag)}
                      className={`flex h-10 w-full items-center justify-between rounded-sm px-4 font-montserrat text-base font-bold text-white transition-colors ${
                        selected ? "bg-[#ffea9e]/20" : "hover:bg-white/10"
                      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      <span>{tag}</span>
                      {selected && <CheckCircleIcon />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {value.map((tag) => (
          <span
            key={tag}
            className="flex h-12 items-center gap-2 rounded-lg border border-[#998c5f] bg-white px-2 font-montserrat text-sm font-bold text-[#00101a]"
          >
            {tag}
            <button
              type="button"
              aria-label={t("composer.removeHashtag", { tag })}
              onClick={() => removeTag(tag)}
              className="flex h-4 w-4 items-center justify-center text-[#998c5f]"
            >
              <CloseTinyIcon />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#00101a]" fill="none" stroke="currentColor" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#fff" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        fill="none"
        stroke="#00101a"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseTinyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}
