# Phase 01 — Secret Box UI Modal (Track A, UI)

**Track:** A (UI) · **Depends on:** none · **Parallel with:** Track B (no cross-track blockedBy)

## MoMorph ref
- Open secret box- chưa mở: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/J3-4YFIpMM
- Clarifications: plans/260718-0451-open-secret-box/clarifications.md

## Goal
Build `SecretBoxModal` presentational component per frame J3-4YFIpMM with mock data props.
Covers UI aspects of FR-002 (layout/title/close/divider/counter), FR-003 (instruction hidden at
count 0), FR-007 (box inert at count 0).

## Integration contract (props)
```
{ open: boolean, onClose: () => void, triggerRef?, unopened: number, opened: number,
  lastBadgeCode: string | null, opening: boolean, onOpenBox: () => void,
  authState: "authed" | "anon" }
```

## Out of scope
- No backend calls, no server action wiring (Track B / phase-04 own those).
- No animation / standby / success-state frames.
- No real data — mock props only.

`momorph-implement-design` handles the rest at runtime: mock data extracted from the Figma design
(e.g. count "05"); box illustration asset downloaded from the design to `public/secret-box/`.
