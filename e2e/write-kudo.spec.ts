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

  test("Gửi is disabled until recipient, danh hiệu, content, and >=1 hashtag are filled (FR-011, SC-002)", async ({
    page,
  }) => {
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

  test("submitting an enabled Gửi closes the modal (FR-012)", async ({ page }) => {
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
    await expect(page.getByRole("dialog")).toBeHidden();
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
