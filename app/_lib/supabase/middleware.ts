import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refresh-ONLY session middleware (F005). NOT route protection — there is no `if (!user) redirect(...)`.
// Its sole job: call getUser() early in the request so Supabase refreshes an expiring access token and
// writes the updated cookies onto the response before any Server Component reads them (Server
// Components can only read cookies, never write them).
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // DO NOT run any code between createServerClient and this call — a mistake here causes
  // hard-to-debug random logouts (session-refresh race). Refresh only; no redirect/protection.
  await supabase.auth.getUser();

  // IMPORTANT: return supabaseResponse as-is — do not build a new response or strip its cookies,
  // or session sync breaks.
  return supabaseResponse;
}
