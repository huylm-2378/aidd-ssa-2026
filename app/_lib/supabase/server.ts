import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Async server Supabase client for Server Components / Route Handlers / Server Actions (F005).
// Next 15/16: `cookies()` is async — this factory is async and every call site must `await` it.
// A NEW instance is created per request (never a singleton on the server).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` was called from a Server Component (can't write cookies) — safe to ignore:
            // the refresh-only middleware persists the refreshed session on the request path.
          }
        },
      },
    },
  );
}
