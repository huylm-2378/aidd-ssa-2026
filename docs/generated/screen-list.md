# Screen List

_Top-level page screens, hand-reconciled from the route set + `docs/features/F00x` specs (narrow sync
of a forward-engineered repo — NOT a full `/tkm:rebuild-spec` core pass). Only page-level SCR### codes
are allocated here; composite/region (REG###) breakdown is deferred to a real rebuild-spec run if the
project ever needs it. `/auth/callback` is a non-visual route handler and is intentionally omitted.
SCR006 is the one exception: it has its own MoMorph screen ID (a dedicated Figma frame) but renders as a
client-side modal over `/sun-kudos` rather than a distinct route, so it's listed here rather than
deferred to REG###. SCR008 (F010) is the same kind of exception: its own dedicated MoMorph frame, but it
renders as an overlay widget on `/` rather than a distinct route. SCR010 (F012) is the same kind of
exception again: its own dedicated MoMorph frame, but it renders as a header dropdown overlay present on
every header-bearing route rather than a distinct route._

| SCR | Screen | Route | Owning feature | Notes |
|-----|--------|-------|----------------|-------|
| SCR001 | Homepage SAA | `/` | F001 | Countdown, 6-card award grid, Kudos banner |
| SCR002 | Awards Information | `/awards-information` | F002 | Six award categories + sticky anchor-nav sidebar |
| SCR003 | Sun* Kudos (a.k.a. "Sun* Kudos - Live board", MoMorph `MaZUn5xHXZ`) | `/sun-kudos` | F003, F008 | Hero + search, Highlight carousel, Spotlight board (F008: real-time pan/zoom constellation + live search + activity ticker), All Kudos feed + sidebar |
| SCR004 | Login | `/login` | F004, F005 | Keyvisual + minimal header/footer + Google OAuth button (F005 makes the button a real `signInWithOAuth` trigger) |
| SCR005 | Auth Code Error | `/auth/auth-code-error` | F005 | OAuth failure fallback; message + link back to `/login` |
| SCR006 | Viết Kudo (composer modal) | `/sun-kudos` (modal, no dedicated route) | F006 | Recipient autocomplete, danh hiệu, content editor, hashtags (max 5), images (max 5), anonymous toggle; opened from the hero prompt search bar, closes via Hủy/backdrop/Escape/Gửi |
| SCR007 | User Profile (a.k.a. "Profile bản thân", MoMorph `3FoIx6ALVb`) | `/profile` | F009 | Keyvisual banner, identity block (avatar/name/department+tier placeholder, icon-collection strip), stats panel (Kudos/hearts/Secret Box counts, visual-only "Mở Secret Box" button), Sent/Received Kudos feed; own profile only, not auth-gated |
| SCR008 | Floating Action Button (a.k.a. "phim nổi chức năng 2", MoMorph `Sv7DFwBw1h`) | `/` (fixed overlay widget, no dedicated route) | F010 | Collapsed red `+` toggle rotates into `×`; opens two gold pills, "Thể lệ" (→ `/awards-information`) and "Viết KUDOS" (opens SCR006 modal); closes on toggle/Escape/outside click |
| SCR009 | Countdown / Prelaunch page (a.k.a. "Countdown - Prelaunch page", MoMorph `8PJQswPZmU`) | `/prelaunch` | F011 | Standalone full-screen route, no Header/Footer; Root-further keyvisual bg, centered "Sự kiện sẽ bắt đầu sau" heading, live DAYS/HOURS/MINUTES countdown (reuses homepage hero's `useCountdown`/`CountdownTile`) |
| SCR010 | Language Dropdown (a.k.a. "Dropdown-ngôn ngữ", MoMorph `hUyaaugye2`) | header overlay on every header-bearing route (no dedicated route) | F012 | Trigger shows active flag+code+chevron; panel lists VN/EN rows with flag icons, active row highlighted; dismiss on outside click/Escape/select; client-only state, no i18n wiring; present in both full and `minimal` header variants (not on `/prelaunch`, which has no Header) |
