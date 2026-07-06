/**
 * Supabase row types for the Kudos board (F007) and the filter shape shared by
 * the query layer. View-facing shapes (`KudoCard`, `SunnerStat`, etc.) stay in
 * their existing modules; these are the raw DB rows the queries read.
 */

/** A `public.sunners` row. */
export interface SunnerRow {
  id: string;
  name: string;
  role_code: string;
  tier: string;
  department: string;
  avatar_url: string | null;
}

/** Embedded person on a kudo (subset of SunnerRow via PostgREST join). */
export interface KudoPersonRow {
  name: string;
  role_code: string;
  tier: string;
  avatar_url: string | null;
}

/** A `public.kudos` row with sender/receiver embedded. */
export interface KudoRow {
  id: string;
  title: string;
  body: string;
  hashtags: string[] | null;
  image_urls: string[] | null;
  department: string;
  like_count: number;
  is_anonymous: boolean;
  created_at: string;
  /** Denormalized sender for user-created Kudos (logged-in user); null for seeded rows. */
  sender_name: string | null;
  sender_avatar: string | null;
  sender: KudoPersonRow | null;
  receiver: KudoPersonRow | null;
}

/** A `public.recent_gifts` row. */
export interface RecentGiftRow {
  name: string;
  note: string;
}

/** The single `public.kudos_stats` row. */
export interface KudosStatsRow {
  received: number;
  sent: number;
  hearts: number;
  secret_box_opened: number;
  secret_box_unopened: number;
}

/** Highlight/feed filter (both optional → no narrowing). */
export interface KudoFilter {
  hashtag?: string | null;
  department?: string | null;
}
