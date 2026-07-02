import { test, expect } from "@playwright/test";

test.describe("Dead Link Check (SC-006)", () => {
  test("should have no dead internal links on homepage", async ({ page }) => {
    await page.goto("/");

    // Find all links
    const links = await page.locator("a").all();
    const brokenLinks: Array<{ href: string; text: string; error: string }> = [];

    for (const link of links) {
      const href = await link.getAttribute("href");
      const text = await link.textContent();

      // Skip external links and anchors without href
      if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        continue;
      }

      // Test internal navigation
      if (href.startsWith("/")) {
        try {
          const response = await page.request.get(href.split("#")[0]); // Remove hash for request
          if (!response.ok()) {
            brokenLinks.push({
              href,
              text: text || "(no text)",
              error: `HTTP ${response.status()}`,
            });
          }
        } catch (error) {
          brokenLinks.push({
            href,
            text: text || "(no text)",
            error: String(error),
          });
        }
      }

      // Test hash anchors - verify the page has the anchor
      if (href.startsWith("#")) {
        const anchorId = href.substring(1);
        const element = page.locator(`#${anchorId}`);
        const count = await element.count();
        if (count === 0) {
          brokenLinks.push({
            href,
            text: text || "(no text)",
            error: "Anchor not found on page",
          });
        }
      }
    }

    if (brokenLinks.length > 0) {
      console.log("Broken links found:", brokenLinks);
    }

    expect(brokenLinks).toHaveLength(0);
  });

  test("all award card links should resolve to /awards-information", async ({ page }) => {
    await page.goto("/");

    // Get award section links only (first one is in awards section)
    const awardsSection = page.locator("section[aria-label='Awards']");
    const awardLinks = await awardsSection.locator("a[href*='/awards-information']").all();

    for (const link of awardLinks) {
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^\/awards-information#/);
    }

    // Verify the route exists by navigating to one
    const firstLink = awardLinks[0];
    const href = await firstLink.getAttribute("href");
    await page.goto(href || "/");
    expect(page.url()).toContain("/awards-information");
  });

  test("Kudos banner link should resolve to /sun-kudos", async ({ page }) => {
    await page.goto("/");

    // Find Kudos banner link (get first one since there are multiple)
    const kudosLinks = page.locator("a[href='/sun-kudos']");
    const count = await kudosLinks.count();
    expect(count).toBeGreaterThan(0);

    // Verify the href is correct
    const kudosLink = kudosLinks.first();
    const href = await kudosLink.getAttribute("href");
    expect(href).toBe("/sun-kudos");
  });

  test("header and footer logos should navigate home", async ({ page }) => {
    await page.goto("/");

    // Verify header has a link to home
    const header = page.locator("header");
    const headerLink = header.locator("a").first();
    const headerHref = await headerLink.getAttribute("href");
    expect(headerHref).toBe("/");

    // Verify footer has a link to home (if footer exists)
    const footer = page.locator("footer");
    const footerExists = await footer.count() > 0;
    if (footerExists) {
      const footerLink = footer.locator("a").first();
      const footerHref = await footerLink.getAttribute("href");
      expect(footerHref).toBe("/");
    }
  });
});
