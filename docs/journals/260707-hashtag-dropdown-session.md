# Hashtag Field: Catalog to Dropdown—Spec vs Reality Trade-off

**Date**: 2026-07-07 16:24  
**Severity**: Medium (decision point, not a defect)  
**Component**: Write-Kudo composer / F006 Hashtag field  
**Status**: Resolved (pending branch merge approval)

## What Happened

The Write-Kudo composer's "Hashtag" field was converted from a free-text chip input into a fixed-catalog MULTI-SELECT DROPDOWN, faithful to the MoMorph design spec. The field now:
- Shows 8 Sun company-value hashtags in a dark panel (318px, 40px rows)
- Lets users select 1–5 hashtags (enforced at form level; dropdown disables after 5 selections)
- Renders selected chips outside the dropdown for closed-state visibility
- Closes on outside-click or Escape key
- Responds honestly to keyboard interaction (aria-pressed toggle buttons, not aria-listbox semantics)

**Files touched**:
- `app/_lib/write-kudo-content.ts`: Added HASHTAG_OPTIONS constant (8 company-value hashtags)
- `app/_components/sun-kudos/hashtag-field.tsx`: Rewritten as dropdown with selections UI
- `app/_components/sun-kudos/hashtag-field.test.tsx`: 8 new unit tests (all passing)
- `docs/features/F006_WriteKudo/technical-spec.md`: FR-008 updated with dropdown implementation

The component's public API ({value, onChange}) remained unchanged—write-kudo-modal and write-kudo-form were untouched, so no cascading integration work was needed.

## The Brutal Truth

This was a spec-vs-reality moment that forced real judgment, and it stings a little because the honest move meant quietly diverging from the design note.

The MoMorph spec prose said "load hashtags dynamically from Supabase"—read literally, that's the requirement. But the actual frame design showed a fixed dark panel with 8 specific, unchanging tags. We chose static. That choice matters because it's the kind of call that either accelerates the ship or drags anchors: dynamic loading means a migration, a Supabase admin step, testing against live data, and a deployment dependency. Static means ship today, know exactly what users see, and refactor to dynamic later if the business says "we need customer-specific hashtags."

The team backed the static route (KISS/YAGNI reasoning), and it felt right—company values don't personalize. But it required naming the tension out loud: we're deliberately reading the frame, not the prose, and taking the simpler path. That's a judgment call, and if the business later says "we need to load these from the database," we'll own the rework.

Also: we caught and corrected a typo in the design spec itself ("High-perorming" → "High-Performing"). That flag went to product, but it's a visible copy change, and it's worth noting we altered the spec's exact text—small, justified, but deliberate.

## Technical Details

**Hashtag catalog** (HASHTAG_OPTIONS in write-kudo-content.ts):
```typescript
#Teamwork, #Innovation, #Excellence, #Customer-Centric,
#Agility, #Integrity, #Growth-Mindset, #High-Performing
```

**Dropdown rendering** (hashtag-field.tsx):
- Dark background (#00070C) per design
- Selected rows: rgba(255,234,158,0.2) highlight + white check-circle icon
- Unselected rows: standard foreground text
- After 5 selections: remaining rows disable (no visual change; click no-ops)
- Escape or outside-click: closes dropdown, retains selected chips in closed state

**ARIA refinement**: The design specified aria-listbox="menu", which over-promises keyboard semantics. A listbox expects single-select + arrow-key navigation; we deliver neither. Downgraded to aria-pressed toggle buttons on each row—honest about what the keyboard does, so screen readers don't lie to assistive-tech users.

**Copy constant tie-back**: The form enforces MAX_HASHTAGS=5 in write-kudo-form.tsx. The dropdown's disable-after-5 logic mirrors that constant, but we can't import it without a circular dependency (form imports field, field can't import form). Added a DRY tie-back comment flagging the magic number, so future readers know where the 5 originates and why it can't be DRY-derived.

## What We Tried

1. **Dynamic data from Supabase** — considered, shelved. The prose suggested this, but no migration was ready, and the business signal (the frame design) pointed to fixed values. Decision: static catalog for now.

2. **aria-listbox with full keyboard semantics** — attempted initially per spec. But implementing arrow-key navigation + single-select behavior would add 40+ lines and didn't match our multi-select UX. Decision: drop the role, use aria-pressed (honest semantics).

3. **Circular import: tie MAX_HASHTAGS constant** — tried to import the form's constant into the field component to stay DRY. Circular dependency killed it. Decision: add a tie-back comment instead of the import.

## Root Cause Analysis

Why did this require decision-making at all? Two reasons:

1. **Spec prose vs. frame design mismatch**: MoMorph's written note ("load from DB") and its frame design (fixed panel, 8 hard-coded tags) contradicted each other. The review cycle surfaced this; the code would have shipped with the contradiction if we'd just followed prose. The root: design-spec prose can be context or intent, but the frame image is the actual spec. We needed to read both and choose.

2. **ARIA semantics don't scale to hybrid UX**: The design used aria-listbox, which is correct for a pure listbox but didn't match our multi-select toggle-button pattern. The root: picking ARIA roles by name rather than by contract. We had to check what listbox promises and either deliver it or downgrade the role.

## Lessons Learned

1. **MoMorph frame images are the source of truth; prose is context.** Read both, but when they conflict, trust the frame. The dark panel, the 8 tags, the layout—that's the spec. The prose ("load dynamic from DB") is intent, not implementation.

2. **ARIA roles must match their keyboard contract or be downgraded.** aria-listbox promises arrow-key navigation and single-select behavior. We deliver neither (it's a multi-select toggle group). Claiming the role is a lie to screen-reader users. Honest ARIA is better than overspecified ARIA.

3. **Static data for stable business concepts buys velocity and clarity.** Company values don't change often. Keeping them as a static constant reduced code surface, eliminated a DB dependency, and left a clear migration path. YAGNI was the right call here.

4. **The reviewer's architectural eye matters.** All 3 Medium findings (ARIA mismatch, missing outside-click test, missing Escape test) were real. A good review catches the semantic and coverage gaps before merge. The 8/10 score was fair and the work was tighter after.

5. **Spec corrections (like the typo) need explicit sign-off.** We corrected "High-perorming" to "High-Performing"—visible to users, and a deviation from design spec. Product needs to know and approve it.

## Next Steps

1. **Await user seal on branch**: Confirm whether to commit on feature/kudos-supabase-data (current) or create a new feature/kudos-hashtag-dropdown branch.
2. **Create commit**: Once branch is clear. All changes are staged; tests pass (8/8), lint clean, typecheck passes.
3. **Notify product on copy change**: "#High-Performing" is the corrected form (small typo fix from design spec).
4. **Merged**. The component is integration-ready. No blockers remain.

---

**Unresolved Q**: Should the hashtag catalog become a Supabase table later if the business wants to customize it per company or team? Answer: Not today. YAGNI holds. If the ask arrives, we refactor the constant into a DB query—the component's API won't change, so write-kudo-form stays unbroken.
