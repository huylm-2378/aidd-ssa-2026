"use client";

import { useEffect, useRef } from "react";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { createClient } from "../../_lib/supabase/client";

/** The raw `public.kudos` row as delivered by a `postgres_changes` INSERT
 *  payload — no embedded sender/receiver name (that only exists on a
 *  PostgREST joined read). */
export interface KudosInsertRow {
  id: string;
  receiver_id: string | null;
  sender_id: string | null;
  created_at: string;
}

/**
 * Subscribes to Supabase Realtime `postgres_changes` INSERT events on
 * `public.kudos` via the shared browser client singleton (F008 — reuses
 * `app/_lib/supabase/client.ts`, no second client/socket). `onInsert` is kept
 * in a ref so the effect subscribes exactly once per mount regardless of the
 * callback's identity (avoids resubscribe churn / dropped events). On channel
 * failure this only logs — the UI keeps the last-known server snapshot with
 * no user-facing error (FR-008 / SC-005).
 */
export function useKudosRealtime(onInsert: (row: KudosInsertRow) => void) {
  const onInsertRef = useRef(onInsert);
  useEffect(() => {
    onInsertRef.current = onInsert;
  }, [onInsert]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("kudos-live-board")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "kudos" },
        (payload: RealtimePostgresInsertPayload<KudosInsertRow>) => {
          onInsertRef.current(payload.new);
        },
      )
      .subscribe((status: string) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("[kudos-live] channel status:", status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
