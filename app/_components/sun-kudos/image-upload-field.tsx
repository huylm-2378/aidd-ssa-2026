"use client";

import { useRef } from "react";
import { MAX_IMAGES, type KudoImage } from "../../_lib/write-kudo-form";
import { WRITE_KUDO_COPY } from "../../_lib/write-kudo-content";
import { useTranslation } from "../../_lib/i18n/use-translation";

interface ImageUploadFieldProps {
  value: KudoImage[];
  onChange: (images: KudoImage[]) => void;
}

/**
 * "Image" thumbnail field (FR-009, MoMorph `mms_F_Frame 537`). Optional —
 * no required marker. Local object-URL previews only, capped at
 * `MAX_IMAGES`; removing a thumbnail revokes its object URL immediately to
 * avoid leaking it (full-form revoke-on-close is handled by the orchestrator).
 */
export default function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const atCap = value.length >= MAX_IMAGES;

  function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    const room = MAX_IMAGES - value.length;
    const next = Array.from(files)
      .slice(0, room)
      .map((file) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(file) }));
    if (next.length > 0) onChange([...value, ...next]);
  }

  function removeImage(image: KudoImage) {
    URL.revokeObjectURL(image.url);
    onChange(value.filter((img) => img.id !== image.id));
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <label className="font-montserrat text-base font-bold text-[#00101a]">
        {t(WRITE_KUDO_COPY.imageLabel)}
        <span className="ml-2 font-montserrat text-xs font-bold text-[#998c5f]">
          ({t(WRITE_KUDO_COPY.maxNote)})
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-4">
        {value.map((image, i) => (
          <div key={image.id} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob: URL, next/image cannot optimize it */}
            <img src={image.url} alt={t("composer.imageAlt", { n: i + 1 })} className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label={t("composer.removeImage")}
              onClick={() => removeImage(image)}
              className="absolute right-1 top-1 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-black/60 text-white"
            >
              <CloseTinyIcon />
            </button>
          </div>
        ))}

        {!atCap && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-12 items-center gap-1 rounded-lg border border-[#998c5f] bg-white px-3 font-montserrat text-sm font-bold text-[#00101a]"
          >
            <PlusIcon />
            {t(WRITE_KUDO_COPY.addImage)}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFileSelect(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
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
    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}
