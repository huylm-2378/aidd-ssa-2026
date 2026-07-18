import type { Metadata } from "next";
import Footer from "../_components/homepage-saa/footer";
import Header from "../_components/homepage-saa/header";
import KudosKeyvisualBg from "../_components/sun-kudos/kudos-keyvisual-bg";
import ProfileIdentity from "../_components/profile/profile-identity";
import ProfileStats from "../_components/profile/profile-stats";
import ProfileKudosSection from "../_components/profile/profile-kudos-section";
import { getAllKudos, getSidebarStats } from "../_lib/kudos/queries";
import { getSecretBoxState } from "../_lib/secret-box/queries";
import { createClient } from "../_lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile — Sun* Annual Awards 2025",
  description: "Your Sun* Kudos profile.",
};

// No auth-metadata source for department/tier (F009 decisions) — rendered as
// design-faithful placeholders, never fabricated as real data.
const PLACEHOLDER_DEPARTMENT = "CEVC3";
const PLACEHOLDER_TIER = "Legend Hero";

interface CurrentUserIdentity {
  name: string;
  avatarUrl?: string;
}

/**
 * Reads the logged-in Sunner's display identity from Supabase auth metadata
 * (`full_name`/`name`, `avatar_url`/`picture`, email fallback). Fail-safe
 * (FR-001): any auth/network error — or a logged-out visitor — falls back to
 * an empty identity rather than crashing the page.
 */
async function getCurrentUserIdentity(): Promise<CurrentUserIdentity> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const meta = user?.user_metadata ?? {};
    const name =
      (meta.full_name as string) || (meta.name as string) || user?.email || "";
    const avatarUrl =
      (meta.avatar_url as string) || (meta.picture as string) || undefined;
    return { name, avatarUrl };
  } catch {
    return { name: "" };
  }
}

/**
 * `/profile` (F009) — the logged-in Sunner's own profile page: keyvisual
 * banner, identity block, personal stats panel, and a Sent/Received kudos
 * feed. Mirrors the `app/sun-kudos/page.tsx` shell and fail-safe data-fetch
 * pattern (every read below tolerates a DB/auth error and renders an empty
 * or placeholder view instead of crashing).
 */
export default async function ProfilePage() {
  const [{ name, avatarUrl }, kudos, stats, secretBox] = await Promise.all([
    getCurrentUserIdentity(),
    getAllKudos(),
    getSidebarStats(),
    getSecretBoxState(),
  ]);

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[#00101a]">
      <Header />
      <main className="flex-1">
        <div className="relative isolate overflow-hidden pb-8">
          <KudosKeyvisualBg />
          <div className="relative mx-auto w-[680px] max-w-full px-4 pt-12">
            <ProfileIdentity
              name={name}
              avatarUrl={avatarUrl}
              department={PLACEHOLDER_DEPARTMENT}
              tier={PLACEHOLDER_TIER}
            />
          </div>
        </div>
        <div className="mx-auto flex w-[680px] max-w-full flex-col gap-10 px-4 pb-16">
          <ProfileStats stats={stats} secretBox={secretBox} />
          <ProfileKudosSection kudos={kudos} currentUserName={name} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
