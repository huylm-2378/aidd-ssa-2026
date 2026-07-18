// Server-only by construction: `../supabase/server` uses `next/headers`.
import { createClient } from "../supabase/server";

/**
 * Per-user Secret Box entitlement (F016 FR-004). Earned boxes come from hearts
 * on kudos the caller RECEIVED: 5 ❤️ = 1 box, so
 * `unopened = max(0, floor(heartsReceived / 5) - opened)` (BR-001).
 * The RPC re-derives this server-side on every open — this read is display-only.
 */
export interface SecretBoxState {
  authState: "authed" | "anon";
  unopened: number;
  opened: number;
}

const ANON_STATE: SecretBoxState = { authState: "anon", unopened: 0, opened: 0 };

/**
 * Read the caller's Secret Box state. Fails SAFE (like every F007 read): any
 * error — signed out, no linked sunner row (0005 not applied/backfilled), DB
 * failure — degrades to zero boxes rather than crashing the page.
 */
export async function getSecretBoxState(): Promise<SecretBoxState> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return ANON_STATE;

    const { data: sunner } = await supabase
      .from("sunners")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    // Authed but unlinked = zero entitlement, not an error (edge-cases.md).
    if (!sunner) return { authState: "authed", unopened: 0, opened: 0 };

    const [heartsRes, openedRes] = await Promise.all([
      supabase.from("kudos").select("like_count").eq("receiver_id", sunner.id),
      supabase
        .from("sunner_badges")
        .select("*", { count: "exact", head: true })
        .eq("sunner_id", sunner.id),
    ]);
    const hearts = (heartsRes.data ?? []).reduce(
      (sum: number, row: { like_count: number | null }) => sum + (row.like_count ?? 0),
      0,
    );
    const opened = openedRes.count ?? 0;
    return {
      authState: "authed",
      unopened: Math.max(0, Math.floor(hearts / 5) - opened),
      opened,
    };
  } catch {
    return ANON_STATE;
  }
}
