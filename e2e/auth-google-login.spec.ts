import { test, expect } from "@playwright/test";

// F005 — Google login with Supabase. Automatable surface only; the full OAuth round-trip
// (SC-002/005/006) needs a real Google account and is verified manually (see the plan's Phase 4).
test.describe("Google login with Supabase (F005)", () => {
  test("the /auth/auth-code-error page renders with a link back to /login (SC-003)", async ({
    page,
  }) => {
    await page.goto("/auth/auth-code-error");
    await expect(page.getByRole("heading", { name: "Đăng nhập chưa hoàn tất" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Quay lại đăng nhập" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  test("logged-out header account menu offers Sign in → /login (SC-007)", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    await header.getByRole("button", { name: "Account menu" }).click();
    const signIn = header.getByRole("menuitem", { name: "Sign in" });
    await expect(signIn).toBeVisible();
    await expect(signIn).toHaveAttribute("href", "/login");
  });

  test("marketing pages stay public — no redirect to /login without a session (SC-008)", async ({
    page,
  }) => {
    for (const path of ["/", "/awards-information", "/sun-kudos"]) {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(`${path.replace("/", "\\/")}$`));
      // Use first() to handle pages with multiple headers (nav + page-specific header).
      await expect(page.locator("header").first()).toBeVisible();
    }
  });
});
