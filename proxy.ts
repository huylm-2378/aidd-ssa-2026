import { type NextRequest } from "next/server";
import { updateSession } from "@/app/_lib/supabase/middleware";

// F005: refresh the Supabase auth session on every matched request. Refresh-only — no route gating.
// Next 16 renamed the `middleware` file convention to `proxy` (same signature; config.matcher unchanged).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Run on all paths EXCEPT Next internals and static image assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
