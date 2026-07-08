/**
 * Pure partition of the current user's kudos into "sent" and "received"
 * subsets, by exact display-name match. No I/O, no React — mirrors the
 * `kudos/map.ts` pure-mapper convention so it can be unit-tested in
 * isolation and reused from both server and client code (FR-008).
 */
import type { KudoCard } from "../kudos-shared";

export interface KudoSplit {
  sent: KudoCard[];
  received: KudoCard[];
}

/** Default tab shown in the profile kudos section (design decision). */
export const DEFAULT_KUDOS_TAB: keyof KudoSplit = "sent";

/**
 * sent = user authored it (senderName === name); received = user is the
 * receiver (receiverName === name). A self-kudo (sender === receiver ===
 * name) appears in both. An empty/whitespace name yields both subsets
 * empty, so it never accidentally matches an anonymous or fallback name.
 */
export function splitKudosByUser(
  kudos: readonly KudoCard[],
  name: string,
): KudoSplit {
  const trimmedName = name.trim();
  if (!trimmedName) return { sent: [], received: [] };

  return {
    sent: kudos.filter((k) => k.senderName === trimmedName),
    received: kudos.filter((k) => k.receiverName === trimmedName),
  };
}
