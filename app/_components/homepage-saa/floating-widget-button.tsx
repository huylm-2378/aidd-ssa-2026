"use client";

import { useState } from "react";

/**
 * Fixed bottom-right quick-action pill button. Opens a stub menu on click
 * (FR-006) -- menu content beyond a placeholder is out of scope for this MVP.
 */
export default function FloatingWidgetButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-40 sm:bottom-10 sm:right-5">
      {isOpen && (
        <div
          role="menu"
          className="absolute bottom-full right-0 mb-3 w-56 rounded-lg border border-[#998c5f] bg-[#101417] p-4 shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]"
        >
          <p className="font-montserrat text-sm font-bold text-white">
            Quick actions
          </p>
          <p className="mt-1 font-montserrat text-xs text-white/60">
            Write a kudos or view SAA rules (coming soon).
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open quick actions"
        className="flex items-center gap-2 rounded-full bg-[#ffea9e] px-4 py-4 shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287] transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101a] active:scale-95"
      >
        <PenIcon />
        <span className="font-montserrat text-2xl font-bold leading-8 text-[#00101a]">
          /
        </span>
        <KudosMarkIcon />
      </button>
    </div>
  );
}

function PenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#00101a]" fill="none" stroke="currentColor" aria-hidden>
      <path
        d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KudosMarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#00101a]" fill="currentColor" aria-hidden>
      <path d="M4 12l5-8 3 5 3-5 5 8-5 8-3-5-3 5-5-8z" />
    </svg>
  );
}
