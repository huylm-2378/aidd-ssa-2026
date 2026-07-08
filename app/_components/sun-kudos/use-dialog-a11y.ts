"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface UseDialogA11yOptions {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement | null>;
  triggerRef?: RefObject<HTMLElement | null>;
}

/**
 * Reusable modal dialog behaviour (F006 SC-005): Escape-to-close, body
 * scroll lock while open, and a focus trap that moves focus into the dialog
 * on open, cycles Tab/Shift+Tab within it, and restores focus to the
 * trigger on close. All effects are no-ops while `open` is false.
 */
export function useDialogA11y({ open, onClose, containerRef, triggerRef }: UseDialogA11yOptions) {
  // Escape closes the dialog (FR-003).
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Body scroll lock while open (FR-002).
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Focus trap: move focus in on open, cycle within container, restore on close.
  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = container?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const first = focusables?.[0];
    // preventScroll: a dialog whose only focusable elements sit below the fold
    // (e.g. the rules drawer's footer buttons) would otherwise scroll its panel
    // to the footer on open, hiding the title. Focus without scrolling.
    first?.focus({ preventScroll: true });

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab" || !container) return;
      const items = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    }
    document.addEventListener("keydown", handleTab);
    const trigger = triggerRef?.current;

    return () => {
      document.removeEventListener("keydown", handleTab);
      (trigger ?? previouslyFocused)?.focus();
    };
  }, [open, containerRef, triggerRef]);
}
