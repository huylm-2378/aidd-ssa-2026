<!-- layout-exempt: rebuild-spec owns all docs/system|features|generated|flows paths — all references here are output targets or internal definitions -->
# Business Rules (DRAFT)

**Project**: aidd-ssa-2026 (Sun* Annual Awards 2025)
**Generated**: 2026-07-17
**Analysis Scope**: Derived from [behavior-logic.md](behavior-logic.md), [permissions-matrix.md](permissions-matrix.md), [data-model.md](data-model.md), [route-list.md](route-list.md), and the Server Action / migration source they cite.

> Plain-language rules the system enforces, rewritten for a non-technical audience.
> No BL###/PERM### codes and no `path:line` citations — that detail lives in the linked artifacts.

### One like per person per Kudo

**Applies when:** a signed-in Sunner taps the heart on any Kudo card.
**Says:** each person can like a given Kudo at most once. Tapping again removes the like instead of
adding a second one — there's no way to "double-like." The system also guarantees this can't be broken by
double-clicking or a network hiccup: the very first tap that reaches the server always wins, and a
second, near-simultaneous tap safely resolves to "unlike" rather than causing an error or an inconsistent
count.
**Source artifact:** [permissions-matrix.md](permissions-matrix.md), [data-model.md](data-model.md)

---

### Like counts are kept by the database, not the app

**Applies when:** any like is added or removed, anywhere in the system.
**Says:** the running "like count" shown on a Kudo is never set directly by the application — it's
maintained automatically by the database itself the moment a like row is added or removed. This means the
count can never drift out of sync with the actual likes, no matter which screen or code path triggered
the change.
**Source artifact:** [data-model.md](data-model.md)

---

### A Kudo must have a receiver, a title, a body, and at least one hashtag

**Applies when:** a Sunner submits the "Write a Kudo" form.
**Says:** the submission is rejected before anything is saved if any of these are missing: who it's for,
a title, the message body, or at least one hashtag/tag. Everything else on the form (photos, "send
anonymously") is optional.
**Source artifact:** [permissions-matrix.md](permissions-matrix.md)

---

### A Kudo needs a real, signed-in sender

**Applies when:** anyone tries to submit a Kudo.
**Says:** only someone currently signed in can send a Kudo — the system attributes every Kudo to a real
person by using their active session, never a name typed into the form. If no one is signed in, the
submission is refused. This is enforced twice, independently: once by the database itself (so it can
never be bypassed even by a bug in the app), and once by the application as an extra safety check.
**Source artifact:** [permissions-matrix.md](permissions-matrix.md)

---

### The sender's name and photo are captured at send time, not looked up later

**Applies when:** a Kudo is created.
**Says:** the sender's display name and avatar are copied onto the Kudo the moment it's sent, using
whatever the sender's Google account currently shows (or their email as a fallback name). If that
person later changes their Google name or photo, previously sent Kudos keep showing the old one — they
are a snapshot, not a live link.
**Source artifact:** [data-model.md](data-model.md)

---

### "Anonymous" hides the sender only when the Kudo is displayed

**Applies when:** a Sunner checks "send anonymously" while writing a Kudo.
**Says:** the sender's identity is still recorded internally exactly as usual — anonymity is a display
rule, not a data-deletion rule. Screens that show the Kudo simply hide the sender's name and photo when
this flag is set.
**Source artifact:** [data-model.md](data-model.md)

---

### The Highlight carousel shows the 5 most-liked Kudos

**Applies when:** the Highlight Kudos section on the Sun* Kudos board renders (optionally narrowed by a
hashtag or department filter the visitor picks).
**Says:** whichever five Kudos currently have the most likes (within the active filter, if any) appear in
the highlight carousel, most-liked first. As likes change, which five Kudos qualify can change too.
**Source artifact:** [screen-flow.md](screen-flow.md)

---

### Everyone can read the recognition wall; only signed-in Sunners can add to it

**Applies when:** any visitor loads a page that shows Kudos, the spotlight roster, sidebar stats, or
recent-gifts list.
**Says:** all of that content is public — no sign-in is needed to see it. The moment an action changes
data (sending a Kudo, liking one), a signed-in session becomes required. Browsing is open; contributing
is not.
**Source artifact:** [permissions.md](permissions.md)

---

### No page requires signing in to view it

**Applies when:** a visitor navigates to any page in the app, including their own profile page.
**Says:** there is no login wall anywhere. Even the profile page renders for a signed-out visitor — it
just shows an empty identity area instead of redirecting them to sign in.
**Source artifact:** [permissions.md](permissions.md)

---

### First Google sign-in creates a Sunner profile automatically, without blocking sign-in

**Applies when:** someone signs in with Google for the first time.
**Says:** the system automatically creates that person's internal Sunner record (so they can appear as a
Kudo recipient) right when their account is created — no separate setup step is needed. If that
automatic step ever fails for any reason, the sign-in itself still succeeds; a Sunner record simply isn't
created that time rather than the person being locked out.
**Source artifact:** [data-model.md](data-model.md)

---

### The like button updates instantly, then corrects itself if the server disagrees

**Applies when:** a Sunner taps the heart on a Kudo.
**Says:** the heart and count flip immediately on screen, before the server has confirmed anything, so
the interaction feels instant. If the server request actually fails, the button and count snap back to
how they were and a short error message appears. If it succeeds, the on-screen count is replaced with
whatever the server reports, in case someone else liked the same Kudo in the meantime.
**Source artifact:** [behavior-logic.md](behavior-logic.md)

---

### The event countdown never goes negative and never crashes on a bad date

**Applies when:** the homepage or the prelaunch page shows the "time until the event" countdown.
**Says:** the countdown recalculates every minute from a fixed event start time. If that start time is
ever missing or malformed, the countdown simply freezes at a "00" display instead of erroring out or
showing a negative number.
**Source artifact:** [behavior-logic.md](behavior-logic.md)

---

### The live Spotlight board updates itself in real time, and degrades quietly if it can't

**Applies when:** a visitor has the Sun* Kudos page's Spotlight board open.
**Says:** new Kudos appear on the live board automatically, without the page needing to be refreshed. If
the live connection drops, the board doesn't show an error — it just keeps showing the last data it had,
silently, until it can reconnect or the page is reloaded.
**Source artifact:** [behavior-logic.md](behavior-logic.md)

## Unresolved / Not Covered

- Photo attachments on a Kudo are not actually uploaded or stored anywhere — the app only remembers *how
  many* photos were attached, not the photos themselves. This is a known scope limitation, not a bug, but
  is worth flagging to a non-technical reader who might expect photos to persist.
- Department/tier shown on the profile page are placeholder values, not read from any real per-person
  record — this document does not treat that as a business rule since it is explicitly a known gap
  rather than intended behavior.
