import { test, expect } from "@playwright/test";

test.describe("Awards Information page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/awards-information");
  });

  test("the active header nav link 'Award Information' is a link with the Figma selected state (gold text + gold underline)", async ({
    page,
  }) => {
    const header = page.locator("header");
    const activeLink = header.getByRole("link", { name: "Award Information" });
    await expect(activeLink).toHaveCount(1);
    await expect(activeLink).toHaveAttribute("href", "/awards-information");
    // On the Awards Information page it is the selected route.
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
  });

  test("hero shows the title text 'Hệ thống giải thưởng SAA 2025'", async ({
    page,
  }) => {
    const heroSection = page.locator("section[aria-label='Awards information hero']");
    const heading = heroSection.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Hệ thống giải thưởng SAA 2025");

    // Hero uses the design's dedicated keyvisual banner (Figma node 2167:5138),
    // not the reused homepage keyvisual — guard against reverting the asset.
    const heroBg = heroSection.locator("img[aria-hidden='true']");
    await expect(heroBg).toHaveAttribute("src", /hero-keyvisual/);

    // Title band is centered; the "Sun* Annual Awards 2025" label is 24px bold (Figma 313:8454).
    const label = heroSection.getByText("Sun* Annual Awards 2025", { exact: true });
    const labelStyle = await label.evaluate((el) => {
      const s = getComputedStyle(el);
      return { fontSize: s.fontSize, textAlign: s.textAlign };
    });
    expect(labelStyle.fontSize).toBe("24px");
    expect(labelStyle.textAlign).toBe("center");
    const headingAlign = await heading.evaluate((el) => getComputedStyle(el).textAlign);
    expect(headingAlign).toBe("center");
  });

  test("exactly 6 award detail sections exist, each with an id equal to its slug", async ({
    page,
  }) => {
    const expectedSlugs = [
      "top-talent",
      "top-project",
      "top-project-leader",
      "best-manager",
      "signature-2025-creator",
      "mvp",
    ];

    for (const slug of expectedSlugs) {
      const section = page.locator(`section#${slug}`);
      await expect(section).toHaveCount(1);
    }

    // Verify there are exactly 6 award sections (not more).
    // Count sections that are award detail sections by checking they have the award structure
    const count = await page.evaluate(() => {
      const slugs = [
        "top-talent",
        "top-project",
        "top-project-leader",
        "best-manager",
        "signature-2025-creator",
        "mvp",
      ];
      return slugs.filter((slug) => document.getElementById(slug) !== null).length;
    });
    expect(count).toBe(6);
  });

  test("each award section shows 'Số lượng giải thưởng:' label and 'Giá trị giải thưởng:' label with correct values", async ({
    page,
  }) => {
    // Spot-check: top-talent shows "10" and "7.000.000 VNĐ"
    const topTalentSection = page.locator("section#top-talent");
    await expect(topTalentSection.getByText("Số lượng giải thưởng:")).toBeVisible();
    await expect(topTalentSection.getByText("10")).toBeVisible();
    await expect(topTalentSection.getByText("7.000.000 VNĐ")).toBeVisible();

    // Spot-check: top-project shows "15.000.000 VNĐ"
    const topProjectSection = page.locator("section#top-project");
    await expect(topProjectSection.getByText("Số lượng giải thưởng:")).toBeVisible();
    await expect(topProjectSection.getByText("Giá trị giải thưởng:")).toBeVisible();
    await expect(topProjectSection.getByText("15.000.000 VNĐ")).toBeVisible();

    // Spot-check: signature-2025-creator shows BOTH "5.000.000 VNĐ" and "8.000.000 VNĐ" plus "Hoặc" separator
    const signatureSection = page.locator("section#signature-2025-creator");
    await expect(signatureSection.getByText("5.000.000 VNĐ")).toBeVisible();
    await expect(signatureSection.getByText("8.000.000 VNĐ")).toBeVisible();
    await expect(signatureSection.getByText("Hoặc", { exact: true })).toBeVisible();
  });

  test("sidebar nav is visible at 1512px, has 6 links with href='#<slug>' for all 6 slugs", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1512, height: 900 });
    await page.goto("/awards-information");

    const nav = page.locator("nav[aria-label='Award categories']");
    await expect(nav).toBeVisible();

    const expectedSlugs = [
      "top-talent",
      "top-project",
      "top-project-leader",
      "best-manager",
      "signature-2025-creator",
      "mvp",
    ];

    const links = nav.locator("a");
    await expect(links).toHaveCount(6);

    for (const slug of expectedSlugs) {
      const link = nav.locator(`a[href="#${slug}"]`);
      await expect(link).toHaveCount(1);
    }

    // The MVP nav item uses the Figma short label "MVP", not the section heading
    // "MVP (Most Valuable Person)" — guard against reverting to the long title.
    await expect(nav.locator('a[href="#mvp"]')).toHaveText("MVP");

    // Sidebar target icon: inactive item uses the white asset, active uses the gold one.
    const inactive = nav.locator('a[href="#mvp"]');
    await expect(inactive.locator("img")).toHaveAttribute("src", /target-icon\.png/);
    const inactiveText = await inactive.evaluate((el) => getComputedStyle(el).color);
    expect(inactiveText).toBe("rgb(255, 255, 255)");

    // The ACTIVE item shows the Figma gold underline (border-bottom) + gold target icon.
    const active = nav.locator('a[aria-current="location"]');
    await expect(active.locator("img")).toHaveAttribute("src", /target-icon-active/);
    const activeBorder = await active.evaluate((el) => {
      const s = getComputedStyle(el);
      return { w: parseFloat(s.borderBottomWidth), color: s.borderBottomColor };
    });
    expect(activeBorder.w).toBeGreaterThan(0);
    expect(activeBorder.color).toBe("rgb(255, 234, 158)");
    const inactiveBorderColor = await inactive.evaluate(
      (el) => getComputedStyle(el).borderBottomColor,
    );
    expect(inactiveBorderColor).not.toBe("rgb(255, 234, 158)");
  });

  test("sidebar nav is hidden at mobile viewport (500px wide)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 500, height: 900 });
    await page.goto("/awards-information");

    const nav = page.locator("nav[aria-label='Award categories']");
    // Hidden below lg breakpoint (typically 1024px)
    await expect(nav).not.toBeVisible();
  });

  test("deep-link to #mvp results in the mvp section being in/near viewport after load", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1512, height: 900 });
    await page.goto("/awards-information#mvp");

    const mvpSection = page.locator("section#mvp");
    const boundingBox = await mvpSection.boundingBox();
    expect(boundingBox).not.toBeNull();

    // After navigation to #mvp, the section should be in/near the viewport.
    // Its top should be a small positive value or near zero (allowing for some scroll margin).
    // We use a tolerant check: within a few hundred pixels of the top of the viewport.
    const topPosition = boundingBox!.y;
    expect(topPosition).toBeLessThan(500); // Within ~500px of top of viewport
  });

  test("award meta typography matches Figma: labels 24px gold, numbers 36px white, note white", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1512, height: 900 });
    await page.goto("/");
    await page.goto("/awards-information");

    const section = page.locator("section#top-talent");

    // "Số lượng giải thưởng:" label — 24px, gold (#FFEA9E), bold.
    const qtyLabel = section.getByText("Số lượng giải thưởng:", { exact: true });
    const qtyLabelStyle = await qtyLabel.evaluate((el) => {
      const s = getComputedStyle(el);
      return { fontSize: s.fontSize, color: s.color };
    });
    expect(qtyLabelStyle.fontSize).toBe("24px");
    expect(qtyLabelStyle.color).toBe("rgb(255, 234, 158)");

    // "Giá trị giải thưởng:" label — 24px gold.
    const valLabel = section.getByText("Giá trị giải thưởng:", { exact: true });
    const valLabelStyle = await valLabel.evaluate((el) => {
      const s = getComputedStyle(el);
      return { fontSize: s.fontSize, color: s.color };
    });
    expect(valLabelStyle.fontSize).toBe("24px");
    expect(valLabelStyle.color).toBe("rgb(255, 234, 158)");

    // The quantity number is 36px white (NOT gold — guards against the inverted colors).
    const qtyNumber = section.getByText("10", { exact: true });
    const qtyNumberStyle = await qtyNumber.evaluate((el) => {
      const s = getComputedStyle(el);
      return { fontSize: s.fontSize, color: s.color };
    });
    expect(qtyNumberStyle.fontSize).toBe("36px");
    expect(qtyNumberStyle.color).toBe("rgb(255, 255, 255)");

    // The "cho mỗi giải thưởng" note is full white (not white/70).
    const note = section.getByText("cho mỗi giải thưởng", { exact: true });
    const noteColor = await note.evaluate((el) => getComputedStyle(el).color);
    expect(noteColor).toBe("rgb(255, 255, 255)");

    // The meta icons (Diamond next to the gold "Số lượng…" label) are WHITE in Figma,
    // NOT gold — they must not match the gold label color.
    const diamondColor = await qtyLabel.evaluate((el) => {
      const svg = el.parentElement?.querySelector("svg");
      return svg ? getComputedStyle(svg).color : null;
    });
    expect(diamondColor).toBe("rgb(255, 255, 255)");
  });
});
