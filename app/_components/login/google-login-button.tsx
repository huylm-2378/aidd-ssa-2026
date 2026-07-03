"use client";

import { useState } from "react";
import { createClient } from "@/app/_lib/supabase/client";
import { LOGIN_CONTENT } from "../../_lib/login-content";

// F005: real Google OAuth trigger. Clicking starts Supabase `signInWithOAuth` (PKCE), which redirects
// the browser to Google via Supabase, then back to our /auth/callback route. Gold pill styling +
// label + Google glyph kept byte-for-byte from the F004 button.
export default function GoogleLoginButton() {
  const [isPending, setIsPending] = useState(false);

  async function handleSignIn() {
    setIsPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    // On success the browser is already navigating away; only re-enable if the call itself failed.
    if (error) setIsPending(false);
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isPending}
      className="inline-flex h-[60px] items-center gap-3 rounded bg-[#ffea9e] px-6 font-montserrat text-lg font-bold text-[#00101a] transition-all duration-200 hover:bg-[#fff8e1] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span>{LOGIN_CONTENT.loginLabel}</span>
      <GoogleGlyph />
    </button>
  );
}

// Standard Google "G" mark (inline SVG — no asset needed).
function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.82-.07-1.6-.2-2.36H12v4.48h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.75z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}
