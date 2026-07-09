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
 * denormalized onto the row (they aren't in the `sunners` directory); anonymous
 * submissions hide them at render time. `department` is copied from the receiver
 * so the Highlight filters keep working on real rows.
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
