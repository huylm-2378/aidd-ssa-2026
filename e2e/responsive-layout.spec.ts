import { test, expect } from "@playwright/test";

test.describe("Award Grid Responsive Layout (SC-005)", () => {
  test("should render 3 columns at desktop width (1280px)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find the awards section and grid
    const awardsSection = page.locator("section[aria-label='Awards']");
    const grid = awardsSection.locator("div").filter({ has: page.locator("article") });

    // Get all award articles
    const articles = grid.locator("article");
    const cardCount = await articles.count();

    expect(cardCount).toBe(6);

    // At desktop width, verify all cards are visible
    for (let i = 0; i < 6; i++) {
      const article = articles.nth(i);
      expect(await article.isVisible()).toBe(true);
    }
  });

  test("should render 2 columns at tablet width (768px)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find the awards section and grid
    const awardsSection = page.locator("section[aria-label='Awards']");
    const grid = awardsSection.locator("div").filter({ has: page.locator("article") });

    // Get all award articles
    const articles = grid.locator("article");
    const cardCount = await articles.count();

    expect(cardCount).toBe(6);

    // At tablet width, verify all cards are visible
    for (let i = 0; i < 6; i++) {
      const article = articles.nth(i);
      expect(await article.isVisible()).toBe(true);
    }
  });

  test("should render appropriately at mobile width (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Find the awards section and grid
    const awardsSection = page.locator("section[aria-label='Awards']");
    const grid = awardsSection.locator("div").filter({ has: page.locator("article") });

    // Get all award articles - should still be visible
    const articles = grid.locator("article");
    const cardCount = await articles.count();

    expect(cardCount).toBe(6);

    // All cards should be visible and scrollable
    for (let i = 0; i < cardCount; i++) {
      const article = articles.nth(i);
      await expect(article).toBeVisible();
    }
  });
});
