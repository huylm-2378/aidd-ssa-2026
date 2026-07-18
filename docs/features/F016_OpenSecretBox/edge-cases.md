---
status: draft
authored_by: takumi
created: 2026-07-18
lang: en
---

| Scenario | What Happens | User-Facing Message |
|----------|--------------|----------------------|
| Unopened count is 0 | Instruction line stays hidden; clicking the box does nothing — no request is sent | "None — box appears inert, counter shows 00" |
| User double-clicks the box rapidly while one open is still in flight | The server re-checks entitlement on every call; once the count reaches 0 the extra click is rejected the same way as the zero-count case, so at most one badge is ever granted per available box | "None — silent no-op once the box is used up" |
| Server returns an unrecognized or corrupted badge code | Client renders a generic fallback badge image instead of crashing, showing a broken image, or rendering the raw value | "Your badge couldn't be displayed — please refresh and try again" |
| Client tries to open a box it isn't entitled to (stale UI, tampered request) | The RPC recomputes entitlement itself and refuses the write; nothing is inserted | "You don't have a Secret Box to open right now" |
| Visitor is not signed in and opens the panel | Modal shows a sign-in prompt in place of the counter/box content; no entitlement is computed and no open is attempted | "Sign in to open your Secret Box" |
| Sunner row not yet linked to the visitor's account (auth link not yet backfilled) | Treated the same as zero entitlement rather than as an error | "None — box appears inert, counter shows 00" |
