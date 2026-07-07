---
status: implemented
authored_by: takumi
created: 2026-07-06
lang: en
fcode: F006
---

# F006_WriteKudo

**Priority**: P1
**Type**: ui

## Overview

The "Viết Kudo" (Write Kudo) composer — a centered modal dialog overlaid on the `/sun-kudos` board,
implementing MoMorph frame "Viết Kudo" (`9ypp4enmFmdK3YAFJLIu6C` / `ihQ26W78P2` / `520:11602`). It lets
a Sunner compose a recognition/thanks message to a teammate: pick a recipient, give an award title,
write a body, tag hashtags, attach images, and optionally send anonymously. It is opened from the
`/sun-kudos` hero prompt search bar and closed via Hủy (Cancel), the backdrop, Escape, or a successful
Gửi (Send). This was explicitly deferred as a future feature in F003_SunKudos.

**Functional client-only** (matches F001–F003): real React form state + validation, mock recipient
data in `app/_lib/*`, **no backend, no persistence**. On Gửi: validate required fields → close (no
network). The rich-text toolbar is rendered as a **visual (non-wired)** control over a styled textarea
(YAGNI — a real contentEditable editor is out of scope).

## Requirements

| Code | Description | Handler | Verifiable |
|------|-------------|---------|------------|
| FR-001 | Clicking the `/sun-kudos` hero prompt bar opens the composer modal | `KudosSearchBar` (edit) → `WriteKudoModal` | yes |
| FR-002 | Modal renders as a centered dialog (752px, `#FFF8E1` bg, 24px radius, 40px padding) over a dark backdrop; Header stays visible; body scroll locked while open | `WriteKudoModal` | yes |
| FR-003 | Dismiss modal via Hủy button, backdrop click, or Escape — discards all input, no submit | `WriteKudoModal` | yes |
| FR-004 | Title heading "Gửi lời cám ơn và ghi nhận đến đồng đội" (centered) | `WriteKudoModal` | yes |
| FR-005 | Người nhận * — recipient search input (placeholder "Tìm kiếm", dropdown arrow); typing filters a mock Sunner list (autocomplete); selecting fills the field; required | `RecipientSelect` | yes |
| FR-006 | Danh hiệu * — award-title text input (placeholder "Dành tặng một danh hiệu cho đồng đội") + hint lines ("Ví dụ: Người truyền động lực cho tôi." / "Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn."); required *(present in design Frame 552 + rendered image, absent from numbered CSV — treated as required per its `*`)* | `WriteKudoModal` | yes |
| FR-007 | Content editor — toolbar (B / I / S / number-list / link / quote) + "Tiêu chuẩn cộng đồng" link on the right, over a styled textarea (placeholder "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!"); hint "Bạn có thể "@ + tên" để nhắc tới đồng nghiệp khác"; toolbar is visual-only; textarea captures body text; required | `KudoEditor` | yes |
| FR-008 | Hashtag * — "+ Hashtag" pill (label + note "Tối đa 5") opens a dropdown of the fixed `HASHTAG_OPTIONS` catalog (MoMorph "Dropdown list hashtag" `p9zO-c4a4x`); clicking a row toggles it (check icon + highlighted bg when selected); max 5 (unselected rows disabled at 5); selected tags also show as removable chips; required (≥1) | `HashtagField` | yes |
| FR-009 | Image — label + thumbnail row (each with `x` to remove) + "+ Image" button (note "Tối đa 5"); adds local object-URL previews; max 5 ("+ Image" hidden at 5); optional | `ImageUploadField` | yes |
| FR-010 | Anonymous — checkbox "Gửi lời cám ơn và ghi nhận ẩn danh" (default off) | `WriteKudoModal` | yes |
| FR-011 | Footer actions — Hủy (secondary, text + `x` icon, always enabled) and Gửi (primary, yellow, text + send icon); Gửi disabled until required fields (recipient, danh hiệu, content, ≥1 hashtag) are filled | `WriteKudoModal` | yes |
| FR-012 | On Gửi (enabled) → run validation, then close the modal and reset state (no persistence) | `WriteKudoModal` | yes |

## Key entities

- `SunnerOption`: `id, name, role, avatar` — mock recipient list for the autocomplete (reuse/extend
  existing kudos mock data where possible). Lives in `app/_lib/write-kudo-content.ts` alongside
  static copy (title, placeholders, hint strings, community-standards label).
- Form state (client, ephemeral): `recipient: SunnerOption | null`, `award: string`,
  `body: string`, `hashtags: string[]` (≤5), `images: {id, url}[]` (≤5), `anonymous: boolean`.

## Success criteria

- SC-001: Clicking the hero prompt bar on `/sun-kudos` opens a modal faithful to frame `ihQ26W78P2`
  (all fields A–H + Danh hiệu present, copy verbatim).
- SC-002: Required-field gating works — Gửi is disabled until recipient + danh hiệu + content + ≥1
  hashtag are set; adding/removing hashtag & image chips respects the max-5 cap.
- SC-003: Modal is dismissible by Hủy, backdrop, and Escape; dismissing discards input; a fresh open
  starts empty.
- SC-004: Layout is pixel-faithful to `ihQ26W78P2` at 1440px (Playwright measurement) and responsive
  (modal scrolls within viewport / stacks gracefully below `sm`).
- SC-005: Accessible dialog — `role="dialog"` + `aria-modal`, labelled by the title, focus moved into
  the modal on open and restored to the trigger on close, Escape closes.

## Assumptions

- Faithful client-only clone with mock data (F001–F003 pattern) — no backend, no submit network call,
  no image persistence (object URLs only, revoked on close).
- Rich-text toolbar is visual-only; body is captured via a plain (styled) textarea. `@`-mention is a
  hint string only (no live mention autocomplete).
- Recipient autocomplete filters a small static mock Sunner list; no real directory lookup.
- Community-standards ("Tiêu chuẩn cộng đồng") link is visual-only (no target page).
- Anonymous toggle only sets local state (design's "enter anonymous name" sub-field is out of scope
  unless it appears in a variant; the base frame shows only the checkbox).

## Out of scope

- Any backend, API, or persistence of the composed Kudo; real image upload/storage.
- A functional rich-text/contentEditable editor and live `@`-mention resolution.
- Kudo detail view, edit/delete of an existing Kudo, notifications, Secret Box, profile pages.
- Wiring the floating widget button as an additional trigger (prompt-bar trigger only for this MVP).
