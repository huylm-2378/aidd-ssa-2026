---
feature: F004_Login
title: Login screen
status: active
authored_by: create-plan
created: 2026-07-03
fcode: F004
route: /login
design:
  fileKey: 9ypp4enmFmdK3YAFJLIu6C
  screenId: GzbNeVGJHz
  node: "662:14387"
  frameName: "Login"
lang: en
---

# F004 — Login screen (`/login`)

## Summary

A faithful **static** clone of the MoMorph frame **"Login"** (screenId `GzbNeVGJHz`,
node `662:14387`). Single full-viewport landing: a full-bleed abstract "Root Further" keyvisual, a
**minimal header** (logo + language switcher only), the large **ROOT FURTHER** logotype, a short
Vietnamese welcome line, a gold **"LOGIN With Google"** button, and the shared footer. No auth
backend — the button mock-navigates to `/`. Mock/visual only; nothing is submitted or persisted.

## Frame structure → element map

| Frame node | Element | FR |
|---|---|---|
| `mms_C_Keyvisual` (`662:14388`) + `Cover` (`662:14390`) | full-bleed background + dark scrim | FR-002 |
| `mms_A_Header` (`662:14391`, component `186:1602`) | minimal header: logo + language | FR-001 |
| `mms_B.1_Key Visual` / `MM_MEDIA_Root Further Logo` (`2939:9548`) | "ROOT FURTHER" logotype | FR-003 |
| `mms_B.2_content` (`662:14753`) | welcome subtitle text | FR-004 |
| `mms_B.3_Login` (`662:14425`) | "LOGIN With Google" button | FR-005 |
| `mms_D_Footer` (`662:14447`, component `342:1427`) | reused footer + copyright | FR-006 |

## Functional requirements

- **FR-001 — Minimal header.** Reuse the shared `Header` via a new opt-in `minimal` prop that renders
  **only** the Sun* logo (left) + language switcher (right); nav links, notification bell, and account
  button are hidden. Default (`minimal` absent/false) leaves the header unchanged for `/`,
  `/awards-information`, `/sun-kudos`.
- **FR-002 — Keyvisual background.** Full-bleed abstract "Root Further" art fills the viewport behind
  the content, with a dark scrim/overlay so the white logotype and text stay legible.
- **FR-003 — Logotype.** Large "ROOT FURTHER" wordmark rendered from the existing asset
  `public/homepage-saa/root-further-logo.png` (white), left-aligned in the content column.
- **FR-004 — Welcome copy.** Two-line subtitle, Montserrat 700, white, ~20px/40px, letter-spacing
  0.5px: `Bắt đầu hành trình của bạn cùng SAA 2025.` / `Đăng nhập để khám phá!`
- **FR-005 — Google login button.** Gold pill labelled `LOGIN With Google` with a trailing Google "G"
  glyph. On click it navigates to `/` (mock "logged-in" landing). Keyboard-focusable, accessible label.
- **FR-006 — Footer.** Reuse the shared `Footer` via a new opt-in `minimal` prop that renders **only**
  the centered copyright line (`Bản quyền thuộc về Sun* © 2025`); logo and nav links are hidden.
  Default (`minimal` absent/false) leaves the footer unchanged for `/`, `/awards-information`,
  `/sun-kudos`.
- **FR-007 — Responsive.** Faithful at the 1512px Figma canvas; content column scales/stacks down to
  375px with no horizontal overflow; logotype and button shrink gracefully.

## Entities

Content is static copy only — one typed module, no runtime data:

```ts
// app/_lib/login-content.ts
export const LOGIN_CONTENT = {
  subtitle: ["Bắt đầu hành trình của bạn cùng SAA 2025.", "Đăng nhập để khám phá!"],
  loginLabel: "LOGIN With Google",
  loginHref: "/",
} as const;
```

> **F014 (round 5) update:** `login-content.ts` above is deleted. Its strings now
> live as `login.subtitle1`/`login.subtitle2`/`login.googleButton` in the i18n
> catalog, rendered by the new `login-welcome.tsx` client leaf — see
> `docs/features/F014_Internationalization/technical-spec.md` FR-014.

## Success criteria

- **SC-001** — `/login` renders header + keyvisual + logotype + subtitle + button + footer, faithful
  at 1512px (spacing/colors/type match the frame).
- **SC-002** — Clicking "LOGIN With Google" navigates to `/`.
- **SC-003** — On `/login` the header shows only logo + language (no nav/bell/account); the header on
  `/`, `/awards-information`, `/sun-kudos` is unchanged (existing e2e stay green).
- **SC-004** — Footer shows the copyright line; layout holds from 1512px down to 375px with no overflow.

## Constraints

- `.claude/rules/development-rules.md`: kebab-case filenames, every file < 200 lines, YAGNI/KISS/DRY,
  real implementation (no stubs).
- Read `node_modules/next/dist/docs/` before using any Next.js API (AGENTS.md — Next 16.2.9 has
  intentional breaking changes). Confirm `Metadata`, `next/image`, `next/link`, `useRouter`/`Link`.
- Colors/type: bg `#00101a`, gold `#ffea9e`, Montserrat. Confirm exact tokens against the live frame /
  existing components before inventing new ones.

## Out of scope

Real OAuth / auth backend; session or token handling; form fields (design has none); language actually
switching content (switcher is the existing visual-only control).

## Assumptions / unresolved

- **Keyvisual asset** — the login background may reuse `public/homepage-saa/keyvisual-bg.png` or need a
  dedicated export to `public/login/`. Confirmed in Phase 1 against the frame; export only if fidelity
  fails at 1512px.
- Logotype uses the existing `root-further-logo.png`; if sizing/crop differs from the frame, export a
  login-specific wordmark.
