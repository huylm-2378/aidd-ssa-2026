import { test, expect } from "@playwright/test";

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

  test("search bar has both fields with the exact placeholders", async ({ page }) => {
    await expect(
      page.getByPlaceholder("Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?"),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Tìm kiếm profile Sunner")).toBeVisible();
  });

  test("all section headings render", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "HIGHLIGHT KUDOS" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "SPOTLIGHT BOARD" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ALL KUDOS" })).toBeVisible();

    const board = page.locator("section[aria-label='Spotlight Board']");
    await expect(board.getByText("388", { exact: true })).toBeVisible();
    await expect(board.getByText("KUDOS", { exact: true })).toBeVisible();
  });

  test("a Kudo card shows sender+receiver, title, hashtags, like count, and actions", async ({
    page,
  }) => {
    const highlight = page.locator("section[aria-label='Highlight Kudos']");
    const card = highlight.locator("article").first();
    await expect(card.getByText("Huỳnh Dương Xuân Nhật")).toBeVisible();
    await expect(card.getByText("Trần Minh Anh")).toBeVisible();
    await expect(card.getByText("IDOL GIỚI TRẺ")).toBeVisible();
    await expect(card.getByText("#Dedicated #Inspring")).toBeVisible();
    await expect(card.getByText("1.000")).toBeVisible();
    await expect(card.getByRole("button", { name: "Copy Link" })).toBeVisible();
    await expect(card.getByRole("button", { name: "Xem chi tiết" })).toBeVisible();
  });

  test("carousel prev/next advances the 'n/N' indicator (SC-004)", async ({ page }) => {
    const highlight = page.locator("section[aria-label='Highlight Kudos']");
    const indicator = highlight.getByText(/^\d+\/\d+$/);
    await expect(indicator).toHaveText("1/5");

    await highlight.getByRole("button", { name: "Kudo tiếp theo" }).click();
    await expect(indicator).toHaveText("2/5");

    await highlight.getByRole("button", { name: "Kudo trước" }).click();
    await expect(indicator).toHaveText("1/5");
  });

  test("sidebar shows 5 stat rows, a Secret Box button, and 10 recent-gift entries (FR-009)", async ({
    page,
  }) => {
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
