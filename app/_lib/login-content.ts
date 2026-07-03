// Static copy for the Login screen (F004, frame "Login" GzbNeVGJHz).
// No backend/auth — the Google button mock-navigates to `loginHref`.
// Follows the typed `readonly` const convention used across app/_lib/*.

export const LOGIN_CONTENT = {
  // mms_B.2_content (662:14753) — two-line Vietnamese welcome, rendered as separate lines.
  subtitle: [
    "Bắt đầu hành trình của bạn cùng SAA 2025.",
    "Đăng nhập để khám phá!",
  ],
  // mms_B.3_Login (662:14425) — gold pill button label + Google glyph.
  loginLabel: "LOGIN With Google",
  // Mock "logged-in" landing (no OAuth backend in this project — confirmed with user).
  loginHref: "/",
} as const;
