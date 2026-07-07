// Server-only by construction: `../supabase/server` uses `next/headers`, which
// throws if ever imported into a Client Component.
import { createClient } from "../supabase/server";
import type { KudoCard } from "../kudos-shared";
import type { SunnerStat, RecentGiftSunner } from "../sun-kudos-content";
import type { SunnerOption } from "../write-kudo-content";
import type { KudoRow, KudoFilter } from "./types";
import { mapKudoRow, mapStats, mapRecentGift, mapSunnerOption } from "./map";

/**
 * Server-side Kudos data access (F007). All reads fail SAFE — a DB/network
 * error or empty result returns an empty view shape so `/sun-kudos` renders a
 * graceful fallback rather than crashing (SC-004). Reads go through the anon
 * server client (public SELECT via RLS).
 */

const KUDO_SELECT =
  "id,title,body,hashtags,image_urls,department,like_count,is_anonymous,created_at," +
  "sender_name,sender_avatar," +
  "sender:sunners!sender_id(name,role_code,tier,avatar_url)," +
  "receiver:sunners!receiver_id(name,role_code,tier,avatar_url)";

/** Top-5 most-liked kudos (optionally filtered). Secondary sort by created_at
 *  keeps equal-like ordering deterministic. */
export async function getHighlightKudos(filter?: KudoFilter): Promise<KudoCard[]> {
  try {
    const supabase = await createClient();
    // Filters (.eq/.contains) must precede .order/.limit — those return a
    // transform builder that no longer exposes filter methods.
    let query = supabase.from("kudos").select(KUDO_SELECT);
    if (filter?.hashtag) query = query.contains("hashtags", [filter.hashtag]);
    if (filter?.department) query = query.eq("department", filter.department);
    const { data, error } = await query
      .order("like_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5);
    if (error || !data) return [];
    return (data as unknown as KudoRow[]).map(mapKudoRow);
  } catch {
    return [];
  }
}

/** Recent kudos feed, newest first (optionally filtered). */
export async function getAllKudos(filter?: KudoFilter): Promise<KudoCard[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("kudos").select(KUDO_SELECT);
    if (filter?.hashtag) query = query.contains("hashtags", [filter.hashtag]);
    if (filter?.department) query = query.eq("department", filter.department);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as unknown as KudoRow[]).map(mapKudoRow);
  } catch {
    return [];
  }
}

/**
 * Spotlight Board data (F008 Live Board): total kudo count, the constellation
 * `nodes`, and the `roster`. Nodes are the DISTINCT recent kudo receivers
 * (deduped by id — one node per name, no repeats), resolved client-side from
 * the roster map (avoids a PostgREST embed). `roster` (all sunners) also backs
 * the live activity ticker's realtime `receiver_id → name` lookup.
 */
const SPOTLIGHT_NODE_CAP = 250;

export async function getSpotlight(): Promise<{
  count: number;
  nodes: { id: string; name: string }[];
  roster: { id: string; name: string }[];
}> {
  try {
    const supabase = await createClient();
    const [countRes, kudosRes, rosterRes] = await Promise.all([
      supabase.from("kudos").select("*", { count: "exact", head: true }),
      supabase
        .from("kudos")
        .select("receiver_id")
        .order("created_at", { ascending: false })
        .limit(SPOTLIGHT_NODE_CAP),
      supabase.from("sunners").select("id,name"),
    ]);
    const roster = (rosterRes.data ?? []).map((r: { id: string; name: string }) => ({
      id: r.id,
      name: r.name,
    }));
    const nameById = new Map(roster.map((r) => [r.id, r.name]));
    // Distinct receivers (dedupe by id, most-recent first) — one node per name,
    // no repeats. Only people who actually received a kudo become nodes.
    const seen = new Set<string>();
    const nodes: { id: string; name: string }[] = [];
    for (const r of (kudosRes.data ?? []) as { receiver_id: string | null }[]) {
      const id = r.receiver_id;
      if (!id || seen.has(id)) continue;
      const name = nameById.get(id);
      if (!name) continue;
      seen.add(id);
      nodes.push({ id, name });
    }
    return { count: countRes.count ?? 0, nodes, roster };
  } catch {
    return { count: 0, nodes: [], roster: [] };
  }
}

/** Sidebar personal-stats rows. */
export async function getSidebarStats(): Promise<SunnerStat[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kudos_stats")
      .select("received,sent,hearts,secret_box_opened,secret_box_unopened")
      .eq("id", 1)
      .maybeSingle();
    return mapStats(data ?? null);
  } catch {
    return mapStats(null);
  }
}

/** "10 Sunner nhận quà mới nhất" (newest first). */
export async function getRecentGifts(): Promise<RecentGiftSunner[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("recent_gifts")
      .select("name,note")
      .order("created_at", { ascending: false })
      .limit(10);
    return (data ?? []).map(mapRecentGift);
  } catch {
    return [];
  }
}

/** Recipient directory for the composer autocomplete. */
export async function getSunnerOptions(): Promise<SunnerOption[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("sunners")
      .select("id,name,role_code,department,tier,avatar_url")
      .order("name");
    return (data ?? []).map(mapSunnerOption);
  } catch {
    return [];
  }
}
