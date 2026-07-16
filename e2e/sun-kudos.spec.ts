import { test, expect } from "@playwright/test";

// The board is data-driven from Supabase (F007). Tests that assert seeded rows
// skip unless KUDOS_DB_SEEDED=1 (set it after running supabase/migrations +
// seed.sql). Structural tests (nav, hero, headings) run unconditionally.
const SEED_GUARD = "requires seeded Supabase (set KUDOS_DB_SEEDED=1 after running supabase/migrations + seed.sql)";

test.describe("Sun* Kudos page (F003)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sun-kudos");
  });

  test("header nav 'Sun* Kudos' is the active link (gold text + gold underline + aria-current)", async ({
    page,
  }) => {
    const header = page.locator("header");
    const activeLink = header.getByRole("link", { name: "Sun* Kudos" });
    await expect(activeLink).toHaveCount(1);
    await expect(activeLink).toHaveAttribute("href", "/sun-kudos");
    await expect(activeLink).toHaveAttribute("aria-current", "page");

    const style = await activeLink.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        color: s.color,
        w: parseFloat(s.borderBottomWidth),
        borderColor: s.borderBottomColor,
      };
    });
    expect(style.color).toBe("rgb(255, 234, 158)");
    expect(style.w).toBeGreaterThan(0);
    expect(style.borderColor).toBe("rgb(255, 234, 158)");
  });

  test("footer nav 'Sun* Kudos' is active (gold text + gold underline + aria-current)", async ({
    page,
  }) => {
    const footer = page.locator("footer");
    const activeLink = footer.getByRole("link", { name: "Sun* Kudos" });
    await expect(activeLink).toHaveAttribute("aria-current", "page");
    const style = await activeLink.evaluate((el) => {
      const s = getComputedStyle(el);
      return { color: s.color, borderColor: s.borderBottomColor };
    });
    expect(style.color).toBe("rgb(255, 234, 158)");
    expect(style.borderColor).toBe("rgb(255, 234, 158)");
  });

  test("hero shows the eyebrow + 'KUDOS' wordmark", async ({ page }) => {
    const hero = page.locator("section[aria-label='Sun* Kudos hero']");
    await expect(hero.getByText("Hệ thống ghi nhận và cảm ơn")).toBeVisible();
    await expect(hero.locator("h1")).toHaveText("KUDOS");
  });

  test("search bar prompt/profile are pill buttons; prompt opens the Viết Kudo composer (F006 FR-001)", async ({
    page,
  }) => {
    // Both pills are real buttons (the label is baked into the pill image → aria-label).
    const prompt = page.getByRole("button", {
      name: "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?",
    });
    await expect(prompt).toBeVisible();
    await prompt.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    const profileButton = page.getByRole("button", { name: "Tìm kiếm profile Sunner" });
    await expect(profileButton).toBeVisible();
  });

  test("all section headings render", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "HIGHLIGHT KUDOS" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "SPOTLIGHT BOARD" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ALL KUDOS" })).toBeVisible();

    // Spotlight shows a "<count> KUDOS" heading; the count is data-driven.
    const board = page.locator("section[aria-label='Spotlight Board']");
    await expect(board.getByText("KUDOS", { exact: true })).toBeVisible();
  });

  test("a Kudo card shows sender+receiver, title, hashtags, like count, and actions", async ({
    page,
  }) => {
    test.skip(!process.env.KUDOS_DB_SEEDED, SEED_GUARD);
    const highlight = page.locator("section[aria-label='Highlight Kudos']");
    // At pageIndex 0, the carousel shows: current card (visible) + next peek (hidden).
    // The first article in the section is the current card.
    // The highlight shows the TOP-5 by likeCount desc. The first card (index 0) is now
    // hl-3 (1520 likes) "CHỖ DỰA CỦA TEAM", not hl-1 (1000 likes) "IDOL GIỚI TRẺ".
    const card = highlight.locator("article").first();
    await expect(card.getByText("Lê Quốc Bảo")).toBeVisible();
    await expect(card.getByText("Đỗ Khánh Chi")).toBeVisible();
    await expect(card.getByText("CHỖ DỰA CỦA TEAM")).toBeVisible();
    await expect(card.getByText("#Leadership #Trust")).toBeVisible();
    await expect(card.getByText("1.520")).toBeVisible();
    await expect(card.getByRole("button", { name: "Copy Link" })).toBeVisible();
    await expect(card.getByRole("button", { name: "Xem chi tiết" })).toBeVisible();
  });

  test("carousel prev/next advances the 'n/N' indicator (SC-004)", async ({ page }) => {
    test.skip(!process.env.KUDOS_DB_SEEDED, SEED_GUARD);
    const highlight = page.locator("section[aria-label='Highlight Kudos']");
    const indicator = highlight.getByText(/^\d+\/\d+$/);
    await expect(indicator).toHaveText("1/5");

    await highlight.getByRole("button", { name: "Kudo tiếp theo" }).click();
    await expect(indicator).toHaveText("2/5");

    await highlight.getByRole("button", { name: "Kudo trước" }).click();
    await expect(indicator).toHaveText("1/5");
  });

  test("carousel slides keep the fixed 525px design height on every page, top-aligned", async ({
    page,
  }) => {
    test.skip(!process.env.KUDOS_DB_SEEDED, SEED_GUARD);
    const highlight = page.locator("section[aria-label='Highlight Kudos']");
    const indicator = highlight.getByText(/^\d+\/\d+$/);

    const measure = () =>
      highlight.locator("article").evaluateAll((cards) =>
        cards.map((card) => {
          const { top, height } = card.getBoundingClientRect();
          return { top: Math.round(top), height: Math.round(height) };
        }),
      );

    // Page 1: current + next peek. Long content must not grow the slide —
    // the card is a fixed 525px box (design frame MaZUn5xHXZ) with
    // ellipsized text.
    let boxes = await measure();
    expect(boxes.length).toBe(2);
    for (const box of boxes) expect(box.height).toBe(525);

    // Page 2 shows all three slots: prev peek + current + next peek.
    await highlight.getByRole("button", { name: "Kudo tiếp theo" }).click();
    await expect(indicator).toHaveText("2/5");
    boxes = await measure();
    expect(boxes.length).toBe(3);
    for (const box of boxes) {
      expect(box.height).toBe(525);
      expect(box.top).toBe(boxes[0].top);
    }
  });

  test("edge peeks fade into the background via gradient overlays (design nodes 2940:13469/13467)", async ({
    page,
  }) => {
    test.skip(!process.env.KUDOS_DB_SEEDED, SEED_GUARD);
    const highlight = page.locator("section[aria-label='Highlight Kudos']");

    // Page 2 shows both peeks. Each peek carries a directional gradient
    // overlay: dark at the outer screen edge, transparent toward the active
    // card — not a uniform opacity dim.
    await highlight.getByRole("button", { name: "Kudo tiếp theo" }).click();
    await expect(highlight.getByText(/^\d+\/\d+$/)).toHaveText("2/5");

    const gradients = await highlight
      .locator(".pointer-events-none.absolute")
      .evaluateAll((overlays) =>
        overlays.map((el) => getComputedStyle(el).backgroundImage),
      );
    expect(gradients).toHaveLength(2);
    expect(gradients[0]).toContain("linear-gradient(to right");
    expect(gradients[1]).toContain("linear-gradient(to left");
    for (const g of gradients) expect(g).toContain("rgb(0, 16, 26)");
  });

  test("selecting a Phòng ban filter narrows the highlight feed and resets the carousel to page 1 (FIX 3)", async ({
    page,
  }) => {
    test.skip(!process.env.KUDOS_DB_SEEDED, SEED_GUARD);
    const highlight = page.locator("section[aria-label='Highlight Kudos']");
    const indicator = highlight.getByText(/^\d+\/\d+$/);

    // Advance to a non-zero page first, so we can prove the filter resets it.
    await highlight.getByRole("button", { name: "Kudo tiếp theo" }).click();
    await expect(indicator).toHaveText("2/5");

    // Seed: "Marketing" has exactly one kudo → count shrinks to 1, page resets.
    await highlight.getByRole("button", { name: "Phòng ban" }).click();
    await highlight.getByRole("option", { name: "Marketing" }).click();
    await expect(indicator).toHaveText("1/1");
  });

  test("a filter combination with no matches shows the empty state, announced politely (FIX 3)", async ({
    page,
  }) => {
    test.skip(!process.env.KUDOS_DB_SEEDED, SEED_GUARD);
    const highlight = page.locator("section[aria-label='Highlight Kudos']");

    // Seed: the sole Marketing kudo has #Dedicated/#Customer, so Marketing +
    // #Teamwork matches nothing.
    await highlight.getByRole("button", { name: "Phòng ban" }).click();
    await highlight.getByRole("option", { name: "Marketing" }).click();
    await highlight.getByRole("button", { name: "Hashtag" }).click();
    await highlight.getByRole("option", { name: "#Teamwork" }).click();

    const empty = highlight.getByRole("status");
    await expect(empty).toHaveText("Không có Kudo phù hợp");
    // No carousel indicator while empty.
    await expect(highlight.getByText(/^\d+\/\d+$/)).toHaveCount(0);
  });

  test("sidebar shows 5 stat rows, a Secret Box button, and 10 recent-gift entries (FR-009)", async ({
    page,
  }) => {
    test.skip(!process.env.KUDOS_DB_SEEDED, SEED_GUARD);
    const all = page.locator("section[aria-label='All Kudos']");
    for (const label of [
      "Số Kudos bạn nhận được:",
      "Số Kudos bạn đã gửi:",
      "Số tim bạn nhận được:",
      "Số Secret Box bạn đã mở:",
      "Số Secret Box chưa mở:",
    ]) {
      await expect(all.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(all.getByRole("button", { name: "Mở Secret Box" })).toBeVisible();
    await expect(all.getByText("10 Sunner nhận quà mới nhất")).toBeVisible();
    await expect(all.getByText(/^Nhận được /)).toHaveCount(10);
  });

  test("feed + sidebar are side by side at 1512px and stack with no overflow at 375px (SC-003)", async ({
    page,
  }) => {
    test.skip(!process.env.KUDOS_DB_SEEDED, SEED_GUARD);
    await page.setViewportSize({ width: 1512, height: 900 });
    const all = page.locator("section[aria-label='All Kudos']");
    const feed = all.locator("article").first();
    const sidebar = all.locator("aside");
    const feedBox = await feed.boundingBox();
    const sideBox = await sidebar.boundingBox();
    expect(feedBox).not.toBeNull();
    expect(sideBox).not.toBeNull();
    // Side by side: sidebar sits to the right of the feed, roughly on the same row.
    expect(sideBox!.x).toBeGreaterThan(feedBox!.x + feedBox!.width - 1);

    await page.setViewportSize({ width: 375, height: 900 });
    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    expect(noOverflow).toBe(true);
    // Stacked: sidebar now sits below the feed.
    const feedBoxM = await feed.boundingBox();
    const sideBoxM = await sidebar.boundingBox();
    expect(sideBoxM!.y).toBeGreaterThan(feedBoxM!.y);
  });
});
