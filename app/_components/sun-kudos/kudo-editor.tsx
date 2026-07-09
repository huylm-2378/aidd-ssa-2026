"use client";

import type { ReactNode } from "react";
import { WRITE_KUDO_COPY } from "../../_lib/write-kudo-content";
import { useTranslation } from "../../_lib/i18n/use-translation";

interface KudoEditorProps {
  value: string;
  onChange: (body: string) => void;
}

/**
 * Content editor (FR-007, MoMorph `mms_C_Chức năng` + `mms_D_text filed`).
 * The B/I/S/number-list/link/quote toolbar is **visual-only** — a real
 * contentEditable rich-text editor is out of scope (YAGNI) — sitting above a
 * styled `<textarea>` that actually captures the body text.
 */
export default function KudoEditor({ value, onChange }: KudoEditorProps) {
  const { t } = useTranslation();
  return (
    <div className="flex w-full flex-col items-end gap-1">
      <div className="flex w-full flex-col items-start overflow-hidden rounded-lg border border-[#998c5f]">
        <div className="flex w-full items-center justify-end border-b border-[#998c5f]">
          <div className="flex items-center">
            <ToolbarButton label={t("composer.toolbar.bold")}>
              <BoldIcon />
            </ToolbarButton>
            <ToolbarButton label={t("composer.toolbar.italic")}>
              <ItalicIcon />
            </ToolbarButton>
            <ToolbarButton label={t("composer.toolbar.strikethrough")}>
              <StrikethroughIcon />
            </ToolbarButton>
            <ToolbarButton label={t("composer.toolbar.numberList")}>
              <NumberListIcon />
            </ToolbarButton>
            <ToolbarButton label={t("composer.toolbar.link")}>
              <LinkIcon />
            </ToolbarButton>
            <ToolbarButton label={t("composer.toolbar.quote")}>
              <QuoteIcon />
            </ToolbarButton>
          </div>
          <button
            type="button"
            className="flex h-10 shrink-0 items-center border-l border-[#998c5f] px-4 font-montserrat text-base font-bold text-[#00101a] underline"
          >
            {t(WRITE_KUDO_COPY.communityStandards)}
          </button>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t(WRITE_KUDO_COPY.contentPlaceholder)}
          rows={6}
          className="min-h-[120px] w-full flex-1 resize-y bg-white px-6 py-4 font-montserrat text-base font-bold text-[#00101a] placeholder:text-[#999999] focus-visible:outline-none"
        />
      </div>

      <p className="w-full font-montserrat text-base font-bold tracking-wide text-[#00101a]">
        {t(WRITE_KUDO_COPY.contentHint)}
      </p>
    </div>
  );
}

function ToolbarButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center border-r border-[#998c5f] text-[#00101a] first:border-l-0"
    >
      {children}
    </button>
  );
}

function BoldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
      <path
        d="M6 4h7a3.5 3.5 0 0 1 0 7H6z M6 11h8a3.5 3.5 0 0 1 0 7H6z"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
      <path
        d="M19 4h-9 M14 20H5 M15 4L9 20"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StrikethroughIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
      <path
        d="M5 12h14 M16 7c-.6-1.4-2-2.2-4-2.2-2.6 0-4.3 1.2-4.3 3 0 1.6 1.2 2.2 3 2.6 M8 17c.6 1.4 2.1 2.2 4.1 2.2 2.6 0 4.4-1.1 4.4-2.9"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NumberListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
      <path
        d="M10 6h10 M10 12h10 M10 18h10 M4 5.5h1.5V9 M4 9h2.5 M4.2 14a1.3 1.3 0 1 1 2 1.1L4 17.5h2.5"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden>
      <path
        d="M10 14a4 4 0 0 0 5.7.4l3-3a4 4 0 0 0-5.7-5.7l-1.6 1.6 M14 10a4 4 0 0 0-5.7-.4l-3 3a4 4 0 0 0 5.7 5.7l1.6-1.6"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M7 8c-1.7 0-3 1.3-3 3v5h5v-5H7c0-1.1.9-2 2-2V8Zm9 0c-1.7 0-3 1.3-3 3v5h5v-5h-2c0-1.1.9-2 2-2V8Z" />
    </svg>
  );
}
