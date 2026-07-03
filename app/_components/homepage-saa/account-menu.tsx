"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createClient } from "@/app/_lib/supabase/client";
import { signOut } from "@/app/auth/actions";

// F005: header account menu wired to the real Supabase session (FR-007 / FR-008).
// Client-side identity read (the header is `"use client"` and shared on every route; a server `user`
// prop would touch every page for one widget). Identity is presentation-only — nothing is authorized
// on it — so `getUser()` (server-verified) is the source of truth and last-write-wins is safe.
export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user ?? null);
      setIsLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const meta = user?.user_metadata ?? {};
  const name = (meta.full_name as string) ?? (meta.name as string) ?? user?.email ?? "";
  const email = user?.email ?? "";
  const avatarUrl = (meta.avatar_url as string) ?? (meta.picture as string) ?? "";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#998c5f] bg-transparent transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Google avatar host; avoids next.config remotePatterns churn (KISS).
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" aria-hidden>
            <circle cx="12" cy="8" r="3.5" strokeWidth={1.5} />
            <path d="M4.5 19.5a7.5 7.5 0 0 1 15 0" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* While the first getUser() is in flight, render no dropdown items so the menu doesn't visibly
          flip logged-out -> logged-in on first paint. */}
      {isOpen && !isLoading && (
        <ul
          role="menu"
          className="absolute right-0 top-full mt-2 min-w-[200px] overflow-hidden rounded-md border border-[#998c5f] bg-[#101417] shadow-lg"
        >
          {user ? (
            <>
              <li className="border-b border-[#2e3940] px-4 py-3">
                <p className="truncate text-sm font-bold text-white">{name}</p>
                {email && <p className="truncate text-xs text-white/50">{email}</p>}
              </li>
              <li>
                <form action={signOut}>
                  <button
                    type="submit"
                    role="menuitem"
                    className="block w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
                  >
                    Sign out
                  </button>
                </form>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login"
                role="menuitem"
                className="block w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
              >
                Sign in
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
