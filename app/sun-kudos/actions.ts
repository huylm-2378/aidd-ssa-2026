"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../_lib/supabase/server";

/** Payload the composer sends to persist a new Kudo (F007 FR-007). */
export interface CreateKudoInput {
  receiverId: string;
  title: string;
  body: string;
  hashtags: string[];
  /** Number of attached images (blob previews aren't persistable — we store
   *  placeholder markers so the thumbnail count survives, per demo scope). */
  imageCount: number;
  isAnonymous: boolean;
}

/** Stable, locale-independent codes for the two known validation failures. */
export type CreateKudoErrorCode = "missing_fields" | "auth_required" | "unknown";

export interface CreateKudoResult {
  ok: boolean;
  /**
   * F014 round 4: a server action can't call `t()` (no React context), so
   * known failures return a stable `CreateKudoErrorCode` for the caller to
   * translate. Anything else (a Supabase `error.message` or a caught
   * `Error.message`) is a dynamic, already-human-readable string passed
   * through as-is — the caller renders it raw.
   */
  error?: CreateKudoErrorCode | string;
}

/**
 * Insert a Kudo and revalidate the board so it appears in All Kudos.
 * The sender is the CURRENTLY LOGGED-IN user (auth.users) — a Kudo must have a
 * real sender, so this requires a session. The user's display name + avatar are
 * denormalized onto the row; additionally (F007 FR-011) the caller's own
 * `sunners` row — created by the `0005` first-login trigger — is looked up via
 * `auth_user_id` to set `sender_id`. A lookup miss (e.g. `0005` not applied
 * yet) leaves `sender_id` NULL and never fails the submit. Anonymous
 * submissions hide the sender at render time. `department` is copied from the
 * receiver so the Highlight filters keep working on real rows.
 */
export async function createKudo(input: CreateKudoInput): Promise<CreateKudoResult> {
  const title = input.title?.trim();
  const body = input.body?.trim();
  if (!input.receiverId || !title || !body || input.hashtags.length === 0) {
    return { ok: false, error: "missing_fields" };
  }

  try {
    const supabase = await createClient();

    // Sender = logged-in user. No session → cannot attribute the Kudo.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "auth_required" };
    }
    const meta = user.user_metadata ?? {};
    const senderName =
      (meta.full_name as string) ||
      (meta.name as string) ||
      user.email ||
      "Sunner";
    const senderAvatar =
      (meta.avatar_url as string) || (meta.picture as string) || null;

    // FR-011: the caller's own sunner row (0005 trigger/backfill) → sender_id.
    // `.maybeSingle()` returns { data: null } on zero rows, so a miss can't throw.
    const { data: senderRow } = await supabase
      .from("sunners")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    // Copy the receiver's department onto the kudo (used by filters).
    const { data: receiver } = await supabase
      .from("sunners")
      .select("department")
      .eq("id", input.receiverId)
      .maybeSingle();

    const imageUrls = Array.from(
      { length: Math.max(0, Math.min(5, input.imageCount)) },
      (_, i) => `ph${i + 1}`,
    );

    const { error } = await supabase.from("kudos").insert({
      receiver_id: input.receiverId,
      sender_id: senderRow?.id ?? null,
      sender_name: senderName,
      sender_avatar: senderAvatar,
      title,
      body,
      hashtags: input.hashtags,
      image_urls: imageUrls,
      department: receiver?.department ?? "CEVC",
      like_count: 0,
      is_anonymous: input.isAnonymous,
    });

    if (error) return { ok: false, error: error.message };

    revalidatePath("/sun-kudos");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

/** Stable, locale-independent codes for the toggleHeart failure modes. */
export type ToggleHeartErrorCode = "auth_required" | "unknown";

export interface ToggleHeartResult {
  ok: boolean;
  liked?: boolean;
  likeCount?: number;
  error?: ToggleHeartErrorCode | string;
}

/**
 * Toggle the current user's like on a kudo (F015). INSERT-first: two rapid
 * taps can't both create a like because the `kudo_likes` PK rejects the
 * second insert (23505 unique_violation) — that rejection IS the un-like
 * signal, so there's no read-then-write race window (AC-2). `like_count` is
 * never written here; DB triggers on `kudo_likes` keep it in sync (FR-002).
 */
export async function toggleHeart(kudoId: string): Promise<ToggleHeartResult> {
  if (!kudoId) return { ok: false, error: "unknown" };

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "auth_required" };
    }

    let liked = true;
    const { error: insertError } = await supabase
      .from("kudo_likes")
      .insert({ kudo_id: kudoId, user_id: user.id });

    if (insertError) {
      // 23505 = unique_violation: already liked -> this tap un-likes it.
      if (insertError.code === "23505") {
        const { error: deleteError } = await supabase
          .from("kudo_likes")
          .delete()
          .eq("kudo_id", kudoId)
          .eq("user_id", user.id);
        if (deleteError) return { ok: false, error: deleteError.message };
        liked = false;
      } else {
        return { ok: false, error: insertError.message };
      }
    }

    const { data: row } = await supabase
      .from("kudos")
      .select("like_count")
      .eq("id", kudoId)
      .maybeSingle();

    revalidatePath("/sun-kudos");
    revalidatePath("/profile");
    return { ok: true, liked, likeCount: row?.like_count ?? 0 };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
