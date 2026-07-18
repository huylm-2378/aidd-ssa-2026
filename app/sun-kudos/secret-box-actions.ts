"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../_lib/supabase/server";

/** Stable, locale-independent codes for the known open failures (F016 FR-008). */
export type OpenSecretBoxErrorCode = "auth_required" | "no_boxes" | "unknown";

export interface OpenSecretBoxResult {
  ok: boolean;
  /** Known failures return a stable code for the caller to translate (F014
   *  pattern); anything else passes through as a human-readable string. */
  error?: OpenSecretBoxErrorCode | string;
  badgeCode?: string;
  remaining?: number;
}

/**
 * Open ONE earned Secret Box (F016 FR-005). All decisions happen inside the
 * `open_secret_box()` SECURITY DEFINER RPC (migration 0006): it re-derives the
 * entitlement, picks the weighted-random badge, and inserts atomically — this
 * action never computes or trusts a client-supplied count/badge (BR-002).
 * The RPC raises stable codes ('auth_required' | 'no_boxes') mapped below.
 */
export async function openSecretBox(): Promise<OpenSecretBoxResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "auth_required" };
    }

    const { data, error } = await supabase.rpc("open_secret_box");
    if (error) {
      const message = error.message ?? "";
      if (message.includes("auth_required")) return { ok: false, error: "auth_required" };
      if (message.includes("no_boxes")) return { ok: false, error: "no_boxes" };
      return { ok: false, error: message || "unknown" };
    }

    const row = (Array.isArray(data) ? data[0] : data) as
      | { badge_code: string; remaining: number }
      | undefined;
    if (!row?.badge_code) {
      return { ok: false, error: "unknown" };
    }

    revalidatePath("/sun-kudos");
    revalidatePath("/profile");
    return { ok: true, badgeCode: row.badge_code, remaining: row.remaining };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
