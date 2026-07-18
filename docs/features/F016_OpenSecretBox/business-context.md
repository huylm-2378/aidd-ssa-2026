---
status: draft
authored_by: takumi
created: 2026-07-18
lang: en
---

## Why It Matters

Sunners already earn hearts when teammates like the kudos they receive, and the product's stated
rule is that every 5 hearts unlocks one Secret Box. Today that count is shown as a static number
with no way to actually open a box. This feature turns that promise into a real reward: opening a
box is a small moment of delight that hands back a random collectible badge, making every heart a
teammate gives feel like it actually leads somewhere.

## Who Uses It

- **Sunner (signed-in member)** — opens their own earned Secret Boxes from either the Kudos sidebar
  or their Profile page, and collects a random badge each time.
- **Visitor (not signed in)** — sees the same "Open Secret Box" button as everyone else, but is
  asked to sign in before any box data or opening action becomes available to them.

## What They Do

1. Sunner receives kudos with hearts from teammates over time.
2. Every 5 hearts received unlocks one Secret Box, shown as a running count wherever the "Open
   Secret Box" button appears.
3. Sunner opens the Secret Box panel from either the sidebar or their profile page.
4. If they have at least one unopened box, they select the box and immediately receive one random
   collectible badge; the box disappears from their unopened count and the badge joins their
   collection.
5. If they have zero unopened boxes, selecting the box does nothing — the panel simply shows they
   have none to open right now.
6. A visitor who is not signed in and tries to open the panel is asked to sign in first, instead of
   seeing box data that isn't theirs.

## Unresolved Questions

- Should previously-opened badges become viewable somewhere else later (a "my collection" gallery)
  beyond this momentary reveal? Out of scope this round per the locked decision, but a likely next
  ask once this ships.
- Should the sidebar's existing "Secret Boxes opened/unopened" numbers (currently shared demo
  figures for everyone) switch to each person's real count in this same release, or stay a
  follow-up? The locked decision leaves that list as-is for now and only adds the click action.
