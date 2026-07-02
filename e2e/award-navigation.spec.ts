import { test, expect } from "@playwright/test";

test.describe("Award Card Navigation (SC-004)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should navigate to awards-information when clicking award card title", async ({ page }) => {
    // Find all award card title links and test one
    const awardTitles = page.locator("article a[href*='/awards-information']");
    const count = await awardTitles.count();
    expect(count).toBeGreaterThan(0);

    // Click the first award title link
    const firstLink = awardTitles.first();
    const href = await firstLink.getAttribute("href");
    expect(href).toMatch(/^\/awards-information#/);

    // Navigate and verify
    await firstLink.click();
    await page.waitForURL(/\/awards-information#/);
    expect(page.url()).toMatch(/\/awards-information#/);
  });

  test("should have 6 award cards with correct navigation links", async ({ page }) => {
    // Find all award cards in the grid
    const section = page.locator("section[aria-label='Awards']");
    const grid = section.locator("div").filter({ has: page.locator("article") });
    const articles = grid.locator("article");

    const cardCount = await articles.count();
    expect(cardCount).toBe(6);

    // For each card, verify there are links to awards-information
    for (let i = 0; i < 6; i++) {
      const article = articles.nth(i);
      const links = article.locator("a[href*='/awards-information']");
      const linkCount = await links.count();
      expect(linkCount).toBe(3); // image link, title link, Chi tiết link
    }
  });

  test("all award card links should have valid anchor slugs", async ({ page }) => {
    const expectedSlugs = [
      "top-talent",
      "top-project",
      "top-project-leader",
      "best-manager",
      "signature-2025-creator",
      "mvp",
    ];

    const section = page.locator("section[aria-label='Awards']");
    const awardLinks = section.locator("a[href*='/awards-information']");

    const hrefs = await awardLinks.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    const nonNullHrefs = hrefs.filter((href): href is string => href !== null);
    const uniqueSlugs = new Set(nonNullHrefs.map((href) => href.split("#")[1]));

    // Should have all 6 slugs (each slug appears 3 times - image, title, chi tiết)
    expectedSlugs.forEach((slug) => {
      expect(uniqueSlugs.has(slug)).toBe(true);
    });
  });
});
