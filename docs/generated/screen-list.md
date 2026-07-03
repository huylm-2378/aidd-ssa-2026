# Screen List

_Top-level page screens, hand-reconciled from the route set + `docs/features/F00x` specs (narrow sync
of a forward-engineered repo — NOT a full `/tkm:rebuild-spec` core pass). Only page-level SCR### codes
are allocated here; composite/region (REG###) breakdown is deferred to a real rebuild-spec run if the
project ever needs it. `/auth/callback` is a non-visual route handler and is intentionally omitted._

| SCR | Screen | Route | Owning feature | Notes |
|-----|--------|-------|----------------|-------|
| SCR001 | Homepage SAA | `/` | F001 | Countdown, 6-card award grid, Kudos banner |
| SCR002 | Awards Information | `/awards-information` | F002 | Six award categories + sticky anchor-nav sidebar |
| SCR003 | Sun* Kudos | `/sun-kudos` | F003 | Hero + search, Highlight carousel, Spotlight board, All Kudos feed + sidebar |
| SCR004 | Login | `/login` | F004, F005 | Keyvisual + minimal header/footer + Google OAuth button (F005 makes the button a real `signInWithOAuth` trigger) |
| SCR005 | Auth Code Error | `/auth/auth-code-error` | F005 | OAuth failure fallback; message + link back to `/login` |
