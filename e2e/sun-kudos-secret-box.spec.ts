import { test, expect } from "@playwright/test";

// F016 Open Secret Box — structural assertions only, run unconditionally.
// E2E sessions are signed OUT, so the modal renders its anon branch (FR-008):
// the sign-in prompt replaces the counter/box content and no count is shown.
// The authed open-flow (RPC, badge grant, counter decrement) is covered by
// unit tests + the migration 0006 operator verification queries — a real
// Google session can't be scripted deterministically here (same stance as
// e2e/sun-kudos.spec.ts's seeded/authed guards).

test.describe("Sun* Kudos — Open Secret Box modal (F016)", () => {
  test("sidebar CTA opens the modal with design title, and X closes it", async ({ page }) => {
    await page.goto("/sun-kudos");
    const cta = page
      .locator("section[aria-label='All Kudos']")
      .getByRole("button", { name: "Mở Secret Box" });
    await cta.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "KHÁM PHÁ SECRET BOX CỦA BẠN" }),
    ).toBeVisible();
    // Title is gold per frame J3-4YFIpMM (#ffea9e).
    await expect(
      dialog.getByRole("heading", { name: "KHÁM PHÁ SECRET BOX CỦA BẠN" }),
    ).toHaveCSS("color", "rgb(255, 234, 158)");

    await dialog.getByRole("button", { name: "Đóng" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("signed-out visitor sees the sign-in prompt instead of counter/box (FR-008)", async ({ page }) => {
    await page.goto("/sun-kudos");
    await page
      .locator("section[aria-label='All Kudos']")
      .getByRole("button", { name: "Mở Secret Box" })
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("Bạn cần đăng nhập để mở Secret Box.")).toBeVisible();
    await expect(dialog.getByText("Secretbox chưa mở")).toHaveCount(0);
    await expect(dialog.getByText("Click vào box để mở")).toHaveCount(0);
  });

  test("Escape closes the modal and focus returns to the trigger", async ({ page }) => {
    await page.goto("/sun-kudos");
    const cta = page
      .locator("section[aria-label='All Kudos']")
      .getByRole("button", { name: "Mở Secret Box" });
    await cta.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(cta).toBeFocused();
  });

  test("profile page CTA opens the same modal", async ({ page }) => {
    await page.goto("/profile");
    await page.getByRole("button", { name: "Mở Secret Box" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "KHÁM PHÁ SECRET BOX CỦA BẠN" }),
    ).toBeVisible();
  });
});
