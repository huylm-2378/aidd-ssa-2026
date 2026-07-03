import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client for Client Components (F005 Google OAuth).
// Module-level SINGLETON: `Header`/`AccountMenu` remount on every client navigation (the header is
// rendered per-page, not hoisted into app/layout.tsx), so creating a fresh client each call would
// churn the auth listener. One shared instance keeps the onAuthStateChange subscription cheap.
let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return browserClient;
}
