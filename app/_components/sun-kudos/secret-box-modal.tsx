"use client";

import { useCallback, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "../../_lib/use-mounted";
import { useTranslation, type MessageKey } from "../../_lib/i18n/use-translation";
import { useDialogA11y } from "./use-dialog-a11y";
import SecretBoxIllustration from "./secret-box-illustration";

export interface SecretBoxModalProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
  /** Real per-sunner count still available to open (BR-001: `floor(hearts / 5) - opened`, never negative). */
  unopened: number;
  /** Real per-sunner count already opened. Not shown visually in this "chưa mở" design frame — surfaced only via `aria-label` for extra screen-reader context (FR-004). */
  opened: number;
  /** `sunner_badges.badge_code` from the most recent open, or `null` before any box has been opened this session. */
  lastBadgeCode: string | null;
  /** RPC call in flight (SM-001 `opening` state) — box is inert while true. */
  opening: boolean;
  /** Fires only when the box is a live click target (`unopened > 0 && !opening`) — DEC-001. */
  onOpenBox: () => void;
  /** `"anon"` replaces the counter/box content with a sign-in prompt (FR-008) — no count is ever computed for a session-less request. */
  authState: "authed" | "anon";
  /** Stable message key for a failed open (`useSecretBox` maps action error codes) — rendered inline under the box; `null`/absent hides the line. */
  errorKey?: MessageKey | null;
}

const TITLE_ID = "secret-box-modal-title";

/**
 * "Secret Box" reward modal (F016, MoMorph `J3-4YFIpMM` — "chưa mở"/unopened
 * frame). Portal + `useMounted` + `useDialogA11y` shape copied from
 * `RulesModal`, but **centered** (`items-center justify-center`) like
 * `WriteKudoModal` rather than a right-anchored drawer (US001 FR-002).
 *
 * Presentational only: no server action, no Supabase call, no navigation —
 * the caller supplies `unopened`/`opened`/`lastBadgeCode`/`opening` as props
 * and reacts to `onOpenBox`/`onClose`. Integration (wiring the real
 * `openSecretBox()` server action + the two existing CTA buttons) is a
 * separate phase.
 */
export default function SecretBoxModal({
  open,
  onClose,
  triggerRef,
  unopened,
  opened,
  lastBadgeCode,
  opening,
  onOpenBox,
  authState,
  errorKey = null,
}: SecretBoxModalProps) {
  const { t } = useTranslation();
  const mounted = useMounted();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useDialogA11y({ open, onClose: handleClose, containerRef, triggerRef });

  if (!mounted || !open) return null;

  // FR-007 / DEC-001: the box is a live click target only with entitlement left and no request in flight.
  const boxEnabled = authState === "authed" && unopened > 0 && !opening;
  const handleBoxClick = () => {
    if (boxEnabled) onOpenBox();
  };
  const unopenedDisplay = String(Math.max(0, unopened)).padStart(2, "0");

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60" onClick={handleClose}>
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={TITLE_ID}
          onClick={(e) => e.stopPropagation()}
          className="flex w-full flex-col items-center gap-5 rounded-[13px] bg-[#00101a] px-3 py-6 font-montserrat sm:max-w-[652px] sm:gap-[22px] sm:px-[13px] sm:py-8"
        >
          <div className="relative flex w-full items-center justify-center">
            <h2 id={TITLE_ID} className="text-center text-xl font-bold uppercase leading-tight text-[#ffea9e] sm:text-[26px]">
              {t("secretBox.title")}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              aria-label={t("secretBox.closeLabel")}
              className="absolute right-0 flex h-6 w-6 shrink-0 items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static local design asset */}
              <img src="/secret-box/close-icon.svg" alt="" aria-hidden className="h-full w-full" />
            </button>
          </div>

          <div className="h-px w-full bg-[#2e3940]" />

          {authState === "anon" ? (
            <p role="status" className="w-full py-10 text-center text-sm font-bold text-white">
              {t("secretBox.signInPrompt")}
            </p>
          ) : (
            <>
              {unopened > 0 && (
                <p className="w-full text-center text-xs font-bold tracking-[0.4px] text-white sm:text-[13px]">
                  {t("secretBox.instruction")}
                </p>
              )}

              <SecretBoxIllustration disabled={!boxEnabled} opening={opening} onClick={handleBoxClick} lastBadgeCode={lastBadgeCode} />

              {errorKey && (
                <p role="status" className="w-full text-center text-xs font-bold text-[#f17676] sm:text-[13px]">
                  {t(errorKey)}
                </p>
              )}

              <div
                className="flex w-full items-center justify-center gap-1.5"
                aria-label={t("secretBox.counterAria", { count: unopenedDisplay, opened: Math.max(0, opened) })}
              >
                <span aria-hidden className="text-xs font-bold tracking-[0.4px] text-white sm:text-[13px]">
                  {t("secretBox.counterLabel")}
                </span>
                <span aria-hidden className="text-2xl font-bold text-[#ffea9e] sm:text-[29px]">
                  {unopenedDisplay}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
