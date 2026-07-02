import { test, expect } from "@playwright/test";

test.describe("Visual spec fidelity regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero title renders the design's Root Further logotype image, not plain text", async ({
    page,
  }) => {
    const heroSection = page.locator("section[aria-label='Event hero']");
    const heading = heroSection.locator("h1");
    await expect(heading).toBeVisible();

    const logoImage = heading.locator("img");
    await expect(logoImage).toHaveCount(1);
    await expect(logoImage).toHaveAttribute("alt", "Root Further");

    // Guard against reverting to a live-text heading (the reported font-mismatch bug).
    const headingText = await heading.evaluate((el) => el.textContent?.trim());
    expect(headingText).toBe("");
  });

  test("keyvisual background spans the hero AND extends down behind the Root Further content (Figma 1512x1392), not just the hero", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1512, height: 900 });
    await page.goto("/");

    const heroSection = page.locator("section[aria-label='Event hero']");
    const contentSection = page.locator("section[aria-label='Root Further theme story']");
    const heroBox = await heroSection.boundingBox();
    const contentBox = await contentSection.boundingBox();
    expect(heroBox).not.toBeNull();
    expect(contentBox).not.toBeNull();

    // The keyvisual is a full-width aria-hidden <img> (src keyvisual-bg) rendered ONCE as a shared
    // background behind both the hero and the Root Further content — anchored at the page root
    // (behind the sticky header), no longer scoped to the hero or nested in <main>.
    const bgImage = page.locator("img[aria-hidden='true'][src*='keyvisual-bg']");
    await expect(bgImage).toHaveCount(1);

    const bgBox = await bgImage.boundingBox();
    expect(bgBox).not.toBeNull();

    // Spans the full page width and starts at the top of the hero.
    expect(bgBox!.width / heroBox!.width).toBeGreaterThan(0.98);
    expect(bgBox!.x).toBeCloseTo(heroBox!.x, 0);
    expect(bgBox!.y).toBeLessThanOrEqual(heroBox!.y + 1);

    // Its bottom extends past the hero (down behind the Root Further content section),
    // matching the Figma Keyvisual BG that ends partway into the content.
    const bgBottom = bgBox!.y + bgBox!.height;
    const heroBottom = heroBox!.y + heroBox!.height;
    expect(bgBottom).toBeGreaterThan(heroBottom);
    expect(bgBottom).toBeGreaterThan(contentBox!.y);
  });

  test("award card images use the design's 24px corner radius", async ({ page }) => {
    const section = page.locator("section[aria-label='Awards']");
    const cardLinks = section.locator("a[href*='/awards-information']").filter({
      has: page.locator("img"),
    });
    const count = await cardLinks.count();
    expect(count).toBe(6);

    for (let i = 0; i < count; i++) {
      const borderRadius = await cardLinks.nth(i).evaluate((el) => getComputedStyle(el).borderRadius);
      expect(borderRadius).toBe("24px");
    }
  });

  test("each award card layers a shared frame with a centered name logotype (real design assets, not baked crops)", async ({
    page,
  }) => {
    const section = page.locator("section[aria-label='Awards']");
    const imageLinks = section.locator("a[href*='/awards-information']").filter({
      has: page.locator("img"),
    });
    await expect(imageLinks).toHaveCount(6);

    for (let i = 0; i < 6; i++) {
      const link = imageLinks.nth(i);
      const imgs = link.locator("img");
      // Two layers: the shared glowing frame + the award-name logotype.
      await expect(imgs).toHaveCount(2);

      const frameSrc = await imgs.nth(0).getAttribute("src");
      expect(frameSrc).toContain("award-bg");

      const nameSrc = await imgs.nth(1).getAttribute("src");
      expect(nameSrc).toContain("award-name-");

      // The name logotype is centered within the frame (both axes).
      const linkBox = await link.boundingBox();
      const nameBox = await imgs.nth(1).boundingBox();
      expect(linkBox).not.toBeNull();
      expect(nameBox).not.toBeNull();
      const linkCenterX = linkBox!.x + linkBox!.width / 2;
      const linkCenterY = linkBox!.y + linkBox!.height / 2;
      const nameCenterX = nameBox!.x + nameBox!.width / 2;
      const nameCenterY = nameBox!.y + nameBox!.height / 2;
      expect(Math.abs(nameCenterX - linkCenterX)).toBeLessThan(2);
      expect(Math.abs(nameCenterY - linkCenterY)).toBeLessThan(2);
    }
  });

  test("the hero (Figma Frame 487) and Root Further (Figma Frame 486) blocks sit 120px apart, matching the design's parent gap", async ({
    page,
  }) => {
    // Figma "Bìa" container is a flex column with gap:120px; Frame 487 ends at y=779 and
    // Frame 486 starts at y=899 (899-779=120). Guard against the section paddings stacking
    // back up to the reported 192px gap.
    await page.setViewportSize({ width: 1512, height: 900 });
    await page.goto("/");

    const frame487 = page.locator("section[aria-label='Event hero'] .max-w-\\[1224px\\]");
    const frame486 = page.locator("section[aria-label='Root Further theme story'] .max-w-\\[1152px\\]");
    const box487 = await frame487.boundingBox();
    const box486 = await frame486.boundingBox();
    expect(box487).not.toBeNull();
    expect(box486).not.toBeNull();

    const gap = box486!.y - (box487!.y + box487!.height);
    expect(gap).toBeCloseTo(120, 0);
  });

  test("the keyvisual background starts at the page top (behind the sticky header) and its bottom reaches the 'Lễ trao giải Sun* Annual Awards 2025' paragraph, not past it", async ({
    page,
  }) => {
    // Figma Keyvisual BG is anchored at y=0 (behind the translucent header) and is 1392px tall,
    // so its bottom lands around the Root Further paragraph ending in "Lễ trao giải Sun* Annual
    // Awards 2025". Guard against the bug where the art was nested in <main> after the sticky
    // header, pushing its top (and therefore its bottom ~76px) below that paragraph.
    await page.setViewportSize({ width: 1512, height: 900 });
    await page.goto("/");

    const geometry = await page.evaluate(() => {
      const bg = document.querySelector(
        "img[aria-hidden='true'][src*='keyvisual-bg']",
      );
      let targetPara: Element | null = null;
      document
        .querySelectorAll("section[aria-label='Root Further theme story'] p")
        .forEach((p) => {
          if (p.textContent?.includes("Lễ trao giải Sun* Annual Awards 2025")) {
            targetPara = p;
          }
        });
      const docTop = (el: Element | null) =>
        el ? el.getBoundingClientRect().top + window.scrollY : null;
      const docBottom = (el: Element | null) =>
        el ? el.getBoundingClientRect().bottom + window.scrollY : null;
      return {
        bgTop: docTop(bg),
        bgBottom: docBottom(bg),
        targetBottom: docBottom(targetPara),
        hasTarget: !!targetPara,
      };
    });

    expect(geometry.hasTarget).toBe(true);
    // Anchored at the page top, not pushed down by the header.
    expect(geometry.bgTop!).toBeLessThanOrEqual(1);
    // Bottom lands at the target paragraph (within a small tolerance), not ~76px past it.
    expect(Math.abs(geometry.bgBottom! - geometry.targetBottom!)).toBeLessThan(40);
  });

  test("the Sun* Kudos promo uses the design's clean background + wordmark assets, with the wordmark centered on the right", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1512, height: 900 });
    await page.goto("/");

    const section = page.locator("section[aria-label='Sun* Kudos promo']");
    const card = section.locator("div.rounded-2xl").first();
    const content = card.locator("> div.relative").first();

    // Background: the Figma Kudos card art (1120x500), NOT the old artifact-laden crop.
    const bg = section.locator("img[aria-hidden='true']");
    await expect(bg).toHaveCount(1);
    await expect(bg).toHaveAttribute("src", /kudos-background/);

    // Wordmark: the transparent "S KUDOS" logotype.
    const wordmark = section.locator("img[alt='Sun* Kudos']");
    await expect(wordmark).toHaveCount(1);
    await expect(wordmark).toHaveAttribute("src", /kudos-wordmark/);

    // The wordmark sits on the right half and is roughly vertically centered in the card.
    const cardBox = await card.boundingBox();
    const wmBox = await wordmark.boundingBox();
    expect(cardBox).not.toBeNull();
    expect(wmBox).not.toBeNull();
    const wmCenterX = wmBox!.x + wmBox!.width / 2;
    const wmCenterY = wmBox!.y + wmBox!.height / 2;
    const cardCenterY = cardBox!.y + cardBox!.height / 2;
    expect(wmCenterX).toBeGreaterThan(cardBox!.x + cardBox!.width / 2); // right half
    expect(Math.abs(wmCenterY - cardCenterY)).toBeLessThan(cardBox!.height * 0.15); // vertically centered

    // Card holds the Figma 1120x500 ratio (2.24) so the gold-arc art is not vertically cropped.
    expect(cardBox!.width / cardBox!.height).toBeCloseTo(2.24, 1);

    // Content is a ~457px column (40.8% of the 1120 card), inset ~64px from the left, and it does
    // NOT fill the full card height (Figma leaves ~46px top/bottom) — guards the old top-glued,
    // full-height, too-narrow block.
    const contentBox = await content.boundingBox();
    expect(contentBox).not.toBeNull();
    expect(contentBox!.width / cardBox!.width).toBeCloseTo(0.408, 1);
    expect((contentBox!.x - cardBox!.x) / cardBox!.width).toBeCloseTo(0.057, 1);
    expect(contentBox!.height / cardBox!.height).toBeLessThan(0.9);
  });

  test("the active header nav link 'About SAA 2025' is a link with the Figma selected state (gold text + gold underline)", async ({
    page,
  }) => {
    const header = page.locator("header");
    const activeLink = header.getByRole("link", { name: "About SAA 2025" });
    await expect(activeLink).toHaveCount(1);
    await expect(activeLink).toHaveAttribute("href", "/");
    // On the homepage it is the selected route.
    await expect(activeLink).toHaveAttribute("aria-current", "page");

    const style = await activeLink.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        color: s.color,
        borderBottomWidth: s.borderBottomWidth,
        borderBottomColor: s.borderBottomColor,
      };
    });
    // Gold text (#FFEA9E) and a gold bottom border (the "gạch vàng").
    expect(style.color).toBe("rgb(255, 234, 158)");
    expect(parseFloat(style.borderBottomWidth)).toBeGreaterThan(0);
    expect(style.borderBottomColor).toBe("rgb(255, 234, 158)");

    // A non-active link stays white with no visible gold underline.
    const inactive = header.getByRole("link", { name: "Sun* Kudos" });
    const inactiveStyle = await inactive.evaluate((el) => {
      const s = getComputedStyle(el);
      return { color: s.color, borderBottomColor: s.borderBottomColor };
    });
    expect(inactiveStyle.color).toBe("rgb(255, 255, 255)");
    expect(inactiveStyle.borderBottomColor).not.toBe("rgb(255, 234, 158)");
  });
});
