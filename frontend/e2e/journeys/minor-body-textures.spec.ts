import { expect } from "@playwright/test";
import { journey } from "../lib/kit";

journey(
  "restored minor-body textures render for Pluto, Ceres, and Vesta",
  async (j) => {
    await j.goto("/");
    await j.waitForCanvas();

    const tour = j.page.getByRole("dialog", { name: /intro tour/i });
    await tour.waitFor({ state: "visible" });
    const solo = tour.getByRole("button", { name: /explore solo/i });
    if (await solo.isVisible()) await solo.click();
    else await tour.getByRole("button", { name: "Skip" }).click();
    await tour.waitFor({ state: "hidden" });

    await j.click('[data-testid="open-sim-setup"]');
    const builder = j.page.getByRole("dialog", {
      name: "Configure simulation",
    });
    await builder.getByRole("button", { name: "Clear", exact: true }).click();
    for (const body of ["Sun", "Pluto", "Ceres", "Vesta"]) {
      await builder.getByRole("button", { name: body, exact: true }).click();
    }
    await builder.getByTestId("run-sim").click();

    await j.waitForRequest("POST", /\/api\/simulation\/initialize/, 200);
    await j.waitForRequest("POST", /\/api\/simulation\/chunk/, 200, {
      timeoutMs: 20_000,
    });
    await j.page.waitForTimeout(1500);

    const scene = await j.sceneStats();
    expect(scene.painted, "minor-body scene should paint").toBe(true);
    expect(scene.bodyCount, "Sun plus three minor bodies should render").toBe(4);
    await j.expectCanvasPainted();
    await j.screenshot("minor-bodies-running");

    await j.page.getByRole("button", { name: /Dwarf planets 3/ }).click();
    await j.page.getByRole("button", { name: "Ceres", exact: true }).click();
    await j.page.waitForTimeout(1000);
    await j.screenshot("ceres-focused");
  },
  { viewports: ["desktop"] },
);
