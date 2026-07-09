"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../_lib/supabase/client";
import { mapSunnerOption } from "../../_lib/kudos/map";
import type { SunnerOption } from "../../_lib/write-kudo-content";

/**
 * Recipient directory for the composer. When the caller already has
 * server-fetched options (`/sun-kudos` page), those win untouched. Otherwise
 * (the homepage FAB renders `WriteKudoModal` with no server data) fetch the
 * real `sunners` rows client-side once, on first open — the table has a
 * public-read RLS policy. Fetch failure degrades to an empty directory.
 *
 * Fix for: the old mock fallback (`SUNNER_OPTIONS`, ids "sunner-1..9") leaked
 * fake ids into `createKudo` → Postgres `invalid input syntax for type uuid`.
 */
export function useSunnerOptions(
  provided: readonly SunnerOption[] | undefined,
  open: boolean,
): readonly SunnerOption[] {
  const [fetched, setFetched] = useState<readonly SunnerOption[] | null>(null);

  useEffect(() => {
    if (provided || !open || fetched !== null) return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("sunners")
          .select("id,name,role_code,department,tier,avatar_url")
          .order("name");
        if (!cancelled) setFetched((data ?? []).map(mapSunnerOption));
      } catch {
        if (!cancelled) setFetched([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [provided, open, fetched]);

  return provided ?? fetched ?? [];
}
