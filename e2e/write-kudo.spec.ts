import { test, expect } from "@playwright/test";

test.describe("Write Kudo composer modal (F006)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sun-kudos");
  });

  test("clicking the hero prompt bar opens the composer modal (FR-001, SC-001)", async ({ page }) => {
    await page.locator("#kudos-prompt").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByText("Gửi lời cám ơn và ghi nhận đến đồng đội"),
    ).toBeVisible();
  });

  test("keyboard users open the composer with Enter on the focused prompt (FR-001, a11y)", async ({
    page,
  }) => {
    // Guards the close-loop fix: the prompt opens on click/Enter/Space, NOT
    // onFocus (the dialog restores focus to it on close). Focus alone must not open it.
    await page.locator("#kudos-prompt").focus();
    await expect(page.getByRole("dialog")).toBeHidden();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("body scroll is locked while the modal is open (FR-002)", async ({ page }) => {
    await page.locator("#kudos-prompt").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");
  });

  test("recipient dropdown does NOT auto-open; opens on user click and then stays open", async ({
    page,
  }) => {
    // Recipient options come from Supabase (F007) — needs seeded sunners.
    test.skip(!process.env.KUDOS_DB_SEEDED, "requires seeded Supabase (set KUDOS_DB_SEEDED=1 after running supabase/migrations + seed.sql)");
    await page.locator("#kudos-prompt").click();
    const dialog = page.getByRole("dialog");
    const combo = dialog.getByRole("combobox", { name: /Người nhận/ });
    // The focus-trap focuses the field, but the list must NOT auto-drop over the form.
    await expect(combo).toHaveAttribute("aria-expanded", "false");
    await expect(dialog.getByRole("listbox")).toHaveCount(0);
    // Opens on a real user click, and stays open past the old 150ms blur-close window.
    await combo.click();
    await expect(combo).toHaveAttribute("aria-expanded", "true");
    await page.waitForTimeout(400);
    await expect(dialog.getByRole("listbox")).toBeVisible();
  });

  test("an incomplete form shows which required fields are still missing (FR-011 UX)", async ({
    page,
  }) => {
    await page.locator("#kudos-prompt").click();
    const dialog = page.getByRole("dialog");
    // Fresh modal: Gửi disabled + hint lists every required field, incl. Hashtag
    // (the reported confusion — user didn't know Hashtag was required).
    await expect(dialog.getByRole("button", { name: "Gửi" })).toBeDisabled();
    const hint = dialog.getByText(/^Cần điền để gửi:/);
    await expect(hint).toBeVisible();
    await expect(hint).toContainText("Hashtag");
    await expect(hint).toContainText("Người nhận");
  });

  test("Gửi is disabled until recipient, danh hiệu, content, and >=1 hashtag are filled (FR-011, SC-002)", async ({
    page,
  }) => {
    // Recipient options come from Supabase (F007) — needs seeded data.
    test.skip(!process.env.KUDOS_DB_SEEDED, "requires seeded Supabase (set KUDOS_DB_SEEDED=1 after running supabase/migrations + seed.sql)");
    await page.locator("#kudos-prompt").click();
    const dialog = page.getByRole("dialog");
    const submit = dialog.getByRole("button", { name: "Gửi" });
    await expect(submit).toBeDisabled();

    await dialog.getByRole("combobox").fill("Trần Minh Anh");
    await dialog.getByRole("option", { name: /Trần Minh Anh/ }).click();
    await expect(submit).toBeDisabled();

    await dialog.getByPlaceholder("Dành tặng một danh hiệu cho đồng đội").fill("Người truyền động lực");
    await expect(submit).toBeDisabled();

    await dialog
      .getByPlaceholder("Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!")
      .fill("Cảm ơn bạn rất nhiều vì đã luôn hỗ trợ team.");
    await expect(submit).toBeDisabled();

    await dialog.getByRole("button", { name: "+ Hashtag" }).click();
    await page.keyboard.type("Teamwork");
    await page.keyboard.press("Enter");

    await expect(submit).toBeEnabled();
  });

  test("submitting without a session shows the login-required error and keeps the modal open (FR-012, auth)", async ({
    page,
  }) => {
    // Sender must be the logged-in user (F007 fix). Persist requires a Supabase
    // session; e2e runs unauthenticated, so Gửi must surface the login error and
    // keep the form open (no data lost). Recipient options need seeded data.
    test.skip(!process.env.KUDOS_DB_SEEDED, "requires seeded Supabase (set KUDOS_DB_SEEDED=1 after running supabase/migrations + seed.sql)");
    await page.locator("#kudos-prompt").click();
    const dialog = page.getByRole("dialog");

    await dialog.getByRole("combobox").fill("Trần Minh Anh");
    await dialog.getByRole("option", { name: /Trần Minh Anh/ }).click();
    await dialog.getByPlaceholder("Dành tặng một danh hiệu cho đồng đội").fill("Người truyền động lực");
    await dialog
      .getByPlaceholder("Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!")
      .fill("Cảm ơn bạn rất nhiều.");
    await dialog.getByRole("button", { name: "+ Hashtag" }).click();
    await page.keyboard.type("Teamwork");
    await page.keyboard.press("Enter");

    await dialog.getByRole("button", { name: "Gửi" }).click();
    await expect(dialog.getByRole("alert")).toContainText("đăng nhập");
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("Hủy, backdrop, and Escape all dismiss and discard input (FR-003, SC-003)", async ({ page }) => {
    // Hủy
    await page.locator("#kudos-prompt").click();
    let dialog = page.getByRole("dialog");
    await dialog.getByPlaceholder("Dành tặng một danh hiệu cho đồng đội").fill("draft");
    await dialog.getByRole("button", { name: "Hủy" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Reopen: starts empty
    await page.locator("#kudos-prompt").click();
    dialog = page.getByRole("dialog");
    await expect(dialog.getByPlaceholder("Dành tặng một danh hiệu cho đồng đội")).toHaveValue("");

    // Backdrop click
    await page.mouse.click(10, 10);
    await expect(page.getByRole("dialog")).toBeHidden();

    // Escape
    await page.locator("#kudos-prompt").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("adding 5 hashtags hides the '+ Hashtag' button (cap)", async ({ page }) => {
    await page.locator("#kudos-prompt").click();
    const dialog = page.getByRole("dialog");

    for (const tag of ["A", "B", "C", "D", "E"]) {
      await dialog.getByRole("button", { name: "+ Hashtag" }).click();
      await page.keyboard.type(tag);
      await page.keyboard.press("Enter");
    }

    await expect(dialog.getByRole("button", { name: "+ Hashtag" })).toHaveCount(0);
  });

  test("modal is ~752px wide, centered, with no horizontal page overflow at 1440px (SC-004)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator("#kudos-prompt").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(700);
    expect(box!.width).toBeLessThan(800);

    const center = box!.x + box!.width / 2;
    expect(Math.abs(center - 720)).toBeLessThan(20);

    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    expect(noOverflow).toBe(true);
  });

  test("on a short viewport the modal top (title) stays reachable, not clipped above the fold (SC-004, fidelity)", async ({
    page,
  }) => {
    // Regression guard: an over-tall modal must scroll from its top with padding
    // preserved. A single items-center + overflow-y-auto container clips the top
    // and jams the title against the viewport edge (the reported Figma mismatch).
    await page.setViewportSize({ width: 1440, height: 700 });
    await page.locator("#kudos-prompt").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const title = dialog.getByRole("heading", {
      name: "Gửi lời cám ơn và ghi nhận đến đồng đội",
    });
    const box = await title.boundingBox();
    expect(box).not.toBeNull();
    // The title's top edge sits below the fold top (padding preserved), not
    // clipped above it.
    expect(box!.y).toBeGreaterThanOrEqual(0);
    // And there is real card padding above the title (~40px design; allow slack).
    const dialogBox = await dialog.boundingBox();
    expect(box!.y - dialogBox!.y).toBeGreaterThan(16);
  });

  test("dialog is accessible: aria-modal true, focus moves inside on open (SC-005)", async ({ page }) => {
    await page.locator("#kudos-prompt").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toHaveAttribute("aria-modal", "true");

    const focusInside = await page.evaluate(() => {
      const dialogEl = document.querySelector('[role="dialog"]');
      return dialogEl ? dialogEl.contains(document.activeElement) : false;
    });
    expect(focusInside).toBe(true);
  });
});
