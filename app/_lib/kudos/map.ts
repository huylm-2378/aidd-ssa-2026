/**
 * Pure mappers from Supabase rows (F007) to the view shapes the section
 * components already consume. Kept free of the server client so they can be
 * unit-tested in isolation.
 */
import type { KudoCard } from "../kudos-shared";
import type { SunnerStat, RecentGiftSunner } from "../sun-kudos-content";
import type { SunnerOption } from "../write-kudo-content";
import type {
  KudoRow,
  RecentGiftRow,
  KudosStatsRow,
  SunnerRow,
} from "./types";

const ANON_NAME = "Người ẩn danh";

/** ISO timestamp → "HH:MM - MM/DD/YYYY" in Asia/Ho_Chi_Minh (design format). */
export function formatTimeRange(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return `${time} - ${day}`;
}

/** One `kudos` row (sender/receiver embedded) → a `KudoCard`. */
export function mapKudoRow(row: KudoRow): KudoCard {
  const images = row.image_urls ?? [];
  // Sender precedence: anonymous → hidden; else the logged-in user who created
  // it (denormalized sender_name/avatar, no directory role/tier); else the
  // seeded sunner via the FK join; else a neutral fallback.
  const isUserSender = !row.is_anonymous && !!row.sender_name;
  return {
    id: row.id,
    senderName: row.is_anonymous
      ? ANON_NAME
      : row.sender_name ?? row.sender?.name ?? "Sunner",
    senderRole: isUserSender ? "" : row.is_anonymous ? "" : row.sender?.role_code ?? "",
    senderTier: isUserSender ? "" : row.sender?.tier ?? "New Hero",
    senderAvatar: row.is_anonymous
      ? undefined
      : row.sender_avatar ?? row.sender?.avatar_url ?? undefined,
    receiverName: row.receiver?.name ?? "Sunner",
    receiverRole: row.receiver?.role_code ?? "",
    receiverTier: row.receiver?.tier ?? "New Hero",
    receiverAvatar: row.receiver?.avatar_url ?? undefined,
    timeRange: formatTimeRange(row.created_at),
    title: row.title,
    body: row.body,
    hashtags: row.hashtags ?? [],
    likeCount: row.like_count,
    department: row.department,
    photos: images.length > 0 ? images : undefined,
  };
}

/** The single stats row → the 5 sidebar rows (labels are i18n catalog keys — consumers translate via t()). */
export function mapStats(row: KudosStatsRow | null): SunnerStat[] {
  const s = row ?? {
    received: 0,
    sent: 0,
    hearts: 0,
    secret_box_opened: 0,
    secret_box_unopened: 0,
  };
  return [
    { label: "stats.received", value: String(s.received) },
    { label: "stats.sent", value: String(s.sent) },
    { label: "stats.hearts", value: String(s.hearts) },
    { label: "stats.secretOpened", value: String(s.secret_box_opened) },
    { label: "stats.secretUnopened", value: String(s.secret_box_unopened) },
  ];
}

export function mapRecentGift(row: RecentGiftRow): RecentGiftSunner {
  return { name: row.name, note: row.note };
}

export function mapSunnerOption(row: SunnerRow): SunnerOption {
  return {
    id: row.id,
    name: row.name,
    role: row.role_code,
    avatar: row.avatar_url ?? undefined,
  };
}
