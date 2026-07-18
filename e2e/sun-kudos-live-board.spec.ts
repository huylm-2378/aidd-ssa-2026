import { test, expect } from "@playwright/test";

// F008 Spotlight Live Board. Structural render assertions run unconditionally;
// assertions that depend on seeded Sunner rows skip unless KUDOS_DB_SEEDED=1
// (set it after running supabase/migrations + seed.sql), matching the guard
// pattern in e2e/sun-kudos.spec.ts.
//
// SC-002 (a `kudos` INSERT increments the live count + prepends a ticker line
// with no page refresh) requires a live Supabase Realtime socket + a real DB
// INSERT — out of scope for deterministic E2E here. Verify manually per the
// plan's operator handoff: apply supabase/migrations/0003_kudos_realtime.sql,
// confirm Realtime is enabled (Dashboard -> Database -> Replication), open
// /sun-kudos in two tabs, submit a Kudo via the composer in one tab, and
// observe the count/ticker update in the other without a reload.
const SEED_GUARD = "requires seeded Supabase (set KUDOS_DB_SEEDED=1 after running supabase/migrations + seed.sql)";

test.describe("Sun* Kudos — Live Spotlight Board (F008)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sun-kudos");
  });

  test("renders heading, count, search input, constellation, and activity ticker", async ({ page }) => {
    const board = page.locator("section[aria-label='Spotlight Board']");
    await expect(board.getByRole("heading", { name: "SPOTLIGHT BOARD" })).toBeVisible();
    await expect(board.getByText(/\d+\s*KUDOS/)).toBeVisible();
    await expect(board.getByLabel("Tìm kiếm trong Spotlight Board")).toBeVisible();
    await expect(board.locator("[aria-label='Hoạt động gần đây']")).toBeVisible();
    await expect(board.getByRole("application")).toBeVisible();
  });

  test("panel matches design frame B.7: white centered count, gold-tint search pill, fading vertical activity stack", async ({
    page,
  }) => {
    const board = page.locator("section[aria-label='Spotlight Board']");

    // Count is a single all-white line (design node 3007:17482 — no gold split).
    const count = board.getByText(/^\d+ KUDOS$/);
    await expect(count).toHaveCSS("color", "rgb(255, 255, 255)");

    // Search pill: gold-tint fill + #998C5F border (design instance 2940:14833).
    const pill = board.locator("div").filter({ has: page.locator("#spotlight-search") }).last();
    await expect(pill).toHaveCSS("border-top-color", "rgb(153, 140, 95)");
    // Tailwind v4 resolves opacity-modified colors into lab() — normalize both
    // sides through a canvas fill to compare actual pixels, not string syntax.
    const pillBg = await pill.evaluate((el) => {
      const px = (css: string) => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = css;
        ctx.fillRect(0, 0, 1, 1);
        return [...ctx.getImageData(0, 0, 1, 1).data];
      };
      return { actual: px(getComputedStyle(el).backgroundColor), expected: px("rgba(255, 234, 158, 0.1)") };
    });
    // ±1 per channel tolerance for lab()->sRGB rounding.
    pillBg.expected.forEach((v, i) => expect(Math.abs(pillBg.actual[i] - v)).toBeLessThanOrEqual(1));

    // Activity log is a vertical stack whose lines fade upward: first (oldest)
    // line more transparent than the last (newest) — design nodes 3004:15995-99.
    const ticker = board.locator("[aria-label='Hoạt động gần đây']");
    await expect(ticker).toHaveCSS("flex-direction", "column");
    const lines = ticker.locator("p");
    const n = await lines.count();
    expect(n).toBeGreaterThanOrEqual(2);
    const firstOpacity = parseFloat(await lines.first().evaluate((el) => getComputedStyle(el).opacity));
    const lastOpacity = parseFloat(await lines.last().evaluate((el) => getComputedStyle(el).opacity));
    expect(firstOpacity).toBeLessThan(lastOpacity);
    expect(lastOpacity).toBe(1);
  });

  test("typing filters/highlights matching names; clearing restores the full cloud", async ({ page }) => {
    test.skip(!process.env.KUDOS_DB_SEEDED, SEED_GUARD);
    const board = page.locator("section[aria-label='Spotlight Board']");
    const search = board.getByLabel("Tìm kiếm trong Spotlight Board");
    const match = board.getByText("Nguyễn Hoàng Linh", { exact: true });
    const nonMatch = board.getByText("Trần Minh Anh", { exact: true });

    await search.fill("hoang linh");
    await expect(match).toHaveCSS("opacity", "1");
    await expect(nonMatch).toHaveCSS("opacity", "0.2");

    await search.fill("");
    await expect(match).toHaveCSS("opacity", "1");
    await expect(nonMatch).toHaveCSS("opacity", "1");
  });

  test("keyboard pan/zoom on the focused canvas moves the transform", async ({ page }) => {
    const canvas = page.locator("section[aria-label='Spotlight Board']").getByRole("application");
    const layer = canvas.locator("> div").first();
    const initial = await layer.evaluate((el) => getComputedStyle(el).transform);

    await canvas.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("+");

    const after = await layer.evaluate((el) => getComputedStyle(el).transform);
    expect(after).not.toBe(initial);
  });
});
