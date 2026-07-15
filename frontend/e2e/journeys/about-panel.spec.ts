import { expect } from "@playwright/test";
import { journey } from "../lib/kit";

// The About popover is desktop chrome only (mobile uses MobileChrome, which has
// no info button), so this journey runs desktop-only.
journey(
  "about popover: open from the top strip, assert content + links, dismiss",
  async (j) => {
    await j.goto("/");
    await j.waitForCanvas();

    // Dismiss the first-load intro tour so it can't intercept the strip click.
    const tour = j.page.getByRole("dialog", { name: /intro tour/i });
    await tour.waitFor({ state: "visible" });
    const solo = tour.getByRole("button", { name: /explore solo/i });
    if (await solo.isVisible()) await solo.click();
    else await tour.getByRole("button", { name: "Skip" }).click();
    await tour.waitFor({ state: "hidden" });

    const aboutBtn = j.page.getByRole("button", { name: "About nbodysim" });
    await expect(aboutBtn).toHaveAttribute("aria-expanded", "false");

    // Open.
    await aboutBtn.click();
    const dialog = j.page.getByRole("dialog", { name: "About nbodysim" });
    await dialog.waitFor({ state: "visible" });
    await expect(aboutBtn).toHaveAttribute("aria-expanded", "true");

    // Content (top to bottom).
    await expect(dialog).toContainText("nbodysim");
    await expect(dialog).toContainText("REAL-TIME SOLAR SYSTEM SIMULATOR");
    await expect(dialog).toContainText(
      "ready-made solar system starts instantly",
    );
    await expect(dialog).toContainText("calculate a custom");
    await expect(dialog).toContainText(
      "simulation and watch it play back in 3D",
    );
    await expect(dialog).toContainText("Orekit");
    await expect(dialog).toContainText("JPL Horizons");
    await expect(dialog).toContainText("View on GitHub");
    await expect(dialog).toContainText("Report a bug");
    await expect(dialog).toContainText("Contact the author");

    // The pitch must NOT contain an em-dash (presentation-copy rule).
    await expect(dialog.locator("p").first()).not.toContainText("—");

    // Link targets.
    await expect(
      dialog.getByRole("link", { name: /view on github/i }),
    ).toHaveAttribute("href", "https://github.com/byeonkho/nbodysim");
    await expect(
      dialog.getByRole("link", { name: /report a bug/i }),
    ).toHaveAttribute("href", "https://github.com/byeonkho/nbodysim/issues/new");
    await expect(
      dialog.getByRole("link", { name: /contact the author/i }),
    ).toHaveAttribute("href", "mailto:contact@nbodysim.com");

    // Let the open fade settle, then capture the panel.
    await j.page.waitForTimeout(250);
    await j.screenshot("about-open");

    // Dismiss with Escape.
    await j.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    await expect(aboutBtn).toHaveAttribute("aria-expanded", "false");

    // Re-open, then dismiss with an outside click.
    await aboutBtn.click();
    await dialog.waitFor({ state: "visible" });
    await j.page.mouse.click(200, 400); // empty area, away from panel + trigger
    await dialog.waitFor({ state: "hidden" });
    await expect(aboutBtn).toHaveAttribute("aria-expanded", "false");

    await j.screenshot("about-closed");
  },
  { viewports: ["desktop"] },
);
