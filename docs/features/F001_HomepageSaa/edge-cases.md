---
status: draft
authored_by: takumi
created: 2026-07-02
lang: en
---

| Scenario | What Happens | User-Facing Message |
|----------|--------------|----------------------|
| Event-start environment variable is missing, empty, or not valid ISO-8601 | Countdown logic catches the parse failure and treats the event as already elapsed; page continues to render normally | "00" shown on all three countdown tiles; no error banner or crash |
| Current time passes the configured event-start datetime while the page is open | On the next per-minute tick, all three tiles clamp to `00` and stay there; "Coming soon" label disappears | Countdown tiles read "00" / "00" / "00"; "Coming soon" text is no longer shown |
| Countdown tile value is a single digit (e.g. 5 days, 3 hours) | Value is zero-padded before render | Tile shows "05", "03" — never a bare single digit |
| Visitor clicks an award card's "Chi tiết" link before the Awards Information page/route exists | Link either resolves to a stub placeholder page or is disabled/left as a "#" anchor per the routing decision (see Unresolved Questions in technical-spec.md) | "None — no broken-link error surfaced; treated as a known limitation until the destination page ships" |
| Award card description text is longer than the card's allotted 1-2 lines | Text is truncated with an ellipsis rather than overflowing or breaking the card layout | Card shows truncated description ending in "…"; full text not shown inline |
| Visitor resizes the browser between desktop and tablet/mobile widths | Award grid re-flows between 3-column (desktop) and 2-column (tablet/mobile) layouts without content loss | Grid visually reflows; all 6 cards remain visible and clickable at every width |
| Visitor clicks the notification bell or avatar icon (no auth backend exists yet) | Icon is rendered as a static visual affordance only; no dropdown/menu content is wired up | "None — icon may be inert or show a stub; not a functional account/notification feature in this MVP" |
| Visitor opens the language switcher and selects "EN" or "VN" | Switcher UI updates to reflect the selection; whether displayed page copy actually changes depends on the i18n-scope decision (see Unresolved Questions in technical-spec.md) | Switcher shows the newly selected language; copy may or may not change until i18n catalog is confirmed |
