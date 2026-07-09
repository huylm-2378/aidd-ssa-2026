"use client";

import { useCallback, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { RULES_COPY, RULE_ICONS, RULE_TIERS, type CollectibleIcon, type RuleTier } from "../../_lib/rules-content";
import { useMounted } from "../../_lib/use-mounted";
import { useTranslation } from "../../_lib/i18n/use-translation";
import { useDialogA11y } from "./use-dialog-a11y";

interface RulesModalProps {
  open: boolean;
  onClose: () => void;
  onWriteKudos?: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
}

const TITLE_ID = "rules-modal-title";

/**
 * "Thể lệ" (rules) drawer (F013, MoMorph `b1Filzi9i6` / node `3204:6051`).
 * Right-anchored dark panel with static rules copy (Hero badge tiers, the
 * 6-icon collectible set, "Kudos Quốc Dân"). Client-only, no data, no
 * persistence — mirrors `WriteKudoModal`'s portal/backdrop/a11y shape exactly
 * so both dialogs behave identically from the FAB.
 */
export default function RulesModal({ open, onClose, onWriteKudos, triggerRef }: RulesModalProps) {
  const mounted = useMounted();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useDialogA11y({ open, onClose: handleClose, containerRef, triggerRef });

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60" onClick={handleClose}>
      <div className="flex min-h-full items-stretch justify-end">
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={TITLE_ID}
          onClick={(e) => e.stopPropagation()}
          className="flex w-full max-w-[553px] flex-col gap-6 bg-[#00070c] p-6 font-montserrat sm:p-10"
        >
          <h2 id={TITLE_ID} className="text-[32px] font-bold leading-tight text-[#ffea9e] sm:text-[45px]">
            {t(RULES_COPY.title)}
          </h2>

          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold uppercase leading-7 text-[#ffea9e] sm:text-[22px]">
              {t(RULES_COPY.receiversHeading)}
            </h3>
            <p className="text-sm font-medium text-white sm:text-base">{t(RULES_COPY.receiversIntro)}</p>
            <div className="flex flex-col gap-4">
              {RULE_TIERS.map((tier) => (
                <TierRow key={tier.name} tier={tier} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold uppercase leading-7 text-[#ffea9e] sm:text-[22px]">
              {t(RULES_COPY.sendersHeading)}
            </h3>
            <p className="text-sm font-medium text-white sm:text-base">{t(RULES_COPY.sendersIntro)}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {RULE_ICONS.map((icon) => (
                <IconTile key={icon.name} icon={icon} />
              ))}
            </div>
            <p className="text-sm font-medium text-white">{t(RULES_COPY.iconsNote)}</p>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold uppercase leading-8 text-[#ffea9e] sm:text-2xl">
              {t(RULES_COPY.nationalHeading)}
            </h3>
            <p className="text-sm font-medium text-white sm:text-base">{t(RULES_COPY.nationalCopy)}</p>
          </section>

          <div className="flex w-full items-center gap-6 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex shrink-0 items-center gap-2 rounded border border-[#998c5f] bg-[#ffea9e]/10 px-10 py-4 font-montserrat text-base font-bold text-[#ffea9e]"
            >
              {t(RULES_COPY.closeLabel)}
              <CloseIcon />
            </button>
            <button
              type="button"
              onClick={() => onWriteKudos?.()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#ffea9e] px-4 py-4 font-montserrat text-base font-bold text-[#00101a] transition-colors hover:bg-[#fae287]"
            >
              {t(RULES_COPY.writeLabel)}
              <PenIcon />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function TierRow({ tier }: { tier: RuleTier }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4">
      {/* Hero badges are wide pills — fix height, keep natural width (no squish). */}
      {/* eslint-disable-next-line @next/next/no-img-element -- static local asset */}
      <img src={tier.badgeSrc} alt="" aria-hidden className="h-7 w-auto shrink-0 object-contain" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-[#ffea9e]">{t(tier.countKey)}</p>
        <p className="text-sm font-medium text-white">{t(tier.descKey)}</p>
      </div>
    </div>
  );
}

function IconTile({ icon }: { icon: CollectibleIcon }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- static local asset */}
      <img src={icon.src} alt="" aria-hidden className="h-16 w-16 shrink-0" />
      <p className="text-xs font-bold uppercase text-white">{icon.name}</p>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" aria-hidden>
      <path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
