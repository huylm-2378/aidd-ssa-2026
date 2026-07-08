"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * True only once mounted on the client (never during SSR / the first hydration pass). Extracted
 * from `write-kudo-modal.tsx` (F006) so any client component can avoid an SSR/first-paint
 * mismatch when its render needs to differ between server and client (e.g. a portal, or content
 * derived from the current wall-clock time).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
