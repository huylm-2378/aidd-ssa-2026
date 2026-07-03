import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/supabase/server";
import { sanitizeNext } from "./redirect-guard";

// F005 PKCE callback: Supabase redirects here with `?code=...` after Google consent. Exchange the
// code for a session, then redirect to the (sanitized) `next` path. On any failure, go to the error
// page. See FR-006 / SC-002 / SC-004.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
