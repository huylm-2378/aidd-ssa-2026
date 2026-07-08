"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** A transient "just received a Kudos" notification shown over the canvas.
 *  `key` is a monotonic id so React keeps each note stable while the stack
 *  grows/shrinks; `id` is the recipient's sunner id (pulses that node). */
export type LiveNote = { key: number; id: string | null; name: string };

/** How long a live note stays on screen before auto-dismissing (ms). */
export const LIVE_TTL_MS = 15_000;

/**
 * Owns the stack of live recipient notes (F008). Each `push` prepends a note
 * (newest on top, older ones pushed down) and schedules its removal after
 * `ttlMs`, so notes overlap when several arrive inside the window and each
 * clears itself independently. All pending timers are cleared on unmount so
 * no setState fires after teardown.
 */
export function useLiveNotes(ttlMs: number = LIVE_TTL_MS) {
  const [notes, setNotes] = useState<LiveNote[]>([]);
  const seq = useRef(0);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const push = useCallback(
    (id: string | null, name: string) => {
      const key = (seq.current += 1);
      setNotes((prev) => [{ key, id, name }, ...prev]);
      const timer = setTimeout(() => {
        setNotes((prev) => prev.filter((n) => n.key !== key));
        timers.current.delete(timer);
      }, ttlMs);
      timers.current.add(timer);
    },
    [ttlMs],
  );

  useEffect(
    () => () => {
      for (const timer of timers.current) clearTimeout(timer);
      timers.current.clear();
    },
    [],
  );

  return { notes, push };
}
