"use client";

import { useCallback, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { createPortal } from "react-dom";
import { EMPTY_FORM, canSubmit, type WriteKudoForm } from "../../_lib/write-kudo-form";
import { WRITE_KUDO_COPY, type SunnerOption } from "../../_lib/write-kudo-content";
import { createKudo } from "../../sun-kudos/actions";
import RecipientSelect from "./recipient-select";
import KudoEditor from "./kudo-editor";
import HashtagField from "./hashtag-field";
import ImageUploadField from "./image-upload-field";
import { useDialogA11y } from "./use-dialog-a11y";

interface WriteKudoModalProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
  /** Recipient directory (F007: from Supabase). Falls back to the mock list. */
  sunnerOptions?: readonly SunnerOption[];
}

const TITLE_ID = "write-kudo-title";

const noopSubscribe = () => () => {};
/** True only once mounted on the client — avoids a portal/SSR hydration mismatch (Risk in plan). */
function useMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/**
 * "Viết Kudo" composer modal (F006, MoMorph `ihQ26W78P2` / instance
 * `520:11647`). Client-only: real form state + validation, no backend, no
 * persistence. Portals to `document.body` so it escapes the search bar's
 * `overflow-hidden`/`backdrop-blur` ancestor stacking context (Risk in plan).
 */
export default function WriteKudoModal({ open, onClose, triggerRef, sunnerOptions }: WriteKudoModalProps) {
  const mounted = useMounted();
  const [form, setForm] = useState<WriteKudoForm>(EMPTY_FORM);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoized so the a11y hook's Escape listener isn't torn down/re-added on
  // every keystroke while the modal is open.
  const handleClose = useCallback(() => {
    setForm((current) => {
      current.images.forEach((image) => URL.revokeObjectURL(image.url));
      return EMPTY_FORM;
    });
    onClose();
  }, [onClose]);

  useDialogA11y({ open, onClose: handleClose, containerRef, triggerRef });

  if (!mounted || !open) return null;

  function updateForm<K extends keyof WriteKudoForm>(key: K, value: WriteKudoForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    if (!canSubmit(form) || !form.recipient) return;
    const result = await createKudo({
      receiverId: form.recipient.id,
      title: form.award,
      body: form.body,
      hashtags: [...form.hashtags],
      imageCount: form.images.length,
      isAnonymous: form.anonymous,
    });
    // On success the board is revalidated server-side; close + reset. On error
    // keep the modal open so the user can retry (no data lost).
    if (result.ok) handleClose();
  }

  return createPortal(
    // Two-wrapper scroll pattern: the backdrop scrolls, the inner `min-h-full`
    // flex wrapper centers a short modal but lets a tall one grow from the top
    // with its padding preserved (a single `items-center` + `overflow` clips the
    // top of an over-tall dialog and makes it unreachable).
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60" onClick={handleClose}>
      <div className="flex min-h-full items-center justify-center p-6">
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={TITLE_ID}
          onClick={(e) => e.stopPropagation()}
          className="flex w-full max-w-[752px] flex-col items-start gap-8 rounded-3xl bg-[#fff8e1] p-6 font-montserrat sm:p-10"
        >
          <h2 id={TITLE_ID} className="w-full text-center text-2xl font-bold leading-10 text-[#00101a] sm:text-[32px]">
          {WRITE_KUDO_COPY.title}
        </h2>

        <RecipientSelect
          value={form.recipient}
          onChange={(recipient) => updateForm("recipient", recipient)}
          options={sunnerOptions}
        />

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center gap-4">
            <label className="flex w-[146px] shrink-0 items-center gap-0.5 font-montserrat text-base font-bold text-[#00101a]">
              {WRITE_KUDO_COPY.awardLabel}
              <span className="text-[#e46060]">*</span>
            </label>
            <input
              type="text"
              value={form.award}
              onChange={(e) => updateForm("award", e.target.value)}
              placeholder={WRITE_KUDO_COPY.awardPlaceholder}
              className="h-14 flex-1 rounded-lg border border-[#998c5f] bg-white px-6 py-4 font-montserrat text-base font-bold text-[#00101a] focus-visible:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 pl-[162px] font-montserrat text-sm font-bold text-[#999999]">
            {WRITE_KUDO_COPY.awardHints.map((hint) => (
              <p key={hint}>{hint}</p>
            ))}
          </div>
        </div>

        <KudoEditor value={form.body} onChange={(body) => updateForm("body", body)} />

        <HashtagField value={form.hashtags} onChange={(hashtags) => updateForm("hashtags", hashtags)} />

        <ImageUploadField value={form.images} onChange={(images) => updateForm("images", images)} />

        <label className="flex items-center gap-4 font-montserrat text-base font-bold text-[#00101a]">
          <input
            type="checkbox"
            checked={form.anonymous}
            onChange={(e) => updateForm("anonymous", e.target.checked)}
            className="h-6 w-6 rounded border border-[#999999]"
          />
          {WRITE_KUDO_COPY.anonymousLabel}
        </label>

        <div className="flex w-full items-center gap-6">
          <button
            type="button"
            onClick={handleClose}
            className="flex shrink-0 items-center gap-2 rounded border border-[#998c5f] bg-[#ffea9e]/10 px-10 py-4 font-montserrat text-base font-bold text-[#00101a]"
          >
            {WRITE_KUDO_COPY.cancel}
            <CloseIcon />
          </button>
          <button
            type="button"
            disabled={!canSubmit(form)}
            onClick={handleSubmit}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#ffea9e] px-4 py-4 font-montserrat text-base font-bold text-[#00101a] transition-colors hover:bg-[#fae287] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {WRITE_KUDO_COPY.submit}
            <SendIcon />
          </button>
        </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" aria-hidden>
      <path d="M22 2 11 13" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2 15 22l-4-9-9-4Z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
