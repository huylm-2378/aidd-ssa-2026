# F011: Countdown / Prelaunch Page — Assembly, Asset Swap, and Study-Before-Build Payoff

**Date**: 2026-07-08 16:12
**Severity**: N/A (Shipped)
**Component**: Prelaunch Countdown Page (MoMorph 8PJQswPZmU — dark full-screen, Root-further keyvisual, "Sự kiện sẽ bắt đầu sau" + DAYS/HOURS/MINUTES)
**Status**: Resolved (specification sealed, review SEALED 9/10)

## What Happened

Shipped F011 — the `/prelaunch` countdown page — through the full Takumi cycle (study → spec → forge → temper → inspect → deliver). PR #16 (commit ed48125). 134 tests pass, production build clean, spec promoted to `docs/features/F011_CountdownPrelaunch/`.

**The win**: This was not a new feature—it was assembly. Study found the repo *already had every piece*:
- `useCountdown` hook (days/hours/minutes, 60s refresh cycle) — tested, live in utils
- `CountdownTile` glass-digit component (reused from homepage hero)
- Full-bleed background pattern (copied from login screen)
- `NEXT_PUBLIC_SAA_EVENT_START` environment target (same as homepage hero countdown)
- Font-digital class (no new 7-segment font needed)

The actual work: wrap a countdown-row client component and mount the page at `/prelaunch` (no header/footer). Three lines of integration, not three days of building.

Product decisions (confirmed):
- Route `/prelaunch` (full-screen, no layout chrome)
- Countdown resets every 60 seconds (existing hook behavior, no change)
- Event target: `NEXT_PUBLIC_SAA_EVENT_START` (same env var as homepage hero)
- Keyvisual asset: MoMorph supplied Root-further bg + "Sự kiện sẽ bắt đầu sau" text overlay

## The Brutal Truth

The build was clean, but the design asset story had a wrinkle. First render reused `public/keyvisual-bg.png` (the homepage hero default) because we didn't have the prelaunch-specific media. User supplied the real asset mid-sprint: `public/prelaunch/MM_MEDIA_BG Image.png`. Swapped it in. No regression, no rebuild needed — just an asset path swap. The friction was minimal; the lesson was clear: *ask for assets early, even if you have a placeholder*.

New shared pattern extracted: `useMounted` (the `useSyncExternalStore` pattern from write-kudo-modal.tsx) moved to `app/_lib/use-mounted.ts`. This hook hydration-gates live digit re-renders. write-kudo-modal updated to import it; behaviour byte-identical. (Reviewer diffed and confirmed—DRY in action.)

Review flagged one design nit (not a code defect): CountdownTile label font size is 24px in the component, but the design spec called for ~36px. The label lives in the shared CountdownTile (reused by homepage hero too). Changing it ripples to the hero. Spec confirms design intent matched the component-as-built; no change. DRY cuts both ways—reuse locks you in.

0 critical issues. SEALED.

## Technical Details

**Component Structure**:
- `app/prelaunch/page.tsx`: async Server Component, fetches no data (countdown is client-driven, static text).
- `app/_components/prelaunch/countdown-row.tsx`: client wrapper mounting CountdownTile with `NEXT_PUBLIC_SAA_EVENT_START` as target.
- Mount-time hydration guard via extracted `useMounted` hook prevents tile re-renders before client is ready.

**Countdown Hook** (existing, no changes):
```ts
const useCountdown = (targetDate: string) => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetDate) - Date.now();
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
      });
    }, 60000); // 60s refresh
    return () => clearInterval(interval);
  }, [targetDate]);
  
  return time;
};
```

**Hydration Guard** (new pattern):
```ts
// app/_lib/use-mounted.ts
export const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

// In countdown-row.tsx
const mounted = useMounted();
return mounted ? <CountdownTile {...} /> : null;
```

Prevents SSR mismatch and stale tile renders on page load. Extracted from write-kudo-modal for reuse.

**Asset Path**:
`public/prelaunch/MM_MEDIA_BG Image.png` — full-bleed background, Root-further keyvisual, user-supplied.

## What We Tried

1. **Reusing homepage hero countdown directly**: Attempted — but homepage mounts it inside layout chrome. Prelaunch needs full-screen, no header/footer. Built a light wrapper (countdown-row.tsx) instead of forking the hero component.
2. **Using keyvisual-bg.png placeholder**: Started here; user supplied prelaunch-specific asset mid-sprint. Swapped in without rebuild.
3. **New 7-segment font**: Checked design — CountdownTile already has font-digital class applied. No new font asset needed.

## Root Cause Analysis

**Study Paid Off**: Three features shipped this week (F009 profile, F010 FAB, F011 prelaunch). All three turned out to be *mostly assembly*—the codebase had tested components (CountdownTile, KudoCard, TierBadge), hooks (useCountdown, useMounted), and layout patterns (full-bleed backgrounds, client wrappers) already in place. The lesson: study the codebase first, inventory what exists, and build by composition instead of from scratch. This sprint, that shifted the scope calculation for all three features—not "weeks to build," but "days to assemble."

**Asset Placeholder**: We didn't have the prelaunch-specific keyvisual at start; used the fallback. This works, but it's a reminder that visual assets aren't code—they're dependencies. Having them upfront shortens the sprint.

**Design vs. Component Intent Lock**: The 24px/36px label discrepancy exists because CountdownTile is shared. Changing it for prelaunch breaks homepage. Lesson: shared components *constrain* design iteration. Either accept the spec-as-built, or fork the component. This one stays shared (DRY principle).

## Lessons Learned

1. **Study Before You Build—The Inventory Matters**: Scan the codebase for tested, working pieces before writing new code. Hooks, components, patterns, and utilities are already there—they're sunk investment and lower risk than new logic. This week, that realization compressed three features from weeks to days.

2. **Hydration Guards Are Essential for SSR/Client Mismatch**: The `useMounted` pattern (extracted, now shared) prevents tile renders before the client is ready. Needed for countdown, useful everywhere—extract it early when you find it.

3. **Asset Dependencies Need Lead Time**: Placeholder images work, but swapping them mid-sprint is friction. Ask for final assets upfront or accept that the sprint will include an asset-swap changeset.

4. **Shared Components Lock Design**: Once CountdownTile ships on homepage, changing its label size impacts both features. Reuse saves code; it also locks you in. Document the constraints.

## Next Steps

None outstanding. The feature is ship-ready. The extracted `useMounted` pattern is available for any component that needs hydration-safe rendering (modals, live-data tiles, animations). Document it in the component library guide.

---

134 tests pass, production build clean, feature ship-ready. One asset was swapped mid-sprint (no code impact). The hydration-guard pattern extracted from write-kudo-modal is now shared. Prelaunch is sealed and merged.

Commit ed48125 on `feature/countdown-prelaunch` — PR #16 merged.
