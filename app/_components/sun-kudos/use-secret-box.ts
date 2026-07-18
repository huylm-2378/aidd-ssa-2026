"use client";

import { useCallback, useRef, useState } from "react";
import { openSecretBox } from "../../sun-kudos/secret-box-actions";
// Type-only import — erased at compile time, so the server-only module
// (`next/headers` via ../supabase/server) never enters the client bundle.
import type { SecretBoxState } from "../../_lib/secret-box/queries";
import type { MessageKey } from "../../_lib/i18n/vi";

/**
 * Client state for the Secret Box modal (F016). Both CTAs (kudos sidebar +
 * profile stats) use this hook: it owns the open flag, the trigger ref for
 * focus restore, and the box-opening flow. Counts hydrate from the
 * server-computed `initial` snapshot (FR-004); every open goes through the
 * `openSecretBox` server action → `open_secret_box()` RPC, and the local
 * counts only move on a confirmed result (BR-002 — the client never decides).
 */
export function useSecretBox(initial: SecretBoxState) {
  const [open, setOpen] = useState(false);
  const [unopened, setUnopened] = useState(initial.unopened);
  const [opened, setOpened] = useState(initial.opened);
  const [lastBadgeCode, setLastBadgeCode] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const [errorKey, setErrorKey] = useState<MessageKey | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openModal = useCallback(() => {
    setErrorKey(null);
    setOpen(true);
  }, []);
  const closeModal = useCallback(() => setOpen(false), []);

  const onOpenBox = useCallback(() => {
    // DEC-001 gate — an inert box never fires a request (FR-007/SC-003).
    if (unopened <= 0 || opening) return;
    setOpening(true);
    setErrorKey(null);
    void openSecretBox()
      .then((result) => {
        if (result.ok && result.badgeCode) {
          setLastBadgeCode(result.badgeCode);
          setUnopened(result.remaining ?? Math.max(0, unopened - 1));
          setOpened((count) => count + 1);
          return;
        }
        setErrorKey(
          result.error === "no_boxes"
            ? "secretBox.noBoxes"
            : result.error === "auth_required"
              ? "secretBox.signInPrompt"
              : "secretBox.error",
        );
      })
      .catch(() => setErrorKey("secretBox.error"))
      .finally(() => setOpening(false));
  }, [unopened, opening]);

  return {
    open,
    openModal,
    closeModal,
    triggerRef,
    unopened,
    opened,
    lastBadgeCode,
    opening,
    errorKey,
    onOpenBox,
    authState: initial.authState,
  };
}
