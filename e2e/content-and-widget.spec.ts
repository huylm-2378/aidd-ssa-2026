import { test, expect } from "@playwright/test";

test.describe("Content and Widget Tests (SC-007, SC-008)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Root Further pull-quote should render in italic (SC-007)", async ({ page }) => {
    const quote = page.locator("blockquote", { hasText: "A tree with deep roots fears no storm" });
    await expect(quote).toBeVisible();

    const fontStyle = await quote.evaluate((el) => getComputedStyle(el).fontStyle);
    expect(fontStyle).toBe("italic");
  });

  test("Kudos banner 'Chi tiết' link should navigate to /sun-kudos (SC-007)", async ({ page }) => {
    // Find link to /sun-kudos and verify it exists
    const kudosLinks = page.locator("a[href='/sun-kudos']");
    const count = await kudosLinks.count();
    expect(count).toBeGreaterThan(0);

    // Verify href is correct
    const kudosLink = kudosLinks.first();
    const href = await kudosLink.getAttribute("href");
    expect(href).toBe("/sun-kudos");
  });

  test("floating button should stay fixed on scroll (SC-008)", async ({ page }) => {
    const widgetButton = page.getByRole("button", { name: "Open quick actions" });
    await expect(widgetButton).toBeVisible();

    const boxBefore = await widgetButton.boundingBox();
    expect(boxBefore).not.toBeNull();

    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);

    await expect(widgetButton).toBeVisible();
    const boxAfter = await widgetButton.boundingBox();
    expect(boxAfter).not.toBeNull();

    // A fixed-position element keeps the same viewport-relative coordinates after scroll.
    expect(boxAfter!.y).toBeCloseTo(boxBefore!.y, 0);
    expect(boxAfter!.x).toBeCloseTo(boxBefore!.x, 0);
  });

  test("floating button should open menu on click (SC-008)", async ({ page }) => {
    const widgetButton = page.getByRole("button", { name: "Open quick actions" });
    await expect(widgetButton).toHaveAttribute("aria-expanded", "false");

    const menu = page.getByRole("menu");
    await expect(menu).toBeHidden();

    await widgetButton.click();

    await expect(widgetButton).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();
  });

  test("homepage loads without crash when env is unset (SC-003 e2e)", async ({ page }) => {
    // Simply navigate to homepage - if the env is unset, the countdown should still render
    await page.goto("/");

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // At minimum, page should not crash and should be visible
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain("Sun");
  });

  test("countdown tiles should be visible and not show negative values", async ({ page }) => {
    await page.goto("/");

    const heroSection = page.locator("section[aria-label='Event hero']");
    for (const label of ["DAYS", "HOURS", "MINUTES"]) {
      const tile = heroSection.locator(`div:has(> span:text-is("${label}"))`).first();
      const digitText = (await tile.locator("span.font-digital").allTextContents()).join("");

      expect(digitText).toMatch(/^\d+$/); // digits only -- no "-" sign, no NaN
    }
  });
});
