import { test, expect } from "@playwright/test";

test.describe("Login page (F004)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders logotype, both welcome lines, the Google button, and footer copyright (SC-001)", async ({
    page,
  }) => {
    await expect(page.getByRole("img", { name: "Root Further" })).toBeVisible();
    await expect(
      page.getByText("Bắt đầu hành trình của bạn cùng SAA 2025."),
    ).toBeVisible();
    await expect(page.getByText("Đăng nhập để khám phá!")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "LOGIN With Google" }),
    ).toBeVisible();
    await expect(
      page.locator("footer").getByText("Bản quyền thuộc về Sun* © 2025"),
    ).toBeVisible();
  });

  test("the Google login button is a gold pill that triggers Google OAuth (F005 SC-001)", async ({
    page,
  }) => {
    // F005: the button is now a real OAuth trigger (no longer a <Link href="/">). It must render as
    // a gold pill and, on click, issue a request toward the Supabase authorize endpoint.
    const button = page.getByRole("button", { name: "LOGIN With Google" });
    await expect(button).toBeVisible();

    const bg = await button.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(255, 234, 158)");

    const authRequest = page.waitForRequest(/supabase\.co\/auth\/v1\/authorize/, { timeout: 15000 });
    await button.click();
    const req = await authRequest;
    expect(req.url()).toContain("provider=google");
  });

  test("header is minimal: logo + language only, no nav / bell / account (SC-003)", async ({
    page,
  }) => {
    const header = page.locator("header");
    // Language switcher present.
    await expect(header.getByRole("button", { name: "VN" })).toBeVisible();
    // Logo home link present.
    await expect(header.getByRole("link", { name: "Sun* Annual Awards home" })).toBeVisible();
    // No nav links.
    await expect(header.getByRole("link", { name: "About SAA 2025" })).toHaveCount(0);
    await expect(header.getByRole("link", { name: "Award Information" })).toHaveCount(0);
    await expect(header.getByRole("link", { name: "Sun* Kudos" })).toHaveCount(0);
    // No notification bell or account button.
    await expect(header.getByRole("button", { name: "Notifications" })).toHaveCount(0);
    await expect(header.getByRole("button", { name: "Account menu" })).toHaveCount(0);
  });

  test("footer is minimal: copyright only, no logo or nav links (SC-004)", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer.getByText("Bản quyền thuộc về Sun* © 2025")).toBeVisible();
    await expect(footer.getByRole("link", { name: "About SAA 2025" })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: "Award Information" })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: "Sun* Kudos" })).toHaveCount(0);
  });

  test("regression: the full header nav still renders on the homepage", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Award Information" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Sun* Kudos" })).toBeVisible();
    await expect(header.getByRole("button", { name: "Account menu" })).toBeVisible();
  });

  test("layout holds with no horizontal overflow at 1512px and 375px (SC-004)", async ({ page }) => {
    for (const width of [1512, 375]) {
      await page.setViewportSize({ width, height: 900 });
      const noOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      );
      expect(noOverflow, `no overflow at ${width}px`).toBe(true);
    }
  });
});
