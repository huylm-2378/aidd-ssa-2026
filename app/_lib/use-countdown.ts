"use client";

import { useEffect, useState } from "react";

export interface CountdownState {
  /** Zero-padded days remaining, e.g. "05". 3+ digit passthrough if >= 100. */
  days: string;
  /** Zero-padded hours remaining (00-23), e.g. "09". */
  hours: string;
  /** Zero-padded minutes remaining (00-59), e.g. "03". */
  minutes: string;
  /** True while the event start is still in the future. */
  isPending: boolean;
}

const REFRESH_INTERVAL_MS = 60_000;

const ELAPSED_STATE: CountdownState = {
  days: "00",
  hours: "00",
  minutes: "00",
  isPending: false,
};

/**
 * Zero-pads a non-negative integer to at least 2 digits.
 * Values >= 100 pass through without truncation (BR-002).
 */
export function zeroPad2(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/**
 * Parses an event-start value into a valid Date, or null if missing/malformed.
 * Never throws (BR-003).
 */
export function parseEventStart(value: string | undefined | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function computeCountdown(eventStart: Date | null): CountdownState {
  if (!eventStart) return ELAPSED_STATE;

  const diffMs = eventStart.getTime() - Date.now();
  if (diffMs <= 0) return ELAPSED_STATE;

  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));

  return {
    days: zeroPad2(days),
    hours: zeroPad2(hours),
    minutes: zeroPad2(minutes),
    isPending: true,
  };
}

/**
 * Client-side countdown to `eventStartIso` (ISO-8601). Recomputes on mount and
 * every 60s (BR-004). Falls back to a frozen "00" elapsed state if the value
 * is missing or fails to parse (BR-003), and never goes negative (BR-001).
 */
export function useCountdown(eventStartIso: string | undefined | null): CountdownState {
  const eventStart = parseEventStart(eventStartIso);
  const [state, setState] = useState<CountdownState>(() => computeCountdown(eventStart));

  useEffect(() => {
    if (!eventStart) return;

    const tick = () => setState(computeCountdown(eventStart));
    const intervalId = setInterval(tick, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
    // eventStart is derived fresh from eventStartIso each render; comparing the
    // ISO string keeps the effect stable without needing a Date equality check.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventStartIso]);

  return state;
}
