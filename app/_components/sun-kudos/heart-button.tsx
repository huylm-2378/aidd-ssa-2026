"use client";

import { useState } from "react";
import { toggleHeart } from "../../sun-kudos/actions";
import { resolveHeartError } from "../../_lib/resolve-heart-error";
import { useTranslation } from "../../_lib/i18n/use-translation";

/**
 * Interactive per-user like toggle for a Kudo card (F015). Replaces the
 * static heart+count footer span. Always fires `toggleHeart` — auth state is
 * resolved server-side, never checked client-side (locked decision 7).
 *
 * Optimistic update via plain `useState` (no `useOptimistic` — no codebase
 * precedent, mirrors `write-kudo-modal`'s state shape): on click, flip
 * `liked`/`count` immediately, then reconcile with the server's authoritative
 * `liked`/`likeCount` on success, or roll back to the captured pre-click
 * state on failure and show an inline translated message.
 */
export default function HeartButton({
  kudoId,
  initialLiked,
  initialCount,
}: {
  kudoId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Resync from props when they change (official derive-state-during-render
  // pattern): the same kudo renders in several places at once (Highlight
  // top-5, All Kudos, Profile) and `revalidatePath`'s soft refresh delivers
  // fresh props to already-mounted instances — without this, a heart toggled
  // elsewhere would stay stale here until a hard reload. Skipped mid-toggle:
  // the in-flight reconcile carries the authoritative server values anyway.
  const [prevProps, setPrevProps] = useState({ initialLiked, initialCount });
  if (prevProps.initialLiked !== initialLiked || prevProps.initialCount !== initialCount) {
    setPrevProps({ initialLiked, initialCount });
    if (!pending) {
      setLiked(initialLiked);
      setCount(initialCount);
    }
  }

  async function handleClick() {
    if (pending) return; // double-fire guard

    setErrorMsg(null);
    const prevLiked = liked;
    const prevCount = count;
    const next = !prevLiked;
    setLiked(next);
    setCount(prevCount + (next ? 1 : -1));
    setPending(true);

    try {
      const res = await toggleHeart(kudoId);
      if (!res.ok) {
        setLiked(prevLiked);
        setCount(prevCount);
        setErrorMsg(resolveHeartError(t, res.error));
        return;
      }
      setLiked(res.liked ?? next);
      setCount(res.likeCount ?? prevCount + (next ? 1 : -1));
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={liked}
        /* aria-label overrides the button's text content, so fold the visible
           count back in — otherwise screen readers would lose it. */
        aria-label={`${t(liked ? "hearts.unlike" : "hearts.like")} — ${count} ${t("sunKudos.likesSrLabel")}`}
        className="flex items-center gap-2 text-2xl font-bold leading-8 text-[#00101a] transition-opacity disabled:opacity-70"
      >
        {count.toLocaleString("vi-VN")}
        {liked ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#d4271d]" fill="#d4271d" aria-hidden>
            <path d="M12 21s-7.5-4.9-10-9.3C.5 8.6 2 5 5.5 5c2 0 3.3 1.2 4 2.3C10.2 6.2 11.5 5 13.5 5 17 5 18.5 8.6 17 11.7 14.5 16.1 12 21 12 21z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-[#d4271d]"
            fill="none"
            stroke="#d4271d"
            strokeWidth={2}
            aria-hidden
          >
            <path d="M12 21s-7.5-4.9-10-9.3C.5 8.6 2 5 5.5 5c2 0 3.3 1.2 4 2.3C10.2 6.2 11.5 5 13.5 5 17 5 18.5 8.6 17 11.7 14.5 16.1 12 21 12 21z" />
          </svg>
        )}
      </button>
      {errorMsg && (
        <span role="alert" className="text-sm font-bold leading-5 text-[#e46060]">
          {errorMsg}
        </span>
      )}
    </span>
  );
}
