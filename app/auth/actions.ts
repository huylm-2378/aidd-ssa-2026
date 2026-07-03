"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";

// F005 sign-out (FR-008). Server Action so the HttpOnly session cookies are cleared server-side,
// then revalidate the layout cache (drops stale RSC) and land on the homepage.
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
