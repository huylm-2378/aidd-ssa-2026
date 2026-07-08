"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import WriteKudoModal from "../sun-kudos/write-kudo-modal";

// mm:313:9140 "Widget Button" -- column layout (gap 20px, align-items flex-end)
// with the pills stacked above the toggle in document order; anchoring the
// container's bottom edge and growing upward matches the Figma frame exactly.
const PILL_CLASSES =
  "flex items-center gap-2 rounded bg-[#ffea9e] p-4 font-montserrat text-2xl font-bold leading-8 text-[#00101a] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-transform duration-150 hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101a] motion-reduce:transition-none motion-reduce:hover:scale-100";

/**
 * Homepage floating action button (F010, mm:313:9139 "Floating Action Button
 * - phim nổi chức năng 2"). Collapsed: a 56x56 round red toggle with a "+"
 * glyph. Opened: the toggle rotates into "x" and reveals two gold pills --
 * "Thể lệ" (links to /awards-information) and "Viết KUDOS" (opens the
 * existing WriteKudoModal, closing this menu first). The menu closes on the
 * toggle, Escape, or an outside click -- the same pattern as
 * `hashtag-field.tsx` -- and returns focus to the toggle button.
 */
export default function FloatingWidgetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  function close() {
    setIsOpen(false);
    toggleRef.current?.focus();
  }

  // Close the menu on outside click or Escape (mirrors hashtag-field.tsx).
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  function handleWriteKudos() {
    setIsOpen(false);
    setComposerOpen(true);
  }

  return (
    <>
      <div
        ref={rootRef}
        className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-5 sm:bottom-10 sm:right-5"
      >
        {isOpen && (
          <div className="flex flex-col items-end gap-5">
            <Link
              href="/awards-information"
              onClick={() => setIsOpen(false)}
              className={PILL_CLASSES}
            >
              <SunSparkIcon />
              Thể lệ
            </Link>
            <button type="button" onClick={handleWriteKudos} className={PILL_CLASSES}>
              <PenIcon />
              Viết KUDOS
            </button>
          </div>
        )}

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Đóng menu thao tác" : "Mở menu thao tác"}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#d4271d] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4271d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101a] active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <PlusIcon open={isOpen} />
        </button>
      </div>

      <WriteKudoModal open={composerOpen} onClose={() => setComposerOpen(false)} triggerRef={toggleRef} />
    </>
  );
}

/** "+" that rotates 45deg into "x" when the menu is open (FR-003, FR-007). */
function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 text-white transition-transform duration-200 motion-reduce:transition-none motion-reduce:duration-0 ${
        open ? "rotate-45" : "rotate-0"
      }`}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#00101a]" fill="none" stroke="currentColor" aria-hidden>
      <path
        d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sun* spark mark (mm:I313:9140;214:3799;186:1763 "MM_MEDIA_LOGO"). */
function SunSparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="#d4271d" aria-hidden>
      <path d="M14.2 2 5.6 13.4h4.7l-1.6 8.6 9.7-12.6h-5.1z" />
    </svg>
  );
}
