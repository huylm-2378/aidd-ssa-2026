---
status: draft
authored_by: takumi
created: 2026-07-18
---

# SCR008_SecretBoxModal — Screen Spec

**Screen**: SCR008_SecretBoxModal
**Feature**: F016 — Open Secret Box
**Type**: composite
**Route**: N/A — modal, no dedicated route (opened over `/sun-kudos` and `/profile`)
**Generated**: 2026-07-18

## Purpose

A signed-in Sunner opens this modal from the "Open Secret Box" button on the Kudos sidebar or the
Profile page to see how many Secret Boxes they've earned and open one to receive a random badge.

## Screen Layout

A single centered dialog over a dark backdrop (reusing the portal/backdrop shape of the existing
`WriteKudoModal`, `items-center justify-center` rather than the right-drawer layout used by
`RulesModal`). Inside: a header row (title + close "X"), a divider, an instruction line, a large
centered box illustration, and a bottom counter row. No sidebar, no scrolling content — the dialog
is short enough to fit without an internal scroll region. (Layout root: TBD (draft) — new
`SecretBoxModal` component, not yet written; wrapper pattern to copy from
`app/_components/sun-kudos/write-kudo-modal.tsx:89-97`.)

### Layout Sketch

```
┌───────────────────────────────────────────┐
│ R1: Header (title centered, X top-right)  │
├───────────────────────────────────────────┤
│ - - - - - - - R2: Divider - - - - - - - - │
├───────────────────────────────────────────┤
│         R3: Instruction line              │
│         (hidden when count = 0)           │
├───────────────────────────────────────────┤
│                                           │
│         R4: Box illustration              │
│         (click target, centered)          │
│                                           │
├───────────────────────────────────────────┤
│   R5: Counter ("Secretbox chưa mở" + N)   │
└───────────────────────────────────────────┘
```

### Layout Regions

| Region ID | Name | Position | Scrollable | Key Components | Responsive Behavior |
|-----------|------|----------|------------|------------------|-----------------------|
| R1 | Header | static, top of dialog | no | Title text, close "X" button | always |
| R2 | Divider | static | no | thin rule | always |
| R3 | Instruction line | static | no | conditional text node | always |
| R4 | Box illustration | static, centered | no | box image / click target, badge overlay after open | always |
| R5 | Counter | static, bottom | no | label text + number text | always |

## User Flow

> **Scope:** within-screen interactions only. Cross-screen navigation belongs in `screen-flow.md`.

### Happy Path

1. User clicks "Open Secret Box" on the Kudos sidebar or Profile page (outside this screen); the
   Secret Box Modal opens in R1–R5 above, populated with their real unopened/opened counts.
2. If the count is above 0, the instruction line in R3 is visible and the box in R4 is an active
   click target.
3. User clicks the box in R4; the box shows a brief in-flight state, then reveals one badge image
   inside R4 and the counter in R5 decreases by one.
4. User clicks the "X" in R1 (or clicks outside the dialog); the modal closes and the user returns
   to the page they opened it from.

### Branches

| Decision point | Condition | Outcome on this screen | Source |
|------------------|-----------|---------------------------|--------|
| Step 2 | unopened count = 0 | instruction line in R3 stays hidden; box in R4 is inert (no click effect) | `TBD (draft)` |
| Step 3 | RPC returns an error (e.g. no boxes left, not signed in) | R4 shows an inline error message instead of a badge; counter in R5 unchanged | `TBD (draft)` |
| Step 1 | no active session | R3/R4/R5 replaced by a sign-in prompt; no counts fetched | `TBD (draft)` |

## UI States

| State | Trigger | Visual Behavior | User Action Available | Source |
|-------|---------|-------------------|---------------------------|--------|
| loading | modal opened, counts not yet resolved | brief skeleton/placeholder over R4/R5 | none | `TBD (draft)` |
| idle | counts resolved, count > 0 | instruction line visible, box active | click box | `TBD (draft)` |
| disabled | counts resolved, count = 0 | instruction line hidden, box inert | none | `TBD (draft)` |
| opening | box clicked, RPC in flight | box shows a brief busy state | none | `TBD (draft)` |
| success | RPC resolved ok | badge image shown in R4, counter decremented in R5 | close modal | `TBD (draft)` |
| error | RPC resolved with an error code | inline error message in place of badge | close modal / retry | `TBD (draft)` |
| signed-out | no active session | sign-in prompt replaces R3/R4/R5 content | sign in (external) | `TBD (draft)` |

## Validation & Error Feedback

### A) Client-side

N/A — no client-side form validation detected. There is no text/number input on this screen; the
only interaction is a single click target.

### B) Server-side

#### Open Secret Box
- **Endpoint:** server action calling `open_secret_box()` RPC (planned; not yet implemented)
- **Request:** no user-supplied fields — the server derives the caller's identity and entitlement
  itself; the client sends no count or badge value
- **Success:** RPC returns `{badgeCode, remaining}` → box frame shows the badge image, counter
  updates to `remaining`
- **Errors:** `no_boxes` → inline message that there is nothing left to open right now |
  `auth_required` → inline sign-in prompt
- **Trigger:** clicking the box illustration in R4 while the count is above 0
- **Source:** `TBD (draft)` — not yet implemented

## Accessibility

| Aspect | Status | Notes |
|--------|--------|-------|
| ARIA roles/labels | planned | dialog to reuse `role="dialog"`, `aria-modal="true"`, `aria-labelledby` from `RulesModal`/`WriteKudoModal` |
| Keyboard navigation | planned | Escape-to-close and focus trap to reuse `useDialogA11y` (`app/_components/sun-kudos/use-dialog-a11y.ts`) |
| Focus management | planned | same hook restores focus to the triggering CTA on close |
| Screen reader compatibility | unknown | not yet built; needs a verbal label for the box illustration and the revealed-badge state, not just a visual counter |

**Related existing precedent:** `app/_components/sun-kudos/use-dialog-a11y.ts` (Escape, scroll lock,
focus trap, restore-focus — reused as-is), `app/_lib/use-mounted.ts` (SSR-safe portal mount).
