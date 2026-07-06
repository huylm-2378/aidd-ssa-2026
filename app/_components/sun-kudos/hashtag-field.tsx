"use client";

import { useState } from "react";
import { MAX_HASHTAGS } from "../../_lib/write-kudo-form";
import { WRITE_KUDO_COPY } from "../../_lib/write-kudo-content";

interface HashtagFieldProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

/**
 * "Hashtag *" chip field (FR-008, MoMorph `mms_E_Frame 536`). Controlled:
 * parent owns `value`; adding/removing a chip reports the next array via
 * `onChange`. Capped at `MAX_HASHTAGS` — the "+ Hashtag" button is hidden
 * once the cap is reached.
 */
export default function HashtagField({ value, onChange }: HashtagFieldProps) {
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const atCap = value.length >= MAX_HASHTAGS;

  function commitDraft() {
    const normalized = normalizeTag(draft);
    if (normalized && !value.includes(normalized) && value.length < MAX_HASHTAGS) {
      onChange([...value, normalized]);
    }
    setDraft("");
    setAdding(false);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-0.5 font-montserrat text-base font-bold text-[#00101a]">
          {WRITE_KUDO_COPY.hashtagLabel}
          <span className="text-[#e46060]">*</span>
        </label>
        <span className="font-montserrat text-xs font-bold text-[#998c5f]">
          ({WRITE_KUDO_COPY.maxNote})
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex h-12 items-center gap-2 rounded-lg border border-[#998c5f] bg-white px-2 font-montserrat text-sm font-bold text-[#00101a]"
          >
            {tag}
            <button
              type="button"
              aria-label={`Xóa hashtag ${tag}`}
              onClick={() => removeTag(tag)}
              className="flex h-4 w-4 items-center justify-center text-[#998c5f]"
            >
              <CloseTinyIcon />
            </button>
          </span>
        ))}

        {adding && !atCap && (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitDraft();
              }
              if (e.key === "Escape") {
                setDraft("");
                setAdding(false);
              }
            }}
            placeholder="#hashtag"
            className="h-12 w-32 rounded-lg border border-[#998c5f] bg-white px-3 font-montserrat text-sm font-bold text-[#00101a] focus-visible:outline-none"
          />
        )}

        {!atCap && !adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex h-12 items-center gap-1 rounded-lg border border-[#998c5f] bg-white px-3 font-montserrat text-sm font-bold text-[#00101a]"
          >
            <PlusIcon />
            {WRITE_KUDO_COPY.addHashtag}
          </button>
        )}
      </div>
    </div>
  );
}

function normalizeTag(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeWidth={2} strokeLinecap="round" />
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
