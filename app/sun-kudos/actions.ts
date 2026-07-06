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

export interface CreateKudoResult {
  ok: boolean;
  error?: string;
}

/**
 * Insert a Kudo and revalidate the board so it appears in All Kudos.
 * Sender is left null (no current-user→sunner mapping in this scope); the
 * card falls back to a neutral sender name. `department` is copied from the
 * receiver so the Highlight filters keep working on real rows.
 */
export async function createKudo(input: CreateKudoInput): Promise<CreateKudoResult> {
  const title = input.title?.trim();
  const body = input.body?.trim();
  if (!input.receiverId || !title || !body || input.hashtags.length === 0) {
    return { ok: false, error: "Thiếu trường bắt buộc." };
  }

  try {
    const supabase = await createClient();

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
    return { ok: false, error: e instanceof Error ? e.message : "Lỗi không xác định." };
  }
}
